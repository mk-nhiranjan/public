// import React from 'react';
// import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, 
  // Download, 
  MapPin, 
  // View, 
  Eye, 
  Mail, 
  Twitter 
} from 'lucide-react';

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

interface FilingCardProps {
  filing: Filing;
  onViewDetail: (filing: Filing) => void;
}

export default function FilingCard({ filing, onViewDetail }: FilingCardProps) {
  // const getChapterBadgeVariant = (chapter: string) => {
  //   switch (chapter) {
  //     case 'Chapter 7':
  //       return 'destructive';
  //     case 'Chapter 11':
  //       return 'default';
  //     case 'Chapter 13':
  //       return 'secondary';
  //     default:
  //       return 'outline';
  //   }
  // };

    const getChapterBadgeStyle = (chapter: string) => {
    switch (chapter) {
      case 'Chapter 7':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800';
      case 'Chapter 11':
        return 'bg-[#385854]/10 dark:bg-[#1F5B52]/30 text-[#385854] dark:text-[#4a9d94] border border-[#385854]/20 dark:border-[#1F5B52]';
      case 'Chapter 13':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700';
    }
  };

  const formatRangeKM = (value: string | null | undefined): string => {
  if (!value) return "";

  const parts = value.split("-").map(p => p.trim());
  if (parts.length !== 2) return value;

  const formatPart = (v: string): string => {
    const lower = v.toLowerCase();

    // Handle text formats: "1 million", "2.5 million"
    if (lower.includes("million")) {
      const num = parseFloat(lower.replace(/[^0-9.]/g, ""));
      return `$${num.toFixed(0)}M`;
    }
    if (lower.includes("billion")) {
      const num = parseFloat(lower.replace(/[^0-9.]/g, ""));
      return `$${num.toFixed(0)}B`;
    }

    // Handle formats like "$100,001"
    const numeric = Number(lower.replace(/[^0-9]/g, ""));
    if (isNaN(numeric)) return v; // fallback

    if (numeric >= 1_000_000_000) return `$${(numeric / 1_000_000_000).toFixed(0)}B`;
    if (numeric >= 1_000_000)     return `$${(numeric / 1_000_000).toFixed(0)}M`;
    if (numeric >= 1_000)         return `$${(numeric / 1_000).toFixed(0)}K`;

    return `$${numeric}`;
  };

  const from = formatPart(parts[0]);
  const to = formatPart(parts[1]);

  return `${from} - ${to}`;
};


  return (
    <div 
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer overflow-hidden"
      onClick={() => onViewDetail(filing)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground dark:text-white mb-1">
            {filing.debtorName}
          </h3>
          <div className="text-sm text-muted-foreground dark:text-gray-400">
            Case #{filing.caseNumber} • Filed {filing.filedDate} • {filing.district}
          </div>
        </div>
        <div
          className={`shrink-0 px-4 py-1.5 rounded-full font-semibold text-sm ${getChapterBadgeStyle(filing.chapter)}`}
        >
          {filing.chapter}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 overflow-hidden text-center">
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1">Assets</div>
          <div className="text-base break-words font-bold text-[#385854] dark:text-[#1F5B52]">  {formatRangeKM(filing.assets)}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 overflow-hidden text-center">
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1">Liabilities</div>
          <div className="text-base break-words font-bold text-red-600">{formatRangeKM(filing.liabilities)}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 overflow-hidden text-center">
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1">Creditors</div>
          <div className="text-sm break-words dark:text-gray-300">{filing.creditors}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 overflow-hidden text-center">
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1">Industry</div>
          <div className="text-sm break-words line-clamp-2 dark:text-gray-300">{filing.industry}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-base text-muted-foreground dark:text-gray-300 mb-3 line-clamp-2">
        {filing.description}
      </p>


      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700 gap-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground dark:text-gray-400 min-w-0">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{filing.location}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 dark:text-gray-300 dark:hover:text-white"
            title="Share via Email"
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 dark:text-gray-300 dark:hover:text-white"
            title="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Docket Link">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-2">
            <Eye className="h-3 w-3 mr-1" />
            <span className="text-xs">View PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
