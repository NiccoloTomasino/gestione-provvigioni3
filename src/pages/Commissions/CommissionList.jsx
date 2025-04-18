import { Link } from 'react-router-dom';
import { useCommissions } from '../../context/CommissionContext';

const CommissionList = () => {
  const { commissions, formatCurrency } = useCommissions();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Elenco Provvigioni</h2>
        <Link 
          to="/commissions/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuova Provvigione
        </Link>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        {commissions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Nessuna provvigione registrata. 
            <Link to="/commissions/new" className="text-blue-600 hover:underline ml-1">
              Aggiungi la prima!
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prodotto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato Pagamenti</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{commission.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{commission.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{commission.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(commission.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {commission.payments.map((payment, idx) => (
                          <span 
                            key={idx} 
                            className={`px-2 py-1 text-xs rounded-full ${
                              payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                            title={`${formatCurrency(payment.amount)} - Scadenza: ${payment.dueDate}`}
                          >
                            {new Date(payment.dueDate).toLocaleDateString('it-IT', { month: 'short' })}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/commissions/${commission.id}`}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Dettagli
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionList;
