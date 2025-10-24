import express from "express";
import dotenv from "dotenv";
import jwtRouter from "./routes/jwt-way.routes.js";
import sessionRouter from "./routes/session-way.routes.js";
import session from "express-session";

dotenv.config({ path: "./.env.local" });

const PORT = process.env.PORT || 3000;

const app = express();

//parse JSOn bodies

app.use(express.json());
//session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 5, // 5 minutes
        sameSite: "lax",
        secure: false
    }
}))

// // pull in routes
app.use("/jwt-way", jwtRouter);
app.use("/session-way", sessionRouter);


app.get("/", (req, res) => {
    res.send("Hello World!");
})

//listen to port 3000
app.listen(PORT, () => {
    console.log("Server is running on port 3000!");
});


