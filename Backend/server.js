const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");



//IMPORTING TASK ROUTES
const task = require("./routes/taskRoutes.js")

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Task Manager API is running...");
});


//TASK ROUTE
app.use("/api/task", task)


app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
