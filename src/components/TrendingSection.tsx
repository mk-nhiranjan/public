import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { getFilings } from '../utils/api';

interface TrendingFiling {
    filing: {
        id?: string;
        file_name?: string;
        caseNumber?: string;
        debtorName: string;
        chapter: string;
        assets: string;
        liabilities?: string;
        district?: string;
        filedDate?: string;
        industry?: string;
        location?: string;
        creditors?: string;
        description?: string;
        topCreditors?: any[];
    };
    change: number;
}

interface TrendingSectionProps {
    trendingFilings?: TrendingFiling[];
    onViewFiling?: (filing: any) => void;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ trendingFilings: propsTrendingFilings, onViewFiling }) => {
    const [trendingFilings, setTrendingFilings] = useState<TrendingFiling[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper function to format liabilities in millions
    const formatLiabilitiesInMillions = (liabilities: string): string => {
        if (!liabilities || liabilities === 'N/A') return 'N/A';
        
        // Remove $ and commas, then parse as number
        const cleanValue = liabilities.replace(/[$,]/g, '');
        const numericValue = parseFloat(cleanValue);
        
        if (isNaN(numericValue)) return liabilities;
        
        // If already in millions format (ends with M), return as is
        if (liabilities.toUpperCase().includes('M')) {
            return liabilities;
        }
        
        // Convert to millions and format
        const millions = numericValue / 1000000;
        return `$${millions.toFixed(0)}M`;
    };

    // Fetch top 10 trending filings from API
    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                // Fetch top 10 cases (page 1, page_size 10)
                const data = await getFilings({ page: '1', page_size: '10' });
                
                const trending: TrendingFiling[] = [];
                if (data.recent_filings) {
                    ['large_cases', 'medium_cases', 'small_cases'].forEach((category) => {
                        if (data.recent_filings[category]?.filings) {
                            data.recent_filings[category].filings.forEach((filing: any) => {
                                trending.push({
                                    filing: {
                                        id: filing.file_id || filing.id,
                                        file_name: filing.file_name || '',
                                        caseNumber: filing.case_number || 'N/A',
                                        debtorName: filing.debtor_name || filing.name || 'Unknown',
                                        chapter: filing.chapter ? `${filing.chapter}` : '11',
                                        assets: filing.assets || 'N/A',
                                        liabilities: filing.liabilities || filing.basic_info?.liabilities || 'N/A',
                                        district: filing.district || filing.basic_info?.district || filing.court || filing.location || 'Unknown',
                                        filedDate: filing.filed_date || '',
                                        industry: filing.industry || 'Unknown',
                                        location: filing.location || '',
                                        creditors: filing.creditors || '0',
                                        description: filing.summary || filing.description || '',
                                        topCreditors: filing.top_creditors || []
                                    },
                                    change: Math.floor(Math.random() * 50) // Random trending change for now
                                });
                            });
                        }
                    });
                }
                setTrendingFilings(trending.slice(0, 10)); // Limit to top 10
            } catch (err) {
                console.error('Error fetching trending data:', err);
                setTrendingFilings(propsTrendingFilings || []);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingData();
    }, [propsTrendingFilings]);

    const displayFilings = trendingFilings.length > 0 ? trendingFilings : propsTrendingFilings || [];
    
    // Return nothing if no filings
    if (!displayFilings || displayFilings.length === 0) {
        return null;
    }

    // Duplicate the array to create a seamless loop
    const extendedFilings = [...displayFilings, ...displayFilings];

    return (
        <div className="bg-gray-50 border-b border-gray-200 sticky top-[65px] h-[45px] overflow-hidden z-40 dark:bg-gray-900 dark:text-whi">
            <div className="flex items-center h-full">
                <div className="flex items-center px-4 py-2 flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap dark:text-white">Trending</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex animate-pulse py-2">
                            <div className="flex items-center mx-4 text-sm flex-shrink-0">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex animate-marquee py-2">
                            {extendedFilings.map((item, index) => (
                                <button
                                    key={index} 
                                    className="flex dark:text-gray-400 items-center mx-4 text-sm flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 hover:underline px-2 py-1 rounded transition-colors cursor-pointer"
                                    onClick={() => {
                                        if (onViewFiling && item.filing.file_name) {
                                            const filingWithId = {
                                                ...item.filing,
                                                id: item.filing.file_name // Set id to file_name for routing
                                            };
                                            onViewFiling(filingWithId);
                                        }
                                    }}
                                >
                                    <span className="font-semibold text-gray-800 dark:text-white">{item.filing.debtorName} </span>
                                    <span className="text-gray-600 dark:text-gray-400">({item.filing.district || item.filing.location || 'Unknown'}) </span>
                                    <span className="font-semibold">- Liab : {formatLiabilitiesInMillions(item.filing.liabilities || 'N/A')}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendingSection;
