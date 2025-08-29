import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, DollarSign, Percent, Calendar, TrendingUp, PieChart, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

const MortgageCalculator = () => {
  const [inputs, setInputs] = useState({
    homePrice: '500000',
    downPayment: '100000',
    downPaymentPercent: 20,
    loanTerm: 30,
    interestRate: '6.5',
    propertyTax: '6000',
    homeInsurance: '1500',
    pmi: '0',
    hoa: '0',
    startDate: new Date().toISOString().slice(0, 7)
  });

  const [results, setResults] = useState<{
    loanAmount: number;
    monthlyPrincipalInterest: number;
    monthlyPropertyTax: number;
    monthlyInsurance: number;
    monthlyPMI: number;
    monthlyHOA: number;
    totalMonthlyPayment: number;
    totalInterest: number;
    totalPaid: number;
    amortizationSchedule: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
      totalInterest: number;
      totalPrincipal: number;
    }>;
    yearlyBreakdown: Array<{
      year: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    let newInputs = { ...inputs, [field]: value };
    
    // Update related fields
    if (field === 'homePrice' || field === 'downPaymentPercent') {
      const price = parseFloat(field === 'homePrice' ? value.toString() : inputs.homePrice) || 0;
      const percent = field === 'downPaymentPercent' ? value as number : inputs.downPaymentPercent;
      newInputs.downPayment = (price * percent / 100).toFixed(0);
      
      // Calculate PMI if down payment is less than 20%
      if (percent < 20) {
        const loanAmount = price - (price * percent / 100);
        newInputs.pmi = (loanAmount * 0.005 / 12).toFixed(0); // 0.5% annual PMI
      } else {
        newInputs.pmi = '0';
      }
    } else if (field === 'downPayment') {
      const price = parseFloat(inputs.homePrice) || 0;
      const down = parseFloat(value.toString()) || 0;
      newInputs.downPaymentPercent = price > 0 ? (down / price * 100) : 0;
      
      // Calculate PMI
      if (newInputs.downPaymentPercent < 20) {
        const loanAmount = price - down;
        newInputs.pmi = (loanAmount * 0.005 / 12).toFixed(0);
      } else {
        newInputs.pmi = '0';
      }
    }
    
    setInputs(newInputs);
  };

  const calculateMortgage = () => {
    const homePrice = parseFloat(inputs.homePrice) || 0;
    const downPayment = parseFloat(inputs.downPayment) || 0;
    const loanAmount = homePrice - downPayment;
    const monthlyRate = (parseFloat(inputs.interestRate) || 0) / 100 / 12;
    const numPayments = inputs.loanTerm * 12;
    
    // Calculate monthly principal and interest
    let monthlyPrincipalInterest = 0;
    if (monthlyRate > 0) {
      monthlyPrincipalInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPrincipalInterest = loanAmount / numPayments;
    }
    
    // Calculate other monthly costs
    const monthlyPropertyTax = (parseFloat(inputs.propertyTax) || 0) / 12;
    const monthlyInsurance = (parseFloat(inputs.homeInsurance) || 0) / 12;
    const monthlyPMI = parseFloat(inputs.pmi) || 0;
    const monthlyHOA = parseFloat(inputs.hoa) || 0;
    
    const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + 
      monthlyInsurance + monthlyPMI + monthlyHOA;
    
    // Generate amortization schedule
    const amortizationSchedule = [];
    const yearlyBreakdown = [];
    let balance = loanAmount;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    
    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPrincipalInterest - interestPayment;
      balance = Math.max(0, balance - principalPayment);
      totalInterest += interestPayment;
      totalPrincipal += principalPayment;
      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      
      amortizationSchedule.push({
        month,
        payment: monthlyPrincipalInterest,
        principal: principalPayment,
        interest: interestPayment,
        balance,
        totalInterest,
        totalPrincipal
      });
      
      // Yearly breakdown
      if (month % 12 === 0 || month === numPayments) {
        yearlyBreakdown.push({
          year: Math.ceil(month / 12),
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          balance
        });
        yearlyPrincipal = 0;
        yearlyInterest = 0;
      }
    }
    
    setResults({
      loanAmount,
      monthlyPrincipalInterest,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthlyPayment,
      totalInterest,
      totalPaid: loanAmount + totalInterest,
      amortizationSchedule,
      yearlyBreakdown
    });
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const pieData = results ? [
    { name: 'Principal & Interest', value: results.monthlyPrincipalInterest },
    { name: 'Property Tax', value: results.monthlyPropertyTax },
    { name: 'Home Insurance', value: results.monthlyInsurance },
    { name: 'PMI', value: results.monthlyPMI },
    { name: 'HOA', value: results.monthlyHOA }
  ].filter(item => item.value > 0) : [];

  const chartData = results ? results.yearlyBreakdown.map(year => ({
    year: `Year ${year.year}`,
    principal: Math.round(year.principal),
    interest: Math.round(year.interest),
    balance: Math.round(year.balance)
  })) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Mortgage Calculator
          </CardTitle>
          <CardDescription>
            Calculate monthly payments, total interest, and view detailed amortization schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="homePrice">Home Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="homePrice"
                      type="number"
                      placeholder="500000"
                      value={inputs.homePrice}
                      onChange={(e) => handleInputChange('homePrice', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="downPayment">
                    Down Payment - {inputs.downPaymentPercent.toFixed(0)}%
                  </Label>
                  <div className="space-y-3">
                    <Slider
                      value={[inputs.downPaymentPercent]}
                      onValueChange={(value) => handleInputChange('downPaymentPercent', value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="downPayment"
                        type="number"
                        value={inputs.downPayment}
                        onChange={(e) => handleInputChange('downPayment', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTerm">
                    Loan Term - {inputs.loanTerm} years
                  </Label>
                  <Slider
                    value={[inputs.loanTerm]}
                    onValueChange={(value) => handleInputChange('loanTerm', value[0])}
                    min={10}
                    max={30}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="6.5"
                      value={inputs.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyTax">Property Tax/Year</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="propertyTax"
                        type="number"
                        placeholder="6000"
                        value={inputs.propertyTax}
                        onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homeInsurance">Home Insurance/Year</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="homeInsurance"
                        type="number"
                        placeholder="1500"
                        value={inputs.homeInsurance}
                        onChange={(e) => handleInputChange('homeInsurance', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pmi">PMI/Month</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pmi"
                        type="number"
                        placeholder="0"
                        value={inputs.pmi}
                        onChange={(e) => handleInputChange('pmi', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hoa">HOA/Month</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="hoa"
                        type="number"
                        placeholder="0"
                        value={inputs.hoa}
                        onChange={(e) => handleInputChange('hoa', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={calculateMortgage} className="w-full bg-gradient-primary">
                  Calculate Mortgage
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {results && (
                <>
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Payment Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">
                        ${results.totalMonthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        <span className="text-sm text-muted-foreground font-normal">/month</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Principal & Interest:</span>
                          <span className="font-medium">${results.monthlyPrincipalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        {results.monthlyPropertyTax > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Property Tax:</span>
                            <span className="font-medium">${results.monthlyPropertyTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        )}
                        {results.monthlyInsurance > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Home Insurance:</span>
                            <span className="font-medium">${results.monthlyInsurance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        )}
                        {results.monthlyPMI > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">PMI:</span>
                            <span className="font-medium">${results.monthlyPMI.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        )}
                        {results.monthlyHOA > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">HOA:</span>
                            <span className="font-medium">${results.monthlyHOA.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Loan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loan Amount:</span>
                        <span className="font-medium">${results.loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Interest:</span>
                        <span className="font-medium text-orange-600">${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Total Paid:</span>
                        <span className="font-bold">${results.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <RePieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          {/* Charts and Tables */}
          {results && (
            <Tabs defaultValue="chart" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chart">Principal vs Interest</TabsTrigger>
                <TabsTrigger value="balance">Loan Balance</TabsTrigger>
                <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Annual Principal vs Interest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend />
                        <Area type="monotone" dataKey="principal" stackId="1" stroke="#10b981" fill="#10b981" />
                        <Area type="monotone" dataKey="interest" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="balance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Remaining Loan Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend />
                        <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Yearly Amortization Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead className="text-right">Principal</TableHead>
                          <TableHead className="text-right">Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.yearlyBreakdown.map((year) => (
                          <TableRow key={year.year}>
                            <TableCell>Year {year.year}</TableCell>
                            <TableCell className="text-right">${year.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right">${year.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                            <TableCell className="text-right">${year.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MortgageCalculator;