import { Calculator, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">FinCalc Studio</span>
            </div>
            <p className="text-sm text-slate-400">
              Professional financial calculators for accurate planning and decision-making. 
              Trusted by professionals and individuals worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-white font-semibold mb-4">Calculators</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/calculators/tax-estimator" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Tax Estimator (1040)
                </Link>
              </li>
              <li>
                <Link to="/calculators/mortgage" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Mortgage Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators/investment" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Investment Returns
                </Link>
              </li>
              <li>
                <Link to="/calculators/retirement" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Retirement Planner
                </Link>
              </li>
              <li>
                <Link to="/calculators/loan" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Loan Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators/compound-interest" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Compound Interest
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Financial Blog
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-slate-500 mt-0.5" />
                <span className="text-sm text-slate-400">
                  support@fincalcstudio.com
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-slate-500 mt-0.5" />
                <span className="text-sm text-slate-400">
                  1-800-FIN-CALC
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                <span className="text-sm text-slate-400">
                  123 Finance Street<br />
                  New York, NY 10001<br />
                  United States
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-400">
              © 2024 Financial Calculator Studio. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-slate-400 hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-slate-400 hover:text-primary transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="text-sm text-slate-400 hover:text-primary transition-colors">
                Cookies
              </Link>
              <Link to="/sitemap" className="text-sm text-slate-400 hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;