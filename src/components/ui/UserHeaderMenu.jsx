import React, { useState } from 'react'
import Logout from './Logout.jsx';
import { MoreVert } from '@mui/icons-material';

function UserHeaderMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = (e) => {
        e.stopPropagation(); // Prevent card click when menu is toggled
        setIsMenuOpen(!isMenuOpen);
      };
    
  return (
    <div>
        <div className="relative flex-shrink-0" onClick={toggleMenu}>
            <MoreVert className="cursor-pointer text-gray-500 hover:text-gray-700" />
            {/* Context Menu */}
            {isMenuOpen && (
                <ul
                className="absolute right-0 top-8 bg-white dark:bg-dark-surface shadow-md rounded-lg w-32 z-10"
                onClick={(e) => e.stopPropagation()} // Prevent card click on menu interaction
                >
                <li
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-red-500 rounded-lg"
                >
                    <Logout/>
                </li>
                </ul>
            )}
         </div>
   </div>
  )
}

export default UserHeaderMenu;