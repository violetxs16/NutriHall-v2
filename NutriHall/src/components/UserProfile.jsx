// src/components/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeData;

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}/accountInfo`);
        unsubscribeData = onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserData(data);
        });
      } else {
        setUserData(null);
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeData) unsubscribeData();
    };
  }, []);

  if (!userData) return null;

  return (
    <div className="flex items-center space-x-2">
      <img
        src={userData.photoURL || '/default-profile.png'}
        alt="Profile"
        className="w-8 h-8 rounded-full"
      />
      <span>{userData.name || 'User'}</span>
    </div>
  );
};

export default UserProfile;
