const mongoose = require("mongoose");
const Post = require("../Post/Post");

//create schema
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
    },
    profilephoto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Edit"],
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // plan: {
    //   type: String,
    //   enum: ["Free", "Premium", "Pro"],
    //   default: "Free",
    // },

    userAward: {
      type: String,
      enum: ["Bronze", "Silver", "Gold"],
      default: "Bronze",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//Hooks
//pre-before record is saved
userSchema.pre("findOne", async function (next) {
  //populate the post
  this.populate({
    path: "posts",
  });
  //get the user  id
  const userId = this._conditions._id;
  //find the post created by user
  const posts = await Post.find({ user: userId });
  //get the last post created by the user
  const lastPost = posts[posts.length - 1];
  // get the last post date
  const lastPostDate = new Date("2024-08-23T06:52:11.737Z"); // Replace with your actual date string
  // console.log(lastPostDate);

  // get the last post date in string format
  const lastPostDateStr = lastPostDate.toDateString();

  //add virtuals to the schema

  userSchema.virtual("lastPostDate").get(function () {
    return lastPostDateStr;
  });

  // ----------Check if user is inactive for 30days--------------
  //get current date
  const currentDate = new Date();
  //get the difference between the last post date and current date
  const diff = currentDate - lastPostDate;
  //get the difference in days and return less than in days
  const diffInDays = diff / (1000 * 3600 * 24);

  if (diffInDays > 30) {
    //Add virtuals isInactive to the schema to che3ck if a user is inactive for 30days
    userSchema.virtual("isInactive").get(function () {
      return true;
    });
    //Find user by id and update
    await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
  } else {
    userSchema.virtual("isInactive").get(function () {
      return false;
    });
    //Find user by id and update
    await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
  }

  //--------Last Active Date---------------

  //convert to days ago, for example 1 day ago
  const daysAgo = Math.floor(diffInDays);
  //add virtuals lastActive in days to the schema
  userSchema.virtual("lastActive").get(function () {
    //check if days ago is less than 0
    if (daysAgo <= 0) {
      return "Today";
    }
    //check if daysAgo is greater than 1
    if (daysAgo > 1) {
      return `${daysAgo} days ago `;
    }
  });

  //-----------------------------
  //Update userAward based on the nuber of posts
  //------------------------------
  //get the number of posts
  const numberOfPosts = posts.length;
  //check if number of post is less than 10
  if (numberOfPosts < 10) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Bronze",
      },
      {
        new: true,
      }
    );
  }
  //check if the number of posts is greater than 10
  if (numberOfPosts > 10) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Silver",
      },
      {
        new: true,
      }
    );
  }
  //check if the number of posts is greater than 20
  if (numberOfPosts > 20) {
    await User.findByIdAndUpdate(
      userId,
      {
        userAward: "Gold",
      },
      {
        new: true,
      }
    );
  }

  next();
});

//Get fullname
userSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

//get user initials
userSchema.virtual("initials").get(function () {
  return `${this.firstname[0]}${this.lastname[0]}`;
});

//get posts count
userSchema.virtual("postCounts").get(function () {
  return this.posts.length;
});

//get followers count
userSchema.virtual("followersCounts").get(function () {
  return this.followers.length;
});

//get following count
userSchema.virtual("followingCounts").get(function () {
  return this.following.length;
});

//get viewers count
userSchema.virtual("viewersCounts").get(function () {
  return this.viewers.length;
});

//get blocked count
userSchema.virtual("blockedCounts").get(function () {
  return this.blocked.length;
});

//Compile the user model

const User = mongoose.model("User", userSchema);

module.exports = User;
