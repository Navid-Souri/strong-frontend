// Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ menuItems, className = '' }) {
  const location = useLocation();

  return (
    <div
      className={`flex h-20 sm:h-24 md:hidden lg:hidden ${className}`}
      style={{ direction: 'ltr' }} // <--- ADD THIS INLINE STYLE
    >
      {menuItems.map(item => (
        <div
          key={item.id}
          className="flex-1 h-full flex justify-center items-center bg-white dark:bg-neutral-900  hover:bg-white transition-colors rounded-lg m-1 sm:m-2 shadow-lg active:-scale-x-100/scale-y-100 active:shadow-none active:bg-white/70"
        >
          <Link
            to={item.path}
            className={`group w-16 h-16 sm:w-20 sm:h-20 flex justify-center items-center ${
              location.pathname === item.path ? 'w-20 h-20 sm:w-24 sm:h-24' : ''
            } rounded-lg`}
          >
            {item.icon}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Navbar;