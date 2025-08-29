import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiggyBank, DollarSign, Percent, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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

const RetirementCalculator = () => {
  const [inputs, setInputs] = useState({
    currentAge: 30,
    retirementAge: 65,
    lifeExpectancy: 85,
    currentSavings: '50000',
    monthlyContribution: '1000',
    employerMatch: '50',
    employerMatchLimit: '6',
    currentIncome: '75000',
    expectedReturnBeforeRetirement: '7',
    expectedReturnDuringRetirement: '4',
    inflationRate: '2.5',
    desiredMonthlyIncome: '5000',
    socialSecurityMonthly: '1500',
    pensionMonthly: '0',
    otherIncomeMonthly: '0'
  });

  const [results, setResults] = useState<{
    retirementBalance: number;
    monthlyIncomeNeeded: number;
    monthlyIncomeFromSavings: number;
    totalMonthlyIncome: number;
    shortfall: number;
    onTrack: boolean;
    requiredMonthlyContribution: number;
    totalContributions: number;
    totalEmployerMatch: number;
    totalReturns: number;
    yearlyProjection: Array<{
      age: number;
      year: number;
      balance: number;
      contributions: number;
      returns: number;
    }>;
    retirementIncome: Array<{
      source: string;
      amount: number;
    }>;
  } | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateRetirement = () => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const yearsInRetirement = inputs.lifeExpectancy - inputs.retirementAge;
    
    const currentSavings = parseFloat(inputs.currentSavings) || 0;
    let monthlyContribution = parseFloat(inputs.monthlyContribution) || 0;
    const currentIncome = parseFloat(inputs.currentIncome) || 0;
    const employerMatchPercent = parseFloat(inputs.employerMatch) / 100 || 0;
    const employerMatchLimit = parseFloat(inputs.employerMatchLimit) / 100 || 0;
    const returnBeforeRetirement = parseFloat(inputs.expectedReturnBeforeRetirement) / 100 || 0;
    const returnDuringRetirement = parseFloat(inputs.expectedReturnDuringRetirement) / 100 || 0;
    const inflationRate = parseFloat(inputs.inflationRate) / 100 || 0;
    const desiredMonthlyIncome = parseFloat(inputs.desiredMonthlyIncome) || 0;
    const socialSecurity = parseFloat(inputs.socialSecurityMonthly) || 0;
    const pension = parseFloat(inputs.pensionMonthly) || 0;
    const otherIncome = parseFloat(inputs.otherIncomeMonthly) || 0;
    
    // Calculate employer match
    const employeeContributionPercent = (monthlyContribution * 12) / currentIncome;
    const effectiveMatchPercent = Math.min(employeeContributionPercent, employerMatchLimit) * employerMatchPercent;
    const monthlyEmployerMatch = (currentIncome / 12) * effectiveMatchPercent;
    
    // Project retirement balance
    let balance = currentSavings;
    let totalContributions = currentSavings;
    let totalEmployerMatch = 0;
    const yearlyProjection = [];
    
    for (let year = 0; year < yearsToRetirement; year++) {
      const age = inputs.currentAge + year;
      const yearStartBalance = balance;
      
      // Annual contributions (employee + employer)
      const annualContribution = monthlyContribution * 12;
      const annualEmployerMatch = monthlyEmployerMatch * 12;
      totalContributions += annualContribution;
      totalEmployerMatch += annualEmployerMatch;
      
      // Calculate returns
      const totalContribution = annualContribution + annualEmployerMatch;
      const returns = (balance + totalContribution / 2) * returnBeforeRetirement;
      balance = balance + totalContribution + returns;
      
      yearlyProjection.push({
        age,
        year: new Date().getFullYear() + year,
        balance,
        contributions: totalContributions + totalEmployerMatch,
        returns: balance - (totalContributions + totalEmployerMatch)
      });
      
      // Increase contribution with inflation
      monthlyContribution *= (1 + inflationRate);
    }
    
    const retirementBalance = balance;
    const totalReturns = retirementBalance - totalContributions - totalEmployerMatch;
    
    // Calculate retirement income
    const inflationAdjustedMonthlyIncome = desiredMonthlyIncome * Math.pow(1 + inflationRate, yearsToRetirement);
    
    // Safe withdrawal rate (4% rule adjusted)
    const safeWithdrawalRate = 0.04;
    const annualWithdrawal = retirementBalance * safeWithdrawalRate;
    const monthlyIncomeFromSavings = annualWithdrawal / 12;
    
    // Total monthly income in retirement
    const totalMonthlyIncome = monthlyIncomeFromSavings + socialSecurity + pension + otherIncome;
    const shortfall = inflationAdjustedMonthlyIncome - totalMonthlyIncome;
    
    // Calculate required monthly contribution if there's a shortfall
    let requiredMonthlyContribution = parseFloat(inputs.monthlyContribution) || 0;
    if (shortfall > 0) {
      // Calculate required balance to cover shortfall
      const requiredAdditionalBalance = (shortfall * 12) / safeWithdrawalRate;
      const totalRequiredBalance = retirementBalance + requiredAdditionalBalance;
      
      // Use future value formula to find required monthly contribution
      const monthlyReturn = returnBeforeRetirement / 12;
      const months = yearsToRetirement * 12;
      
      if (monthlyReturn > 0) {
        requiredMonthlyContribution = 
          (totalRequiredBalance - currentSavings * Math.pow(1 + monthlyReturn, months)) /
          ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn * (1 + monthlyReturn));
      }
    }
    
    const retirementIncome = [
      { source: 'Retirement Savings', amount: monthlyIncomeFromSavings },
      { source: 'Social Security', amount: socialSecurity },
      { source: 'Pension', amount: pension },
      { source: 'Other Income', amount: otherIncome }
    ].filter(item => item.amount > 0);
    
    setResults({
      retirementBalance,
      monthlyIncomeNeeded: inflationAdjustedMonthlyIncome,
      monthlyIncomeFromSavings,
      totalMonthlyIncome,
      shortfall,
      onTrack: shortfall <= 0,
      requiredMonthlyContribution: Math.max(requiredMonthlyContribution, 0),
      totalContributions,
      totalEmployerMatch,
      totalReturns,
      yearlyProjection,
      retirementIncome
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5" />
            Retirement Savings Calculator
          </CardTitle>
          <CardDescription>
            Plan your retirement savings strategy and track your progress toward financial independence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Tabs defaultValue="personal" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="savings">Savings</TabsTrigger>
                  <TabsTrigger value="retirement">Retirement</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Age: {inputs.currentAge}</Label>
                    <Slider
                      value={[inputs.currentAge]}
                      onValueChange={(value) => handleInputChange('currentAge', value[0])}
                      min={18}
                      max={70}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Retirement Age: {inputs.retirementAge}</Label>
                    <Slider
                      value={[inputs.retirementAge]}
                      onValueChange={(value) => handleInputChange('retirementAge', value[0])}
                      min={50}
                      max={75}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Life Expectancy: {inputs.lifeExpectancy}</Label>
                    <Slider
                      value={[inputs.lifeExpectancy]}
                      onValueChange={(value) => handleInputChange('lifeExpectancy', value[0])}
                      min={70}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentIncome">Current Annual Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentIncome"
                        type="number"
                        value={inputs.currentIncome}
                        onChange={(e) => handleInputChange('currentIncome', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="savings" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentSavings">Current Retirement Savings</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentSavings"
                        type="number"
                        value={inputs.currentSavings}
                        onChange={(e) => handleInputChange('currentSavings', e.target.value)}
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
                        value={inputs.monthlyContribution}
                        onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employerMatch">Employer Match %</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="employerMatch"
                          type="number"
                          value={inputs.employerMatch}
                          onChange={(e) => handleInputChange('employerMatch', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employerMatchLimit">Match Limit %</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="employerMatchLimit"
                          type="number"
                          value={inputs.employerMatchLimit}
                          onChange={(e) => handleInputChange('employerMatchLimit', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedReturnBeforeRetirement">Return Before Retirement</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="expectedReturnBeforeRetirement"
                          type="number"
                          step="0.1"
                          value={inputs.expectedReturnBeforeRetirement}
                          onChange={(e) => handleInputChange('expectedReturnBeforeRetirement', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inflationRate">Inflation Rate</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="inflationRate"
                          type="number"
                          step="0.1"
                          value={inputs.inflationRate}
                          onChange={(e) => handleInputChange('inflationRate', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="retirement" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="desiredMonthlyIncome">Desired Monthly Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="desiredMonthlyIncome"
                        type="number"
                        value={inputs.desiredMonthlyIncome}
                        onChange={(e) => handleInputChange('desiredMonthlyIncome', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialSecurityMonthly">Est. Social Security/Month</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="socialSecurityMonthly"
                        type="number"
                        value={inputs.socialSecurityMonthly}
                        onChange={(e) => handleInputChange('socialSecurityMonthly', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pensionMonthly">Pension Income/Month</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pensionMonthly"
                        type="number"
                        value={inputs.pensionMonthly}
                        onChange={(e) => handleInputChange('pensionMonthly', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedReturnDuringRetirement">Return During Retirement</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="expectedReturnDuringRetirement"
                        type="number"
                        step="0.1"
                        value={inputs.expectedReturnDuringRetirement}
                        onChange={(e) => handleInputChange('expectedReturnDuringRetirement', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={calculateRetirement} className="w-full bg-gradient-primary">
                Calculate Retirement Plan
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {results && (
                <>
                  <Card className={results.onTrack ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {results.onTrack ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            On Track for Retirement
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            Adjustment Needed
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">
                        {formatCurrency(results.retirementBalance)}
                        <span className="text-sm text-muted-foreground font-normal block">
                          Projected at retirement
                        </span>
                      </div>
                      
                      {results.shortfall > 0 ? (
                        <Alert className="bg-orange-100 border-orange-300">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Monthly shortfall: {formatCurrency(results.shortfall)}
                            <br />
                            Increase contribution to: {formatCurrency(results.requiredMonthlyContribution)}/month
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="bg-green-100 border-green-300">
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Monthly surplus: {formatCurrency(Math.abs(results.shortfall))}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Retirement Income Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Income Needed:</span>
                          <span className="font-bold text-lg">{formatCurrency(results.monthlyIncomeNeeded)}</span>
                        </div>
                        
                        <div className="border-t pt-3 space-y-2">
                          {results.retirementIncome.map((source, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-sm">{source.source}:</span>
                              <span className="font-medium">{formatCurrency(source.amount)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="font-medium">Total Income:</span>
                            <span className="font-bold">{formatCurrency(results.totalMonthlyIncome)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Savings Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <RePieChart>
                          <Pie
                            data={[
                              { name: 'Your Contributions', value: results.totalContributions },
                              { name: 'Employer Match', value: results.totalEmployerMatch },
                              { name: 'Investment Returns', value: results.totalReturns }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[0, 1, 2].map((index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </RePieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          {/* Chart */}
          {results && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Retirement Savings Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={results.yearlyProjection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      name="Total Balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RetirementCalculator;