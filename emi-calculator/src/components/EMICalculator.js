import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const calculateEMI = () => {
    const P = parseFloat(principal);
    const annualInterestRate = parseFloat(annualRate);
    const N = parseFloat(tenure);

    if (!P || P <= 0 || !annualInterestRate || annualInterestRate < 0 || !N || N <= 0) {
      alert('Please enter valid positive values for all fields');
      return;
    }

    // Convert annual interest rate to monthly rate
    const R = (annualInterestRate / 100) / 12;

    // Calculate EMI using the formula
    let calculatedEMI;
    
    if (R === 0) {
      // If interest rate is 0, EMI is simply principal divided by tenure
      calculatedEMI = P / N;
    } else {
      // EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
      const numerator = P * R * Math.pow(1 + R, N);
      const denominator = Math.pow(1 + R, N) - 1;
      calculatedEMI = numerator / denominator;
    }

    const total = calculatedEMI * N;
    const interest = total - P;

    setEmi(calculatedEMI);
    setTotalAmount(total);
    setTotalInterest(interest);
  };

  const resetCalculator = () => {
    setPrincipal('');
    setAnnualRate('');
    setTenure('');
    setEmi(null);
    setTotalAmount(null);
    setTotalInterest(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Loan EMI Calculator</h1>
          </div>

          <div className="space-y-6">
            {/* Principal Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal Amount (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="Enter loan amount"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Interest Rate Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Interest Rate (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  placeholder="Enter annual interest rate"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Loan Tenure Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure (Months)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="Enter loan tenure in months"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={calculateEMI}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Calculate EMI
              </button>
              <button
                onClick={resetCalculator}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Results */}
            {emi !== null && (
              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Calculation Results</h2>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Monthly EMI</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    ₹{emi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Principal Amount</div>
                    <div className="text-lg font-semibold text-gray-800">
                      ₹{parseFloat(principal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">Total Interest</div>
                    <div className="text-lg font-semibold text-orange-600">
                      ₹{totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Amount Payable</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  <strong>Formula used:</strong> EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
                  <br />
                  Where P = Principal, R = Monthly Interest Rate, N = Tenure in months
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test Cases */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample Test Cases</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="p-3 bg-gray-50 rounded">
              <strong>Test 1:</strong> Principal: ₹100,000 | Annual Rate: 12% | Tenure: 12 months
              <br />
              <span className="text-indigo-600">Expected EMI: ₹8,884.88</span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Test 2:</strong> Principal: ₹500,000 | Annual Rate: 10.5% | Tenure: 60 months
              <br />
              <span className="text-indigo-600">Expected EMI: ₹10,743.65</span>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Test 3:</strong> Principal: ₹1,000,000 | Annual Rate: 8.5% | Tenure: 240 months
              <br />
              <span className="text-indigo-600">Expected EMI: ₹7,689.11</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}