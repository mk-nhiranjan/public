import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronUp, ChevronDown, Trash2, Link } from "lucide-react";
import { getToken, isTokenExpired, setSessionExpiredFlag, startTokenExpiryWatcher, logout } from "../utils/auth";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface LogItem {
  id: string;
  title: string;
  url: string;
  date: string;
  time: string;
  tweetId?: string | null;
  fileName?: string | null;
  sortDate?: number | null;
}

const TwitterLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");

  const filteredAndSortedLogs = useMemo<LogItem[]>(() => {
    const filtered = logs.filter((log: LogItem) =>
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a: LogItem, b: LogItem) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case "date":
          aVal = a.sortDate || 0;
          bVal = b.sortDate || 0;
          break;
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        default:
          aVal = new Date(`${a.date} ${a.time}`);
          bVal = new Date(`${b.date} ${b.time}`);
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [logs, searchTerm, sortBy, sortOrder]);

  // Reset to first page when filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedLogs.length, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedLogs.length / pageSize));

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedLogs.slice(start, start + pageSize);
  }, [filteredAndSortedLogs, currentPage]);

  // Helper: parse various updated_at formats returned by the API
  const parseUpdatedAt = (val: any): Date | null => {
    if (!val) return null;
    if (typeof val === 'string') {
      const iso = Date.parse(val);
      if (!isNaN(iso)) return new Date(iso);

      const m = val.match(/datetime\.datetime\(([^)]+)\)/);
      if (m && m[1]) {
        const parts = m[1].split(',').map((p: string) => p.trim());
        const [y, mo, d, h = '0', mi = '0', s = '0', ms = '0'] = parts;
        const msNum = parseInt(ms || '0', 10) / 1000;
        return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s), Math.round(msNum));
      }

      try { return new Date(val); } catch { return null; }
    }
    if (typeof val === 'number') return new Date(val);
    try {
      const anyVal: any = val;
      if (anyVal.year && anyVal.month && anyVal.day) {
        return new Date(anyVal.year, anyVal.month - 1, anyVal.day, anyVal.hour || 0, anyVal.minute || 0, anyVal.second || 0);
      }
    } catch {}
    return null;
  };

  // Fetch logs from API on mount
  useEffect(() => {
    let mounted = true;
    // start a background watcher to auto-logout when the token expires
    try { startTokenExpiryWatcher(); } catch {}
    const fetchLogs = async () => {
      setIsLoading(true);
      setFetchError(null);
      // If token has already expired, mark and logout immediately
      try {
        if (isTokenExpired()) {
          try { setSessionExpiredFlag(); } catch {}
          await logout();
          return;
        }
      } catch (e) {
        // ignore and continue; fetch will fail if auth is invalid
      }
      try {
        const url = 'https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod/twitter/logs';
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(url, { method: 'GET', headers });
        if (res.status === 401) {
          if (mounted) setFetchError('Session expired. Redirecting...');
          try { setSessionExpiredFlag(); } catch {}
          await logout();
          return;
        }
        if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        const body = await res.json();
        const mapped: LogItem[] = (body.data || []).map((item: any, idx: number) => {
          const dateObj = parseUpdatedAt(item.updated_at);
          const dateStr = dateObj ? dateObj.toLocaleDateString() : '';
          const timeStr = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          const sortDate = dateObj ? dateObj.getTime() : null;
          const tweetId = item.tweet_id || item.tweetId || null;
          const urlStr = tweetId ? `https://twitter.com/i/web/status/${tweetId}` : '';
          return {
            id: item.file_name || tweetId || `log-${idx}`,
            title: item.file_name || `Tweet ${tweetId || idx}`,
            url: urlStr,
            date: dateStr,
            time: timeStr,
            tweetId: tweetId,
            fileName: item.file_name || null,
            sortDate,
          };
        });
        if (mounted) setLogs(mapped);
      } catch (err: any) {
        console.error('Failed to fetch twitter logs', err);
        if (mounted) setFetchError(err.message || 'Unknown error');
      } finally { if (mounted) setIsLoading(false); }
    };
    fetchLogs();
    return () => { mounted = false; };
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id);
    setDeleteConfirmText("");
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    // find the log entry
    const entry = logs.find((l) => l.id === deleteTarget);
    if (!entry) {
      setDeleteTarget(null);
      return;
    }

    const performDelete = async () => {
      setDeleteLoadingId(deleteTarget);
      try {
        const token = getToken();
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        if (entry.tweetId) {
          // Use the dedicated delete endpoint for tweet-id deletes
          const deleteUrl = `https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod/twitter/${entry.tweetId}`;
          const body = { operation: 'delete_by_tweet_id'};
          const res = await fetch(deleteUrl, { method: 'DELETE', headers, body: JSON.stringify(body) });
          if (res.status === 401) {
            setFetchError('Session expired. Redirecting...');
            try { setSessionExpiredFlag(); } catch {}
            await logout();
            return;
          }
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Delete failed: ${res.status} ${res.statusText} ${text}`);
          }
        } else {
          // Fallback to old endpoint for file_name or id-based deletes
          const url = 'https://1kftc09v98.execute-api.us-east-1.amazonaws.com/prod/twitter/logs';
          let body: any = {};
          if (entry.fileName) {
            body = { operation: 'delete_by_file_name', file_name: entry.fileName };
          } else {
            body = { operation: 'delete_by_id', id: entry.id };
          }
          const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
          if (res.status === 401) {
            setFetchError('Session expired. Redirecting...');
            try { setSessionExpiredFlag(); } catch {}
            await logout();
            return;
          }
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Delete failed: ${res.status} ${res.statusText} ${text}`);
          }
        }

        // remove from UI after successful delete
        setLogs((prev) => prev.filter((l) => l.id !== deleteTarget));
      } catch (err: any) {
        console.error('Delete failed', err);
        // Optionally show an error toast; for now we log and keep the item
        setFetchError(err.message || 'Delete failed');
      } finally {
        setDeleteLoadingId(null);
        setDeleteTarget(null);
        setDeleteConfirmText("");
      }
    };

    performDelete();
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleSort = (column: "date" | "title") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (column: "date" | "title") => {
    if (sortBy !== column)
      return <div className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 ">Communication Logs</h1>
            <p className="text-gray-600 mt-1 text-sm dark:text-gray-400">Manage and track all social media communications</p>
          </div>
        </div>

        {/* Loader is displayed inside the table while fetching */}
        {fetchError && (
          <div className="mb-4 text-sm text-red-600">Error loading logs: {fetchError}</div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-400 rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:border-gray-600 transition text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-400 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200 border-b dark:bg-gray-800 border-gray-400">
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100 hover:text-black transition-colors"
                    >
                      Date
                      {getSortIcon("date")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900  dark:text-gray-100">Time</th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-2 font-semibold text-gray-900  dark:text-gray-100 hover:text-black transition-colors"
                    >
                      Title
                      {getSortIcon("title")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900  dark:text-gray-100">URL</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900  dark:text-gray-100">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25 text-gray-300" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <div className="text-sm text-gray-700 dark:text-white">Loading logs...</div>
                      </div>
                    </td>
                  </tr>
                ) : paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log: LogItem) => (
                    <tr key={log.id} className="hover:bg-gray-100 transition-colors dark:hover:bg-gray-700">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900  dark:text-gray-100">{log.date}</td>
                      <td className="px-6 py-3 text-sm text-gray-600  dark:text-gray-100">{log.time}</td>
                      <td className="px-6 py-3 text-sm text-gray-900  dark:text-gray-100">{log.title}</td>
                      <td className="px-6 py-3 text-sm">
                        <a
                          href={log.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline text-sm"
                        >
                          <Link className="inline-block w-4 h-4 mr-1 text-blue-400 hover:text-blue-900" />
                        </a>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteClick(log.id)}
                          disabled={!!deleteLoadingId}
                          className={`flex items-center gap-2 px-2 py-1 text-sm font-medium rounded transition ${deleteLoadingId ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-white-300 text-red-600 hover:bg-gray-300'}`}
                        >
                          {deleteLoadingId === log.id ? (
                            <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-gray-600">No logs found</p>
                      <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
        {/* Delete confirmation dialog */}
        <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteConfirmText(""); } }}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Confirm delete</DialogTitle>
              <DialogDescription>Are you sure you want to delete this communication log? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <label className="block text-sm text-gray-700 mb-2">Type <span className="font-medium">permanently delete</span> to confirm:</label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type permanently delete to enable Delete"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">You must type <span className="font-mono">permanently delete</span> to enable the Delete button.</p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCancelDelete}>Cancel</Button>
                <Button
                  className="ml-2 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleConfirmDelete}
                  disabled={!!deleteLoadingId || deleteConfirmText.trim().toLowerCase() !== 'permanently delete'}
                >
                  {deleteLoadingId ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>

              {/* Page links */}
              {(() => {
                const pages: number[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  const left = Math.max(2, currentPage - 1);
                  const right = Math.min(totalPages - 1, currentPage + 1);
                  if (left > 2) pages.push(-1);
                  for (let i = left; i <= right; i++) pages.push(i);
                  if (right < totalPages - 1) pages.push(-1);
                  pages.push(totalPages);
                }

                return pages.map((p, idx) => {
                  if (p === -1) {
                    return (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === currentPage}
                        onClick={(e: any) => {
                          e.preventDefault();
                          setCurrentPage(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default TwitterLogs;
