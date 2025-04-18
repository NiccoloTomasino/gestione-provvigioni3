import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
      
      <footer className="bg-gray-200 py-4 mt-8">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          GestioneProvvigioni App © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
