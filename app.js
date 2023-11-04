require("dotenv").config();
const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;
const Router = require("./routes/post.router");

app.get("/", (req, res) => {
    return res.json({
      status: true,
      message: "Hello World!",
      error: null,
      data: null,
    });
  });


app.use(express.json());
app.use("/api/v1", Router);

app.listen(PORT, () => console.log("Listening on port", PORT));
