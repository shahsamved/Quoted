import { useState, useEffect } from 'react';
import { auth, firestore, storage } from './firebase.js';
import { useRouter } from 'next/router';
import { FaEdit } from 'react-icons/fa';
import { MdPerson } from 'react-icons/md';

const profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          // If the user is not logged in, redirect to the login page
          router.push('/login');
          return;
        }

        const userSnapshot = await firestore.collection('users').doc(currentUser.uid).get();
        if (userSnapshot.exists) {
          setUser(userSnapshot.data());
          setName(userSnapshot.data().name);
        }
      } catch (error) {
        setError('Error retrieving user data');
      }
    };

    getUserData();
  }, [router]);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Fetch the profile picture from storage if it exists
          const storageRef = storage.ref(`profile-pics/${currentUser.uid}`);
          const downloadURL = await storageRef.getDownloadURL();
          setProfilePic(downloadURL);
        }
      } catch (error) {
        // If there's an error fetching the profile picture, set it to null
        setProfilePic(null);
      }
    };

    fetchProfilePic();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        // If the user is not logged in, redirect to the login page
        router.push('/login');
        return;
      }

      await firestore.collection('users').doc(currentUser.uid).update({
        name: name,
      });

      if (profilePic) {
        const storageRef = storage.ref(`profile-pics/${currentUser.uid}`);
        await storageRef.put(profilePic);
      }

      // Refresh the user data after updating
      const userSnapshot = await firestore.collection('users').doc(currentUser.uid).get();
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
          <div className="profile-pic-wrapper">
            {/* Display circular user icon if no profile pic */}
            {!profilePic && (
              <div className="circular-user-icon" onClick={handleProfilePicClick}>
                <MdPerson className="user-icon" />
              </div>
            )}

            {/* Display the existing profile pic or uploaded profile pic */}
            {profilePic && (
              <label htmlFor="profilePicInput" className="profile-pic-label">
                <img src={profilePic} alt="Author Profile" className="profile-pic" />
                <div className="edit-icon-overlay">
                  <FaEdit className="edit-icon" />
                </div>
              </label>
            )}

            {/* Hidden input for uploading profile pic */}
            <input
              type="file"
              accept="image/*"
              id="profilePicInput"
              onChange={handleProfilePicChange}
              style={{ display: 'none' }} // Hide the file input
            />
          </div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" />
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

        .profile-pic-wrapper {
          position: relative;
          margin-bottom: 20px;
          cursor: pointer;
        }

        .profile-pic-label {
          display: inline-block;
          position: relative;
        }

        .profile-pic {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }

        .edit-icon-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .profile-pic-label:hover .edit-icon-overlay {
          opacity: 1;
        }

        .edit-icon {
          color: #fff;
          font-size: 24px;
          cursor: pointer;
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
