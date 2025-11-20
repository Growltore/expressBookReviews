const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");

const public_users = express.Router();

// TASK 6 is inside auth_users.js (register), so leave this route unused
public_users.post("/register", (req, res) => {
  return res.status(300).json({ message: "Use /customer/register instead" });
});

// TASK 1 — Get the book list
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// TASK 2 — Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

// TASK 3 — Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = [];

  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  });

  return result.length > 0 ?
    res.status(200).json(result) :
    res.status(404).json({ message: "No books found for this author" });
});

// TASK 4 — Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = [];

  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  });

  return result.length > 0 ?
    res.status(200).json(result) :
    res.status(404).json({ message: "No books found with this title" });
});

// TASK 5 — Get reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return books[isbn] ?
    res.status(200).json(books[isbn].reviews) :
    res.status(404).json({ message: "Book not found" });
});


// -----------------------------
// TASKS 10–13 (Async/Await + Axios)
// -----------------------------

// TASK 10 — async: get all books
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// TASK 11 — async: get book by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(404).json({ message: "Book not found" });
  }
});

// TASK 12 — async: get books by author
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(404).json({ message: "Author not found" });
  }
});

// TASK 13 — async: get books by title
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch {
    return res.status(404).json({ message: "Title not found" });
  }
});

module.exports.general = public_users;
