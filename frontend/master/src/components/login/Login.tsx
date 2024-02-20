import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import axiosInstance from '../../config/axiosInstance';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { isAuthenticated, login } = useAuthStore();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/loginAdmin', {
        email,
        password,
      });

      if (response.status === 200) {
        const data = await response.data;
        login(email, password);

        
        window.location.href = '/';
      } else {
       
        setErrorMessage('Invalid login credentials');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-4 flex justify-center">Login Page</h1>
        {isAuthenticated ? (
          <p>You are already logged in.</p>
        ) : (
          <div className=' border border-black px-4 py-8 rounded-md w-[50vh]'>
          <>
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block border rounded-md w-full p-2 my-2"
            />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block border rounded-md w-full p-2 my-2"
            />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white w-[15vh] py-1 my-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
            <p className=' text-sm my-1 cursor-pointer'>Forgot Password?</p>
          </>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
