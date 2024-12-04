// src/components/Signup.jsx
import React, { useContext, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../firebaseConfig';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const sanitizedEmail = email.replace(/[.@]/g, '_'); // Replace '.' and '@' with '_'

      // Save user data to Firebase Realtime Database
      await set(ref(database, `users/${sanitizedEmail}`), {
        uid: userCredential.user.uid,
        email,
      });
      navigate('/settings');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'mytheme' ? 'bg-gray-100' : 'bg-gray-800'}`}>
      <form
        onSubmit={handleSignup}
        className={`${theme === 'mytheme' ? 'bg-white' : 'bg-zinc-900'} p-6 rounded shadow-md w-full max-w-sm`}>
        <h2 className={`text-2xl mb-4 ${theme === 'mytheme' ? '#333' : '#BEBEBE'}`}>Create an Account</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full bg-white border px-3 py-2 rounded text-black"
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
            className="w-full bg-white border px-3 py-2 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-500 underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
