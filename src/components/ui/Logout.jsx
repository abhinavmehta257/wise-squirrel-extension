import { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import React from 'react';
import { loginContext } from '../../context/context.jsx';

export default function Logout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {setToken} = useContext(loginContext);
  useEffect(() => {
    const authToken = Cookies.get('authToken');
    setIsLoggedIn(!!authToken);
  }, []);

  const handleLogout = () => {
    // Remove authToken from cookies
    Cookies.remove('authToken');
    setToken(null);
    // Remove authToken from chrome.storage.local
    chrome.storage.local.remove('authToken', () => {
      console.log('AuthToken removed from chrome.storage.local');
    });

    setIsLoggedIn(false);
    toast.success('Logged out successfully', {
      position: "bottom-center"
    });
  };

  return (
    <button 
      className='' 
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}