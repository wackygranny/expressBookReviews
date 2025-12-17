const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Object.keys(books).length > 0) {
                resolve(books);
            } else {
                reject(new Error("No books found."));
            }
        }, 100);
    });
};

const getBooksByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found for this ISBN."));
            }
        }, 100);
    });
};

const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchingBooks = {};
            const searchAuthorLower = author.toLowerCase();
            
            for (const isbn in books) {
                const bookAuthor = books[isbn].author;
                if (bookAuthor && bookAuthor.toLowerCase().includes(searchAuthorLower)) {
                    matchingBooks[isbn] = books[isbn];
                }
            }

            if (Object.keys(matchingBooks).length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error(`No books found matching author: ${author}`));
            }
        }, 100);
    });
};

const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const matchingBooks = {};
            const searchTitleLower = title.toLowerCase();
            
            for (const isbn in books) {
                const bookTitle = books[isbn].title;
                if (bookTitle && bookTitle.toLowerCase().includes(searchTitleLower)) {
                    matchingBooks[isbn] = books[isbn];
                }
            }

            if (Object.keys(matchingBooks).length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error(`No books found matching title: ${title}`));
            }
        }, 100);
    });
};

const getBookReviews = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book.reviews);
            } else {
                reject(new Error("Book not found for this ISBN."));
            }
        }, 100);
    });
};


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login." });
        } else {
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

public_users.get('/',function (req, res) {
    getBooks()
        .then(bookList => {
            return res.status(300).json(bookList);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error retrieving book list." });
        });
});

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    getBooksByISBN(isbn)
        .then(book => {
            return res.status(300).json(book);
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        });
});
 
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    getBooksByAuthor(author)
        .then(matchingBooks => {
            return res.status(300).json(matchingBooks);
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        });
});

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    getBooksByTitle(title)
        .then(matchingBooks => {
            return res.status(200).json(matchingBooks);
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        });
});

public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    // Using the new promise helper for consistency
    getBookReviews(isbn)
        .then(reviews => {
            return res.status(200).json(reviews);
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        });
});

module.exports.general = public_users;