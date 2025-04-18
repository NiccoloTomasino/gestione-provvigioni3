import { createContext, useState, useContext, useEffect } from 'react';

// Crea il context
const CommissionContext = createContext();

// Dati iniziali di esempio
const initialCommissions = [
  { 
    id: 1, 
    date: '2025-04-10', 
    client: 'Rossi SRL', 
    product: 'Software CRM', 
    amount: 3500, 
    payments: [
      { id: 1, dueDate: '2025-05-15', amount: 1750, status: 'pending' },
      { id: 2, dueDate: '2025-06-15', amount: 1750, status: 'pending' }
    ]
  },
  { 
    id: 2, 
    date: '2025-04-12', 
    client: 'Bianchi & Co', 
    product: 'Consulenza', 
    amount: 2800, 
    payments: [
      { id: 1, dueDate: '2025-05-30', amount: 2800, status: 'pending' }
    ]
  },
  { 
    id: 3, 
    date: '2025-04-15', 
    client: 'Verdi SpA', 
    product: 'Licenza Enterprise', 
    amount: 4200, 
    payments: [
      { id: 1, dueDate: '2025-05-15', amount: 1400, status: 'pending' },
      { id: 2, dueDate: '2025-06-15', amount: 1400, status: 'pending' },
      { id: 3, dueDate: '2025-07-15', amount: 1400, status: 'pending' }
    ]
  }
];

// Provider component
export const CommissionProvider = ({ children }) => {
  const [commissions, setCommissions] = useState(initialCommissions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Utility per formattare la valuta
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Utility per ottenere il nome del mese
  const getMonthName = (monthIndex) => {
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                   'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return months[monthIndex];
  };

  // Calcola i pagamenti futuri
  const calculateFuturePayments = () => {
    const today = new Date();
    const futureMonths = {};
    
    // Inizializza i prossimi 6 mesi
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
      futureMonths[monthKey] = {
        monthName: getMonthName(monthDate.getMonth()),
        year: monthDate.getFullYear(),
        total: 0,
        payments: []
      };
    }
    
    // Aggiungi i pagamenti previsti
    commissions.forEach(commission => {
      commission.payments.forEach(payment => {
        const dueDate = new Date(payment.dueDate);
        const monthKey = `${dueDate.getFullYear()}-${dueDate.getMonth() + 1}`;
        
        if (futureMonths[monthKey] && payment.status === 'pending') {
          futureMonths[monthKey].total += payment.amount;
          futureMonths[monthKey].payments.push({
            ...payment,
            client: commission.client,
            product: commission.product,
            commissionDate: commission.date,
            commissionId: commission.id
          });
        }
      });
    });
    
    return Object.values(futureMonths);
  };
  
  // Funzione per aggiungere una nuova commissione
  const addCommission = (newCommission) => {
    // Genera un nuovo ID
    const id = commissions.length > 0 
      ? Math.max(...commissions.map(c => c.id)) + 1 
      : 1;
    
    const commissionToAdd = {
      ...newCommission,
      id
    };
    
    setCommissions([...commissions, commissionToAdd]);
    return commissionToAdd;
  };
  
  // Funzione per aggiornare lo stato di un pagamento
  const updatePaymentStatus = (commissionId, paymentId, newStatus) => {
    const updatedCommissions = commissions.map(commission => {
      if (commission.id === commissionId) {
        const updatedPayments = commission.payments.map(payment => {
          if (payment.id === paymentId) {
            return { ...payment, status: newStatus };
          }
          return payment;
        });
        
        return { ...commission, payments: updatedPayments };
      }
      return commission;
    });
    
    setCommissions(updatedCommissions);
  };
  
  // Valore del context
  const value = {
    commissions,
    loading,
    error,
    formatCurrency,
    getMonthName,
    calculateFuturePayments,
    addCommission,
    updatePaymentStatus
  };
  
  return (
    <CommissionContext.Provider value={value}>
      {children}
    </CommissionContext.Provider>
  );
};

// Hook personalizzato per utilizzare il context
export const useCommissions = () => {
  const context = useContext(CommissionContext);
  if (context === undefined) {
    throw new Error('useCommissions deve essere usato all\'interno di un CommissionProvider');
  }
  return context;
};
