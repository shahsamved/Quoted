import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore, storage } from './firebase.js';
import { FaEdit } from 'react-icons/fa';
import { MdPerson } from 'react-icons/md';

const UpdateProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [existingProfilePic, setExistingProfilePic] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch the existing user data from Firestore
    const fetchUserData = async () => {
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
          setName(userSnapshot.data().name || '');
          setExistingProfilePic(userSnapshot.data().profilePic || '');
        } else {
          setError('User data not found');
        }
      } catch (error) {
        setError('Error fetching user data');
      }
    };

    fetchUserData();
  }, [router]);

  const handleProfilePicClick = () => {
    // Trigger the hidden file input when the profile pic is clicked
    fileInputRef.current.click();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  useEffect(() => {
    // Fetch the updated user data from Firestore after updating
    const fetchUpdatedUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser && existingProfilePic === '') {
          // Only fetch the updated data if the existingProfilePic is not set (i.e., when the component first loads)
          const userSnapshot = await firestore.collection('users').doc(currentUser.uid).get();
          if (userSnapshot.exists) {
            setExistingProfilePic(userSnapshot.data().profilePic || '');
          }
        }
      } catch (error) {
        console.error('Error fetching updated user data:', error);
      }
    };

    fetchUpdatedUserData();
  }, [existingProfilePic]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        // If the user is not logged in, redirect to the login page
        router.push('/login');
        return;
      }

      const userData = {
        name: name,
        profilePic: existingProfilePic, // Set the existing profile pic
      };

      // Upload profile picture if selected
      if (profilePic) {
        const storageRef = storage.ref(`profile-pics/${currentUser.uid}`);
        const uploadTask = storageRef.put(profilePic);

        // Wait for the upload task to complete
        const snapshot = await uploadTask;

        // Get the download URL for the uploaded profile picture
        const downloadURL = await snapshot.ref.getDownloadURL();
        userData.profilePic = downloadURL;
      }

      await firestore.collection('users').doc(currentUser.uid).update(userData);

      // Redirect to dashboard after successful profile update
      router.push('/dashboard');
    } catch (error) {
      setError('Error updating profile');
    }
  };

  return (
    <div className="update-profile">
      <h3 className="section-title">Update Profile</h3>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <form className="form" onSubmit={handleUpdateProfile}>
          <div className="profile-pic-wrapper">
            {/* Display circular user icon if no profile pic */}
            {!existingProfilePic && (
              <div className="circular-user-icon" onClick={handleProfilePicClick}>
                <MdPerson className="user-icon" />
              </div>
            )}

            {/* Display the existing profile pic or uploaded profile pic */}
            {existingProfilePic && (
              <label htmlFor="profilePicInput" className="profile-pic-label">
                <img src={existingProfilePic} alt="User Profile" className="profile-pic" />
                <div className="profile-pic-overlay">
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
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input"
          />
          <button type="submit" className="button">
            Update Profile
          </button>
        </form>
      )}

      <style jsx>{`
        /* Styles for update-profile page */
        .update-profile {
          max-width: 400px;
          margin: 0 auto;
          margin-top: 20px;
          padding: 20px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .form {
          display: flex;
          flex-direction: column;
        }

        .profile-pic-wrapper {
          position: relative;
          margin-bottom: 20px;
          cursor: pointer;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #f0f0f0;
          overflow: hidden;
        }

        .user-icon {
          font-size: 48px;
          color: #aaa;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .profile-pic {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .edit-icon {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background-color: #0070f3;
          color: #fff;
          font-size: 16px;
          padding: 5px;
          border-radius: 50%;
        }

        .profile-pic-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .profile-pic-label:hover .profile-pic-overlay {
          opacity: 1;
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

export default UpdateProfile;
