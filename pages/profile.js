import { useState, useEffect } from 'react';
import { auth, firestore, storage } from './firebase.js';
import { useRouter } from 'next/router';

const profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userSnapshot = await firestore
          .collection('users')
          .doc(auth.currentUser.uid)
          .get();

        if (userSnapshot.exists) {
          setUser(userSnapshot.data());
          setName(userSnapshot.data().name);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await firestore.collection('users').doc(auth.currentUser.uid).update({
        name: name,
      });

      if (profilePic) {
        const storageRef = storage.ref(`profile-pics/${auth.currentUser.uid}`);
        await storageRef.put(profilePic);
      }

      // Refresh the user data after updating
      const userSnapshot = await firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .get();

      if (userSnapshot.exists) {
        setUser(userSnapshot.data());
      }

      // Navigate back to the dashboard page after successful profile update
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  return (
    <div className="container">
      <h2 className="title">User Profile</h2>
      {user && (
        <form className="form" onSubmit={handleUpdateProfile}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="input"
          />
          <button type="submit" className="button">
            Update Profile
          </button>
        </form>
      )}
      {error && <p className="error">{error}</p>}

      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
        }

        .input {
          margin-bottom: 10px;
          padding: 10px;
          font-size: 16px;
        }

        .button {
          padding: 10px;
          background-color: #0070f3;
          color: #fff;
          font-size: 16px;
          border: none;
          cursor: pointer;
        }

        .error {
          color: red;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default profile;
