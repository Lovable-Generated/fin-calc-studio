import CalculatorHeader from '@/components/CalculatorHeader';
import Footer from '@/components/Footer';

interface CalculatorLayoutProps {
  children: React.ReactNode;
}

const CalculatorLayout = ({ children }: CalculatorLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <CalculatorHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default CalculatorLayout;