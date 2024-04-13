const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressSession = require("express-session");
require("dotenv").config();

const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");
const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");
const { authenticateJWT } = require("./middlewares/authenticateJWT");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(
//   expressSession({
//     resave: false,
//     saveUninitialized: false,
//     // access local environment variables
//     secret: process.env.SESSION_SECRET,
//   })
// );

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/post", postRouter);
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
