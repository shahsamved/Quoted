import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore, storage } from './firebase.js';


const QuoteUpload = () => {
  const router = useRouter();

  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);
  const userId = auth.currentUser.uid;

  const handleQuoteUpload = async (e) => {
    e.preventDefault();
    try {
      // Create a new quote document in the "quotes" collection
      const quoteData = {
        quote: quote,
        author: author,
        timestamp: new Date(),
        authorId: userId,
        likes: 0,
      };
  
      const docRef = await firestore.collection('quotes').add(quoteData);
  
      // If profile picture is selected, upload it to storage and update the quote document
      if (profilePic) {
        const storageRef = storage.ref(`quote-pics/${docRef.id}`);
        const uploadTask = storageRef.put(profilePic);
  
        // Wait for the upload task to complete
        const snapshot = await uploadTask;
  
        // Get the download URL for the uploaded profile picture
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log("Download URL");
        console.log(downloadURL);
  
        quoteData.profilePic = downloadURL;
  
        // Update the quote document with the download URL
        await firestore.collection('quotes').doc(docRef.id).set(quoteData);
      }
  
      // Clear the form after successful quote upload
      setQuote('');
      setAuthor('');
      setProfilePic(null);
  
      // Redirect to dashboard after successful quote upload
      router.push('/dashboard');
    } catch (error) {
      console.error('Error uploading quote:', error);
    }
  };
  
  
  

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  return (
    <div className="quote-upload">
      <h3 className="section-title">Upload a Quote</h3>
      <form className="form" onSubmit={handleQuoteUpload}>
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
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          className="input"
        />
        <button type="submit" className="button">
          Upload Quote
        </button>
      </form>

      <style jsx>{`
        .quote-upload {
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
      `}</style>
    </div>
  );
};

export default QuoteUpload;