const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

const JWT_SECRET = "verysecretkeyforjsonwebtoken";

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if (req.session.authorization) { 
        let token = req.session.authorization['accessToken'];
        
        // 2. Verify the JWT token
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                // If token is valid, the request proceeds
                // Store the decoded user payload on the request object for downstream use.
                req.user = user; 
                next();
            } else {
                // Token is invalid or expired
                return res.status(403).json({ message: "User not authenticated or session expired." });
            }
        });
    } else {
        // No authorization token in session
        return res.status(403).json({ message: "User not logged in." });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
