const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const JWT_SECRET = "verysecretkeyforjsonwebtoken";

const isValid = (username)=>{ //returns boolean
    return (username && users.filter((user) => user.username === username).length === 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const matchingUsers = users.filter((user) => user.username === username && user.password === password);
        return matchingUsers.length > 0;
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in: Username and Password required." });
    }

    if (authenticatedUser(username, password)) {
        // 1. Generate JWT with the username as data
        let token = jwt.sign({ data: username }, JWT_SECRET, { expiresIn: '1h' });

        // 2. Store the token and username in the session
        req.session.authorization = {
            accessToken: token,
            username: username
        };
        
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
    // Review content from query parameter
    const review = req.query.review; 
    
    // The username is stored in the session by the /login route
    const username = req.session.authorization.username; 

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content is required." });
    }

    const bookReviews = books[isbn].reviews;
    let action = "added";

    // Check if the user already reviewed the book (for modification)
    if (bookReviews[username]) {
        action = "modified";
    }
    
    // Add new review or overwrite existing one
    bookReviews[username] = review;

    return res.status(200).json({ message: `Review for ISBN ${isbn} by user ${username} ${action} successfully.` });
});

// Delete a book review (DELETE /auth/review/:isbn)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    // The username is stored in the session by the /login route
    const username = req.session.authorization.username; 

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    const bookReviews = books[isbn].reviews;

    // Check if the user has a review to delete (only their own)
    if (bookReviews[username]) {
        delete bookReviews[username];
        return res.status(200).json({ message: `Review for ISBN ${isbn} by user ${username} deleted successfully.` });
    } else {
        return res.status(404).json({ message: `No review found for ISBN ${isbn} by user ${username}.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
