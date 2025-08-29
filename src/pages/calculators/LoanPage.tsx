import { LoanCalculator } from '@/components/LoanCalculator';
import CalculatorLayout from './CalculatorLayout';

const LoanPage = () => {
  return (
    <CalculatorLayout>
      <LoanCalculator />
    </CalculatorLayout>
  );
};

export default LoanPage;