import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

interface LoanCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  paymentSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('250000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('30');
  
  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(2)}%`;
  }, []);

  const calculation = useMemo((): LoanCalculation => {
    const principal = parseFloat(loanAmount) || 0;
    const monthlyRate = (parseFloat(interestRate) || 0) / 100 / 12;
    const numberOfPayments = (parseFloat(loanTerm) || 0) * 12;

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      return {
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        paymentSchedule: []
      };
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Generate payment schedule (first 12 months for display)
    const paymentSchedule = [];
    let balance = principal;
    
    for (let month = 1; month <= Math.min(numberOfPayments, 12); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      paymentSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentSchedule
    };
  }, [loanAmount, interestRate, loanTerm]);

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    setter(value);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-primary shadow-medium">
          <Calculator className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loan Payment Calculator</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Calculate your monthly mortgage or loan payments with detailed amortization
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Loan Details
            </CardTitle>
            <CardDescription>
              Enter your loan information to calculate payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loan-amount" className="text-sm font-medium">
                Loan Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="loan-amount"
                  type="text"
                  value={loanAmount}
                  onChange={handleInputChange(setLoanAmount)}
                  className="pl-10 text-lg"
                  placeholder="250,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate" className="text-sm font-medium">
                Interest Rate (Annual %)
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="interest-rate"
                  type="text"
                  value={interestRate}
                  onChange={handleInputChange(setInterestRate)}
                  className="pl-10 text-lg"
                  placeholder="6.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan-term" className="text-sm font-medium">
                Loan Term (Years)
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="loan-term"
                  type="text"
                  value={loanTerm}
                  onChange={handleInputChange(setLoanTerm)}
                  className="pl-10 text-lg"
                  placeholder="30"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-primary">Payment Summary</CardTitle>
            <CardDescription>
              Your calculated loan payment breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-lg bg-gradient-primary">
                <div className="text-primary-foreground/80 text-sm font-medium">Monthly Payment</div>
                <div className="text-2xl font-bold text-primary-foreground">
                  {formatCurrency(calculation.monthlyPayment)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary">
                  <div className="text-secondary-foreground/70 text-sm font-medium">Total Payment</div>
                  <div className="text-lg font-semibold text-secondary-foreground">
                    {formatCurrency(calculation.totalPayment)}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-accent">
                  <div className="text-accent-foreground/80 text-sm font-medium">Total Interest</div>
                  <div className="text-lg font-semibold text-accent-foreground">
                    {formatCurrency(calculation.totalInterest)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Schedule */}
      {calculation.paymentSchedule.length > 0 && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Payment Schedule (First 12 Months)</CardTitle>
            <CardDescription>
              Monthly breakdown of principal and interest payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Month</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Payment</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Principal</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Interest</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {calculation.paymentSchedule.map((row) => (
                    <tr key={row.month} className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">{row.month}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(row.payment)}</td>
                      <td className="text-right py-3 px-4 text-success">{formatCurrency(row.principal)}</td>
                      <td className="text-right py-3 px-4 text-accent">{formatCurrency(row.interest)}</td>
                      <td className="text-right py-3 px-4 font-medium">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};