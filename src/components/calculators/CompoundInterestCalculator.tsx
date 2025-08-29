import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Percent, DollarSign, Calendar, TrendingUp, BarChart3, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CompoundInterestCalculator = () => {
  const [inputs, setInputs] = useState({
    principal: '10000',
    interestRate: '7',
    compoundFrequency: 'monthly',
    timePeriod: 10,
    regularDeposit: '200',
    depositFrequency: 'monthly',
    depositTiming: 'beginning',
    variableRate: false,
    yearlyRateChanges: [] as Array<{year: number; rate: number}>
  });

  const [results, setResults] = useState<{
    futureValue: number;
    totalDeposits: number;
    totalInterest: number;
    effectiveRate: number;
    detailedSchedule: Array<{
      period: number;
      periodLabel: string;
      startBalance: number;
      deposit: number;
      interest: number;
      endBalance: number;
      totalDeposits: number;
      totalInterest: number;
    }>;
    yearlyBreakdown: Array<{
      year: number;
      balance: number;
      yearlyDeposits: number;
      yearlyInterest: number;
      cumulativeDeposits: number;
      cumulativeInterest: number;
    }>;
    comparisonData: Array<{
      frequency: string;
      futureValue: number;
      totalInterest: number;
    }>;
  } | null>(null);

  const compoundingOptions = {
    daily: { periods: 365, label: 'Daily' },
    weekly: { periods: 52, label: 'Weekly' },
    biweekly: { periods: 26, label: 'Bi-weekly' },
    monthly: { periods: 12, label: 'Monthly' },
    quarterly: { periods: 4, label: 'Quarterly' },
    semiannually: { periods: 2, label: 'Semi-annually' },
    annually: { periods: 1, label: 'Annually' }
  };

  const depositFrequencyOptions = {
    daily: 365,
    weekly: 52,
    biweekly: 26,
    monthly: 12,
    quarterly: 4,
    annually: 1
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateCompoundInterest = () => {
    const principal = parseFloat(inputs.principal) || 0;
    const annualRate = parseFloat(inputs.interestRate) / 100;
    const years = inputs.timePeriod;
    const regularDeposit = parseFloat(inputs.regularDeposit) || 0;
    
    const compoundPeriods = compoundingOptions[inputs.compoundFrequency as keyof typeof compoundingOptions].periods;
    const depositPeriods = depositFrequencyOptions[inputs.depositFrequency as keyof typeof depositFrequencyOptions];
    
    // Calculate detailed schedule
    const detailedSchedule = [];
    const yearlyBreakdown = [];
    let balance = principal;
    let totalDeposits = principal;
    let totalInterest = 0;
    let yearlyDeposits = 0;
    let yearlyInterest = 0;
    
    const totalPeriods = compoundPeriods * years;
    const periodicRate = annualRate / compoundPeriods;
    const depositsPerCompound = compoundPeriods / depositPeriods;
    const depositAmount = regularDeposit / depositsPerCompound;
    
    // Generate monthly/quarterly schedule for display (max 60 periods)
    const displayPeriods = Math.min(totalPeriods, 60);
    const periodStep = Math.max(1, Math.floor(totalPeriods / displayPeriods));
    
    for (let period = 1; period <= totalPeriods; period++) {
      const startBalance = balance;
      
      // Add deposit (if applicable)
      let periodDeposit = 0;
      if (period % (compoundPeriods / depositPeriods) === 0 || 
          (inputs.depositTiming === 'beginning' && period === 1)) {
        periodDeposit = regularDeposit;
        if (inputs.depositTiming === 'beginning') {
          balance += periodDeposit;
        }
      }
      
      // Calculate interest
      const interest = balance * periodicRate;
      balance += interest;
      
      // Add deposit at end if specified
      if (inputs.depositTiming === 'end' && periodDeposit > 0) {
        balance += periodDeposit;
      }
      
      totalInterest += interest;
      if (periodDeposit > 0) {
        totalDeposits += periodDeposit;
        yearlyDeposits += periodDeposit;
      }
      yearlyInterest += interest;
      
      // Add to detailed schedule (sample for display)
      if (period % periodStep === 0 || period === 1 || period === totalPeriods) {
        const periodLabel = inputs.compoundFrequency === 'monthly' 
          ? `Month ${period}`
          : inputs.compoundFrequency === 'quarterly'
          ? `Quarter ${period}`
          : `Period ${period}`;
          
        detailedSchedule.push({
          period,
          periodLabel,
          startBalance,
          deposit: periodDeposit,
          interest,
          endBalance: balance,
          totalDeposits,
          totalInterest
        });
      }
      
      // Yearly breakdown
      if (period % compoundPeriods === 0 || period === totalPeriods) {
        const year = Math.ceil(period / compoundPeriods);
        yearlyBreakdown.push({
          year,
          balance,
          yearlyDeposits,
          yearlyInterest,
          cumulativeDeposits: totalDeposits,
          cumulativeInterest: totalInterest
        });
        yearlyDeposits = 0;
        yearlyInterest = 0;
      }
    }
    
    // Calculate comparison with different compounding frequencies
    const comparisonData = [];
    for (const [key, option] of Object.entries(compoundingOptions)) {
      const periods = option.periods * years;
      const rate = annualRate / option.periods;
      
      let compBalance = principal;
      let compInterest = 0;
      
      for (let p = 1; p <= periods; p++) {
        // Simplified calculation for comparison
        const periodDeposit = regularDeposit * (depositPeriods / option.periods);
        compBalance += periodDeposit;
        const interest = compBalance * rate;
        compBalance += interest;
        compInterest += interest;
      }
      
      comparisonData.push({
        frequency: option.label,
        futureValue: compBalance,
        totalInterest: compInterest
      });
    }
    
    // Calculate effective annual rate
    const effectiveRate = Math.pow(1 + annualRate / compoundPeriods, compoundPeriods) - 1;
    
    setResults({
      futureValue: balance,
      totalDeposits,
      totalInterest,
      effectiveRate,
      detailedSchedule,
      yearlyBreakdown,
      comparisonData
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Compound Interest Calculator
          </CardTitle>
          <CardDescription>
            Calculate how your money grows over time with compound interest and regular contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Initial Investment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="principal"
                      type="number"
                      placeholder="10000"
                      value={inputs.principal}
                      onChange={(e) => handleInputChange('principal', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Annual Interest Rate</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="7"
                      value={inputs.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compoundFrequency">Compound Frequency</Label>
                  <Select value={inputs.compoundFrequency} onValueChange={(value) => handleInputChange('compoundFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(compoundingOptions).map(([key, option]) => (
                        <SelectItem key={key} value={key}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Investment Period: {inputs.timePeriod} years</Label>
                  <Slider
                    value={[inputs.timePeriod]}
                    onValueChange={(value) => handleInputChange('timePeriod', value[0])}
                    min={1}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-4">Regular Contributions (Optional)</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="regularDeposit">Contribution Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="regularDeposit"
                          type="number"
                          placeholder="200"
                          value={inputs.regularDeposit}
                          onChange={(e) => handleInputChange('regularDeposit', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="depositFrequency">Frequency</Label>
                        <Select value={inputs.depositFrequency} onValueChange={(value) => handleInputChange('depositFrequency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="depositTiming">Timing</Label>
                        <Select value={inputs.depositTiming} onValueChange={(value) => handleInputChange('depositTiming', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginning">Beginning</SelectItem>
                            <SelectItem value="end">End</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={calculateCompoundInterest} className="w-full bg-gradient-primary">
                  Calculate Compound Interest
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {results && (
                <>
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Future Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-700">
                        {formatCurrency(results.futureValue)}
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Deposits:</span>
                          <span className="font-medium">{formatCurrency(results.totalDeposits)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Interest:</span>
                          <span className="font-medium text-green-600">+{formatCurrency(results.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-muted-foreground">Effective Annual Rate:</span>
                          <span className="font-bold">{formatPercent(results.effectiveRate)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Growth Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Principal & Deposits</span>
                            <span className="text-sm font-medium">
                              {formatPercent(results.totalDeposits / results.futureValue)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full"
                              style={{ width: `${(results.totalDeposits / results.futureValue) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Interest Earned</span>
                            <span className="text-sm font-medium">
                              {formatPercent(results.totalInterest / results.futureValue)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-600 h-3 rounded-full"
                              style={{ width: `${(results.totalInterest / results.futureValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <Alert className="mt-4">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Your money will grow <strong>{(results.futureValue / results.totalDeposits).toFixed(2)}x</strong> over {inputs.timePeriod} years
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compounding Frequency Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={results.comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="frequency" angle={-45} textAnchor="end" height={60} />
                          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Bar dataKey="futureValue" fill="#3b82f6" />
                        </BarChart>
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
                <TabsTrigger value="chart">Growth Chart</TabsTrigger>
                <TabsTrigger value="breakdown">Annual Breakdown</TabsTrigger>
                <TabsTrigger value="schedule">Detailed Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Growth Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={results.yearlyBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="cumulativeDeposits" 
                          stackId="1" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          name="Total Deposits"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="cumulativeInterest" 
                          stackId="1" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          name="Total Interest"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Annual Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                          <TableHead className="text-right">Yearly Deposits</TableHead>
                          <TableHead className="text-right">Yearly Interest</TableHead>
                          <TableHead className="text-right">Total Interest</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.yearlyBreakdown.map((year) => (
                          <TableRow key={year.year}>
                            <TableCell>Year {year.year}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(year.balance)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(year.yearlyDeposits)}</TableCell>
                            <TableCell className="text-right text-green-600">{formatCurrency(year.yearlyInterest)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(year.cumulativeInterest)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Compound Schedule</CardTitle>
                    <CardDescription>Showing sample periods from the full calculation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Period</TableHead>
                            <TableHead className="text-right">Start Balance</TableHead>
                            <TableHead className="text-right">Deposit</TableHead>
                            <TableHead className="text-right">Interest</TableHead>
                            <TableHead className="text-right">End Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.detailedSchedule.slice(0, 20).map((period) => (
                            <TableRow key={period.period}>
                              <TableCell>{period.periodLabel}</TableCell>
                              <TableCell className="text-right">{formatCurrency(period.startBalance)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(period.deposit)}</TableCell>
                              <TableCell className="text-right text-green-600">{formatCurrency(period.interest)}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(period.endBalance)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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

export default CompoundInterestCalculator;