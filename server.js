const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const post = require("./routes/api/post");
const user = require("./routes/api/user");
const profile = require("./routes/api/profile");

const app = express();

// db
const db = require("./config/keys").mongo;

// local
// const localdb = require("./config/keys").local;
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongo setup
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log(err));

// passport
app.use(passport.initialize());
require("./config/passport")(passport);

//routes
app.use("/api/post", post);
app.use("/api/users", user);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started at port ${port}`));
