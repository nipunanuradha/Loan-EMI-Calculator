import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Calendar, PieChart as PieIcon, Table as TableIcon, Download, Sliders as SliderIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
//import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

export default function EMICalculator() {
  //State Variables
  const [principal, setPrincipal] = useState('100000');
  const [annualRate, setAnnualRate] = useState('12');
  const [tenure, setTenure] = useState('12');
  
  // Prepayment States
  const [prepaymentAmount, setPrepaymentAmount] = useState('');
  
  // Results State
  const [emi, setEmi] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [savedTenure, setSavedTenure] = useState(null); // To show months saved

  // Calculation Logic
  const calculateEMI = () => {
    const P = parseFloat(principal);
    const annualInterestRate = parseFloat(annualRate);
    const N = parseFloat(tenure);
    const prePay = parseFloat(prepaymentAmount) || 0;

    if (!P || P <= 0 || !annualInterestRate || annualInterestRate < 0 || !N || N <= 0) {
      alert('Please enter valid positive values for all fields');
      return;
    }

    // Calculate Standard EMI (Base EMI)
    const R = (annualInterestRate / 100) / 12;
    let calculatedEMI;
    
    if (R === 0) {
      calculatedEMI = P / N;
    } else {
      const numerator = P * R * Math.pow(1 + R, N);
      const denominator = Math.pow(1 + R, N) - 1;
      calculatedEMI = numerator / denominator;
    }

    // Generate Schedule with Prepayment Logic (Reduce Tenure Strategy)
    let currentBalance = P;
    let newSchedule = [];
    let actualMonthsTaken = 0;
    
    // We loop up to N, but if balance hits 0 earlier (due to prepayment), we stop
    for (let i = 1; i <= N; i++) {
      let monthlyInterest = currentBalance * R;
      let monthlyPrincipal = calculatedEMI - monthlyInterest;
      
      // Apply Prepayment in the 1st Month (Simplified logic for Lump Sum)
      // You can change 'i === 1' to any month if you want a specific month input
      let extraPayment = 0;
      if (i === 1 && prePay > 0) {
        extraPayment = prePay;
        // If prepayment is huge, adjust it to not exceed balance
        if (extraPayment > currentBalance - monthlyPrincipal) {
            extraPayment = currentBalance - monthlyPrincipal;
        }
      }

      let totalPrincipalPaid = monthlyPrincipal + extraPayment;

      // Check if loan is finished
      if (totalPrincipalPaid >= currentBalance) {
        monthlyPrincipal = currentBalance; // Pay off remaining
        extraPayment = 0; // Already included in clearing balance
        currentBalance = 0;
      } else {
        currentBalance -= totalPrincipalPaid;
      }
      
      newSchedule.push({
        month: i,
        interest: monthlyInterest,
        principal: monthlyPrincipal,
        extra: extraPayment,
        balance: currentBalance > 0 ? currentBalance : 0
      });

      actualMonthsTaken = i;
      if (currentBalance <= 0) break;
    }

    // Calculate totals based on the actual schedule
    const totalPaidInterest = newSchedule.reduce((acc, curr) => acc + curr.interest, 0);
    const totalPaidAmount = P + totalPaidInterest;

    setEmi(calculatedEMI);
    setTotalAmount(totalPaidAmount);
    setTotalInterest(totalPaidInterest);
    setSchedule(newSchedule);
    
    // If tenure reduced
    if (actualMonthsTaken < N) {
        setSavedTenure(N - actualMonthsTaken);
    } else {
        setSavedTenure(null);
    }
  };

  const resetCalculator = () => {
    setPrincipal('100000');
    setAnnualRate('12');
    setTenure('12');
    setPrepaymentAmount('');
    setEmi(null);
    setTotalAmount(null);
    setTotalInterest(null);
    setSchedule([]);
    setSavedTenure(null);
  };

  //  PDF Download Function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Loan EMI Report', 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // Summary Section
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 35, 180, 40, 'F');
    
    doc.text(`Principal Amount: Rs. ${parseFloat(principal).toFixed(2)}`, 20, 45);
    doc.text(`Interest Rate: ${annualRate}%`, 20, 52);
    doc.text(`Tenure: ${tenure} Months`, 20, 59);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255); // Blue color for EMI
    doc.text(`Monthly EMI: Rs. ${emi?.toFixed(2)}`, 100, 45);
    doc.setTextColor(0, 0, 0); // Reset color
    
    doc.text(`Total Interest: Rs. ${totalInterest?.toFixed(2)}`, 100, 55);
    doc.text(`Total Amount: Rs. ${totalAmount?.toFixed(2)}`, 100, 65);

    // Table
    const tableColumn = ["Month", "Principal", "Interest", "Extra Pay", "Balance"];
    const tableRows = [];

    schedule.forEach(row => {
      const rowData = [
        row.month,
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.extra > 0 ? row.extra.toFixed(2) : '-',
        row.balance.toFixed(2)
      ];
      tableRows.push(rowData);
    });

    autoTable(doc,{
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }, // Indigo color
    });

    doc.save('emi-calculation-report.pdf');
  };

  // Chart Data
  const chartData = [
    { name: 'Principal', value: parseFloat(principal) || 0 },
    { name: 'Interest', value: totalInterest || 0 },
  ];
  const COLORS = ['#4F46E5', '#EA580C'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                 <Calculator className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Smart EMI Calculator</h1>
            </div>
            
            {emi && (
              <button 
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-lg"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT SIDE: Inputs */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Principal Input + Slider */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
                  <span>Loan Amount (LKR)</span>
                  <span className="text-indigo-600">{Number(principal).toLocaleString()}</span>
                </label>
                <div className="relative mb-3">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <input 
                  type="range" min="10000" max="10000000" step="5000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Rate Input + Slider */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
                  <span>Interest Rate (%)</span>
                  <span className="text-indigo-600">{annualRate}%</span>
                </label>
                <div className="relative mb-3">
                  <Percent className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <input 
                  type="range" min="1" max="30" step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Tenure Input + Slider */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
                  <span>Tenure (Months)</span>
                  <span className="text-indigo-600">{tenure} Months</span>
                </label>
                <div className="relative mb-3">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <input 
                  type="range" min="6" max="360" step="6"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

               {/* Prepayment Input (Optional) */}
               <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Part Payment (Optional)
                  <span className="text-xs font-normal text-gray-500 block">Reduce your loan tenure by paying extra once.</span>
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-3 text-sm text-orange-400 font-bold">LKR</span>
                  <input
                    type="number"
                    value={prepaymentAmount}
                    onChange={(e) => setPrepaymentAmount(e.target.value)}
                    placeholder="Ex: 50000"
                    className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={calculateEMI}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg active:transform active:scale-95"
                >
                  Calculate EMI
                </button>
                <button
                  onClick={resetCalculator}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Results */}
            <div className="lg:col-span-8">
              {!emi ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl p-10 bg-gray-50">
                  <SliderIcon className="w-20 h-20 mb-4 opacity-20" />
                  <p className="text-lg">Adjust sliders and click Calculate</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300">
                      <div className="text-indigo-200 text-sm font-medium mb-1">Monthly EMI</div>
                      <div className="text-3xl font-bold">
                        LKR {emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                      <div className="text-gray-500 text-sm font-medium mb-1">Total Interest</div>
                      <div className="text-2xl font-bold text-orange-600">
                        LKR {totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                      <div className="text-gray-500 text-sm font-medium mb-1">Total Payment</div>
                      <div className="text-2xl font-bold text-gray-800">
                        LKR {totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>

                  {/* Prepayment Impact Banner */}
                  {savedTenure && (
                    <div className="bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3">
                        <div className="bg-green-200 p-2 rounded-full">🎉</div>
                        <div>
                            <span className="font-bold">Good News!</span> By paying an extra LKR{parseFloat(prepaymentAmount).toLocaleString()}, 
                            you finish the loan <span className="font-bold">{savedTenure} months earlier!</span>
                        </div>
                    </div>
                  )}
                  
                  {/* Chart and Table Layout */}
                  <div className="flex flex-col gap-1">
                    {/* Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-80 relative">
                        <h3 className="absolute top-4 left-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Interest Breakdown</h3>
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
                                <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <br />
                    {/* Table */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-h-96 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <TableIcon className="w-4 h-4"/> Amortization Schedule
                            </h3>
                        </div>
                        <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-indigo-200">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-bold sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4">Mon</th>
                                        <th className="px-6 py-4">Principal</th>
                                        <th className="px-6 py-4">Interest</th>
                                        <th className="px-6 py-4">Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {schedule.map((row) => (
                                        <tr key={row.month} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-3">{row.month}</td>
                                            <td className="px-6 py-3 text-indigo-600 font-medium">
                                                LKR {row.principal.toLocaleString(undefined, {maximumFractionDigits:0})}
                                                {row.extra > 0 && <span className="block text-[10px] text-green-600">+LKR {row.extra} (Extra)</span>}
                                            </td>
                                            <td className="px-6 py-3 text-orange-500">LKR {row.interest.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                                            <td className="px-6 py-3 text-gray-500">LKR {row.balance.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}