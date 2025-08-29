import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CalculatorLayout from './calculators/CalculatorLayout';
import { 
  Receipt, 
  Home, 
  TrendingUp, 
  PiggyBank, 
  Wallet, 
  Percent,
  ArrowRight,
  Check
} from 'lucide-react';

const AllCalculators = () => {
  const calculators = [
    {
      id: 'tax-estimator',
      title: 'Tax Estimator (1040)',
      description: 'Calculate your federal income tax with 2024 tax brackets, deductions, and estimate your refund',
      icon: Receipt,
      color: 'bg-green-500',
      features: ['2024 Tax Brackets', 'Deductions & Credits', 'Refund Estimation', 'Tax Breakdown'],
      path: '/calculators/tax-estimator',
      popular: true
    },
    {
      id: 'mortgage',
      title: 'Mortgage Calculator',
      description: 'Determine monthly payments, total interest, and view detailed amortization schedules',
      icon: Home,
      color: 'bg-blue-500',
      features: ['PMI Calculation', 'Amortization Schedule', 'Refinance Analysis', 'Payment Breakdown'],
      path: '/calculators/mortgage',
      popular: true
    },
    {
      id: 'investment',
      title: 'Investment Returns',
      description: 'Project investment growth over time with compound returns and regular contributions',
      icon: TrendingUp,
      color: 'bg-purple-500',
      features: ['Compound Growth', 'Risk Analysis', 'Portfolio Allocation', 'Inflation Adjustment'],
      path: '/calculators/investment'
    },
    {
      id: 'retirement',
      title: 'Retirement Planner',
      description: 'Plan your retirement savings strategy and track progress toward financial independence',
      icon: PiggyBank,
      color: 'bg-orange-500',
      features: ['401(k) & IRA', 'Social Security', 'Withdrawal Strategy', 'Retirement Income'],
      path: '/calculators/retirement',
      popular: true
    },
    {
      id: 'loan',
      title: 'Loan Calculator',
      description: 'Calculate payments for any type of loan with detailed payment schedules',
      icon: Wallet,
      color: 'bg-indigo-500',
      features: ['Auto Loans', 'Personal Loans', 'Student Loans', 'Payment Schedule'],
      path: '/calculators/loan'
    },
    {
      id: 'compound-interest',
      title: 'Compound Interest',
      description: 'See how your money grows over time with compound interest and regular deposits',
      icon: Percent,
      color: 'bg-teal-500',
      features: ['Daily/Monthly/Yearly', 'Regular Deposits', 'Interest Comparison', 'Growth Charts'],
      path: '/calculators/compound-interest'
    }
  ];

  return (
    <CalculatorLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Financial Calculators</h1>
          <p className="text-lg text-muted-foreground">
            Professional-grade financial calculators to help you make informed decisions. 
            All calculations use industry-standard formulas and current tax regulations.
          </p>
        </div>

        {/* Popular Calculators */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Most Popular
            <Badge variant="secondary">Trending</Badge>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.filter(calc => calc.popular).map((calc) => (
              <Card key={calc.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl ${calc.color} flex items-center justify-center text-white shadow-lg`}>
                      <calc.icon className="w-7 h-7" />
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Popular
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {calc.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {calc.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={calc.path}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Open Calculator
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Calculators */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">All Calculators</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.filter(calc => !calc.popular).map((calc) => (
              <Card key={calc.id} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl ${calc.color} flex items-center justify-center text-white shadow-lg`}>
                      <calc.icon className="w-7 h-7" />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {calc.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {calc.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={calc.path}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                      Open Calculator
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Calculator?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We can build custom financial calculators tailored to your specific needs. 
              Contact us to discuss your requirements.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-primary">
                  Request Custom Calculator
                </Button>
              </Link>
              <Link to="/api">
                <Button size="lg" variant="outline">
                  API Documentation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
};

export default AllCalculators;