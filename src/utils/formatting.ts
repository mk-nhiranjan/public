/**
 * Number formatting utilities for bankruptcy filings platform
 * 
 * Formatting Rules:
 * - Asset/Liability ranges: Use specific format like "$0-$50K", "$1M-$10M", etc.
 * - All other amounts: $X,XXX (no decimals), -$X,XXX for negatives
 */

/**
 * Format dollar amounts according to platform rules
 * @param amount - The amount to format (can be number or string)
 * @param includeDecimals - Whether to include decimals (default: false)
 * @returns Formatted string with $ prefix and comma separators
 */
export function formatCurrency(amount: number | string, includeDecimals: boolean = false): string {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[$,]/g, '')) : amount;
  
  if (isNaN(numAmount)) {
    return '$0';
  }

  const isNegative = numAmount < 0;
  const absAmount = Math.abs(numAmount);
  
  // Format with no decimals by default
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(absAmount);

  // Add negative sign if needed
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format large numbers with K, M, B abbreviations
 * Used for summary statistics
 */
export function formatLargeNumber(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[$,]/g, '')) : amount;
  
  if (isNaN(numAmount)) {
    return '0';
  }

  const absAmount = Math.abs(numAmount);
  
  if (absAmount >= 1000000000) {
    return `${(numAmount / 1000000000).toFixed(1)}B`;
  } else if (absAmount >= 1000000) {
    return `${(numAmount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `${(numAmount / 1000).toFixed(1)}K`;
  }
  
  return numAmount.toLocaleString('en-US');
}

/**
 * Format regular numbers (non-currency) with commas
 * @param num - Number to format
 * @returns Formatted string with comma separators
 */
export function formatNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
  
  if (isNaN(numValue)) {
    return '0';
  }

  return numValue.toLocaleString('en-US');
}

/**
 * Valid Form 201 Field 15 asset/liability ranges
 */
export enum AssetRange {
  ZERO_TO_50K = '$0-$50K',
  FIFTY_K_TO_100K = '$50K-$100K',
  HUNDRED_K_TO_500K = '$100K-$500K',
  FIVE_HUNDRED_K_TO_1M = '$500K-$1M',
  ONE_M_TO_10M = '$1M-$10M',
  TEN_M_TO_50M = '$10M-$50M',
  FIFTY_M_TO_100M = '$50M-$100M',
  HUNDRED_M_TO_500M = '$100M-$500M',
  FIVE_HUNDRED_M_TO_1B = '$500M-$1B',
  ONE_B_TO_10B = '$1B-$10B',
  TEN_B_TO_50B = '$10B-$50B',
  MORE_THAN_50B = 'More than $50B',
  NOT_SELECTED = 'Not Selected'
}

/**
 * Check if a string is a valid Form 201 asset range
 * @param value - String to check
 * @returns boolean
 */
export function isAssetRange(value: string): boolean {
  return Object.values(AssetRange).includes(value as AssetRange);
}
