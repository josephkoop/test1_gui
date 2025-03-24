//app.js

import express from "express";
import path from "path";
import taskRoutes from './routes/taskRoutes.js'

const app = express();

// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images) from the "public" directory
app.use(express.static(path.join(process.cwd(), "public")));

// Set up EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Logging middleware to print requests with timestamps
const loggingMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};

app.use(loggingMiddleware);

// Use task-related routes defined in "taskRoutes.js"
app.use("/", taskRoutes);

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).send("404 Not Found.\n");
});

// Start the server on port 3006
const PORT = 3006;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
