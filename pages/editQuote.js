import { firestore, storage } from './firebase.js';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { FaEdit } from 'react-icons/fa';
import { MdPerson } from 'react-icons/md';

const EditQuote = () => {
  const router = useRouter();
  const { id, userId } = router.query;

  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [existingProfilePic, setExistingProfilePic] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch the existing quote data from Firestore
    const fetchQuoteData = async () => {
      try {
        const quoteSnapshot = await firestore.collection('quotes').doc(id).get();
        if (quoteSnapshot.exists) {
          const quoteData = quoteSnapshot.data();
          console.log(quoteData);
          setQuote(quoteData.quote || '');
          setAuthor(quoteData.author || '');
          setExistingProfilePic(quoteData.profilePic || '');
        } else {
          setError('Quote not found');
        }
      } catch (error) {
        setError('Error fetching quote data');
      }
    };

    if (id) {
      fetchQuoteData();
    }
  }, [id]);

  const handleProfilePicClick = () => {
    // Trigger the hidden file input when the profile pic is clicked
    fileInputRef.current.click();
  };

  useEffect(() => {
    // Fetch the updated quote data from Firestore after updating
    const fetchUpdatedQuoteData = async () => {
      try {
        const quoteSnapshot = await firestore.collection('quotes').doc(id).get();
        if (quoteSnapshot.exists) {
          const quoteData = quoteSnapshot.data();
          setExistingProfilePic(quoteData.profilePic || '');
        }
      } catch (error) {
        console.error('Error fetching updated quote data:', error);
      }
    };

    if (id && existingProfilePic === '') {
      // Only fetch the updated data if the existingProfilePic is not set (i.e., when the component first loads)
      fetchUpdatedQuoteData();
    }
  }, [id, existingProfilePic]);

  const handleQuoteUpdate = async (e) => {
    e.preventDefault();
    try {
      // Fetch the existing quote data from Firestore
      const quoteSnapshot = await firestore.collection('quotes').doc(id).get();
      const existingQuoteData = quoteSnapshot.data();
      const quoteData = {
        quote: quote,
        author: author,
        timestamp: new Date(),
        likes: existingQuoteData.likes || 0, // Use existing likes field or default to 0
        profilePic: existingProfilePic, // Set the existing profile pic
      };

      // Upload profile picture if selected
      if (profilePic) {
        const storageRef = storage.ref(`quote-pics/${id}`);
        const uploadTask = storageRef.put(profilePic);

        // Wait for the upload task to complete
        const snapshot = await uploadTask;

        // Get the download URL for the uploaded profile picture
        const downloadURL = await snapshot.ref.getDownloadURL();
        quoteData.authorProfilePic = downloadURL;
      }

      await firestore.collection('quotes').doc(id).set(quoteData);

      // Redirect back to dashboard with userId as a query parameter
      router.push(`/dashboard?userId=${userId}`);
    } catch (error) {
      setError('Error updating quote');
    }
  };
  

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  return (
    <div className="edit-quote">
      <h3 className="section-title">Edit Quote</h3>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <form className="form" onSubmit={handleQuoteUpdate}>
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
                <img
                  src={existingProfilePic}
                  alt="Author Profile"
                  className="profile-pic"
                />
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

          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Enter the quote"
            className="input"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="input"
          />
          <button type="submit" className="button">
            Update Quote
          </button>
        </form>
      )}

      <style jsx>{`   .edit-quote {
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
        }`}</style>
    </div>
  );
};

export default EditQuote;
