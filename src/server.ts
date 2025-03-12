// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { notFound } from "./controllers/notFoundController";
import snippetRoutes from "./routes/snippetRoutes";
import { helloMiddleware } from "./middleware/exampleMiddleware";
import mongoose from "mongoose";
import { getDashboard } from "./controllers/dashboardController";

// Variables
const app = express();
const PORT = process.env.PORT || 3000;

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/dashboard', getDashboard);
app.use("/api", helloMiddleware, snippetRoutes);
app.all("*", notFound);

// Database connection
try {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Database connection OK");
} catch (err) {
  console.error(err);
  process.exit(1);
}

// Server Listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}! 🚀`);
});
