import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
const app = express();

app.use(express.json()); //recibimos y enviamos datos en formato JSON
//Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
console.log("Server running");
export default app;
