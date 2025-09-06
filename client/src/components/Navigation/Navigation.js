// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import './Navigation.css';

// const Navigation = () => {
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <nav className="navigation">
//       <div className="nav-brand">
//         <Link to="/">ChatterBox</Link>
//       </div>
      
//       <div className="nav-links">
//         <Link 
//           to="/chats" 
//           className={location.pathname === '/chats' ? 'nav-link active' : 'nav-link'}
//         >
//           Chats
//         </Link>
//         <Link 
//           to="/contacts" 
//           className={location.pathname === '/contacts' ? 'nav-link active' : 'nav-link'}
//         >
//           Contacts
//         </Link>
//       </div>

//       <div className="nav-user">
//         {user ? (
//           <>
//             <span className="user-name">Hello, {user.name}</span>
//             <button onClick={handleLogout} className="logout-btn">
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="auth-link">Login</Link>
//             <Link to="/register" className="auth-link">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navigation;



// Navigation.js में
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AddContactModal from '../Contacts/AddContactModal';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="navigation">
        <div className="nav-brand">
          <Link to="/chat">ChatterBox</Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/chat" 
            className={location.pathname === '/chat' ? 'nav-link active' : 'nav-link'}
          >
            Chats
          </Link>
          <button 
            className="nav-link"
            onClick={() => setIsAddContactOpen(true)}
          >
            Add Contact
          </button>
        </div>

        <div className="nav-user">
          {user ? (
            <>
              <span className="user-name">Hello, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link">Register</Link>
            </>
          )}
        </div>
      </nav>

      <AddContactModal 
        isOpen={isAddContactOpen} 
        onClose={() => setIsAddContactOpen(false)} 
      />
    </>
  );
};

export default Navigation;