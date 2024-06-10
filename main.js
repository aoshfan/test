const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static('public'));

// eslint-disable-next-line no-undef,no-unused-vars
// var bar = a + 1;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/book-db",
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}
connectToMongoDB();

// Define the book schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  published: {
    type: Date,
    default: Date.now,
  },
  genre: {
    type: String,
    enum: ["Fiction", "Non-Fiction", "Biography", "Mystery", "Romance"],
  },
  pages: {
    type: Number,
    min: 1,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

// Define a route for the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Create the Book model
const Book = mongoose.model("Book", bookSchema);

// Create a new book
app.post("/books", async (req, res) => {
  const { title, author, genre, pages, rating } = req.body;
  const book = new Book({ title, author, genre, pages, rating });
  await book.save();
  res.status(201).json(book);
});

// Read all books
app.get("/books", async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

// Read a specific book
app.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

// Update a book
app.put("/books/:id", async (req, res) => {
  const { title, author, genre, pages, rating } = req.body;
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { title, author, genre, pages, rating },
    { new: true, runValidators: true },
  );
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json({ message: "Book deleted" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
