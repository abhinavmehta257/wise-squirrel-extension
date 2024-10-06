import React, { useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { Toaster, toast } from 'react-hot-toast';
import { loginContext, routeContext } from '../context/context.jsx';

function Login() {
  const url = 'https://fantastic-train-r6qjxrpp5rwf5r4v-3000.app.github.dev/api';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {setToken} = useContext(loginContext);
  const {route, setRoute} = useContext(routeContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(email, password);
      setIsSubmitting(true);
      const response = await fetch(`${url}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,  // Using the state value for email
          password: password // Using the state value for password
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.log(error.message);
        
        toast.error(`Signin failed. ${error.message}`,{
          position: "bottom-center"
        });
        
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      const { authToken } = data;

      // Store authToken in chrome.storage.local
      chrome.storage.local.set({ authToken: authToken }, function() {
        console.log('AuthToken is stored in chrome.storage.local');
      });

      // Optionally, you can also set it as a cookie
      Cookies.set('authToken', authToken, { expires: 7 }); // Expires in 7 days
      setToken(authToken);
      setIsSubmitting(false);
      // Show success toast
      toast.success('Signin successful!',{
        position: "bottom-center"
      });
      // router.push("/dashboard")
    } catch (err) {
      console.error('Error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="w-full h-full flex flex-col items-center justify-center bg-dark-background">
      <div className="p-8 rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-light-text mb-6 text-center">Signin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-light-text mb-2">Email</label>
            <input 
              type="email" 
              id="email"
              name='email' 
              className="w-full p-3 bg-dark-surface text-light-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary-text"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-light-text mb-2">Password</label>
            <input 
              type="password" 
              id="password"
              name='password' 
              className="w-full p-3 bg-dark-surface text-light-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary-text"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-dark-surface text-light-surface p-3 rounded-md font-semibold hover:bg-opacity-90">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">
          <button
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
            onClick={()=> setRoute('signup')}
          >
            SignUp
          </button>
        </p>
      </div>
      <Toaster/>
    </div>
  </>
  );
}

export default Login;
