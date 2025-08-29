import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign, Percent, Calendar, Target, PieChart, BarChart3 } from 'lucide-react';
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

const InvestmentCalculator = () => {
  const [inputs, setInputs] = useState({
    initialInvestment: '10000',
    monthlyContribution: '500',
    annualReturn: '8',
    investmentPeriod: 20,
    compoundFrequency: 'monthly',
    inflationRate: '2.5',
    taxRate: '25',
    contributionIncrease: '3',
    riskProfile: 'moderate'
  });

  const [results, setResults] = useState<{
    futureValue: number;
    totalContributions: number;
    totalReturns: number;
    inflationAdjustedValue: number;
    afterTaxValue: number;
    effectiveAnnualReturn: number;
    yearlyData: Array<{
      year: number;
      balance: number;
      contributions: number;
      returns: number;
      inflationAdjusted: number;
    }>;
    monthlyData: Array<{
      month: number;
      balance: number;
      contribution: number;
      interest: number;
    }>;
  } | null>(null);

  const riskProfiles = {
    conservative: { return: 5, volatility: 5 },
    moderate: { return: 8, volatility: 12 },
    aggressive: { return: 11, volatility: 20 },
    veryAggressive: { return: 14, volatility: 30 }
  };

  const handleInputChange = (field: string, value: string | number) => {
    let newInputs = { ...inputs, [field]: value };
    
    // Update return rate based on risk profile
    if (field === 'riskProfile') {
      newInputs.annualReturn = riskProfiles[value as keyof typeof riskProfiles].return.toString();
    }
    
    setInputs(newInputs);
  };

  const calculateInvestment = () => {
    const principal = parseFloat(inputs.initialInvestment) || 0;
    let monthlyContribution = parseFloat(inputs.monthlyContribution) || 0;
    const annualReturn = parseFloat(inputs.annualReturn) / 100;
    const years = inputs.investmentPeriod;
    const inflationRate = parseFloat(inputs.inflationRate) / 100;
    const taxRate = parseFloat(inputs.taxRate) / 100;
    const contributionIncrease = parseFloat(inputs.contributionIncrease) / 100;
    
    // Compound frequency multiplier
    const compoundingPeriods = {
      daily: 365,
      monthly: 12,
      quarterly: 4,
      annually: 1
    };
    
    const n = compoundingPeriods[inputs.compoundFrequency as keyof typeof compoundingPeriods];
    const rate = annualReturn / n;
    
    const yearlyData = [];
    const monthlyData = [];
    let balance = principal;
    let totalContributions = principal;
    let totalReturns = 0;
    let currentMonthlyContribution = monthlyContribution;
    
    // Calculate month by month for detailed tracking
    for (let year = 1; year <= years; year++) {
      let yearStartBalance = balance;
      let yearContributions = 0;
      
      // Increase monthly contribution annually
      if (year > 1) {
        currentMonthlyContribution *= (1 + contributionIncrease);
      }
      
      for (let month = 1; month <= 12; month++) {
        const monthNumber = (year - 1) * 12 + month;
        const monthlyReturn = balance * (annualReturn / 12);
        balance += monthlyReturn + currentMonthlyContribution;
        totalContributions += currentMonthlyContribution;
        totalReturns += monthlyReturn;
        yearContributions += currentMonthlyContribution;
        
        // Store monthly data for first 5 years
        if (year <= 5) {
          monthlyData.push({
            month: monthNumber,
            balance: balance,
            contribution: currentMonthlyContribution,
            interest: monthlyReturn
          });
        }
      }
      
      const yearReturns = balance - yearStartBalance - yearContributions;
      const inflationAdjusted = balance / Math.pow(1 + inflationRate, year);
      
      yearlyData.push({
        year,
        balance: balance,
        contributions: totalContributions,
        returns: yearReturns,
        inflationAdjusted
      });
    }
    
    const futureValue = balance;
    const inflationAdjustedValue = futureValue / Math.pow(1 + inflationRate, years);
    const afterTaxValue = principal + (futureValue - principal) * (1 - taxRate);
    const effectiveAnnualReturn = Math.pow(futureValue / principal, 1 / years) - 1;
    
    setResults({
      futureValue,
      totalContributions,
      totalReturns,
      inflationAdjustedValue,
      afterTaxValue,
      effectiveAnnualReturn,
      yearlyData,
      monthlyData
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
            <TrendingUp className="w-5 h-5" />
            Investment Return Calculator
          </CardTitle>
          <CardDescription>
            Project investment growth, analyze returns, and plan your portfolio strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="riskProfile">Risk Profile</Label>
                  <Select value={inputs.riskProfile} onValueChange={(value) => handleInputChange('riskProfile', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative (5% avg return)</SelectItem>
                      <SelectItem value="moderate">Moderate (8% avg return)</SelectItem>
                      <SelectItem value="aggressive">Aggressive (11% avg return)</SelectItem>
                      <SelectItem value="veryAggressive">Very Aggressive (14% avg return)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialInvestment">Initial Investment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="initialInvestment"
                      type="number"
                      placeholder="10000"
                      value={inputs.initialInvestment}
                      onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="monthlyContribution"
                      type="number"
                      placeholder="500"
                      value={inputs.monthlyContribution}
                      onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentPeriod">
                    Investment Period - {inputs.investmentPeriod} years
                  </Label>
                  <Slider
                    value={[inputs.investmentPeriod]}
                    onValueChange={(value) => handleInputChange('investmentPeriod', value[0])}
                    min={1}
                    max={40}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualReturn">Expected Annual Return</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="annualReturn"
                      type="number"
                      step="0.1"
                      placeholder="8"
                      value={inputs.annualReturn}
                      onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contributionIncrease">Annual Contribution Increase</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contributionIncrease"
                        type="number"
                        step="0.1"
                        placeholder="3"
                        value={inputs.contributionIncrease}
                        onChange={(e) => handleInputChange('contributionIncrease', e.target.value)}
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
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inflationRate">Inflation Rate</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="inflationRate"
                        type="number"
                        step="0.1"
                        placeholder="2.5"
                        value={inputs.inflationRate}
                        onChange={(e) => handleInputChange('inflationRate', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Capital Gains Tax Rate</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="taxRate"
                        type="number"
                        step="1"
                        placeholder="25"
                        value={inputs.taxRate}
                        onChange={(e) => handleInputChange('taxRate', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={calculateInvestment} className="w-full bg-gradient-primary">
                  Calculate Returns
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
                        <Target className="w-5 h-5" />
                        Future Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-700">
                        {formatCurrency(results.futureValue)}
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Contributions:</span>
                          <span className="font-medium">{formatCurrency(results.totalContributions)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Investment Returns:</span>
                          <span className="font-medium text-green-600">+{formatCurrency(results.totalReturns)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-muted-foreground">ROI:</span>
                          <span className="font-bold">{formatPercent((results.futureValue - results.totalContributions) / results.totalContributions)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Adjusted Values</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Inflation Adjusted:</span>
                        <span className="font-medium">{formatCurrency(results.inflationAdjustedValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">After Tax (Est.):</span>
                        <span className="font-medium">{formatCurrency(results.afterTaxValue)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Effective Annual Return:</span>
                        <span className="font-bold">{formatPercent(results.effectiveAnnualReturn)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Investment Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Contributions</span>
                            <span className="text-sm font-medium">
                              {formatPercent(results.totalContributions / results.futureValue)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(results.totalContributions / results.futureValue) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Returns</span>
                            <span className="text-sm font-medium">
                              {formatPercent(results.totalReturns / results.futureValue)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(results.totalReturns / results.futureValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          {/* Charts */}
          {results && (
            <Tabs defaultValue="growth" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="growth">Portfolio Growth</TabsTrigger>
                <TabsTrigger value="breakdown">Annual Breakdown</TabsTrigger>
                <TabsTrigger value="table">Detailed Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="growth" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Growth Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={results.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="contributions" 
                          stackId="1" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          name="Total Contributions"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="returns" 
                          stackId="1" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          name="Investment Returns"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="inflationAdjusted" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Inflation Adjusted"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Annual Returns Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={results.yearlyData.filter((_, i) => i % Math.ceil(results.yearlyData.length / 10) === 0)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="returns" fill="#10b981" name="Annual Returns" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="table" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Schedule (Every 5 Years)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                          <TableHead className="text-right">Contributions</TableHead>
                          <TableHead className="text-right">Returns</TableHead>
                          <TableHead className="text-right">Inflation Adj.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.yearlyData
                          .filter((_, index) => index === 0 || (index + 1) % 5 === 0 || index === results.yearlyData.length - 1)
                          .map((year) => (
                            <TableRow key={year.year}>
                              <TableCell>Year {year.year}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(year.balance)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(year.contributions)}</TableCell>
                              <TableCell className="text-right text-green-600">{formatCurrency(year.balance - year.contributions)}</TableCell>
                              <TableCell className="text-right text-orange-600">{formatCurrency(year.inflationAdjusted)}</TableCell>
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

export default InvestmentCalculator;