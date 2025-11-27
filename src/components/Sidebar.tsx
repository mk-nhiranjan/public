import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RiTwitterXFill } from "react-icons/ri";
// RKLogo import removed; not used in this component
import { 
  
  Home, 
  BarChart3, 
  Bell, 
  Search, 
  Settings, 
  
  TrendingUp,
  // Database,
  
  Download,
  MapPin,
  FileJson,
  Menu,
  LogOut,
  // X
} from 'lucide-react';
import { isAuthenticated, logout } from '../utils/auth';

type ViewType = 'landing' | 'dashboard' | 'filings' | 'analytics' | 'alerts' | 'creditors' | 'trends' | 'search' | 'filters' | 'data' | 'settings' | 'filing-detail' | 'database' | 'sofa-extractor';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export default function Sidebar({ currentView, onNavigate, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  };
  const mainNavigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      count: null,
    },
    {
      id: 'sofa-extractor',
      label: 'SOFA/SOAL Extractor',
      icon: FileJson,
      count: null,
    },
    {
      id:'twitter-logs',
      label: 'Twitter Logs',
      icon: RiTwitterXFill,
      count: null,
    }
  ];

  const comingSoonItems = [
    {
      id: 'analytics', 
      label: 'Trends & Insights',
      icon: BarChart3,
      count: null,
    },
    {
      id: 'trends',
      label: 'Industry Analysis', 
      icon: TrendingUp,
      count: null,
    },
    {
      id: 'creditors',
      label: 'Geographic Data',
      icon: MapPin,
      count: null,
    },
    {
      id: 'alerts',
      label: 'Alerts & Notifications', 
      icon: Bell,
      count: 3,
    },
    {
      id: 'search',
      label: 'Advanced Search',
      icon: Search,
    },
    {
      id: 'data',
      label: 'Export Data',
      icon: Download,
    },
  ];

  const settingsItem = {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    count: null,
  };
  // Sidebar is fixed at top-[110px] to account for header (65px) + trending section (45px)
  const topPosition = 'top-[110px]';

  return (
    <>
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-sidebar dark:bg-gray-800 border-r border-sidebar-border dark:text-white dark:border-gray-700 flex flex-col fixed left-0 ${topPosition} bottom-0 z-30 shadow-md transition-all duration-300`}>
        {/* Header strip with hamburger + rhino */}
        <div className="h-16 border-b border-sidebar-border dark:border-gray-700 flex items-center justify-center px-3 dark:bg-gray-800/50">
          <button
            onClick={() => handleCollapse()}
            className="h-9 w-9 p-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex-shrink-0 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          {!isCollapsed && (
            <>
              {/* <img
                src="https://mcusercontent.com/b25f6f76dc7d034b910e8eb3a/images/7dc0fc01-dbf7-b56c-619c-1e1c21ce4def.jpg"
                alt="Filing Alert Logo"
                className="ml-3 h-10 w-10 rounded-full object-cover flex-shrink-0"
              /> */}
              <div className="ml-3 min-w-0 flex-1">
                <div className="font-bold text-gray-800 dark:text-white">
                  MENU
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-sidebar dark:from-gray-800 to-sidebar/95 dark:to-gray-800/75">
          {/* MAIN Section */}
          <div className={`${isCollapsed ? 'px-2' : 'p-4'} pt-6`}>
            {!isCollapsed && (
              <div className="text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider mb-3">
                Main
              </div>
            )}
            <nav className="space-y-1">
              {mainNavigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id || 
                               (currentView === 'filing-detail' && item.id === 'filings');
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 transition-all ${
                      isActive 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm dark:bg-[#385854] dark:hover:bg-[#385854]'
                        : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    } ${isCollapsed ? 'px-2' : ''}`}
                    onClick={() => onNavigate(item.id as ViewType)}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`${isCollapsed ? 'h-5 w-5' : 'mr-3 h-4 w-4'}`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count && (
                          <Badge variant="secondary" className={`ml-auto text-xs ${isActive ? 'bg-sidebar-primary-foreground/20' : ''}`}>
                            {item.count > 999 ? '999+' : item.count}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* COMING SOON Section */}
          <div className={`${isCollapsed ? 'px-2' : 'p-4'} border-t border-sidebar-border dark:border-gray-700 bg-sidebar/50 dark:bg-gray-800/30`}>
            {!isCollapsed && (
              <div className="text-xs font-medium text-muted-foreground dark:text-gray-400 uppercase tracking-wider mb-3 opacity-75">
                Coming Soon
              </div>
            )}
            <nav className="space-y-1">
              {comingSoonItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start h-10 opacity-50 cursor-not-allowed ${isCollapsed ? 'px-2' : ''}`}
                    disabled
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`${isCollapsed ? 'h-5 w-5' : 'mr-3 h-4 w-4'}`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.count}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {settingsItem && (
          <div className={`${isCollapsed ? 'px-2' : 'p-4'} border-t border-sidebar-border dark:border-gray-700 bg-sidebar/50 dark:bg-gray-800/30`}>
            <nav className="space-y-1">
              <Button
                key={settingsItem.id}
                variant={currentView === 'settings' ? "secondary" : "ghost"}
                className={`w-full justify-start h-10 transition-all ${
                  currentView === 'settings'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm' 
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } ${isCollapsed ? 'px-2' : ''}`}
                onClick={() => onNavigate('settings')}
                title={isCollapsed ? settingsItem.label : undefined}
              >
                <settingsItem.icon className={`${isCollapsed ? 'h-5 w-5' : 'mr-3 h-4 w-4'}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{settingsItem.label}</span>
                    {settingsItem.count && (
                      <Badge variant="secondary" className={`ml-auto text-xs ${currentView === 'settings' ? 'bg-sidebar-primary-foreground/20' : ''}`}>
                        {settingsItem.count > 999 ? '999+' : settingsItem.count}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </nav>
          </div>
        )}

        {/* Logout Button (visible only when authenticated) */}
        {isAuthenticated() && (
          <div className={`border-t border-sidebar-border dark:border-gray-700 p-3 bg-sidebar/50 dark:bg-gray-800/30`}>
            <Button
              variant="destructive"
              className={`w-full h-10 ${isCollapsed ? 'justify-center px-0' : 'justify-start px-2'}`}
              onClick={async () => {
                setIsLoggingOut(true);
                try {
                  await logout();
                } catch (e) {
                  /* ignore */
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              title={isCollapsed ? 'Logout' : undefined}
              aria-label="Logout"
            >
              {isCollapsed ? (
                isLoggingOut ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                ) : (
                  <LogOut className="h-4 w-4 text-red-500" />
                )
              ) : (
                <>
                  <LogOut className="ml-2 mr-3 h-4 w-4 text-red-500" />
                  <span className="flex-1 text-left text-red-500">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
