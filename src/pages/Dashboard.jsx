import { Link } from 'react-router-dom';
import { useCommissions } from '../context/CommissionContext';

const Dashboard = () => {
  const { commissions, loading, error, formatCurrency, calculateFuturePayments } = useCommissions();
  
  if (loading) return <div className="text-center py-10">Caricamento...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  
  const futurePayments = calculateFuturePayments();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Riepilogo Pagamenti Futuri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {futurePayments.map((month, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-lg">{month.monthName} {month.year}</h4>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(month.total)}</p>
              <p className="text-sm text-gray-500">{month.payments.length} pagamenti previsti</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Ultime Provvigioni</h3>
          <div className="space-y-2">
            {commissions.slice(-3).map((commission) => (
              <div key={commission.id} className="p-2 border-b hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{commission.client}</p>
                    <p className="text-sm text-gray-600">{commission.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(commission.amount)}</p>
                    <p className="text-sm text-gray-500">{commission.date}</p>
                  </div>
                </div>
              </div>
            ))}
            <Link 
              to="/commissions" 
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
            >
              Visualizza tutte le provvigioni →
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Prossimi Pagamenti</h3>
          <div className="space-y-2">
            {futurePayments[0]?.payments.slice(0, 3).map((payment, index) => (
              <div key={index} className="p-2 border-b hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{payment.client}</p>
                    <p className="text-sm text-gray-600">{payment.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-gray-500">Scadenza: {new Date(payment.dueDate).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>
              </div>
            ))}
            <Link 
              to="/payments" 
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
            >
              Visualizza tutti i pagamenti →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <Link 
          to="/commissions/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registra Nuova Provvigione
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
