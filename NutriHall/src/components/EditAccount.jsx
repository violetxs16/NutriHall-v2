// src/components/EditAccount.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Inside EditAccount component
const storage = getStorage();

const handlePhotoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileRef = storageRef(storage, `profilePictures/${user.uid}/${file.name}`);
  uploadBytes(fileRef, file)
    .then(() => getDownloadURL(fileRef))
    .then((url) => {
      setAccountInfo((prev) => ({ ...prev, photoURL: url }));
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
    });
};


const EditAccount = () => {
  const [accountInfo, setAccountInfo] = useState({
    name: '',
    sex: 'other',
    height: '',
    weight: '',
    photoURL: '',
  });

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const accountRef = ref(database, `users/${user.uid}/accountInfo`);
      onValue(accountRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAccountInfo(data);
        }
      });
    }
  }, [user]);

  const handleSave = () => {
    const accountRef = ref(database, `users/${user.uid}/accountInfo`);
    set(accountRef, accountInfo)
      .then(() => {
        // Update Firebase Auth profile
        updateProfile(user, {
          displayName: accountInfo.name,
          photoURL: accountInfo.photoURL,
        })
          .then(() => {
            alert('Account information updated!');
          })
          .catch((error) => {
            console.error('Error updating profile:', error);
          });
      })
      .catch((error) => {
        console.error('Error saving account info:', error);
      });
  };

  const handleChange = (e) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    // Handle photo upload here (e.g., using Firebase Storage)
    // For simplicity, we'll assume the user enters a photo URL
    setAccountInfo({ ...accountInfo, photoURL: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Edit Account</h2>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={accountInfo.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Sex</label>
        <select
          name="sex"
          value={accountInfo.sex}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Height (cm)</label>
        <input
          type="number"
          name="height"
          value={accountInfo.height}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Weight (kg)</label>
        <input
          type="number"
          name="weight"
          value={accountInfo.weight}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>


      <div className="mb-4">
        <label className="block mb-1">Age</label>
        <input
            type="number"
            name="age"
            value={accountInfo.age || ''}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
        />
      </div>


      <div className="mb-4">
        <label className="block mb-1">Profile Picture</label>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      </div>


      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditAccount;
