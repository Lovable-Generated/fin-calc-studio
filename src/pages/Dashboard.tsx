import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CalculatorLayout from './calculators/CalculatorLayout';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Clock, 
  TrendingUp, 
  Star,
  ArrowRight,
  BarChart3,
  FileText,
  Settings,
  Download,
  Share2
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentCalculations, setRecentCalculations] = useState<any[]>([]);
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);

  useEffect(() => {
    // Load saved calculations from localStorage
    const saved = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
    setSavedCalculations(saved);
    
    // Mock recent calculations
    setRecentCalculations([
      {
        id: 1,
        type: 'Mortgage Calculator',
        date: new Date().toISOString(),
        summary: 'Home loan for $500,000',
        icon: '🏠'
      },
      {
        id: 2,
        type: 'Tax Estimator',
        date: new Date(Date.now() - 86400000).toISOString(),
        summary: 'Federal tax calculation',
        icon: '📋'
      },
      {
        id: 3,
        type: 'Investment Returns',
        date: new Date(Date.now() - 172800000).toISOString(),
        summary: 'Portfolio projection',
        icon: '📈'
      }
    ]);
  }, []);

  const quickLinks = [
    { title: 'Tax Estimator', path: '/calculators/tax-estimator', icon: FileText, color: 'bg-green-500' },
    { title: 'Mortgage Calculator', path: '/calculators/mortgage', icon: Calculator, color: 'bg-blue-500' },
    { title: 'Investment Returns', path: '/calculators/investment', icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Retirement Planner', path: '/calculators/retirement', icon: Clock, color: 'bg-orange-500' }
  ];

  const stats = [
    { label: 'Calculations This Month', value: '47', change: '+12%', positive: true },
    { label: 'Saved Calculations', value: savedCalculations.length.toString(), change: 'Total', positive: true },
    { label: 'Average Session Time', value: '8m 34s', change: '+2m', positive: true },
    { label: 'Most Used Calculator', value: 'Mortgage', change: '23 uses', positive: true }
  ];

  return (
    <CalculatorLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Track your financial calculations and access your saved results
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'} mt-1`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Calculations */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Calculations
                  </span>
                  <Link to="/dashboard/history">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCalculations.map((calc) => (
                    <div key={calc.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{calc.icon}</div>
                        <div>
                          <p className="font-medium">{calc.type}</p>
                          <p className="text-sm text-muted-foreground">{calc.summary}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(calc.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump to your most used calculators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickLinks.map((link) => (
                    <Link key={link.path} to={link.path}>
                      <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-all hover:shadow-md group">
                        <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center text-white`}>
                          <link.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium group-hover:text-primary transition-colors">{link.title}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Calculations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Saved Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedCalculations.length > 0 ? (
                  <div className="space-y-3">
                    {savedCalculations.slice(0, 3).map((calc, idx) => (
                      <div key={idx} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <p className="font-medium text-sm">{calc.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(calc.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    <Link to="/dashboard/saved">
                      <Button variant="outline" className="w-full" size="sm">
                        View All Saved
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No saved calculations yet</p>
                    <p className="text-xs mt-1">Your saved calculations will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/dashboard/profile">
                  <Button variant="outline" className="w-full justify-start">
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/dashboard/preferences">
                  <Button variant="outline" className="w-full justify-start">
                    Preferences
                  </Button>
                </Link>
                <Link to="/dashboard/export">
                  <Button variant="outline" className="w-full justify-start">
                    Export Data
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Features */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <Badge className="w-fit mb-2">PRO</Badge>
                <CardTitle className="text-lg">Unlock Pro Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary" />
                    Export to Excel/PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    Unlimited saved calculations
                  </li>
                </ul>
                <Button className="w-full bg-gradient-primary">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default Dashboard;