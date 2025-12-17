const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            // Check isValid returns true, meaning username is valid and not taken
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login." });
        } else {
            // Check if username is already taken
            const existingUser = users.find(u => u.username === username);
            if (existingUser) {
                return res.status(409).json({ message: "User already exists!" });
            } else {
                return res.status(400).json({ message: "Invalid username format (must not be empty)." });
            }
        }
    }
    return res.status(400).json({ message: "Unable to register. Username and password are required." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(300).json(book);
    } else {
        return res.status(404).json({ message: "Book not found for this ISBN." });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
    const matchingBooks = {};
    const searchAuthorLower = author.toLowerCase();

    // Loop through all books and check the author field
    for (const isbn in books) {
        const bookAuthor = books[isbn].author;
        if (bookAuthor && bookAuthor.toLowerCase().includes(searchAuthorLower)) {
            matchingBooks[isbn] = books[isbn];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(300).json(matchingBooks);
    } else {
        return res.status(404).json({ message: `No books found matching author: ${author}` });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
    const matchingBooks = {};
    const searchTitleLower = title.toLowerCase();

    // Loop through all books and check the title field
    for (const isbn in books) {
        const bookTitle = books[isbn].title;
        if (bookTitle && bookTitle.toLowerCase().includes(searchTitleLower)) {
            matchingBooks[isbn] = books[isbn];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: `No books found matching title: ${title}` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        // Return only the reviews for the specified book
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found for this ISBN." });
    }
});

module.exports.general = public_users;
