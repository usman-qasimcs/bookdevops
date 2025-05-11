const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: String,
    publicationYear: Number,
    pages: Number,
    status: {
        type: String,
        enum: ['To Read', 'Currently Reading', 'Finished Reading'],
        default: 'To Read',
    },
});

const Book = mongoose.model('Book', bookSchema);

// --- API Endpoints ---

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get books', details: err.message });
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get book', details: err.message });
    }
});

app.post('/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ error: 'Failed to add book', details: err.message });
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update book', details: err.message });
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid MongoDB ID format:', id);
            return res.status(400).json({ error: 'Invalid book ID format' });
        }
        
        console.log(`Attempting to delete book with ID: ${id}`);
        
        const deletedBook = await Book.findByIdAndDelete(id);
        
        if (!deletedBook) {
            console.log('Book not found for deletion');
            return res.status(404).json({ error: 'Book not found' });
        }
        
        console.log('Book deleted successfully:', deletedBook._id);
        return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Error deleting book:', err);
        return res.status(500).json({ error: 'Failed to delete book', details: err.message });
    }
});

app.patch('/books/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['To Read', 'Currently Reading', 'Finished Reading'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (err) {
         res.status(400).json({ error: 'Failed to update book status', details: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));