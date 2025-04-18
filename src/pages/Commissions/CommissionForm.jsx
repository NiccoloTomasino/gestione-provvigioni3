import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCommissions } from '../../context/CommissionContext';

const CommissionForm = () => {
  const { addCommission, formatCurrency } = useCommissions();
  const navigate = useNavigate();
  
  const [newCommission, setNewCommission] = useState({
    client: '',
    product: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    payments: []
  });
  
  const [paymentPlan, setPaymentPlan] = useState([
    { dueDate: '', amount: '', status: 'pending' }
  ]);
  
  const [error, setError] = useState('');
  
  // Handler per l'aggiunta di un piano di pagamento
  const handleAddPaymentPlan = () => {
    setPaymentPlan([...paymentPlan, { dueDate: '', amount: '', status: 'pending' }]);
  };
  
  // Handler per la modifica di un elemento del piano di pagamento
  const handlePaymentPlanChange = (index, field, value) => {
    const updatedPaymentPlan = [...paymentPlan];
    updatedPaymentPlan[index] = { ...updatedPaymentPlan[index], [field]: value };
    setPaymentPlan(updatedPaymentPlan);
  };
  
  // Handler per rimuovere una rata dal piano
  const handleRemovePayment = (index) => {
    const updatedPaymentPlan = [...paymentPlan];
    updatedPaymentPlan.splice(index, 1);
    setPaymentPlan(updatedPaymentPlan);
  };
  
  // Handler per salvare una nuova commissione
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verifica che i campi obbligatori siano compilati
    if (!newCommission.client || !newCommission.product || !newCommission.amount) {
      setError('Compila tutti i campi obbligatori');
      return;
    }
    
    // Verifica che tutti i piani di pagamento abbiano date e importi
    for (const payment of paymentPlan) {
      if (!payment.dueDate || !payment.amount) {
        setError('Tutti i piani di pagamento devono avere una data e un importo');
        return;
      }
    }
    
    // Verifica che la somma dei pagamenti corrisponda all'importo totale
    const totalPayments = paymentPlan.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    if (Math.abs(totalPayments - parseFloat(newCommission.amount)) > 0.01) {
      setError('La somma dei pagamenti deve corrispondere all\'importo totale della provvigione');
      return;
    }
    
    // Crea una nuova commissione con ID per i pagamenti
    const commissionsWithPaymentIds = {
      ...newCommission,
      amount: parseFloat(newCommission.amount),
      payments: paymentPlan.map((payment, index) => ({
        id: index + 1,
        dueDate: payment.dueDate,
        amount: parseFloat(payment.amount),
        status: 'pending'
      }))
    };
    
    // Salva la commissione
    addCommission(commissionsWithPaymentIds);
    
    // Naviga alla lista delle provvigioni
    navigate('/commissions');
  };
  
  // Calcola il totale pianificato e il rimanente
  const totalPlannedAmount = paymentPlan.reduce(
    (sum, payment) => sum + (parseFloat(payment.amount) || 0), 0
  );
  const remainingAmount = parseFloat(newCommission.amount || 0) - totalPlannedAmount;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Registra Nuova Provvigione</h2>
        <Link 
          to="/commissions" 
          className="text-gray-600 hover:text-gray-800"
        >
          ← Torna all'elenco
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                value={newCommission.date}
                onChange={(e) => setNewCommission({...newCommission, date: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                value={newCommission.client}
                onChange={(e) => setNewCommission({...newCommission, client: e.target.value})}
                placeholder="Nome del cliente"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prodotto/Servizio *</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                value={newCommission.product}
                onChange={(e) => setNewCommission({...newCommission, product: e.target.value})}
                placeholder="Descrizione del prodotto o servizio"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Importo Totale (€) *</label>
              <input
                type="number"
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                value={newCommission.amount}
                onChange={(e) => setNewCommission({...newCommission, amount: e.target.value})}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Piano di Pagamento</h3>
              <div className="text-sm">
                <span className={Math.abs(remainingAmount) < 0.01 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(remainingAmount) < 0.01
                    ? 'Piano completo' 
                    : `Mancano ${formatCurrency(remainingAmount)}`}
                </span>
              </div>
            </div>
            
            {paymentPlan.map((payment, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <div className="w-1/3">
                  <label className="block text-xs text-gray-500 mb-1">Data Scadenza *</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    value={payment.dueDate}
                    onChange={(e) => handlePaymentPlanChange(index, 'dueDate', e.target.value)}
                    required
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs text-gray-500 mb-1">Importo (€) *</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    value={payment.amount}
                    onChange={(e) => handlePaymentPlanChange(index, 'amount', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="w-1/3 flex items-end">
                  {paymentPlan.length > 1 && (
                    <button 
                      type="button"
                      className="p-2 text-red-600 hover:text-red-800"
                      onClick={() => handleRemovePayment(index)}
                    >
                      Rimuovi
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button 
              type="button"
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={handleAddPaymentPlan}
            >
              + Aggiungi rata
            </button>
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Link 
              to="/commissions"
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
            >
              Annulla
            </Link>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salva Provvigione
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommissionForm;
