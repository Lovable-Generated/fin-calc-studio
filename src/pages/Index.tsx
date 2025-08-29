import { LoanCalculator } from '@/components/LoanCalculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, PieChart, DollarSign, ArrowRight, Check } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary shadow-strong mb-8">
            <Calculator className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Financial Calculator
            <span className="block text-transparent bg-clip-text bg-gradient-hero mt-2">
              Studio
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional financial calculators built with precision. Make informed decisions 
            with our suite of interactive tools designed for accuracy and ease of use.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-medium">
              Try Calculator Below
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary/20">
              View All Calculators
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Our Calculators?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by financial professionals for accuracy, reliability, and ease of use
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-soft border-0 bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Accurate Results</CardTitle>
                <CardDescription>
                  Precise calculations using industry-standard formulas and methodologies
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-soft border-0 bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">Real-time Updates</CardTitle>
                <CardDescription>
                  Instant recalculation as you adjust parameters with live feedback
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-soft border-0 bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Detailed Breakdown</CardTitle>
                <CardDescription>
                  Comprehensive reports with payment schedules and visual insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Loan Payment Calculator
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate monthly payments, total interest, and view detailed amortization schedules
            </p>
          </div>
          
          <LoanCalculator />
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            More Calculators Coming Soon
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Tax Estimator', icon: DollarSign, status: 'Coming Soon' },
              { name: 'Investment Returns', icon: TrendingUp, status: 'Coming Soon' },
              { name: 'Retirement Planner', icon: PieChart, status: 'Coming Soon' },
              { name: 'Debt Payoff', icon: Calculator, status: 'Coming Soon' },
            ].map((calc, index) => (
              <Card key={index} className="shadow-soft border border-border/50 opacity-75">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
                    <calc.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{calc.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {calc.status}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Financial Calculator Studio. Professional tools for financial planning.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;