const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5001;
const url = "mongodb://localhost:27017/instagram";

require("./models/user");
require("./models/post");

// mongoose.connect(url, function(err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     db.close();
//   });
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongo db");
});
mongoose.connection.on("error", () => {
  console.log("Error connected to mongo db");
});
mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// const customMiddleware = (req, res, next) => {
//   console.log("middleware executed!!");
//   next();
// };

// app.use(customMiddleware)

app.get("/", (req, res) => {
  res.send("hello world");
 });
// app.get("/about", customMiddleware, (req, res) => {
//   res.send("about world");
// });

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
