import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Receipt, DollarSign, Calculator, TrendingDown, FileText, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  base: number;
}

const TaxEstimator = () => {
  // 2024 Tax Brackets
  const taxBrackets: Record<string, TaxBracket[]> = {
    single: [
      { min: 0, max: 11600, rate: 0.10, base: 0 },
      { min: 11600, max: 47150, rate: 0.12, base: 1160 },
      { min: 47150, max: 100525, rate: 0.22, base: 5426 },
      { min: 100525, max: 191950, rate: 0.24, base: 17168.50 },
      { min: 191950, max: 243725, rate: 0.32, base: 39110.50 },
      { min: 243725, max: 609350, rate: 0.35, base: 55678.50 },
      { min: 609350, max: null, rate: 0.37, base: 183647.25 }
    ],
    marriedJointly: [
      { min: 0, max: 23200, rate: 0.10, base: 0 },
      { min: 23200, max: 94300, rate: 0.12, base: 2320 },
      { min: 94300, max: 201050, rate: 0.22, base: 10852 },
      { min: 201050, max: 383900, rate: 0.24, base: 34337 },
      { min: 383900, max: 487450, rate: 0.32, base: 78221 },
      { min: 487450, max: 731200, rate: 0.35, base: 111357 },
      { min: 731200, max: null, rate: 0.37, base: 196669.50 }
    ],
    marriedSeparately: [
      { min: 0, max: 11600, rate: 0.10, base: 0 },
      { min: 11600, max: 47150, rate: 0.12, base: 1160 },
      { min: 47150, max: 100525, rate: 0.22, base: 5426 },
      { min: 100525, max: 191950, rate: 0.24, base: 17168.50 },
      { min: 191950, max: 243725, rate: 0.32, base: 39110.50 },
      { min: 243725, max: 365600, rate: 0.35, base: 55678.50 },
      { min: 365600, max: null, rate: 0.37, base: 98334.75 }
    ],
    headOfHousehold: [
      { min: 0, max: 16550, rate: 0.10, base: 0 },
      { min: 16550, max: 63100, rate: 0.12, base: 1655 },
      { min: 63100, max: 100500, rate: 0.22, base: 7241 },
      { min: 100500, max: 191950, rate: 0.24, base: 15469 },
      { min: 191950, max: 243700, rate: 0.32, base: 37417 },
      { min: 243700, max: 609350, rate: 0.35, base: 53977 },
      { min: 609350, max: null, rate: 0.37, base: 181954.50 }
    ]
  };

  const standardDeductions = {
    single: 14600,
    marriedJointly: 29200,
    marriedSeparately: 14600,
    headOfHousehold: 21900
  };

  const [inputs, setInputs] = useState({
    grossIncome: '',
    filingStatus: 'single',
    dependents: '0',
    withheld: '',
    estimated: '',
    itemizedDeductions: '',
    useItemized: false,
    retirement401k: '',
    retirementIRA: '',
    healthInsurance: '',
    hsa: '',
    studentLoanInterest: '',
    mortgageInterest: '',
    propertyTax: '',
    charitableDonations: '',
    stateLocalTaxes: ''
  });

  const [results, setResults] = useState<{
    grossIncome: number;
    adjustedGrossIncome: number;
    taxableIncome: number;
    federalTax: number;
    effectiveRate: number;
    marginalRate: number;
    afterTaxIncome: number;
    totalPayments: number;
    refundOrOwed: number;
    deductions: number;
    taxByBracket: Array<{bracket: string; income: number; tax: number; rate: number}>;
  } | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateTax = () => {
    const grossIncome = parseFloat(inputs.grossIncome) || 0;
    const retirement401k = parseFloat(inputs.retirement401k) || 0;
    const retirementIRA = parseFloat(inputs.retirementIRA) || 0;
    const healthInsurance = parseFloat(inputs.healthInsurance) || 0;
    const hsa = parseFloat(inputs.hsa) || 0;
    const studentLoanInterest = Math.min(parseFloat(inputs.studentLoanInterest) || 0, 2500);

    // Calculate AGI
    const adjustedGrossIncome = grossIncome - retirement401k - retirementIRA - healthInsurance - hsa - studentLoanInterest;

    // Calculate deductions
    let deductions = standardDeductions[inputs.filingStatus as keyof typeof standardDeductions];
    if (inputs.useItemized) {
      const itemized = 
        (parseFloat(inputs.mortgageInterest) || 0) +
        (parseFloat(inputs.propertyTax) || 0) +
        Math.min(parseFloat(inputs.stateLocalTaxes) || 0, 10000) + // SALT cap
        (parseFloat(inputs.charitableDonations) || 0) +
        (parseFloat(inputs.itemizedDeductions) || 0);
      
      if (itemized > deductions) {
        deductions = itemized;
      }
    }

    const taxableIncome = Math.max(0, adjustedGrossIncome - deductions);

    // Calculate tax
    const brackets = taxBrackets[inputs.filingStatus as keyof typeof taxBrackets];
    let tax = 0;
    let marginalRate = 0;
    const taxByBracket = [];

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      const bracketMin = bracket.min;
      const bracketMax = bracket.max || Infinity;
      
      if (taxableIncome > bracketMin) {
        const taxableInBracket = Math.min(taxableIncome - bracketMin, bracketMax - bracketMin);
        const taxForBracket = taxableInBracket * bracket.rate;
        tax += taxForBracket;
        marginalRate = bracket.rate;
        
        if (taxableInBracket > 0) {
          taxByBracket.push({
            bracket: `$${bracketMin.toLocaleString()} - ${bracket.max ? `$${bracket.max.toLocaleString()}` : 'above'}`,
            income: taxableInBracket,
            tax: taxForBracket,
            rate: bracket.rate
          });
        }
      }
    }

    const effectiveRate = grossIncome > 0 ? (tax / grossIncome) : 0;
    const afterTaxIncome = grossIncome - tax;
    const totalPayments = (parseFloat(inputs.withheld) || 0) + (parseFloat(inputs.estimated) || 0);
    const refundOrOwed = totalPayments - tax;

    setResults({
      grossIncome,
      adjustedGrossIncome,
      taxableIncome,
      federalTax: tax,
      effectiveRate,
      marginalRate,
      afterTaxIncome,
      totalPayments,
      refundOrOwed,
      deductions,
      taxByBracket
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            2024 Federal Tax Estimator (Form 1040)
          </CardTitle>
          <CardDescription>
            Calculate your federal income tax, estimate refunds, and understand your tax bracket
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="income" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="deductions">Deductions</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="income" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grossIncome">Gross Annual Income</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="grossIncome"
                      type="number"
                      placeholder="75000"
                      value={inputs.grossIncome}
                      onChange={(e) => handleInputChange('grossIncome', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select value={inputs.filingStatus} onValueChange={(value) => handleInputChange('filingStatus', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="marriedJointly">Married Filing Jointly</SelectItem>
                      <SelectItem value="marriedSeparately">Married Filing Separately</SelectItem>
                      <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirement401k">401(k) Contributions</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="retirement401k"
                      type="number"
                      placeholder="0"
                      value={inputs.retirement401k}
                      onChange={(e) => handleInputChange('retirement401k', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirementIRA">Traditional IRA Contributions</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="retirementIRA"
                      type="number"
                      placeholder="0"
                      value={inputs.retirementIRA}
                      onChange={(e) => handleInputChange('retirementIRA', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthInsurance">Health Insurance Premiums</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="healthInsurance"
                      type="number"
                      placeholder="0"
                      value={inputs.healthInsurance}
                      onChange={(e) => handleInputChange('healthInsurance', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hsa">HSA Contributions</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hsa"
                      type="number"
                      placeholder="0"
                      value={inputs.hsa}
                      onChange={(e) => handleInputChange('hsa', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deductions" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="useItemized"
                  checked={inputs.useItemized}
                  onCheckedChange={(checked) => handleInputChange('useItemized', checked)}
                />
                <Label htmlFor="useItemized">Use Itemized Deductions</Label>
              </div>

              {inputs.useItemized && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mortgageInterest">Mortgage Interest</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mortgageInterest"
                        type="number"
                        placeholder="0"
                        value={inputs.mortgageInterest}
                        onChange={(e) => handleInputChange('mortgageInterest', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyTax">Property Tax</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="propertyTax"
                        type="number"
                        placeholder="0"
                        value={inputs.propertyTax}
                        onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stateLocalTaxes">State & Local Taxes (SALT)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="stateLocalTaxes"
                        type="number"
                        placeholder="0"
                        value={inputs.stateLocalTaxes}
                        onChange={(e) => handleInputChange('stateLocalTaxes', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Capped at $10,000</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="charitableDonations">Charitable Donations</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="charitableDonations"
                        type="number"
                        placeholder="0"
                        value={inputs.charitableDonations}
                        onChange={(e) => handleInputChange('charitableDonations', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {!inputs.useItemized && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Standard deduction for {inputs.filingStatus === 'marriedJointly' ? 'Married Filing Jointly' :
                      inputs.filingStatus === 'marriedSeparately' ? 'Married Filing Separately' :
                      inputs.filingStatus === 'headOfHousehold' ? 'Head of Household' : 'Single'}: ${standardDeductions[inputs.filingStatus as keyof typeof standardDeductions].toLocaleString()}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="studentLoanInterest">Student Loan Interest</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="studentLoanInterest"
                    type="number"
                    placeholder="0"
                    value={inputs.studentLoanInterest}
                    onChange={(e) => handleInputChange('studentLoanInterest', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Maximum deduction: $2,500</p>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="withheld">Federal Tax Withheld (W-2)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="withheld"
                      type="number"
                      placeholder="0"
                      value={inputs.withheld}
                      onChange={(e) => handleInputChange('withheld', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated">Estimated Tax Payments</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="estimated"
                      type="number"
                      placeholder="0"
                      value={inputs.estimated}
                      onChange={(e) => handleInputChange('estimated', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={calculateTax} className="w-full bg-gradient-primary">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Tax
              </Button>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {results ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Income Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gross Income:</span>
                          <span className="font-medium">${results.grossIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">AGI:</span>
                          <span className="font-medium">${results.adjustedGrossIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deductions:</span>
                          <span className="font-medium">-${results.deductions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-muted-foreground">Taxable Income:</span>
                          <span className="font-bold">${results.taxableIncome.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tax Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Federal Tax:</span>
                          <span className="font-medium text-red-600">${results.federalTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Effective Rate:</span>
                          <span className="font-medium">{(results.effectiveRate * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Marginal Rate:</span>
                          <span className="font-medium">{(results.marginalRate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-muted-foreground">After-Tax Income:</span>
                          <span className="font-bold text-green-600">${results.afterTaxIncome.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className={results.refundOrOwed >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {results.refundOrOwed >= 0 ? (
                          <>
                            <TrendingDown className="w-5 h-5 text-green-600" />
                            Estimated Refund
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5 text-red-600" />
                            Amount Owed
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        ${Math.abs(results.refundOrOwed).toLocaleString()}
                      </div>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Tax:</span>
                          <span>${results.federalTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Payments:</span>
                          <span>${results.totalPayments.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tax Breakdown by Bracket</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {results.taxByBracket.map((bracket, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                            <div>
                              <div className="font-medium">{bracket.bracket}</div>
                              <div className="text-sm text-muted-foreground">
                                ${bracket.income.toLocaleString()} @ {(bracket.rate * 100).toFixed(0)}%
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${bracket.tax.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Enter your income information and click "Calculate Tax" to see your results.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxEstimator;