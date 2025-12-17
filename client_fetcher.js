const API_URL = "http://localhost:5000/";

const fetchAllBooksPromise = () => {
    console.log("--- Method 1: Fetching Books using Promises (.then) ---");
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok && response.status !== 300) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Success (Promise Callback): Book count:", Object.keys(data).length);
        })
        .catch(error => {
            console.error("Error fetching books (Promise Callback):", error.message);
        });
};

const fetchBookByISBNPromise = (isbn) => {
    console.log(`\n--- Method 3: Fetching Book by ISBN (${isbn}) using Promises (.then) ---`);
    const url = `${API_URL}isbn/${isbn}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok && response.status !== 300) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Success (ISBN Promise): Title - ${data.title}, Author - ${data.author}`);
        })
        .catch(error => {
            console.error(`Error fetching book by ISBN (${isbn}):`, error.message);
        });
};

const fetchBookByAuthorPromise = (author) => {
    console.log(`\n--- Method 4: Fetching Books by Author (${author}) using Promises (.then) ---`);
    const url = `${API_URL}author/${author}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok && response.status !== 300) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const bookCount = Object.keys(data).length;
            console.log(`Success (Author Promise): Found ${bookCount} books by author.`);
        })
        .catch(error => {
            console.error(`Error fetching books by Author (${author}):`, error.message);
        });
};

const fetchBookByTitlePromise = (title) => {
    console.log(`\n--- Method 5: Fetching Books by Title (${title}) using Promises (.then) ---`);
    const url = `${API_URL}title/${title}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) { // Title route returns 200 on success (from general.js)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const bookCount = Object.keys(data).length;
            console.log(`Success (Title Promise): Found ${bookCount} books matching title.`);
        })
        .catch(error => {
            console.error(`Error fetching books by Title (${title}):`, error.message);
        });
};

fetchAllBooksPromise();
fetchBookByISBNPromise();
fetchBookByAuthorPromise();
fetchBookByTitlePromise();