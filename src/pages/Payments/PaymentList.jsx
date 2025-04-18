import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommissions } from '../../context/CommissionContext';

const PaymentList = () => {
  const { calculateFuturePayments, formatCurrency, updatePaymentStatus } = useCommissions();
  const [expandedMonth, setExpandedMonth] = useState(null);
  
  const futurePayments = calculateFuturePayments();
  
  // Toggle mese espanso
  const toggleMonth = (index) => {
    if (expandedMonth === index) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth(index);
    }
  };
  
  // Handler per aggiornare lo stato di un pagamento
  const handlePaymentStatusChange = (commissionId, paymentId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    updatePaymentStatus(commissionId, paymentId, newStatus);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pagamenti Futuri</h2>
      
      {futurePayments.map((month, monthIndex) => (
        <div key={monthIndex} className="bg-white p-4 rounded-lg shadow mb-6">
          <div 
            className="flex justify-between items-center border-b pb-2 cursor-pointer"
            onClick={() => toggleMonth(monthIndex)}
          >
            <h3 className="font-semibold text-lg">
              {month.monthName} {month.year}
              <span className="ml-2 text-green-600 font-bold">{formatCurrency(month.total)}</span>
            </h3>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">
                {month.payments.length} pagamenti previsti
              </span>
              <span className="transform transition-transform duration-200" style={{ 
                transform: expandedMonth === monthIndex ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </span>
            </div>
          </div>
          
          <div className={`mt-4 ${expandedMonth === monthIndex ? 'block' : 'hidden'}`}>
            {month.payments.length > 0 ? (
              <div className="space-y-2">
                {month.payments.map((payment, paymentIndex) => (
                  <div key={paymentIndex} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border-b">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-3 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={payment.status === 'paid'}
                        onChange={() => handlePaymentStatusChange(payment.commissionId, payment.id, payment.status)}
                      />
                      <div>
                        <p className="font-medium">{payment.client}</p>
                        <p className="text-sm text-gray-600">{payment.product}</p>
                        <Link 
                          to={`/commissions/${payment.commissionId}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Vedi dettagli
                        </Link>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-gray-500">Scadenza: {new Date(payment.dueDate).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mt-2">Nessun pagamento previsto</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentList;
