import { useParams, Link } from 'react-router-dom';
import { useCommissions } from '../../context/CommissionContext';

const CommissionDetail = () => {
  const { id } = useParams();
  const { commissions, formatCurrency, updatePaymentStatus } = useCommissions();
  
  // Trova la commissione corrente
  const commission = commissions.find(c => c.id === parseInt(id));
  
  if (!commission) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Commissione non trovata</p>
        <Link to="/commissions" className="text-blue-600 hover:underline">
          Torna all'elenco
        </Link>
      </div>
    );
  }
  
  // Handler per aggiornare lo stato di un pagamento
  const handlePaymentStatusChange = (paymentId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    updatePaymentStatus(commission.id, paymentId, newStatus);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dettaglio Provvigione</h2>
        <Link 
          to="/commissions" 
          className="text-gray-600 hover:text-gray-800"
        >
          ← Torna all'elenco
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Informazioni Generali</h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente:</span>
                  <span className="font-medium">{commission.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Prodotto:</span>
                  <span className="font-medium">{commission.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data:</span>
                  <span className="font-medium">{commission.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Importo Totale:</span>
                  <span className="font-bold text-green-600">{formatCurrency(commission.amount)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Stato Pagamenti</h3>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${(commission.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) / commission.amount) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-sm">
                  <span>Incassato: {formatCurrency(commission.payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0))}</span>
                  <span>Da incassare: {formatCurrency(commission.payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Piano di Pagamento</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scadenza</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commission.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(payment.dueDate).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status === 'paid' ? 'Pagato' : 'In attesa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handlePaymentStatusChange(payment.id, payment.status)}
                        className={`px-3 py-1 text-xs rounded border ${
                          payment.status === 'pending' 
                            ? 'border-green-600 text-green-600 hover:bg-green-50' 
                            : 'border-yellow-600 text-yellow-600 hover:bg-yellow-50'
                        }`}
                      >
                        {payment.status === 'pending' ? 'Segna come pagato' : 'Segna come non pagato'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionDetail;
