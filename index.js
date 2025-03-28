const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path=require("path")
const { connection } = require("./Config/db");
const { userRouter } = require("./routes/authRoutes");
const { videoRouter } = require("./routes/videoRoutes");
// const { videoRouter } = require("./routes/videoRoutes");

const PORT = process.env.PORT;

const app = express();

// Middleware
app.use(cors());

app.use(express.json());  // <-- Add this line to parse JSON bodies!
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/users", userRouter);
app.use("/videos", videoRouter);


app.get("/", async (req, res) => {
    res.setHeader("Content-type", "text/html");
    res.send("<h1>Welcome to the Video Management Application server</h1>");
});

app.listen(PORT, async () => {
    try {
      await connection;
      console.log("You are connected to Video Management Application");
      console.log(`Server is running on Port: ${PORT}`);
    } catch (err) {
      console.log(err.message);
    }
});
