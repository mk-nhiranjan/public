// import React from 'react';
import { Button } from './ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import RKLogo from './RKLogo';
import Header from './Header';
import { ArrowRight, FileText, Zap, Bell, Building2, Calendar, DollarSign } from 'lucide-react';

export default function LandingPage({ onNavigateToDashboard }: { onNavigateToDashboard: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 dark:from-gray-950 dark:to-gray-900 text-foreground dark:text-white">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            <Zap className="h-3 w-3 mr-1" />
            Beta Release
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground dark:text-white mb-6">
            Chapter 11 Bankruptcy
            <span className="text-[#0f766e] block dark:text-[#0f766e]">Filing Monitor</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track Chapter 11 bankruptcy filings with detailed financial analysis. 
            Get comprehensive debtor information, creditor data, and filing insights in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onNavigateToDashboard} size="lg" className="px-8">
              View Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0f766e] mb-2">Chapter 11</div>
            <div className="text-sm text-muted-foreground dark:text-white">Bankruptcy Filings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0f766e] mb-2">47</div>
            <div className="text-sm text-muted-foreground dark:text-white">Filed Today</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0f766e] mb-2">$2.4B</div>
            <div className="text-sm text-muted-foreground dark:text-white">Total Assets Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0f766e] mb-2">Real-time</div>
            <div className="text-sm text-muted-foreground dark:text-white">Filing Updates</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground dark:text-white mb-4">
            Current Features - Chapter 11 Focus
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive Chapter 11 bankruptcy monitoring with detailed debtor and creditor analysis.
          </p>
          <Badge variant="outline" className="mt-4">
            More features coming soon
          </Badge>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-[#0f766e] dark:text-[#0f766e] mb-4" />
              <CardTitle>Chapter 11 Filings</CardTitle>
              <CardDescription>
                Monitor all Chapter 11 bankruptcy filings with comprehensive debtor information and case details.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="h-10 w-10 text-[#0f766e] dark:text-[#0f766e] mb-4" />
              <CardTitle>Company Intelligence</CardTitle>
              <CardDescription>
                Detailed company profiles including assets, liabilities, industry classification, and business operations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-[#0f766e] dark:text-[#0f766e] mb-4" />
              <CardTitle>Creditor Analysis</CardTitle>
              <CardDescription>
                Complete creditor breakdowns with claim types, amounts, and status indicators (Contested/Unliquidated/Disputed).
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-[#0f766e] dark:text-[#0f766e] mb-4" />
              <CardTitle>Filing Tracking</CardTitle>
              <CardDescription>
                Real-time updates on new Chapter 11 filings with case numbers, districts, and filing dates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-10 w-10 text-[#0f766e] dark:text-[#0f766e] mb-4" />
              <CardTitle>Smart Grouping</CardTitle>
              <CardDescription>
                Filings organized by liability ranges with enhanced visual hierarchy for easy analysis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
              <CardDescription>
                Advanced analytics, trend analysis, alerts, creditor tracking, and multi-chapter support.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Sign In Section */}
      {/* <section className="bg-[#0f766e] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            Ready to start monitoring Chapter 11 filings?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Sign in with your preferred account to access Filing Alert Beta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="secondary" size="lg" className="px-8">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
            <Button variant="secondary" size="lg" className="px-8">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M23.5 0h-15C7.4 0 6.5.9 6.5 2v20c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM8 19H5v-9h3v9zM6.5 8.8C5.5 8.8 4.7 8 4.7 7s.8-1.8 1.8-1.8S8.3 6 8.3 7s-.8 1.8-1.8 1.8zM20 19h-3v-4.4c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.4V19h-3v-9h2.9v1.2h.04c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19z"/>
              </svg>
              Sign in with LinkedIn
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="px-8">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165C3.887 18.165 2.892 15.64 2.892 11.992 2.892 6.714 6.655 1.9 12.476 1.9c4.565 0 8.121 3.249 8.121 7.596 0 4.528-2.856 8.166-6.82 8.166-1.331 0-2.584-.692-3.007-1.513 0 0-.658 2.505-.818 3.117-.298 1.149-1.099 2.587-1.634 3.467 1.234.379 2.54.583 3.886.583 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              Sign in with Microsoft
            </Button>
            <Button variant="secondary" size="lg" className="px-8">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Sign in with Twitter
            </Button>
          </div>
          
          <div className="mt-6">
            <Button onClick={onNavigateToDashboard} variant="outline" size="sm" className="text-[#0f766e] border-[#0f766e] hover:bg-[#0f766e]/10">
              Or view demo dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <div className="flex items-center space-x-2 mb-4">
                <RKLogo size={24} />
                <span className="font-semibold dark:text-white">Filing Alert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Beta release - Chapter 11 bankruptcy filing monitoring platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Dashboard</li>
                <li>Analytics</li>
                <li>Alerts</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Status</li>
                <li>Updates</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Filing Alert powered by RK | Consultants. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}