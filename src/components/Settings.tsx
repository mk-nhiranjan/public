import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Bell, CheckCircle2, Moon, Sun } from 'lucide-react';
// import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useDarkMode } from '../contexts/ThemeContext';

interface SettingsProps {
  // kept for compatibility; no props required for UI-only settings
}

interface Preferences {
  districts: string[];
  industries: string[];
  liabilityRanges: string[];
  emailNotifications?: {
    instantAlerts: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
    newFilings: boolean;
    savedFilings: boolean;
  };
}

const DEFAULT_PREFERENCES: Preferences = {
  districts: [],
  industries: [],
  liabilityRanges: [],
  emailNotifications: {
    instantAlerts: false,
    dailyDigest: true,
    weeklyReport: true,
    newFilings: true,
    savedFilings: true,
  }
};

export default function Settings(_: SettingsProps) {
  const [preferences, setPreferences] = useState<Preferences>({ ...DEFAULT_PREFERENCES });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // All US Bankruptcy Districts
  const districts = [
    // Alabama
    'N.D. Alabama', 'M.D. Alabama', 'S.D. Alabama',
    // Alaska
    'D. Alaska',
    // Arizona
    'D. Arizona',
    // Arkansas
    'E.D. Arkansas', 'W.D. Arkansas',
    // California
    'N.D. California', 'E.D. California', 'C.D. California', 'S.D. California',
    // Colorado
    'D. Colorado',
    // Connecticut
    'D. Connecticut',
    // Delaware
    'D. Delaware',
    // District of Columbia
    'D. District of Columbia',
    // Florida
    'N.D. Florida', 'M.D. Florida', 'S.D. Florida',
    // Georgia
    'N.D. Georgia', 'M.D. Georgia', 'S.D. Georgia',
    // Hawaii
    'D. Hawaii',
    // Idaho
    'D. Idaho',
    // Illinois
    'N.D. Illinois', 'C.D. Illinois', 'S.D. Illinois',
    // Indiana
    'N.D. Indiana', 'S.D. Indiana',
    // Iowa
    'N.D. Iowa', 'S.D. Iowa',
    // Kansas
    'D. Kansas',
    // Kentucky
    'E.D. Kentucky', 'W.D. Kentucky',
    // Louisiana
    'E.D. Louisiana', 'M.D. Louisiana', 'W.D. Louisiana',
    // Maine
    'D. Maine',
    // Maryland
    'D. Maryland',
    // Massachusetts
    'D. Massachusetts',
    // Michigan
    'E.D. Michigan', 'W.D. Michigan',
    // Minnesota
    'D. Minnesota',
    // Mississippi
    'N.D. Mississippi', 'S.D. Mississippi',
    // Missouri
    'E.D. Missouri', 'W.D. Missouri',
    // Montana
    'D. Montana',
    // Nebraska
    'D. Nebraska',
    // Nevada
    'D. Nevada',
    // New Hampshire
    'D. New Hampshire',
    // New Jersey
    'D. New Jersey',
    // New Mexico
    'D. New Mexico',
    // New York
    'N.D. New York', 'E.D. New York', 'S.D. New York', 'W.D. New York',
    // North Carolina
    'E.D. North Carolina', 'M.D. North Carolina', 'W.D. North Carolina',
    // North Dakota
    'D. North Dakota',
    // Ohio
    'N.D. Ohio', 'S.D. Ohio',
    // Oklahoma
    'N.D. Oklahoma', 'E.D. Oklahoma', 'W.D. Oklahoma',
    // Oregon
    'D. Oregon',
    // Pennsylvania
    'E.D. Pennsylvania', 'M.D. Pennsylvania', 'W.D. Pennsylvania',
    // Rhode Island
    'D. Rhode Island',
    // South Carolina
    'D. South Carolina',
    // South Dakota
    'D. South Dakota',
    // Tennessee
    'E.D. Tennessee', 'M.D. Tennessee', 'W.D. Tennessee',
    // Texas
    'N.D. Texas', 'E.D. Texas', 'S.D. Texas', 'W.D. Texas',
    // Utah
    'D. Utah',
    // Vermont
    'D. Vermont',
    // Virginia
    'E.D. Virginia', 'W.D. Virginia',
    // Washington
    'E.D. Washington', 'W.D. Washington',
    // West Virginia
    'N.D. West Virginia', 'S.D. West Virginia',
    // Wisconsin
    'E.D. Wisconsin', 'W.D. Wisconsin',
    // Wyoming
    'D. Wyoming',
    // Puerto Rico
    'D. Puerto Rico',
    // Guam
    'D. Guam',
    // Northern Mariana Islands
    'D. Northern Mariana Islands',
    // Virgin Islands
    'D. Virgin Islands'
  ];

  // Comprehensive industry list
  const industries = [
    'Aerospace & Defense',
    'Agriculture & Farming',
    'Automotive',
    'Banking & Financial Services',
    'Biotechnology',
    'Broadcasting & Media',
    'Chemical Manufacturing',
    'Construction',
    'Consumer Electronics',
    'Consumer Goods',
    'Education',
    'Energy & Utilities',
    'Engineering',
    'Entertainment',
    'Environmental Services',
    'Fashion & Apparel',
    'Food & Beverage',
    'Furniture',
    'Gaming & Casinos',
    'Healthcare',
    'Hospitality & Tourism',
    'Industrial Equipment',
    'Insurance',
    'Internet & E-commerce',
    'Logistics & Transportation',
    'Manufacturing',
    'Maritime & Shipping',
    'Mining & Metals',
    'Oil & Gas',
    'Paper & Packaging',
    'Pharmaceuticals',
    'Printing & Publishing',
    'Real Estate',
    'Religious Organization',
    'Restaurants',
    'Retail',
    'Software & SaaS',
    'Technology',
    'Telecommunications',
    'Textiles',
    'Waste Management',
    'Other'
  ];

  const liabilityRanges = [
    '$0 - $50K', '$50K - $100K', '$100K - $500K', '$500K - $1M',
    '$1M - $10M', '$10M - $50M', '$50M - $100M', '$100M - $500M',
    '$500M - $1B', '$1B+'
  ];

  // NOTE: Simplified UI-only Settings: no network calls.
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const resetPreferences = () => {
    setPreferences({ ...DEFAULT_PREFERENCES });
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}>
              Customize your email notifications and alert preferences for bankruptcy filings
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className={`flex items-center gap-2 ${
              isDarkMode
                ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                Dark Mode
              </>
            )}
          </Button>
        </div>

      {/* error handling removed for UI-only settings (no network calls) */}

      {saveSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Preferences saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Email Notification Settings */}
      <Card className={`mb-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#1F5B52]" />
            <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Email Notifications</CardTitle>
          </div>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}>
            Choose how and when you want to receive email alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-filings" className={isDarkMode ? 'text-white' : ''}>Real-Time Filings</Label>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                Notifications for ALL new Chapter 11 filings (Warning: High email volume)
              </p>
            </div>
            <Switch
              id="new-filings"
              checked={preferences.emailNotifications?.newFilings}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  emailNotifications: {
                    ...preferences.emailNotifications!,
                    newFilings: checked,
                    // If Real-Time Filings is turned on, turn off Custom Alerts
                    instantAlerts: checked ? false : preferences.emailNotifications!.instantAlerts
                  }
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily-digest" className={isDarkMode ? 'text-white' : ''}>Daily Digest</Label>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                Daily summary of ALL matching filings (sent at 9 AM)
              </p>
            </div>
            <Switch
              id="daily-digest"
              checked={preferences.emailNotifications?.dailyDigest}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  emailNotifications: {
                    ...preferences.emailNotifications!,
                    dailyDigest: checked
                  }
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-report" className={isDarkMode ? 'text-white' : ''}>Weekly Report</Label>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                Weekly summary with trends and insights (sent Monday mornings)
              </p>
            </div>
            <Switch
              id="weekly-report"
              checked={preferences.emailNotifications?.weeklyReport}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  emailNotifications: {
                    ...preferences.emailNotifications!,
                    weeklyReport: checked
                  }
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="saved-filings" className={isDarkMode ? 'text-white' : ''}>Saved Filing Updates</Label>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                Notifications about updates to your saved filings
              </p>
            </div>
            <Switch
              id="saved-filings"
              checked={preferences.emailNotifications?.savedFilings}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  emailNotifications: {
                    ...preferences.emailNotifications!,
                    savedFilings: checked
                  }
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="instant-alerts" className={isDarkMode ? 'text-white' : ''}>Custom Alerts</Label>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                Receive immediate notifications for new filings matching your criteria
              </p>
            </div>
            <Switch
              id="instant-alerts"
              checked={preferences.emailNotifications?.instantAlerts}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  emailNotifications: {
                    ...preferences.emailNotifications!,
                    instantAlerts: checked,
                    // If Custom Alerts is turned on, turn off Real-Time Filings
                    newFilings: checked ? false : preferences.emailNotifications!.newFilings
                  }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {preferences.emailNotifications?.instantAlerts && (
        <>
          {/* Liability Ranges - Only show when Custom Alerts is enabled */}
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Liability Size</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}>
                Select liability ranges to monitor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {liabilityRanges.map((range) => (
                  <Badge
                    key={range}
                    variant={preferences.liabilityRanges.includes(range) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      preferences.liabilityRanges.includes(range)
                        ? 'bg-[#1F5B52] hover:bg-[#1a4d45] text-white'
                        : isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : ''
                    }`}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        liabilityRanges: toggleArrayItem(preferences.liabilityRanges, range)
                      })
                    }
                  >
                    {range}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Court Districts */}
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Court Districts</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}>
                Select districts to monitor for new filings ({preferences.districts.length} selected)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {districts.map((district) => (
                  <Badge
                    key={district}
                    variant={preferences.districts.includes(district) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      preferences.districts.includes(district)
                        ? 'bg-[#1F5B52] hover:bg-[#1a4d45] text-white'
                        : isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : ''
                    }`}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        districts: toggleArrayItem(preferences.districts, district)
                      })
                    }
                  >
                    {district}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industries */}
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Industries</CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-muted-foreground'}>
                Select industries you want to track ({preferences.industries.length} selected)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <Badge
                    key={industry}
                    variant={preferences.industries.includes(industry) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      preferences.industries.includes(industry)
                        ? 'bg-[#1F5B52] hover:bg-[#1a4d45] text-white'
                        : isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : ''
                    }`}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        industries: toggleArrayItem(preferences.industries, industry)
                      })
                    }
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={resetPreferences}
          disabled={isSaving}
          className={isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : ''}
        >
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1F5B52] hover:bg-[#1a4d45] text-white"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
      </div>
    </div>
  );
}
