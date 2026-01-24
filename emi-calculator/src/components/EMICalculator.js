import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, PieChart as PieIcon, Table as TableIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [tenure, setTenure] = useState('');
  
  // Results State
  const [emi, setEmi] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [schedule, setSchedule] = useState([]); // New state for Amortization Schedule

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
      calculatedEMI = P / N;
    } else {
      const numerator = P * R * Math.pow(1 + R, N);
      const denominator = Math.pow(1 + R, N) - 1;
      calculatedEMI = numerator / denominator;
    }

    const total = calculatedEMI * N;
    const interest = total - P;

    //Generate Amortization Schedule
    let currentBalance = P;
    let newSchedule = [];
    
    for (let i = 1; i <= N; i++) {
      // For the last month, adjust slightly to handle rounding errors
      let monthlyInterest = currentBalance * R;
      let monthlyPrincipal = calculatedEMI - monthlyInterest;
      
      // If it's the last month or balance becomes negative due to rounding
      if (i === N || monthlyPrincipal > currentBalance) {
          monthlyPrincipal = currentBalance;
          // Recalculate EMI for last month strictly to close loan
          // (Optional visual fix, but keeping standard formula is usually better for consistency)
      }

      currentBalance -= monthlyPrincipal;
      
      newSchedule.push({
        month: i,
        interest: monthlyInterest,
        principal: monthlyPrincipal,
        balance: currentBalance > 0 ? currentBalance : 0
      });
    }

    setEmi(calculatedEMI);
    setTotalAmount(total);
    setTotalInterest(interest);
    setSchedule(newSchedule);
  };

  const resetCalculator = () => {
    setPrincipal('');
    setAnnualRate('');
    setTenure('');
    setEmi(null);
    setTotalAmount(null);
    setTotalInterest(null);
    setSchedule([]);
  };

  // Data for the Pie Chart
  const chartData = [
    { name: 'Principal Amount', value: parseFloat(principal) || 0 },
    { name: 'Total Interest', value: totalInterest || 0 },
  ];

  const COLORS = ['#4F46E5', '#EA580C']; // Indigo for Principal, Orange for Interest

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto"> {/* Changed max-w-2xl to max-w-4xl to fit chart better */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Loan EMI Calculator</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Input Section - Left Side */}
            <div className="md:col-span-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principal Amount ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    placeholder="100000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

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
                    placeholder="12"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

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
                    placeholder="12"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={calculateEMI}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Calculate
                </button>
                <button
                  onClick={resetCalculator}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Results Section - Right Side */}
            <div className="md:col-span-2">
              {emi === null ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-8">
                  <Calculator className="w-16 h-16 mb-4 opacity-50" />
                  <p>Enter details to view breakdown</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <div className="text-sm text-indigo-600 font-medium mb-1">Monthly EMI</div>
                      <div className="text-2xl font-bold text-indigo-700">
                        ${emi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <div className="text-sm text-green-600 font-medium mb-1">Total Payable</div>
                      <div className="text-2xl font-bold text-green-700">
                        ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Chart and Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                    
                    {/* Pie Chart */}
                    <div className="h-64 relative">
                        <h3 className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                            <PieIcon className="w-4 h-4" /> Interest Breakdown
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN', {maximumFractionDigits: 2})}`} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text in Donut Chart */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
                             <div className="text-xs text-gray-500">Interest Share</div>
                             <div className="text-sm font-bold text-gray-700">
                                {((totalInterest / totalAmount) * 100).toFixed(1)}%
                             </div>
                        </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex flex-col justify-center space-y-4">
                         <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-600">
                            <div className="text-xs text-gray-500">Principal Amount</div>
                            <div className="text-lg font-bold text-gray-800">
                                ${parseFloat(principal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                         </div>
                         <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-orange-500">
                            <div className="text-xs text-gray-500">Total Interest</div>
                            <div className="text-lg font-bold text-orange-600">
                                ${totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                         </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amortization Table */}
          {emi !== null && schedule.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <TableIcon className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-800">Amortization Schedule</h2>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-bold sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Month</th>
                                <th className="px-6 py-4">Principal Paid</th>
                                <th className="px-6 py-4">Interest Paid</th>
                                <th className="px-6 py-4">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schedule.map((row) => (
                                <tr key={row.month} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-gray-600">{row.month}</td>
                                    <td className="px-6 py-3 text-indigo-600">${row.principal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-3 text-orange-600">${row.interest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-3 text-gray-800">${row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}