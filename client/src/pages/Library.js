import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Library.css';

function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBookId, setExpandedBookId] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/books');
        setBooks(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDeleteBook = async (id) => {
    try {
      console.log(`Attempting to delete book with ID: ${id}`);
      await axios.delete(`http://localhost:5000/books/${id}`);
      // Update state to remove the deleted book
      setBooks(prevBooks => prevBooks.filter(book => book._id !== id));
      setExpandedBookId(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error || 'Failed to delete book');
    }
  };

  const toggleBookDetails = (id) => {
    setExpandedBookId(expandedBookId === id ? null : id);
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="library-container">
      <h1 className="library-title">My Library</h1>
      <Link to="/add" className="add-book-button">Add New Book</Link>
      <div className="book-list-container">
        {books.length === 0 ? (
          <div className="empty-library">Your library is empty. Add some books!</div>
        ) : (
          books.map(book => (
            <div key={book._id} className="book-item">
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <button
                  className="view-details-button"
                  onClick={() => toggleBookDetails(book._id)}
                >
                  {expandedBookId === book._id ? 'Hide Details' : 'View Details'}
                </button>
                {expandedBookId === book._id && (
                  <div className="expanded-details">
                    <p>Genre: {book.genre || 'N/A'}</p>
                    <p>Publication Year: {book.publicationYear || 'N/A'}</p>
                    <p>Pages: {book.pages || 'N/A'}</p>
                    <p>Status: {book.status || 'N/A'}</p>
                  </div>
                )}
              </div>
              <button onClick={() => handleDeleteBook(book._id)} className="delete-book-button">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Library;