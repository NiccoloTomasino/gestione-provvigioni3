import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">GestioneProvvigioni</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive ? 'px-3 py-1 rounded bg-white text-blue-600' : 'px-3 py-1 rounded text-white hover:bg-blue-500'
                }
                end
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/commissions" 
                className={({ isActive }) => 
                  isActive ? 'px-3 py-1 rounded bg-white text-blue-600' : 'px-3 py-1 rounded text-white hover:bg-blue-500'
                }
              >
                Provvigioni
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/payments" 
                className={({ isActive }) => 
                  isActive ? 'px-3 py-1 rounded bg-white text-blue-600' : 'px-3 py-1 rounded text-white hover:bg-blue-500'
                }
              >
                Pagamenti
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reports" 
                className={({ isActive }) => 
                  isActive ? 'px-3 py-1 rounded bg-white text-blue-600' : 'px-3 py-1 rounded text-white hover:bg-blue-500'
                }
              >
                Report
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
