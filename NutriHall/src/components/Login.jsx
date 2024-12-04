import React, { useContext, useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false); // State to toggle reset form
  const [resetEmail, setResetEmail] = useState('');
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/record-meal');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Password reset email sent! Please check your inbox.');
      setIsResettingPassword(false); // Close the reset form after successful submission
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-${theme === 'mytheme' ? 'gray-100' : 'gray-800'}`}>
      <form
        onSubmit={isResettingPassword ? handlePasswordReset : handleLogin}
        className={`p-6 rounded shadow-md w-full max-w-sm ${theme === 'mytheme' ? 'bg-white' : 'bg-zinc-900'}`}
      >
        <h2 className="text-2xl mb-4">{isResettingPassword ? 'Reset Password' : 'Login'}</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        
        {!isResettingPassword ? (
          <>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="w-full bg-white border px-3 py-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-white border px-3 py-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
            <p className="mt-4 text-center">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-blue-500 underline"
              >
                Sign Up
              </button>
            </p>
            <p className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setIsResettingPassword(true)}
                className="text-blue-500 underline"
              >
                Forgot Password?
              </button>
            </p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block mb-1">Enter your email</label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Reset Password
            </button>
            <p className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsResettingPassword(false)}
                className="text-blue-500 underline"
              >
                Back to Login
              </button>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
