import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  ArrowRight, 
  Check,
  Home,
  Percent,
  Clock,
  Receipt,
  Wallet,
  ChartBar,
  Shield,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const Landing = () => {
  const calculators = [
    {
      id: 'tax-estimator',
      title: 'Tax Estimator (1040)',
      description: 'Calculate your federal income tax with precision',
      icon: Receipt,
      color: 'bg-green-500',
      features: ['2024 Tax Brackets', 'Deductions & Credits', 'Refund Estimation'],
      status: 'available'
    },
    {
      id: 'mortgage',
      title: 'Mortgage Calculator',
      description: 'Determine monthly payments and total interest',
      icon: Home,
      color: 'bg-blue-500',
      features: ['PMI Calculation', 'Amortization Schedule', 'Refinance Analysis'],
      status: 'available'
    },
    {
      id: 'investment',
      title: 'Investment Returns',
      description: 'Project investment growth over time',
      icon: TrendingUp,
      color: 'bg-purple-500',
      features: ['Compound Growth', 'Risk Analysis', 'Portfolio Allocation'],
      status: 'available'
    },
    {
      id: 'retirement',
      title: 'Retirement Planner',
      description: 'Plan your retirement savings strategy',
      icon: PieChart,
      color: 'bg-orange-500',
      features: ['401(k) & IRA', 'Social Security', 'Withdrawal Strategy'],
      status: 'available'
    },
    {
      id: 'loan',
      title: 'Loan Calculator',
      description: 'Calculate payments for any type of loan',
      icon: Wallet,
      color: 'bg-indigo-500',
      features: ['Auto Loans', 'Personal Loans', 'Student Loans'],
      status: 'available'
    },
    {
      id: 'compound-interest',
      title: 'Compound Interest',
      description: 'See how your money grows over time',
      icon: Percent,
      color: 'bg-teal-500',
      features: ['Daily/Monthly/Yearly', 'Regular Deposits', 'Interest Comparison'],
      status: 'available'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Calculations Performed' },
    { value: '500K+', label: 'Active Users' },
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'Available' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FinCalc Studio</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/calculators" className="text-sm font-medium hover:text-primary transition-colors">
                Calculators
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              <Zap className="w-3 h-3 mr-1" />
              Trusted by 500,000+ Users
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Financial Calculators
              <span className="block text-foreground">That Professionals Trust</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Make informed financial decisions with our suite of professional-grade calculators. 
              From taxes to retirement planning, we've got you covered with accurate, real-time calculations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/calculators">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-lg">
                  Explore All Calculators
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Professional Financial Calculators</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each calculator is designed with precision and includes advanced features for comprehensive financial planning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <Card key={calc.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${calc.color} flex items-center justify-center text-white`}>
                      <calc.icon className="w-6 h-6" />
                    </div>
                    {calc.status === 'available' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Available
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {calc.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {calc.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/calculators/${calc.id}`}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                      Try Calculator
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose FinCalc Studio?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by financial experts, trusted by professionals worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle>Bank-Level Security</CardTitle>
                <CardDescription>
                  Your data is encrypted and never stored. Complete privacy guaranteed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-4">
                  <ChartBar className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Real-Time Analysis</CardTitle>
                <CardDescription>
                  Instant calculations with visual charts and detailed breakdowns.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle>Professional Grade</CardTitle>
                <CardDescription>
                  Used by financial advisors, CPAs, and investment professionals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle>Industry Standards</CardTitle>
                <CardDescription>
                  Calculations based on latest IRS guidelines and financial regulations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who trust our calculators for their financial planning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary shadow-lg">
                Create Free Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/calculators">
              <Button size="lg" variant="outline">
                Browse Calculators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;