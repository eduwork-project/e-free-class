const express = require("express");
const app = express();

const helloRouter = require("./routes/hello");

app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});
app.get(
  "/",
  (req, res, next) => {
    console.log("midleware root path triggered");
    next();
  },
  (req, res) => {
    if (req.query.id === '0') {
      next("id empty");
      return;
    }
    res.send("hello world");
  }
);
app.use("/hello", helloRouter);
app.use((req, res, next) => {
  res.status(404).send("page not avail");
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("error occured");
});

app.listen(3000, () => {
  console.log("app is running!");
});
