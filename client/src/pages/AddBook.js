import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { bookApi } from '../api';
import './AddBook.css';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [pages, setPages] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      setError('Title and Author are required');
      return;
    }

    try {
      const newBook = {
        title,
        author,
        genre,
        publicationYear: parseInt(publicationYear),
        pages: parseInt(pages),
      };
      await bookApi.createBook(newBook);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add book');
    }
  };

  return (
    <div className="add-book-container">
      <h1 className="add-book-title">Add New Book</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="publicationYear">Publication Year:</label>
          <input
            type="number"
            id="publicationYear"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pages">Pages:</label>
          <input
            type="number"
            id="pages"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />
        </div>
        <button type="submit" className="add-book-button">Add Book</button>
        <button type="button" onClick={() => navigate('/')} className="cancel-button">Cancel</button>
      </form>
    </div>
  );
}

export default AddBook;