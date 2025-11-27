import { useEffect, useMemo, useState } from 'react';
// import { Input } from './ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
// import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { getFilings } from '../utils/api';

type ViewType = 'landing' | 'dashboard' | 'filings' | 'analytics' | 'alerts' | 'creditors' | 'trends' | 'search' | 'filters' | 'data' | 'settings' | 'filing-detail' | 'database';

interface FilingRow {
  id: string;
  title?: string;
  debtorName: string;
  assets: string;
  liabilities: string;
  district: string;
  industry: string;
  filedDate: string;
  caseNumber: string;
  description: string;
  chapter?: string;
  creditors?: string;
  location?: string;
  affiliates?: { name: string; case_number: string }[];
  petitionLink?: string;
}

interface DatabaseViewProps {
  onNavigate: (view: ViewType) => void;
  onViewFiling: (filing: any) => void;
  searchTerm: string;
  selectedDistrict?: string;
  selectedIndustry?: string;
  selectedChapter?: string;
  selectedAssetRange?: string;
  selectedLiabilityRange?: string;
}

type SortKey = keyof FilingRow;

const FilingRowComponent: React.FC<{ filing: FilingRow, onViewDetail: (filing: any) => void }> = ({ filing }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAffiliates, setShowAffiliates] = useState(false);

  const hasAffiliates = filing.affiliates && filing.affiliates.length > 0;

  return (
    <>
      <TableRow className="hover:bg-gray-50 transition-colors  dark:border-gray-700 dark:hover:bg-gray-700/30 cursor-pointer " onClick={() => setIsExpanded(!isExpanded)}>
        <TableCell className="font-medium min-w-[200px]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <div className="min-w-0">
              <div className="font-semibold truncate" title={filing.title || filing.debtorName}>{filing.title || filing.debtorName}</div>
              {hasAffiliates && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                  onClick={(e) => { e.stopPropagation(); setShowAffiliates(!showAffiliates); }}
                >
                  <span className="font-medium">{filing.affiliates?.length} Related Debtors</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showAffiliates ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-sm whitespace-nowrap">{filing.filedDate}</TableCell>
        <TableCell className="text-sm truncate max-w-[180px]" title={filing.district || filing.location}>{filing.district || filing.location}</TableCell>
        <TableCell className="text-sm whitespace-nowrap">{filing.chapter || '—'}</TableCell>
        <TableCell className="font-semibold whitespace-nowrap">{filing.liabilities}</TableCell>
        <TableCell className="text-sm whitespace-nowrap">{filing.creditors || '—'}</TableCell>
        <TableCell className="text-sm whitespace-nowrap">{filing.industry}</TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="bg-blue-50/30 border-l-4 border-blue-400">
            <div className="p-4">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm mb-1 text-gray-800 dark:text-white">Case Summary</h4>
                  <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-wrap dark:text-white">{filing.description}</p>
                  {filing.petitionLink && (
                    <a 
                      href={filing.petitionLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Petition
                    </a>
                  )}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
      {hasAffiliates && showAffiliates && (
        <TableRow>
          <TableCell colSpan={7} className="bg-gray-50 border-l-4 border-gray-400">
            <div className="p-4">
              <h4 className="font-semibold text-sm mb-2 text-gray-800">Related Debtors</h4>
              <div className="grid grid-cols-2 gap-2">
                {filing.affiliates?.map(affiliate => (
                  <div key={affiliate.case_number} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">•</span>
                    <span className="font-medium">{affiliate.name}</span>
                    <span className="text-gray-500">({affiliate.case_number})</span>
                  </div>
                ))}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default function DatabaseView({ onViewFiling, searchTerm: initialSearchTerm, selectedDistrict, selectedIndustry, selectedChapter, selectedAssetRange, selectedLiabilityRange }: DatabaseViewProps) {
  const [rows, setRows] = useState<FilingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [district, setDistrict] = useState('all');
  const [industry, setIndustry] = useState('all');
  const [chapter, setChapter] = useState('all');
  const [assetRange, setAssetRange] = useState('all');
  const [liabilityRange, setLiabilityRange] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('filedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Sync parent-provided filters into local state (triggers reload via currentPage reset)
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== 'all' && district !== selectedDistrict) {
      setDistrict(selectedDistrict);
      setCurrentPage(1);
    } else if (!selectedDistrict || selectedDistrict === 'all') {
      if (district !== 'all') {
        setDistrict('all');
        setCurrentPage(1);
      }
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedIndustry && selectedIndustry !== 'all' && industry !== selectedIndustry) {
      setIndustry(selectedIndustry);
      setCurrentPage(1);
    } else if (!selectedIndustry || selectedIndustry === 'all') {
      if (industry !== 'all') {
        setIndustry('all');
        setCurrentPage(1);
      }
    }
  }, [selectedIndustry]);

  useEffect(() => {
    if (selectedChapter && selectedChapter !== 'all' && chapter !== selectedChapter) {
      setChapter(selectedChapter);
      setCurrentPage(1);
    } else if (!selectedChapter || selectedChapter === 'all') {
      if (chapter !== 'all') {
        setChapter('all');
        setCurrentPage(1);
      }
    }
  }, [selectedChapter]);

  useEffect(() => {
    if (selectedAssetRange && selectedAssetRange !== 'all' && assetRange !== selectedAssetRange) {
      setAssetRange(selectedAssetRange);
      setCurrentPage(1);
    } else if (!selectedAssetRange || selectedAssetRange === 'all') {
      if (assetRange !== 'all') {
        setAssetRange('all');
        setCurrentPage(1);
      }
    }
  }, [selectedAssetRange]);

  useEffect(() => {
    if (selectedLiabilityRange && selectedLiabilityRange !== 'all' && liabilityRange !== selectedLiabilityRange) {
      setLiabilityRange(selectedLiabilityRange);
      setCurrentPage(1);
    } else if (!selectedLiabilityRange || selectedLiabilityRange === 'all') {
      if (liabilityRange !== 'all') {
        setLiabilityRange('all');
        setCurrentPage(1);
      }
    }
  }, [selectedLiabilityRange]);

  // Load data from API with server-side filters (only depends on currentPage to avoid cycles)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { page: String(currentPage), page_size: String(PAGE_SIZE) };
        // Use current local filter state (synced from parent props above)
        if (district && district !== 'all') {
          params.district = district;
          params.location = district; // include as both district and location per API expectation
        }
        if (industry && industry !== 'all') params.industry = industry;
        if (chapter && chapter !== 'all') params.chapter = chapter;
        if (assetRange && assetRange !== 'all') params.assets = assetRange;
        if (liabilityRange && liabilityRange !== 'all') params.liabilities = liabilityRange;
        const data = await getFilings(params);
        
        // Extract all filings from API response (all size categories)
        const allFilings: FilingRow[] = [];
        if (data.recent_filings) {
          ['large_cases', 'medium_cases', 'small_cases'].forEach((category) => {
            if (data.recent_filings[category]?.filings) {
              data.recent_filings[category].filings.forEach((d: any) => {
                allFilings.push({
                  id: d.file_id || d.id || d.basic_info?.file_id,
                  title: d.title || d.company_name || d.debtor_details?.legal_name || d.basic_info?.debtor_name || undefined,
                  debtorName: d.debtor_name || d.name || d.basic_info?.debtor_name || 'Unknown',
                  assets: d.assets || d.financial_overview?.total_assets || 'N/A',
                  liabilities: d.liabilities || d.financial_overview?.total_liabilities || 'N/A',
                  district: d.location || d.district || d.basic_info?.district || '',
                  industry: d.industry || d.debtor_details?.industry || 'Unknown',
                  filedDate: d.filed_date || d.basic_info?.filing_date || '',
                  caseNumber: d.case_number || d.basic_info?.case_number || '',
                  description: d.summary || d.description || d.business_overview || 'No description available.',
                  affiliates: d.affiliates || [],
                  petitionLink: d.petition_link || d.file_details?.docket_link,
                  chapter: d.chapter || d.basic_info?.chapter || '',
                  creditors: d.creditors || d.financial_overview?.creditors || 'N/A',
                  location: d.location || d.basic_info?.location || '',
                });
              });
            }
          });
        }
        setRows(allFilings);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage]);


    const sortedAndFilteredRows = useMemo(() => {
      // Server-side filtering is used for district/industry; only apply search locally
      const filtered = rows.filter(r => {
        const matchesSearch = searchTerm
          ? (r.debtorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            r.id?.toLowerCase().includes(searchTerm.toLowerCase()))
          : true;
        return matchesSearch;
      });

      return filtered.sort((a, b) => {
        const aValue = a[sortKey as keyof typeof a];
        const bValue = b[sortKey as keyof typeof b];

        if (sortKey === 'filedDate') {
          const dateA = aValue ? new Date(aValue as string).getTime() : 0;
          const dateB = bValue ? new Date(bValue as string).getTime() : 0;
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }, [rows, searchTerm, district, industry, sortKey, sortDirection]);

  // const uniqueDistricts = useMemo(() => Array.from(new Set(rows.map(r => r.district))).filter(Boolean), [rows]);
  // const uniqueIndustries = useMemo(() => Array.from(new Set(rows.map(r => r.industry))).filter(Boolean), [rows]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ sortKey: key, children, className }: { sortKey: SortKey, children: React.ReactNode, className?: string }) => (
    <TableHead 
      onClick={() => handleSort(key)} 
      className={`cursor-pointer hover:bg-gray-800 transition-colors select-none ${className}`}
    >
      <div className="flex items-center gap-1">
        {children}
        <div className="flex flex-col">
          {sortKey === key ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4 text-white" />
            ) : (
              <ArrowDown className="h-4 w-4 text-white" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
    </TableHead>
  );

  return (
    <div className="px-4 py-4 w-full h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Database View</h1>
        <span className="text-sm text-muted-foreground">{sortedAndFilteredRows.length} results</span>
      </div>

      {/* Sticky header + scrollable body with horizontal scroll */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <Table className="min-w-full relative">
            <TableHeader className="bg-black border-b-2 border-gray-800 sticky top-0 z-20">
              <TableRow>
                <SortableHeader sortKey="debtorName" className="font-semibold text-white min-w-[200px] whitespace-nowrap">DEBTOR NAME</SortableHeader>
                <SortableHeader sortKey="filedDate" className="font-semibold text-white min-w-[120px] whitespace-nowrap">FILED DATE</SortableHeader>
                <SortableHeader sortKey="district" className="font-semibold text-white min-w-[160px] whitespace-nowrap">DISTRICT</SortableHeader>
                <SortableHeader sortKey="chapter" className="font-semibold text-white min-w-[100px] whitespace-nowrap">CHAPTER</SortableHeader>
                <SortableHeader sortKey="liabilities" className="font-semibold text-white min-w-[120px] whitespace-nowrap">LIABILITIES</SortableHeader>
                <SortableHeader sortKey="creditors" className="font-semibold text-white min-w-[120px] whitespace-nowrap">CREDITORS</SortableHeader>
                <SortableHeader sortKey="industry" className="font-semibold text-white min-w-[120px] whitespace-nowrap">INDUSTRY</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell>
                </TableRow>
              ) : sortedAndFilteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No results</TableCell>
                </TableRow>
              ) : (
                sortedAndFilteredRows.map(r => (
                  <FilingRowComponent key={r.id} filing={r} onViewDetail={onViewFiling} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination controls - now visible */}
        <div className="flex-shrink-0 flex flex-col gap-3 p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-white">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-white">
              <span className="font-medium">Page {currentPage}</span>
              <span className="mx-2">•</span>
              <span>Showing {rows.length} results</span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                ← Previous
              </Button>
              <Button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={rows.length < PAGE_SIZE}
                variant="outline"
                size="sm"
              >
                Next →
              </Button>
            </div>
          </div>
          
          {/* Page size info */}
          <div className="text-xs text-gray-500 border-t pt-2 dark:bg-gray-700 dark:text-gray-400">
            Page size: {PAGE_SIZE} items per page
            {rows.length < PAGE_SIZE && (
              <span className="ml-2 text-gray-600 font-medium">
                (Last page - {rows.length} items)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


