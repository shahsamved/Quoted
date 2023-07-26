import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore, storage } from './firebase.js';

const RegisterPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Store additional user data in Firestore
      const userData = {
        email: email,
        name: name,
        //password: password,
      };

      // Upload profile picture if selected
      if (profilePic) {
        // Create a reference to the storage location
        const storageRef = storage.ref(`profile-pics/${userCredential.user.uid}`);

        // Upload the profile picture file to storage
        const snapshot = await storageRef.put(profilePic);

        // Get the download URL for the uploaded profile picture
        const downloadURL = await snapshot.ref.getDownloadURL();

        // Add the download URL to the userData object
        userData.profilePic = downloadURL;
      }

      await firestore.collection('users').doc(userCredential.user.uid).set(userData);

      // Redirect or perform additional actions upon successful registration
      router.push('/dashboard'); // Example: Redirect to dashboard page
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
      <h2 className="title">Register</h2>
      <form className="form" onSubmit={handleRegister}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input"
        />
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
          Register
        </button>
      </form>
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

export default RegisterPage;
