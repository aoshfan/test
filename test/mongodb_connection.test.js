const mongoose = require("mongoose");
const mongooseMock = require("mongoose-mock");

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

describe("Book Schema", () => {
  beforeAll(() => {
    // Mock the Mongoose connection
    mongoose.connect = mongooseMock.connect;
  });

  afterAll(() => {
    // Close the Mongoose connection
    mongoose.disconnect();
  });

  test("should create a book with valid data", () => {
    // Define the book data
    const bookData = {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      pages: 180,
      rating: 4.5,
    };

    // Create a new book
    const Book = mongoose.model("Book", bookSchema);
    const book = new Book(bookData);

    // Validate the book
    expect(book.title).toBe(bookData.title);
    expect(book.author).toBe(bookData.author);
    expect(book.genre).toBe(bookData.genre);
    expect(book.pages).toBe(bookData.pages);
    expect(book.rating).toBe(bookData.rating);
    expect(book.published).toBeInstanceOf(Date);
  });
});
