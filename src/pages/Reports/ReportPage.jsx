import { useState } from 'react';
import { useCommissions } from '../../context/CommissionContext';

const ReportPage = () => {
  const { commissions, formatCurrency, getMonthName } = useCommissions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const years = Array.from(
    new Set(commissions.map(c => new Date(c.date).getFullYear()))
  ).sort((a, b) => b - a);
  
  if (years.length === 0) {
    years.push(new Date().getFullYear());
  }
  
  // Genera il report mensile per l'anno selezionato
  const generateMonthlyReport = () => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      index: i,
      name: getMonthName(i),
      commissions: 0,
      payments: 0,
      pendingPayments: 0
    }));
    
    // Calcola le commissioni registrate per mese
    commissions.forEach(commission => {
      const date = new Date(commission.date);
      if (date.getFullYear() === selectedYear) {
        months[date.getMonth()].commissions += commission.amount;
      }
      
      // Calcola i pagamenti per mese
      commission.payments.forEach(payment => {
        const paymentDate = new Date(payment.dueDate);
        if (paymentDate.getFullYear() === selectedYear) {
          if (payment.status === 'paid') {
            months[paymentDate.getMonth()].payments += payment.amount;
          } else {
            months[paymentDate.getMonth()].pendingPayments += payment.amount;
          }
        }
      });
    });
    
    return months;
  };
  
  const monthlyReport = generateMonthlyReport();
  
  // Calcola i totali annuali
  const annualTotals = {
    commissions: monthlyReport.reduce((sum, month) => sum + month.commissions, 0),
    payments: monthlyReport.reduce((sum, month) => sum + month.payments, 0),
    pendingPayments: monthlyReport.reduce((sum, month) => sum + month.pendingPayments, 0)
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Report Mensili</h2>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Report per mese - {selectedYear}</h3>
          <div>
            <select 
              className="border rounded p-2 mr-2"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                alert('Funzionalità di esportazione da implementare');
              }}
            >
              Esporta Report Annuale
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mese</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provvigioni Registrate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamenti Ricevuti</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamenti in Attesa</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyReport.map((month) => (
                <tr key={month.index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{month.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(month.commissions)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">
                    {formatCurrency(month.payments)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-yellow-600">
                    {formatCurrency(month.pendingPayments)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="px-6 py-4 whitespace-nowrap">Totale Annuale</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(annualTotals.commissions)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600">
                  {formatCurrency(annualTotals.payments)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-yellow-600">
                  {formatCurrency(annualTotals.pendingPayments)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-blue-800">Totale Provvigioni</h4>
            <p className="text-2xl font-bold">{formatCurrency(annualTotals.commissions)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-green-800">Totale Pagamenti Ricevuti</h4>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(annualTotals.payments)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-yellow-800">Totale Pagamenti Attesi</h4>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(annualTotals.pendingPayments)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
