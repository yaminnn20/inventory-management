import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import invoiceRoutes from "./routes/invoiceRoutes"; // Ensure this path is correct
import supplierRoutes from "./routes/supplierRoutes"; // Ensure
import orderRoutes from "./routes/orderRoutes"; // Ensure
/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* CORS CONFIGURATION */
app.use(
  cors({
    origin: ["http://localhost:3000", "https://deepgrovee.vercel.app"], // Allow both frontends
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

/* ROUTES */
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users", userRoutes); // http://localhost:8000/users
app.use("/expenses", expenseRoutes); // http://localhost:8000/expenses
app.use("/invoices", invoiceRoutes); // http://localhost:8000/invoices
app.use("/suppliers", supplierRoutes); // http://localhost:8000/suppliers
app.use("/orders", orderRoutes); // http://localhost:8000/suppliers

/* SERVER */
const port = Number(process.env.PORT) || 3001; // Make sure this is set to 8000
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
