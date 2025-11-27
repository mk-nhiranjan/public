import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { formatCurrency } from '../utils/formatting';
import { getCaseDetails } from '../utils/api';
import LoadingModal from './LoadingModal';
import { 
  // ArrowLeft, 
  ExternalLink, 
  // Download, 
  Building,
  Users,
  FileText,
  Phone,
  Mail,
  Info,
  Search,
  ArrowUpDown,
  Twitter
} from 'lucide-react';

interface Filing {
  id: string;
  title?: string;
  debtorName: string;
  logoUrl?: string;
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

interface Claim {
  creditor: string;
  amount: string;
  amountNumeric: number;
  nature: string;
  claimType: 'Secured' | 'Priority' | 'Unsecured';
  status?: 'C' | 'U' | 'D' | '';
}

interface EquityHolder {
  name: string;
  type: string;
  ownership: string;
  shares?: string;
}

interface DetailedFilingData {
  entityType: string;
  taxId: string;
  businessAddress: string;
  authorizedRep: string;
  title: string;
  yearsInBusiness?: string;
  keyDetails?: string[];
  claims: Claim[];
  equityHolders: EquityHolder[];
  basicInfo?: {
    case_number: string;
    chapter: string;
    debtor_name: string;
    district: string;
    filing_date: string;
    industry: string;
  }
  attorney: {
    name: string;
    firm: string;
    address: string;
    phone: string;
    email: string;
  };
  financialAccounts: Array<{
    institution: string;
    type: string;
    accountNumber: string;
    status: string;
    balance: string;
  }>;
  file_details?: {
    docket_url?: string;
    file_name?: string;
    docket_link?: string;
  };
}

interface FilingDetailProps {
  filing: Filing;
  onBack: () => void;
}

export default function FilingDetail({ filing }: FilingDetailProps) {
  const { fileName } = useParams<{ fileName: string }>();
  const [claimSearch, setClaimSearch] = useState('');
  const [sortField, setSortField] = useState<'creditor' | 'amount' | 'claimType'>('amount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);  // Start with true to show initial loading
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch detailed case data from API using file_name from URL params
  useEffect(() => {
    if (fileName) {
      (async () => {
        try {
          setIsLoading(true);
          setLoadError(null);
          const decodedFileName = decodeURIComponent(fileName);
          console.log(`Fetching details for file_name: ${decodedFileName}`);
          const data = await getCaseDetails(decodedFileName);
          console.log('API Data received:', data);
          setApiData(data);
          setLoadError(null);
        } catch (err) {
          console.error('Error fetching case details:', err);
          setLoadError(`Failed to load filing details: ${err}`);
          setApiData(null);  // Clear any partial data on error
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);  // No fileName, so not loading
    }
  }, [fileName]);

  // const handleBack = () => {
  //   if (onBack) {
  //     try { onBack(); return; } catch {}
  //   }
  //   if (typeof window !== 'undefined' && window.history?.length) {
  //     window.history.back();
  //   }
  // };

  const getChapterBadgeVariant = (chapter: string) => {
    switch (chapter) {
      case 'Chapter 7':
        return 'destructive';
      case 'Chapter 11':
        return 'default';
      case 'Chapter 13':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Generate detailed data based on the specific filing
  const generateDetailedData = (filing: Filing): DetailedFilingData => {
    // Midwest Manufacturing specific data
    if (filing.id === '3' || filing.debtorName.includes('Midwest Manufacturing')) {
      const allClaims: Claim[] = [
        { creditor: 'Fifth Third Bank', amount: formatCurrency(4500000), amountNumeric: 4500000, nature: 'Real estate mortgage and equipment loan', claimType: 'Secured', status: '' },
        { creditor: 'Equipment Finance Corp', amount: formatCurrency(987500), amountNumeric: 987500, nature: 'Manufacturing equipment financing', claimType: 'Secured', status: '' },
        { creditor: 'Industrial Credit Union', amount: formatCurrency(650000), amountNumeric: 650000, nature: 'Working capital line of credit', claimType: 'Secured', status: 'U' },
        { creditor: 'Caterpillar Financial', amount: formatCurrency(425000), amountNumeric: 425000, nature: 'Heavy machinery lease', claimType: 'Secured', status: '' },
        { creditor: 'Michigan Department of Treasury', amount: formatCurrency(125000), amountNumeric: 125000, nature: 'Unpaid sales tax 2023-2024', claimType: 'Priority', status: '' },
        { creditor: 'Department of Labor', amount: formatCurrency(89000), amountNumeric: 89000, nature: 'COBRA and health insurance premiums', claimType: 'Priority', status: '' },
        { creditor: 'Michigan Unemployment Agency', amount: formatCurrency(45500), amountNumeric: 45500, nature: 'Quarterly unemployment contributions', claimType: 'Priority', status: '' },
        { creditor: 'Steel Suppliers Inc', amount: formatCurrency(1275000), amountNumeric: 1275000, nature: 'Raw materials and steel inventory', claimType: 'Unsecured', status: 'D' },
        { creditor: 'DTE Energy', amount: formatCurrency(156000), amountNumeric: 156000, nature: 'Industrial electricity service', claimType: 'Unsecured', status: '' },
        { creditor: 'Consumers Energy', amount: formatCurrency(89500), amountNumeric: 89500, nature: 'Natural gas service', claimType: 'Unsecured', status: '' },
        { creditor: 'Industrial Parts Supply Co', amount: formatCurrency(445000), amountNumeric: 445000, nature: 'Manufacturing components and parts', claimType: 'Unsecured', status: '' },
        { creditor: 'Teamsters Local 299', amount: formatCurrency(125000), amountNumeric: 125000, nature: 'Union pension obligations', claimType: 'Unsecured', status: 'C' },
        { creditor: 'Ford Motor Company', amount: formatCurrency(950000), amountNumeric: 950000, nature: 'Auto parts supply contract', claimType: 'Unsecured', status: 'U' },
        { creditor: 'General Motors', amount: formatCurrency(680000), amountNumeric: 680000, nature: 'Automotive component supply', claimType: 'Unsecured', status: '' },
        { creditor: 'Various Trade Creditors', amount: formatCurrency(875000), amountNumeric: 875000, nature: 'Professional services and supplies', claimType: 'Unsecured', status: '' }
      ];

      return {
        entityType: 'Limited Liability Company',
        taxId: '38-1234567',
        businessAddress: '1500 Industrial Blvd, Detroit, MI 48201',
        authorizedRep: 'Robert Johnson',
        title: 'Managing Member',
        yearsInBusiness: '47 years in business since 1978 founding',
        keyDetails: [
          '47 years in business since 1978 founding [Source: MapQuest Business Directory]',
          '2 manufacturing facilities with 150 employees',
          'Operating under Chapter 11 reorganization'
        ],
        claims: allClaims,
        equityHolders: [
          { name: 'Robert Johnson', type: 'Member', ownership: '65%', shares: 'N/A - LLC' },
          { name: 'Patricia Johnson', type: 'Member', ownership: '35%', shares: 'N/A - LLC' }
        ],
        attorney: {
          name: 'Jennifer Williams',
          firm: 'Detroit Restructuring Law Group',
          address: '150 W Jefferson Ave, Suite 2500, Detroit, MI 48226',
          phone: '(313) 555-0198',
          email: 'jwilliams@detroitlaw.com'
        },
        financialAccounts: [
          {
            institution: 'Fifth Third Bank',
            type: 'Operating Account',
            accountNumber: 'xxxx-7341',
            status: 'Restricted',
            balance: formatCurrency(45670)
          }
        ]
      };
    }

    // Generic data for other filings – map what we have, leave missing fields blank
    const parseAmountToNumber = (value: any): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const n = parseFloat(value.replace(/[^0-9.-]/g, ''));
        return isNaN(n) ? 0 : n;
      }
      return 0;
    };

    const normalizeClaimType = (t: any): 'Secured' | 'Priority' | 'Unsecured' | undefined => {
      if (!t || typeof t !== 'string') return undefined;
      const s = t.toLowerCase();
      if (s.includes('secured')) return 'Secured';
      if (s.includes('priority')) return 'Priority';
      if (s.includes('unsecured')) return 'Unsecured';
      return undefined;
    };

    const allClaims: Claim[] = (filing.topCreditors || []).map((c: any) => ({
      creditor: c?.name || '',
      amount: c?.amount || '',
      amountNumeric: parseAmountToNumber(c?.amount),
      nature: c?.nature || '',
      claimType: normalizeClaimType(c?.claim_type ?? c?.type) as any,
      status: ''
    }));

    return {
      entityType: 'Corporation',
      taxId: '12-3456789',
      businessAddress: filing.location,
      authorizedRep: 'Corporate Officer',
      title: 'CEO',
      keyDetails: ['Business details coming soon'],
      claims: allClaims,
      equityHolders: [
        { name: 'Primary Shareholder', type: 'Common Stock', ownership: '100%', shares: '1,000' }
      ],
      attorney: {
        name: 'Attorney Name',
        firm: 'Law Firm LLP',
        address: 'Attorney Address',
        phone: '(555) 123-4567',
        email: 'attorney@lawfirm.com'
      },
      financialAccounts: [{
        institution: 'Financial Institution',
        type: 'Business Checking',
        accountNumber: 'xxxx-1234',
        status: 'Open',
        balance: formatCurrency(5000)
      }],
      file_details: {
        docket_url: '',
        file_name: '',
        docket_link: ''
      },
      basicInfo: {
        case_number: filing.caseNumber,
        chapter: filing.chapter,
        debtor_name: filing.debtorName,
        district: filing.district,
        filing_date: filing.filedDate,
        industry: filing.industry
      }
    };
  };

  const detailedData = apiData ? (console.log('Using API data'), parseApiData(apiData)) : (console.log('Using generated/filing data'), generateDetailedData(filing));
  console.log('Detailed Filing Data:', detailedData);
  console.log('isLoading:', isLoading, 'apiData:', apiData, 'loadError:', loadError);
  // Parse API response data into DetailedFilingData format
  function parseApiData(data: any): DetailedFilingData {
    console.log('parseApiData input:', data);
    console.log('Data keys:', Object.keys(data || {}));
    
    const parseAmountToNumber = (value: any): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const n = parseFloat(value.replace(/[^0-9.-]/g, ''));
        return isNaN(n) ? 0 : n;
      }
      return 0;
    };

    const normalizeClaimType = (t: any): 'Secured' | 'Priority' | 'Unsecured' | undefined => {
      if (!t || typeof t !== 'string') return undefined;
      const s = t.toLowerCase().trim();
      // Check priority_unsecured FIRST before generic unsecured check
      if (s.includes('priority') && s.includes('unsecured')) return 'Priority';
      if (s === 'priority' || s.includes('priority_unsecured')) return 'Priority';
      if (s === 'unsecured' || s.includes('unsecured')) return 'Unsecured';
      if (s === 'secured' || s.includes('secured')) return 'Secured';
      return undefined;
    };

    // Extract claims from creditors_list in the new API structure
    let claimsArray: any[] = [];
    if (Array.isArray(data.creditors?.creditors_list)) {
      console.log('Found creditors in data.creditors.creditors_list');
      claimsArray = data.creditors.creditors_list;
    } else if (Array.isArray(data.claims)) {
      console.log('Found creditors in data.claims');
      claimsArray = data.claims;
    } else if (Array.isArray(data.creditors)) {
      console.log('Found creditors in data.creditors');
      claimsArray = data.creditors;
    }
    console.log('claimsArray length:', claimsArray.length);

    const allClaims: Claim[] = claimsArray.map((claim: any) => ({
      creditor: claim?.name || claim?.creditor || 'Unknown Creditor',
      amount: claim?.amount ? formatCurrency(parseAmountToNumber(claim.amount)) : formatCurrency(0),
      amountNumeric: parseAmountToNumber(claim?.amount || 0),
      nature: claim?.basis || claim?.nature || claim?.description || 'Not specified',
      claimType: normalizeClaimType(claim?.type || claim?.claim_type || claim?.status || 'unsecured') || 'Unsecured',
      status: claim?.disputed ? 'D' : (claim?.contingent ? 'C' : (claim?.unliquidated ? 'U' : ''))
    }));

    // Extract equity holders from debtor_details or legacy fields
    let equityArray: any[] = [];
    if (Array.isArray(data.equity_holders)) {
      equityArray = data.equity_holders;
    } else if (Array.isArray(data.shareholders)) {
      equityArray = data.shareholders;
    }

    const equityHolders: EquityHolder[] = equityArray.map((holder: any) => ({
      name: holder?.name || 'Unknown',
      type: holder?.type || 'Unknown',
      ownership: holder?.ownership || holder?.percentage || '0%',
      shares: holder?.shares || 'N/A'
    }));

    // Extract financial accounts (if available)
    let accountsArray: any[] = [];
    if (Array.isArray(data.financial_accounts)) {
      accountsArray = data.financial_accounts;
    } else if (Array.isArray(data.financialAccounts)) {
      accountsArray = data.financialAccounts;
    }

    return {
      entityType: data.debtor_details?.entity_type || 'Corporation',
      taxId: data.debtor_details?.tax_id || '0',
      businessAddress: data.debtor_details?.business_address || 'Not available',
      authorizedRep: data.debtor_details?.authorized_rep || 'Not available',
      title: data.basic_info?.title || data.debtor_details?.legal_name || data.basic_info?.debtor_name || 'Not specified',
      yearsInBusiness: data.business_overview,
      keyDetails: [
        data.debtor_details?.industry ? `Industry: ${data.debtor_details.industry}` : null,
        data.creditors?.total_creditors ? `Total Creditors: ${data.creditors.total_creditors}` : null,
        data.financial_overview?.total_assets ? `Total Assets: ${formatCurrency(data.financial_overview.total_assets)}` : null,
        data.financial_overview?.total_liabilities ? `Total Liabilities: ${formatCurrency(data.financial_overview.total_liabilities)}` : null,
        data.financial_overview?.secured_creditors_count ? `Secured Creditors: ${data.financial_overview.secured_creditors_count}` : null,
        data.debtor_details?.small_business_debtor ? 'Small Business Debtor' : null,
        data.debtor_details?.subchapter_v ? 'Subchapter V' : null
      ].filter(Boolean) as string[],
      claims: allClaims,
      equityHolders: equityHolders,
      attorney: {
        name: data.attorney_info?.name || 'Not available',
        firm: data.attorney_info?.firm_name || data.attorney_info?.name || 'Not available',
        address: data.attorney_info?.address || 'Not available',
        phone: data.attorney_info?.phone || 'Not available',
        email: data.attorney_info?.email || 'Not available'
      },
      financialAccounts: accountsArray.map((account: any) => ({
        institution: account?.institution || 'Unknown',
        type: account?.type || 'Not specified',
        accountNumber: account?.account_number || account?.accountNumber || 'xxxx-xxxx',
        status: account?.status || 'Unknown',
        balance: account?.balance ? formatCurrency(parseAmountToNumber(account.balance)) : formatCurrency(0)
      })),
      file_details: {
        docket_url: data.file_details?.docket_link || data.docket_link || '',
        file_name: data.file_details?.file_name || data.file_name || '',
        docket_link: data.file_details?.docket_link || data.docket_link || ''
      },
      basicInfo: {
        case_number: data.basic_info?.case_number || data.case_number || '',
        chapter: data.basic_info?.chapter || data.chapter || '',
        debtor_name: data.basic_info?.debtor_name || data.debtor_name || '',
        district: data.basic_info?.district || data.district || '',
        filing_date: data.basic_info?.filing_date || data.filing_date || data.filed_date || '',
        industry: data.debtor_details?.industry || data.industry || ''
      }
    };
  }

  // Filter and sort claims
  const filteredClaims = detailedData.claims.filter(claim =>
    claim.creditor.toLowerCase().includes(claimSearch.toLowerCase()) ||
    claim.nature.toLowerCase().includes(claimSearch.toLowerCase()) ||
    claim.claimType.toLowerCase().includes(claimSearch.toLowerCase())
  );

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'creditor') {
      comparison = a.creditor.localeCompare(b.creditor);
    } else if (sortField === 'amount') {
      comparison = a.amountNumeric - b.amountNumeric;
    } else if (sortField === 'claimType') {
      comparison = a.claimType.localeCompare(b.claimType);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'creditor' | 'amount' | 'claimType') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <LoadingModal isOpen={isLoading} message="Loading filing details..." />
      
      {/* Show error message if loading failed */}
      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative m-6" role="alert">
          <span className="block sm:inline">{loadError}</span>
        </div>
      )}


      {/* Main Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* Header Summary */}
        <Card className="bg-white dark:bg-gray-900">
        <CardContent className="py-4">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Share via Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-white"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
              <Button size="sm" className="bg-[#1F5B52] hover:bg-[#1a4d45] text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Petition
              </Button>
            </div>
          </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700">
          <CardContent className="pt-8">
            {/* Title and Meta */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  {filing.logoUrl ? (
                    <img
                      src={filing.logoUrl}
                      alt={`${filing.debtorName} logo`}
                      className="h-12 w-12 object-contain"
                    />
                  ) : null}
                  <h1 className="text-4xl font-bold text-foreground leading-tight">
                    {apiData?.basic_info?.title || detailedData.title || apiData?.basic_info?.debtor_name || filing.title || filing.debtorName}
                  </h1>
                </div>
                <p className="text-muted-foreground dark:text-gray-400">
                  Case #{detailedData.basicInfo?.case_number} • Filed {detailedData.basicInfo?.filing_date} • {detailedData.basicInfo?.district}
                </p>
              </div>
              <Badge 
                variant={getChapterBadgeVariant(apiData?.basic_info?.chapter || filing.chapter)} 
                className={`text-sm px-4 py-2 font-semibold ${(apiData?.basic_info?.chapter || filing.chapter) === 'Chapter 11' ? 'bg-blue-800 text-white' : ''}`}
              >
                {apiData?.basic_info?.chapter || filing.chapter}
              </Badge>
            </div>

            {/* Key Metrics Grid - Simplified */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ">
              <div className="bg-muted/50 rounded-lg p-4 border border-border text-center dark:bg-gray-800 dark:border-gray-700">
                <div className="text-xs text-muted-foreground mb-2">Assets</div>
                <div className="font-bold text-red-700">{apiData?.financial_overview?.estimated_assets || filing.assets || 'No data'}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border text-center dark:bg-gray-800 dark:border-gray-700">
                <div className="text-xs text-muted-foreground mb-2">Liabilities</div>
                <div className="font-bold" style={{ color: '#385854' }}>{apiData?.financial_overview?.estimated_liabilities || filing.liabilities || 'No data'}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border text-center dark:bg-gray-800 dark:border-gray-700">
                <div className="text-xs text-muted-foreground mb-2">Creditors</div>
                <div className="font-bold text-foreground">{apiData?.creditors?.total_creditors || filing.creditors || 0}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border text-center dark:bg-gray-800 dark:border-gray-700">
                <div className="text-xs text-muted-foreground mb-2">Industry</div>
                <div className="font-semibold text-foreground">
                  {(apiData?.basic_info?.industry || filing.industry) === 'Religious Organization' ? 'Religious Org' : (apiData?.basic_info?.industry || filing.industry) === 'Technology' ? 'Tech' : (apiData?.basic_info?.industry || filing.industry)}
                </div>
                <div className="text-xs text-muted-foreground dark:text-gray-400">
                  {(apiData?.basic_info?.industry || filing.industry) === 'Religious Organization' ? 'Non-profit' : (apiData?.basic_info?.industry || filing.industry) === 'Technology' ? 'SaaS' : (apiData?.basic_info?.industry || filing.industry) === 'Manufacturing' ? 'Auto Parts' : 'Fashion'}
                </div>
              </div>
            </div>

            {/* Business Overview */}
            <div className="bg-muted/30 rounded-lg p-5 dark:bg-gray-800 dark:text-gray-400">
              <h3 className="font-semibold text-foreground mb-3">Business Overview</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {apiData?.business_overview || filing.description || 'No information available'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Debtor Information */}
        <Card className="bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700" >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Debtor Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm dark:text-gray-400">
              {detailedData.title && (
                <div className="flex border-b border-border pb-3">
                  <div className="w-40 text-muted-foreground">Business Name:</div>
                  <div className="flex-1 font-semibold">{detailedData.title.toUpperCase()}</div>
                </div>
              )}
              
              <div className="flex border-b border-border pb-3">
                <div className="w-40 text-muted-foreground">Legal Name:</div>
                <div className="flex-1 font-semibold">{(apiData?.basic_info?.debtor_name || apiData?.debtor_details?.legal_name || detailedData.title || '').toUpperCase()}</div>
              </div>
              
              <div className="flex border-b border-border pb-3">
                <div className="w-40 text-muted-foreground">Entity Type:</div>
                <div className="flex-1 font-semibold">{apiData?.debtor_details?.entity_type || detailedData.entityType}</div>
              </div>
              
              <div className="flex border-b border-border pb-3">
                <div className="w-40 text-muted-foreground">Tax ID:</div>
                <div className="flex-1 font-semibold">{apiData?.debtor_details?.tax_id || detailedData.taxId}</div>
              </div>
              
              <div className="flex border-b border-border pb-3">
                <div className="w-40 text-muted-foreground">Industry:</div>
                <div className="flex-1 font-semibold">{apiData?.basic_info?.industry || apiData?.debtor_details?.industry || 'Not available'}</div>
              </div>
              
              <div className="flex border-b border-border pb-3">
                <div className="w-40 text-muted-foreground">Address:</div>
                <div className="flex-1 font-semibold">{apiData?.debtor_details?.business_address || detailedData.businessAddress}</div>
              </div>
              
              <div className="flex border-b border-border pb-3">
                <div className="w-40 text-muted-foreground">Authorized Rep:</div>
                <div className="flex-1">
                  <div className="font-semibold">{apiData?.debtor_details?.authorized_rep || detailedData.authorizedRep || 'Not available'}</div>
                  <div className="text-muted-foreground">{detailedData.title}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Details */}
        {detailedData.keyDetails && detailedData.keyDetails.length > 0 && (
          <Card className="bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700" >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Key Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 dark:text-gray-400">
                {detailedData.keyDetails.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Claims Table - Consolidated */}
        <Card className="bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Claims Schedule ({sortedClaims.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims..."
                  value={claimSearch}
                  onChange={(e) => setClaimSearch(e.target.value)}
                  className="pl-10 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden dark:border-gray-700 dark:text-gray-400">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="cursor-pointer" onClick={() => handleSort('creditor')}>
                      <div className="flex items-center gap-2">
                        Creditor
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Nature of Claim</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('claimType')}>
                      <div className="flex items-center gap-2">
                        Type
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => handleSort('amount')}>
                      <div className="flex items-center justify-end gap-2">
                        Amount
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedClaims.map((claim, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{claim.creditor}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{claim.nature}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            claim.claimType === 'Secured' ? 'default' : 
                            claim.claimType === 'Priority' ? 'secondary' : 
                            'outline'
                          }
                          className="text-xs"
                        >
                          {claim.claimType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {claim.status && (
                          <Badge 
                            variant={
                              claim.status === 'D' ? 'destructive' : 
                              claim.status === 'C' ? 'secondary' : 
                              'outline'
                            } 
                            className="text-xs"
                          >
                            {claim.status === 'C' ? 'Contested' : claim.status === 'U' ? 'Unliquidated' : 'Disputed'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">{claim.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Claims Summary */}
            <div className="mt-4 grid grid-cols-3 gap-4 dark:text-gray-400">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Secured Claims</div>
                <div className="font-semibold">
                  {detailedData.claims.filter(c => c.claimType === 'Secured').length} claims
                </div>
                <div className="text-sm font-mono">
                  {formatCurrency(detailedData.claims.filter(c => c.claimType === 'Secured').reduce((sum, c) => sum + c.amountNumeric, 0))}
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Priority Claims</div>
                <div className="font-semibold">
                  {detailedData.claims.filter(c => c.claimType === 'Priority').length} claims
                </div>
                <div className="text-sm font-mono">
                  {formatCurrency(detailedData.claims.filter(c => c.claimType === 'Priority').reduce((sum, c) => sum + c.amountNumeric, 0))}
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Unsecured Claims</div>
                <div className="font-semibold">
                  {detailedData.claims.filter(c => c.claimType === 'Unsecured').length} claims
                </div>
                <div className="text-sm font-mono">
                  {formatCurrency(detailedData.claims.filter(c => c.claimType === 'Unsecured').reduce((sum, c) => sum + c.amountNumeric, 0))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equity Holders */}
        <Card className="bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equity Holders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden dark:text-gray-400 dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Ownership</TableHead>
                    <TableHead>Shares</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedData.equityHolders.map((holder, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{holder.name}</TableCell>
                      <TableCell>{holder.type}</TableCell>
                      <TableCell className="font-semibold">{holder.ownership}</TableCell>
                      <TableCell className="text-muted-foreground">{holder.shares || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Attorney Information */}
        <Card className="bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Attorney Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm dark:text-gray-400">
              <div>
                <div className="font-semibold text-foreground">{detailedData.attorney.name}</div>
                <div className="text-muted-foreground">{detailedData.attorney.firm}</div>
              </div>
              <div className="text-muted-foreground">{detailedData.attorney.address}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{detailedData.attorney.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{detailedData.attorney.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
