import React, { useContext, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Cookies from 'js-cookie';    
import { loginContext, routeContext, urlContext } from '../context/context.jsx';
export const metadata = {
  title: "Sign Up",
  description: "Page description",
};

function SignupForm() {
    const {url} = useContext(urlContext);
    const {setToken} = useContext(loginContext);
  const {setRoute} = useContext(routeContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'username is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${url}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json();
        console.log(error.message);
        
        toast.error(`Signup failed. ${error.message}`);
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(data);
      
      const { authToken } = data;
      Cookies.set('authToken', authToken, { expires: 7 });
      // Save token in cookies
      setToken(authToken)// Expires in 7 days

      // Show success toast
      toast.success('Signup successful!');
    } catch (error) {
      console.error('Error:', error);
    }
    setIsSubmitted(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-dark-background">
      <h2 className="text-3xl font-bold text-light-text mb-6 text-center">Register</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className='p-8 w-full'>
        <div className="space-y-4 ">
          <div>
            <label
              className="block text-light-text mb-2"
              htmlFor="name"
            >
              User name
            </label>
            <input
              className="w-full p-3 bg-dark-surface text-light-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary-text"
              type="text"
              placeholder="Corey Barker"
              required
              id="username" 
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
          </div>
          <div>
            <label
              className="block text-light-text mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              name="email"
              id="email"
              className="w-full p-3 bg-dark-surface text-light-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary-text"
              type="email"
              placeholder="corybarker@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label
              className="block text-light-text mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full p-3 bg-dark-surface text-light-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary-text"
              type="password"
              autoComplete="on"
              placeholder="••••••••"
              required
              id="password" 
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-light-text mb-2">Password Confirmation</label>
            <input 
            id="passwordConfirmation" 
            type="password" 
            value={formData.passwordConfirmation}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full p-3 bg-dark-surface text-light-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary-text"
            />
            {errors.passwordConfirmation && <p className="text-red-500">{errors.passwordConfirmation}</p>}
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <button type='submit' className="w-full bg-dark-surface text-light-surface p-3 rounded-md font-semibold hover:bg-opacity-90">
          {isSubmitted ? "loading":"Submit"} 
          </button>
        </div>
      </form>


      {/* Bottom link */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          <button
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
            onClick={()=>setRoute('login')}
          >
            Login
          </button>
        </p>
      </div>
      <Toaster/>
    </div>
   
  );
}

export default SignupForm;

