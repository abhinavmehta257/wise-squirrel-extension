import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import Login from './components/Login.jsx';
import Cookies from 'js-cookie';
import Dashboard from './components/Dashboard.jsx';
import { loginContext, loaderContext, urlContext, routeContext } from './context/context.jsx';
import SignupForm from './components/SignUp.jsx';

const Popup = () => {
  const [token,setToken] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [route, setRoute] = useState('Login');
  useEffect(()=>{
    const token = Cookies.get('authToken');
    if (token) {
      setToken(token);
      setRoute('dashboard');
    }
    console.log(token);
  })
  const url = 'https://fantastic-train-r6qjxrpp5rwf5r4v-3000.app.github.dev/api/'

  const renderElement = ()=>{
    switch(route){
      case 'dashboard': return <Dashboard/>
      case 'signup': return <SignupForm/>
      default: return <Login/>
    }
  }
 return (
  <routeContext.Provider value={{route, setRoute}}>
    <urlContext.Provider value={{url}}>
      <loaderContext.Provider value={{setIsLoader}}>
        <loginContext.Provider value={{token, setToken}}>
          <div className='h-[100vh] w-full flex flex-col bg-dark-background p-4'>
            {renderElement()}
          </div>
        </loginContext.Provider>
      </loaderContext.Provider>
    </urlContext.Provider>
  </routeContext.Provider>
  )
};

export default Popup;


render(<Popup/>,document.getElementById("react-target"));