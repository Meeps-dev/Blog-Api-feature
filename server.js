const express = require("express");
const userRouter = require("./routes/users/userRoutes");
const postRouter = require("./routes/posts/postRoutes");
const commentRouter = require("./routes/comments/commentRoutes");
const categoryRouter = require("./routes/categories/categoryRoutes");
const globalErrHandler = require("./middleware/globalErrorHandler");
const isAdmin = require("./middleware/isAdmin");
const Post = require("./model/Post/Post");

require("dotenv").config();
require("./config/dbConnect");

const app = express();

//middlewares

app.use(express.json()); //pass incoming payload
//routes
//-----
//Home route

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    res.json(error);
  }
});

app.use(isAdmin);
// const userAuth = {
//   isLogin: true,
//   isAdmin: false,
// };

// app.use((req, res, next) => {
//   if (userAuth.isLogin) {
//     next();
//   } else {
//     return res.json({
//       msg: " login credentials",
//     });
//   }
// });
//----
//routes
//---

//users route
app.use("/api/v1/users", userRouter);

//GET/api/v1/users
// app.get("/api/v1/users", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "all user route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

//DELETE/api/v1/users/:id
// app.delete("/api/v1/users/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "delete user route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

//PUT/api/v1/users/:id
// app.put("/api/v1/users/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "update user route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

//--------
//posts route
//---------
app.use("/api/v1/posts", postRouter);

//POST/api/v1/posts

// app.post("/api/v1/posts", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "post created",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

// //GET/api/v1/posts/:id
// app.get("/api/v1/posts/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "post route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

// //GET/api/v1/posts
// app.get("/api/v1/posts", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "posts route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

// //DELETE/api/v1/posts/:id
// app.delete("/api/v1/posts/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "delete post route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

// //PUT/api/v1/users/:id
// app.put("/api/v1/posts/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "update post route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

//----------
//comment route
//----------

app.use("/api/v1/comments", commentRouter);
//POST/api/v1/comments
// app.post("/api/v1/comments", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "comment created",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

// //GET/api/v1/comments/:id
// app.get("/api/v1/comments/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "comment route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

// //DELETE/api/v1/comments/:id
// app.delete("/api/v1/comments/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "delete comment route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

// //PUT/api/v1/comments/:id
// app.put("/api/v1/comments/:id", async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "update comment route",
//     });
//   } catch (error) {
//     res.json(error.message);
//   }
// });

//---------
//categories route
//---------

//POST/api/v1/categories

app.use("/api/v1/categories", categoryRouter);
// app.post("/api/v1/categories", async (req, res) => {

// Error handlers middleware
app.use(globalErrHandler);

//404 error
app.use("*", (req, res) => {
  console.log(req.originalUrl);
  res.status(404).json({
    message: `${req.originalUrl} - Route Not Found`,
  });
});

//Listen to server
const PORT = process.env.port || 9000;

app.listen(PORT, console.log(`server is up and running on ${PORT}`));
