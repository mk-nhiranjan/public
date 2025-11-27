import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import FilingDetail from './components/FilingDetail';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DatabaseView from './components/DatabaseView';
import SOFAExtractorView from './components/SOFAExtractorView';
import TwiiterLogs from './components/TwiiterLogs';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SessionExpiredModal from './components/SessionExpiredModal';
import TrendingSection from './components/TrendingSection';
// import Settings from './components/Settings';
import { ThemeProvider } from './contexts/ThemeContext';


interface Filing {
  id: string;
  file_name?: string;
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

// App Layout Component with Sidebar and Header
function AppLayout({ children, onSearchResults, onViewFiling }: { children: React.ReactNode; onSearchResults?: (results: any) => void; onViewFiling?: (filing: any) => void }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname.substring(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 dark:from-gray-950 dark:to-gray-900 transition-colors">
      <Header onSearch={() => {}} onSearchResults={onSearchResults} />
      <div className="pt-[65px]">
        <TrendingSection onViewFiling={onViewFiling} />
        <Sidebar
          currentView={currentPath as any}
          onNavigate={(view) => navigate(`/${view}`)}
          onCollapseChange={setIsSidebarCollapsed}
        />
        <main className={`${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} min-h-screen transition-all duration-300 dark:bg-gray-900`}>
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Inner Router Component to access useNavigate hook
function InnerApp() {
  const [selectedFiling, setSelectedFiling] = useState<Filing | null>(null);
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: '',
    searchResults: null,
    isSemanticSearch: false,
    searchId: 0  // Add a unique ID to force re-renders on new searches
  });

  const handleViewFiling = (filing: Filing) => {
    console.log('Navigating to filing detail:', filing);
    setSelectedFiling(filing);
    // Navigate to filing detail with file_name (and optionally file_id for reference)
    // filing.id should contain the file_name now
    navigate(`/filing-detail/${encodeURIComponent(filing.id)}`);
  };

  const handleBackFromDetail = () => {
    setSelectedFiling(null);
    navigate('/dashboard');
  };

    const handleSearchResults = (results: any) => {
      console.log('=== Search Results Received in App ===', results);
      setSearchData({
        searchTerm: results.query,
        searchResults: results,
        isSemanticSearch: results.searchType === 'semantic_search',
        searchId: Date.now()  // Force re-render with a unique timestamp
      });
    };

  return (

    <Routes>
      {/* Landing Page - No Sidebar/Header */}
      <Route path="/" element={<LandingPage onNavigateToDashboard={() => navigate('/dashboard')} />} />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <Dashboard
              onNavigateToLanding={() => navigate('/')}
              onViewFiling={handleViewFiling}
              searchTerm={searchData.searchTerm}
              searchResults={searchData.searchResults}
              isSemanticSearch={searchData.isSemanticSearch}
              searchId={searchData.searchId}
            />
          </AppLayout>
        }
      />

      {/* Filings Routes */}
      <Route
        path="/filings"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <Dashboard
              onNavigateToLanding={() => navigate('/')}
              onViewFiling={handleViewFiling}
              searchTerm={searchData.searchTerm}
              searchResults={searchData.searchResults}
              isSemanticSearch={searchData.isSemanticSearch}
              searchId={searchData.searchId}
            />
          </AppLayout>
        }
      />

      {/* Filing Detail Route */}
      <Route
        path="/filing-detail/:fileName"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            {selectedFiling ? (
              <FilingDetail filing={selectedFiling} onBack={handleBackFromDetail} />
            ) : (
              // Allow FilingDetail to load data from URL parameter
              <FilingDetail 
                filing={{
                  id: '',
                  debtorName: '',
                  caseNumber: '',
                  filedDate: '',
                  district: '',
                  chapter: '',
                  assets: '',
                  liabilities: '',
                  creditors: '',
                  location: '',
                  industry: '',
                  description: '',
                  topCreditors: []
                }} 
                onBack={handleBackFromDetail} 
              />
            )}
          </AppLayout>
        }
      />

      {/* Database View Route */}
      <Route
        path="/database"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <DatabaseView
              onNavigate={(view) => navigate(`/${view}`)}
              onViewFiling={handleViewFiling}
              searchTerm={searchData.searchTerm}
            />
          </AppLayout>
        }
      />

      {/* SOFA Extractor Route */}
      <Route
        path="/sofa-extractor"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <SOFAExtractorView />
          </AppLayout>
        }
      />

      {/* Analytics Route */}
      <Route
        path="/analytics"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Analytics</h1>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </div>
          </AppLayout>
        }
      />

      {/* Alerts Route */}
      <Route
        path="/alerts"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Alerts</h1>
              <p className="text-muted-foreground">Alert management coming soon...</p>
            </div>
          </AppLayout>
        }
      />

      {/* Creditors Route */}
      <Route
        path="/creditors"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Creditor Tracker</h1>
              <p className="text-muted-foreground">Creditor tracking coming soon...</p>
            </div>
          </AppLayout>
        }
      />

      {/* Trends Route */}
      <Route
        path="/trends"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Market Trends</h1>
              <p className="text-muted-foreground">Market trend analysis coming soon...</p>
            </div>
          </AppLayout>
        }
      />

      {/* Search Route - Show Dashboard with search results */}
      <Route
        path="/search"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <Dashboard
              onNavigateToLanding={() => navigate('/')}
              onViewFiling={handleViewFiling}
              searchTerm={searchData.searchTerm}
              searchResults={searchData.searchResults}
              isSemanticSearch={searchData.isSemanticSearch}
              searchId={searchData.searchId}
            />
          </AppLayout>
        }
      />

      {/* Filters Route */}
      <Route
        path="/filters"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Saved Filters</h1>
              <p className="text-muted-foreground">Filter management coming soon...</p>
            </div>
          </AppLayout>
        }
      />

      {/* Data Export Route */}
      <Route
        path="/data"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Data Export</h1>
              <p className="text-muted-foreground">Data export tools coming soon...</p>
            </div>
          </AppLayout>
        }
      />

      {/* Settings Route */}
      <Route
        path="/settings"
        element={
          <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Settings</h1>
              <p className="text-muted-foreground">Application settings coming soon...</p>
            </div>
          </AppLayout>
        }
      />

      {/* Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Twitter Logs Route - Protected */}
      <Route
        path="/twitter-logs"
        element={
          <ProtectedRoute>
            <AppLayout onSearchResults={handleSearchResults} onViewFiling={handleViewFiling}>
              <TwiiterLogs />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

// Main App Component
export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <InnerApp />
        <SessionExpiredModal />
      </Router>
    </ThemeProvider>
  );
}