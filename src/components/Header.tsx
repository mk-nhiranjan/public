// import React from 'react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, X, LogIn, Moon, Sun } from 'lucide-react';
import { performSearch } from '../utils/api';
import { isAuthenticated, redirectToLogin } from '../utils/auth';
import { useDarkMode } from '../contexts/ThemeContext';

interface HeaderProps {
  onSearch?: (term: string) => void;
  onSearchResults?: (results: any) => void;
  onNavigate?: (view: string) => void;
}

export default function Header({ onSearch, onSearchResults, onNavigate }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'keyword_search' | 'semantic_search'>('keyword_search');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn] = useState(isAuthenticated());
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await performSearch(searchType, searchQuery);
      console.log('Search results:', results);
      
      // Pass results to parent component
      if (onSearchResults) {
        onSearchResults({
          query: searchQuery,
          searchType: searchType,
          results: results
        });
      }

      // Navigate to search results view
      if (onNavigate) {
        onNavigate('search');
      }

      if (onSearch) {
        onSearch(searchQuery);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // Reset to default state
    if (onNavigate) {
      onNavigate('dashboard');
    }
    if (onSearchResults) {
      onSearchResults({
        query: '',
        searchType: searchType,
        results: []
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[65px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 flex items-center px-6 transition-colors">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="https://mcusercontent.com/b25f6f76dc7d034b910e8eb3a/images/7dc0fc01-dbf7-b56c-619c-1e1c21ce4def.jpg"
            alt="Filing Alert Logo"
            className="h-10 w-10 object-cover rounded-full border-2 border-gray-100 dark:border-gray-700"
          />
          <div>
            <div className="font-bold text-gray-800 dark:text-white">
              Filing Alert
              <span
                className="ml-2 inline-flex items-center rounded-full border px-3 py-[2px] text-xs font-bold"
                style={{ backgroundColor: '#2b2b2b', color: '#3b82f6', borderColor: '#3b82f6' }}
              >
                Beta
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">powered by <span className="font-semibold" style={{ color: '#385854' }}>RK | Consultants</span></div>
          </div>
        </div>

        {/* Search Bar with Type Selector */}
        <div className="relative flex-1 max-w-lg mx-8">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent">
            <Select value={searchType} onValueChange={(val: any) => setSearchType(val)}>
              <SelectTrigger className="w-32 bg-transparent border-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-none shadow-none focus:ring-0 dark:text-white">
                <SelectValue placeholder="Search type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-50 dark:bg-gray-800 dark:text-white">
                <SelectItem value="keyword_search">Keyword</SelectItem>
                <SelectItem value="semantic_search">Semantic</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

            <div className="relative flex-1">
              <Input
                placeholder="Search filings, case numbers, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                className="pl-4 pr-20 h-10 bg-transparent border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400"
                disabled={isSearching}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Clear search"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-all duration-300 hover:scale-110 active:scale-95"
                title="Search"
              >
                <Search className={`h-4 w-4 transition-transform duration-500 ${isSearching ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={toggleDarkMode}
            variant="ghost" 
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </Button>
          <Button variant="ghost" className="text-[#385854] dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700">
            <a href="https://rkc.llc" target="_blank" rel="noopener noreferrer">
              Visit RK | Consultants
            </a>
          </Button>
          {!isLoggedIn && (
            <Button 
              onClick={() => redirectToLogin()}
              className="flex items-center gap-2 bg-[#385854] hover:bg-sidebar-primary-dark text-white font-semibold"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
