import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ menuItems, className = '' }) {
  const location = useLocation();

  return (
    <div
      className={`hidden md:flex flex-col w-20 lg:w-24 h-screen fixed left-0 top-0 pt-20 shadow-lg z-40 ${className} bg-white dark:bg-neutral-900 text-gray-900 dark:text-white transition-colors duration-300`}
      style={{ direction: 'ltr' }}
    >
      {menuItems.map(item => (
        <div
          key={item.id}
          className={`flex-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors ${
            location.pathname === item.path ? 'bg-gray-100 dark:bg-neutral-800' : ''
          }`}
        >
          <Link
            to={item.path}
            className={`group w-full h-full flex flex-col justify-center items-center p-2  ${
              location.pathname === item.path ? 'w-24 h-24 lg:w-28 lg:h-28' : 'w-20 h-20'
            }`}
            title={item.title}
          >
            
              {item.icon}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;