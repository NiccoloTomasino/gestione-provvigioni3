import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CommissionList from './pages/Commissions/CommissionList';
import CommissionForm from './pages/Commissions/CommissionForm';
import CommissionDetail from './pages/Commissions/CommissionDetail';
import PaymentList from './pages/Payments/PaymentList';
import ReportPage from './pages/Reports/ReportPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="commissions" element={<CommissionList />} />
          <Route path="commissions/new" element={<CommissionForm />} />
          <Route path="commissions/:id" element={<CommissionDetail />} />
          <Route path="payments" element={<PaymentList />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
