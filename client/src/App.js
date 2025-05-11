import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Library from './pages/Library';
import AddBook from './pages/AddBook';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Library</Link>
            </li>
            <li>
              <Link to="/add">Add Book</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/add" element={<AddBook />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;