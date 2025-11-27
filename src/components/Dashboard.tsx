import React ,{useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import FilingCard from './FilingCard';
import { ChevronDown, ChevronUp, Loader2, Filter, LayoutGrid, Table } from 'lucide-react';
import { formatNumber } from '../utils/formatting';
import DatabaseView from './DatabaseView';
// import TrendingSection from './TrendingSection';
import { getFilings } from '../utils/api';

interface Filing {
  id: string;
  title?: string;
  debtorName: string;
  caseNumber: string;
  filedDate: string;
  district: string;
  chapter: string;
  assets: string;
  liabilities: string;
  creditors: string;
  location: string;
  industry: string;
  description: string;
  topCreditors: Array<{
    name: string;
    amount: string;
    type: string;
  }>;
}

interface DashboardProps {
  onNavigateToLanding: () => void;
  onViewFiling: (filing: Filing) => void;
  searchTerm: string;
  searchResults?: any;
  isSemanticSearch?: boolean;
  searchId?: number;  // Unique ID to track search changes
}

interface Metrics {
  totalFilings: string;
  totalFilingsRaw: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  chapter11Percentage?: string;
  chapter7Percentage?: string;
}

interface FilterOptions {
  chapters: string[];
  districts: string[];
  industries: string[];
  assetRanges: string[];
  liabilitiesRanges: string[];
}

export default function Dashboard({ onViewFiling, searchTerm: initialSearchTerm, searchResults, isSemanticSearch, searchId }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedAssetRange, setSelectedAssetRange] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLiabilityRange, setSelectedLiabilityRange] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'database'>('cards');
  const [groupBy, setGroupBy] = useState<'date' | 'liabilities'>('date');
  
  const [filings, setFilings] = useState<Filing[]>([]);
  const [trendingFilings, setTrendingFilings] = useState([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Infinite scroll state - page-based pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const scrollSentinelRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    
    // If search results are provided, use them directly
    if (searchResults && searchResults.results) {
      console.log('=== NEW SEARCH TRIGGERED ===');
      console.log('Processing search results:', searchResults);
      
      // Clear filings immediately to force re-render
      setFilings([]);
      
      const allFilings: Filing[] = [];
      
      // Handle recent_filings structure
      if (searchResults.results.recent_filings) {
        console.log('Recent filings found:', searchResults.results.recent_filings);
        ['large_cases', 'medium_cases', 'small_cases'].forEach((category) => {
          const categoryData = searchResults.results.recent_filings[category];
          if (categoryData?.filings && Array.isArray(categoryData.filings)) {
            console.log(`Processing ${category}:`, categoryData.filings.length, 'filings');
            categoryData.filings.forEach((filing: any) => {
              allFilings.push({
                id: filing.file_name || filing.file_id || filing.id,
                title: filing.title || filing.company_name || undefined,
                debtorName: filing.debtor_name || filing.name || 'Unknown',
                caseNumber: filing.case_number || 'N/A',
                filedDate: filing.filed_date || '',
                district: filing.location || filing.district || '',
                chapter: filing.chapter ? `${filing.chapter}` : 'Chapter 11',
                assets: filing.assets || 'N/A',
                liabilities: filing.liabilities || 'N/A',
                creditors: filing.creditors || '0',
                location: filing.location || '',
                industry: filing.industry || 'Unknown',
                description: filing.summary || filing.description || '',
                topCreditors: []
              });
            });
          }
        });
      }
      
      console.log('Total filings after processing:', allFilings.length);
      console.log('Setting filings to:', allFilings);
      
      // Replace all filings (don't append, since this is a new search)
      setFilings(allFilings);
      
      // Don't update metrics during search - keep original dashboard metrics
      // Metrics should only reflect overall dashboard statistics, not search results
      
      setLoading(false);
      setCurrentPage(1);
      setHasMoreResults(allFilings.length >= PAGE_SIZE);
      return;
    }
  }, [searchResults, searchId]);

  // Fetch metrics and data
  useEffect(() => {
    (async () => {
      try {
        // Fetch initial data (no filters)
        const data = await getFilings({ limit: '15' });
        console.log('Initial dashboard data:', data);
        if (data && data.metrics) {
          const normalized: Metrics = {
            totalFilings: String(data.metrics.total_filings || 0),
            totalFilingsRaw: Number(data.metrics.total_filings || 0),
            todayCount: Number(data.metrics.filings_today || 0),
            weekCount: Number(data.metrics.filings_this_week || 0),
            monthCount: Number(data.metrics.filings_this_month || 0),
            chapter11Percentage: `${data.metrics.chapter_11_percentage || 0}`,
          };
          setMetrics(normalized);
          setTrendingFilings(trendingFilings)
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    })();
  }, []);

  // Fetch filter options
  useEffect(() => {
    (async () => {
      try {
        // Fetch data once to populate filters
        const data = await getFilings({ limit: '15' });
        console.log('Filter options data:', data);
        if (data) {
          // Extract unique values from available fields in the response
          const districtsSet = new Set<string>();
          const industriesSet = new Set<string>();

          if (data.recent_filings) {
            ['large_cases', 'medium_cases', 'small_cases'].forEach((cat) => {
              const catData = data.recent_filings[cat];
              if (catData?.filings && Array.isArray(catData.filings)) {
                catData.filings.forEach((f: any) => {
                  // Extract district: API provides 'location' field; use location as district
                  const d = (f.location || f.district || f.basic_info?.district || '').toString().trim();
                  const ind = (f.industry || f.debtor_details?.industry || '').toString().trim();
                  if (d) districtsSet.add(d);
                  if (ind) industriesSet.add(ind);
                });
              }
            });
          }

          const normalized: FilterOptions = {
            chapters: ['Chapter 11', 'Chapter 7'],
            districts: [...Array.from(districtsSet).sort()],
            industries: [...Array.from(industriesSet).sort()],
            assetRanges: [
              "$0 - $50,000",
              "$50,001 - $100,000",
              "$100,001 - $500,000",
              "$500,001 - $1 million",
              "$1,000,001 - $10 million",
              "$10,000,001 - $50 million",
              "$50,000,001 - $100 million",
              "$100,000,001 - $500 million",
            ],
            liabilitiesRanges: [
              "$0 - $50,000",
              "$50,001 - $100,000",
              "$100,001 - $500,000",
              "$500,001 - $1 million",
              "$1,000,001 - $10 million",
              "$10,000,001 - $50 million",
              "$50,000,001 - $100 million",
              "$100,000,001 - $500 million",
            ],
          };

          setFilterOptions(normalized);
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    })();
  }, []);

  // Fetch filings with filters
  useEffect(() => {
    // Skip this effect if we have semantic search results
    if (isSemanticSearch && searchResults && searchResults.results) {
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setHasMoreResults(true);

    (async () => {
      try {
        // Build query params matching API expectations with page-based pagination
        const params: Record<string, string> = { page: '1', page_size: String(PAGE_SIZE), limit: String(PAGE_SIZE) };
        
        if (searchTerm) params.search = searchTerm;
        if (selectedDistrict !== 'all') params.district = selectedDistrict;
        if (selectedDistrict !== 'all') params.location = selectedDistrict;
        if (selectedAssetRange !== 'all') params.assets = selectedAssetRange;
        if (selectedIndustry !== 'all') params.industry = selectedIndustry;
        if (selectedLiabilityRange !== 'all') params.liabilities = selectedLiabilityRange;

        const data = await getFilings(params);
        
        // Extract filings from response - API returns data grouped by size
        const allFilings: Filing[] = [];
        
        if (data.recent_filings) {
          // Process each size category
          ['large_cases', 'medium_cases', 'small_cases'].forEach((category) => {
            if (data.recent_filings[category]?.filings) {
              data.recent_filings[category].filings.forEach((filing: any) => {
                allFilings.push({
                  id: filing.file_name || filing.file_id || filing.id,
                  title: filing.title || filing.company_name || undefined,
                  debtorName: filing.debtor_name || filing.name || 'Unknown',
                  caseNumber: filing.case_number || 'N/A',
                  filedDate: filing.filed_date || '',
                  district: filing.location || filing.district || '',
                  chapter: filing.chapter ? `${filing.chapter}` : 'Chapter 11',
                  assets: filing.assets || 'N/A',
                  liabilities: filing.liabilities || 'N/A',
                  creditors: filing.creditors || '0',
                  location: filing.location || '',
                  industry: filing.industry || 'Unknown',
                  description: filing.summary || filing.description || '',
                  topCreditors: []
                });
              });
            }
          });
        }

        setFilings(allFilings);
        console.log('Fetched filings:', allFilings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching filings:', err);
        setError('Failed to load filings');
        setLoading(false);
      }
    })();
  }, [searchTerm, selectedChapter, selectedDistrict, selectedAssetRange, selectedIndustry, selectedLiabilityRange, isSemanticSearch, searchResults]);

  // Infinite scroll effect - fetch next page when user reaches sentinel
  // BUT disable infinite scroll when search results are active (to prevent keyword search infinite loop)
  useEffect(() => {
    // Don't enable infinite scroll if we're showing semantic search results
    if (isSemanticSearch && searchResults && searchResults.results) {
      return;
    }

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMoreResults && !loading) {
          setIsLoadingMore(true);
          try {
            const nextPage = currentPage + 1;
            const params: Record<string, string> = {
              page: String(nextPage),
              page_size: String(PAGE_SIZE),
              limit: String(PAGE_SIZE)
            };

            if (searchTerm) params.search = searchTerm;
            if (selectedChapter !== 'all') params.chapter = selectedChapter;
            if (selectedDistrict !== 'all') {
              params.district = selectedDistrict;
              params.location = selectedDistrict;
            }
            if (selectedAssetRange !== 'all') params.assets = selectedAssetRange;
            if (selectedIndustry !== 'all') params.industry = selectedIndustry;
            if (selectedLiabilityRange !== 'all') params.liabilities = selectedLiabilityRange;

            const data = await getFilings(params);
            const newFilings: Filing[] = [];

            if (data.recent_filings) {
              ['large_cases', 'medium_cases', 'small_cases'].forEach((category) => {
                if (data.recent_filings[category]?.filings) {
                  data.recent_filings[category].filings.forEach((filing: any) => {
                    newFilings.push({
                      id: filing.file_name || filing.file_id || filing.id,
                      title: filing.title || filing.company_name || undefined,
                      debtorName: filing.debtor_name || filing.name || 'Unknown',
                      caseNumber: filing.case_number || 'N/A',
                      filedDate: filing.filed_date || '',
                      district: filing.location || filing.district || '',
                      chapter: filing.chapter ? `Chapter ${filing.chapter}` : 'Chapter 11',
                      assets: filing.assets || 'N/A',
                      liabilities: filing.liabilities || 'N/A',
                      creditors: filing.creditors || '0',
                      location: filing.location || '',
                      industry: filing.industry || 'Unknown',
                      description: filing.summary || filing.description || '',
                      topCreditors: []
                    });
                  });
                }
              });
            }

            // Append new filings to existing ones
            if (newFilings.length > 0) {
              setFilings((prev) => [...prev, ...newFilings]);
              setCurrentPage(nextPage);
            } else {
              setHasMoreResults(false);
            }
          } catch (err) {
            console.error('Error loading more filings:', err);
          } finally {
            setIsLoadingMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (scrollSentinelRef.current) {
      observer.observe(scrollSentinelRef.current);
    }

    return () => {
      if (scrollSentinelRef.current) {
        observer.unobserve(scrollSentinelRef.current);
      }
    };
  }, [currentPage, isLoadingMore, hasMoreResults, loading, searchTerm, selectedDistrict, selectedAssetRange, selectedIndustry, selectedLiabilityRange, isSemanticSearch, searchResults]);

  const activeFiltersCount = [selectedChapter, selectedDistrict, selectedAssetRange, selectedIndustry, selectedLiabilityRange].filter(v => v !== 'all').length;

  // Apply filters to filings (district, industry, chapter, etc.) for cards view
  const filteredFilings = filings.filter(f => {
    // District filter
    if (selectedDistrict !== 'all' && f.district !== selectedDistrict && f.location !== selectedDistrict) {
      return false;
    }
    // Industry filter
    if (selectedIndustry !== 'all' && f.industry !== selectedIndustry) {
      return false;
    }
    // Chapter filter
    if (selectedChapter !== 'all' && f.chapter !== selectedChapter) {
      return false;
    }
    return true;
  });

  // Default sort: most recent first
  const sortedFilings = [...filteredFilings].sort((a, b) => {
    try {
      const dateA = new Date(a.filedDate.split('/').reverse().join('-'));
      const dateB = new Date(b.filedDate.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    } catch (e) {
      return 0;
    }
  });

  // Helper to parse and format filing dates for grouping
  const formatDateDisplay = (raw: string) => {
    if (!raw) return 'Unknown';
    try {
      // support dd/mm/yyyy or ISO strings
      let d: Date;
      if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(raw)) {
        const parts = raw.split('/');
        d = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
      } else {
        d = new Date(raw);
      }
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return raw;
    }
  };

  // Group filings by liabilities buckets
  // Parse a liabilities string into an approximate USD number (upper bound when a range is provided).
  // Returns numeric value in USD, or null if it can't be determined.
  const parseLiabilitiesToNumber = (s?: string): number | null => {
    if (!s) return null;
    const raw = String(s).toLowerCase();

    try {
      // If string contains 'million' or 'billion' with an explicit number, capture that first
      const millionMatch = raw.match(/([\d,.]+)\s*(million)\b/);
      if (millionMatch) {
        const num = parseFloat(millionMatch[1].replace(/,/g, ''));
        if (!isNaN(num)) return Math.round(num * 1e6);
      }

      const billionMatch = raw.match(/([\d,.]+)\s*(billion)\b/);
      if (billionMatch) {
        const num = parseFloat(billionMatch[1].replace(/,/g, ''));
        if (!isNaN(num)) return Math.round(num * 1e9);
      }

      // Otherwise, extract any plain numbers (with commas) and use the largest as an estimate (upper bound of range).
      const numberMatches = raw.match(/[\d,]+(?:\.\d+)?/g);
      if (numberMatches && numberMatches.length > 0) {
        const parsed = numberMatches
          .map(x => parseFloat(x.replace(/,/g, '')))
          .filter(n => !isNaN(n));
        if (parsed.length > 0) {
          // If the values look small (e.g., 50, 100) but the string also contains 'million' elsewhere
          // we handle that above. Otherwise treat numbers with commas as full USD values.
          return Math.max(...parsed);
        }
      }

      return null;
    } catch (e) {
      return null;
    }
  };

  const groupedByLiabilities = (() => {
    const large: Filing[] = [];
    const medium: Filing[] = [];
    const small: Filing[] = [];
    const other: Filing[] = [];

    const LARGE_THRESHOLD = 50_000_000; // 50M and above
    const MEDIUM_THRESHOLD = 10_000_000; // 10M - 50M
    const SMALL_THRESHOLD = 1_000_000;  // 1M - 10M

    filteredFilings.forEach(f => {
      const value = parseLiabilitiesToNumber(f.liabilities);
      if (value === null) {
        other.push(f);
        return;
      }

      if (value >= LARGE_THRESHOLD) {
        large.push(f);
      } else if (value >= MEDIUM_THRESHOLD) {
        medium.push(f);
      } else if (value >= SMALL_THRESHOLD) {
        small.push(f);
      } else {
        other.push(f);
      }
    });

    return { large, medium, small, other };
  })();

  // Group filings by filed date (display string)
  const groupedByDate = sortedFilings.reduce<Record<string, typeof filings>>((acc, f) => {
    const key = formatDateDisplay(f.filedDate || '') || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(f);
    return acc;
  }, {} as Record<string, typeof filings>);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      {/* Main Content - trending bar is provided globally by AppLayout */}
      <main className="px-6 py-8 pt-[110px]">
        <div className="max-w-6xl mx-auto">
          {/* Metrics - centered cards like the design */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-8 py-6 text-center w-64">
              <div className="text-sm text-gray-500 dark:text-gray-400">Today</div>
              <div className="mt-2 text-3xl font-bold text-[#0f766e]">{formatNumber(metrics?.todayCount || 0)}</div>
              {/* <div className="mt-1 text-sm text-[#10b981]">↗ 100% vs yesterday</div> */}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-8 py-6 text-center w-64">
              <div className="text-sm text-gray-500 dark:text-gray-400">This Week</div>
              <div className="mt-2 text-3xl font-bold text-[#0f766e]">{formatNumber(metrics?.weekCount || 0)}</div>
              {/* <div className="mt-1 text-sm text-[#10b981]">↗ 33% vs last week</div> */}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-8 py-6 text-center w-64">
              <div className="text-sm text-gray-500 dark:text-gray-400">This Month</div>
              <div className="mt-2 text-3xl font-bold text-[#0f766e]">{formatNumber(metrics?.monthCount || 0)}</div>
              {/* <div className="mt-1 text-sm text-[#10b981]">↗ 33% vs last month</div> */}
            </div>
          </div>
        
        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-lg transition-all"
          >
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-500" />
              <span className="font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-3 bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            {filtersOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {filtersOpen && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {/* search input removed per request */}
              
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="bg-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-200 transition-colors dark:bg-gray-700">
                  <SelectValue placeholder="All Chapters" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50">
                  <SelectItem value="all">All Chapters</SelectItem>
                  {filterOptions?.chapters.map(chapter => (
                    <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="bg-gray-100 border-gray-300 hover:bg-gray-200 dark:border-gray-700 transition-colors dark:bg-gray-700">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50">
                  <SelectItem value="all">All Districts</SelectItem>
                  {filterOptions?.districts.slice(0, 20).map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAssetRange} onValueChange={setSelectedAssetRange}>
                <SelectTrigger className="bg-gray-100 border-gray-300 hover:bg-gray-200 dark:border-gray-700 transition-colors dark:bg-gray-700">
                  <SelectValue placeholder="All Asset Ranges" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50">
                  <SelectItem value="all">All Asset Ranges</SelectItem>
                  {filterOptions?.assetRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLiabilityRange} onValueChange={setSelectedLiabilityRange}>
                <SelectTrigger className="bg-gray-100 border-gray-300 hover:bg-gray-200 dark:border-gray-700 transition-colors dark:bg-gray-700">
                  <SelectValue placeholder="All Liability Ranges" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50">
                  <SelectItem value="all">All Liability Ranges</SelectItem>
                  {filterOptions?.liabilitiesRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="bg-gray-100 border-gray-300 hover:bg-gray-200 dark:border-gray-700 transition-colors dark:bg-gray-700">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50">
                  <SelectItem value="all">All Industries</SelectItem>
                  {filterOptions?.industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline"
                className="bg-gray-100 border-gray-300 hover:bg-gray-200 dark:border-gray-700 dark:bg-[#385854]"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedChapter('all');
                  setSelectedDistrict('all');
                  setSelectedAssetRange('all');
                  setSelectedIndustry('all');
                  setSelectedLiabilityRange('all');
                }}
              >
                Clear All
              </Button>
              </div>
              {/* "Group by case size" removed per request */}
            </div>
          )}
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold dark:text-white">Recent Filings</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">{filings.length} filings found</div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">View:</span>
                  <div className="inline-flex rounded-md shadow-sm overflow-hidden">
                    <button
                      aria-pressed={activeTab === 'cards'}
                      onClick={() => setActiveTab('cards')}
                      className={`flex items-center px-3 py-2 text-sm focus:outline-none ${activeTab === 'cards' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'} rounded-l-md`}
                    >
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      <span>Cards</span>
                    </button>
                    <button
                      aria-pressed={activeTab === 'database'}
                      onClick={() => setActiveTab('database')}
                      className={`flex items-center px-3 py-2 text-sm focus:outline-none ${activeTab === 'database' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'} rounded-r-md`}
                    >
                      <Table className="w-4 h-4 mr-2" />
                      <span>Table</span>
                    </button>
                  </div>
                </div>

                {activeTab !== 'database' && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Group by:</span>
                    <div className="inline-flex rounded-md shadow-sm overflow-hidden">
                      <button
                        aria-pressed={groupBy === 'date'}
                        onClick={() => setGroupBy('date')}
                        className={`px-3 py-2 text-sm focus:outline-none ${groupBy === 'date' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'} rounded-l-md`}
                      >
                        Date
                      </button>
                      <button
                        aria-pressed={groupBy === 'liabilities'}
                        onClick={() => setGroupBy('liabilities')}
                        className={`px-3 py-2 text-sm focus:outline-none ${groupBy === 'liabilities' ? 'bg-emerald-700 text-white ring-1 ring-black' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'} rounded-r-md`}
                      >
                        Liabilities
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

                {activeTab === 'cards' ? (
                  <div>
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                        <p className="text-gray-500 mt-2">Loading filings...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-red-500 font-semibold bg-red-50 border border-red-200 rounded-lg">
                        {error}
                      </div>
                    ) : filings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No filings found matching your filters
                      </div>
                    ) : (
                      <>
                        {groupBy === 'liabilities' ? (
                          <div className="space-y-8">
                            {groupedByLiabilities.large.length > 0 && (
                              <section>
                                <div className="flex items-center mb-3">
                                  <h3 className="font-semibold">Large Cases ($50M+ Liabilities)</h3>
                                  <span className="ml-3 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{groupedByLiabilities.large.length}</span>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                                  {groupedByLiabilities.large.map((filing, i) => (
                                    <FilingCard key={`large-${i}-${filing.id}`} filing={filing} onViewDetail={onViewFiling} />
                                  ))}
                                </div>
                              </section>
                            )}

                            {groupedByLiabilities.medium.length > 0 && (
                              <section>
                                <div className="flex items-center mb-3">
                                  <h3 className="font-semibold">Medium Cases ($10M-$50M Liabilities)</h3>
                                  <span className="ml-3 bg-slate-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{groupedByLiabilities.medium.length}</span>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                                  {groupedByLiabilities.medium.map((filing, i) => (
                                    <FilingCard key={`medium-${i}-${filing.id}`} filing={filing} onViewDetail={onViewFiling} />
                                  ))}
                                </div>
                              </section>
                            )}

                            {groupedByLiabilities.small.length > 0 && (
                              <section>
                                <div className="flex items-center mb-3">
                                  <h3 className="font-semibold">Small Cases ($1M-$10M Liabilities)</h3>
                                  <span className="ml-3 bg-gray-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">{groupedByLiabilities.small.length}</span>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                                  {groupedByLiabilities.small.map((filing, i) => (
                                    <FilingCard key={`small-${i}-${filing.id}`} filing={filing} onViewDetail={onViewFiling} />
                                  ))}
                                </div>
                              </section>
                            )}

                            {groupedByLiabilities.other.length > 0 && (
                              <section>
                                <div className="flex items-center mb-3">
                                  <h3 className="font-semibold">Other Cases</h3>
                                  <span className="ml-3 bg-gray-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">{groupedByLiabilities.other.length}</span>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                                  {groupedByLiabilities.other.map((filing, i) => (
                                    <FilingCard key={`other-${i}-${filing.id}`} filing={filing} onViewDetail={onViewFiling} />
                                  ))}
                                </div>
                              </section>
                            )}
                          </div>
                        ) : (
                          // Group by date: render sections per date (most recent first)
                          Object.keys(groupedByDate)
                            .sort((a, b) => {
                              const da = new Date(a).getTime() || 0;
                              const db = new Date(b).getTime() || 0;
                              return db - da;
                            })
                            .map((dateKey) => (
                              <section key={dateKey} className="mb-6">
                                <div className="flex items-center mb-3">
                                  <h3 className="font-semibold">{dateKey}</h3>
                                  <span className="ml-3 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{groupedByDate[dateKey].length}</span>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                                  {groupedByDate[dateKey].map((filing, i) => (
                                    <FilingCard key={`date-${dateKey}-${i}-${filing.id}`} filing={filing} onViewDetail={onViewFiling} />
                                  ))}
                                </div>
                              </section>
                            ))
                        )}
                      </>
                    )}

                    {/* Infinite scroll sentinel */}
                    <div ref={scrollSentinelRef} className="py-8 text-center">
                      {isLoadingMore && (
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                          <span className="text-gray-500 text-sm">Loading more filings...</span>
                        </div>
                      )}
                      {!hasMoreResults && filings.length > 0 && (
                        <p className="text-gray-400 text-sm">No more filings to load</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <DatabaseView onNavigate={() => {}} onViewFiling={onViewFiling} searchTerm={searchTerm} selectedDistrict={selectedDistrict} selectedIndustry={selectedIndustry} selectedChapter={selectedChapter} selectedAssetRange={selectedAssetRange} selectedLiabilityRange={selectedLiabilityRange} />
                )}
              </div>
        </div>
      </div>
      </main>
    </div>
  );
}