const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const getTokenFromHeader = require("../../utils/getTokenFromHeader");
const { appErr, AppErr } = require("../../utils/appErr");
const Category = require("../../model/Category/Category");
const Comment = require("../../model/Comment/comment");
const Post = require("../../model/Post/Post");

//Register
const userRegisterCtrl = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Check if email exist
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(new AppErr("User Already Exist", 500));
    }

    //hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//Login
const userLoginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //Check if email exist
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return next(appErr("Invalid login credentials"));
    }

    //verify password
    const isPasswordMatched = await bcrypt.compare(
      password,
      userFound.password
    );
    if (!isPasswordMatched) {
      if (!userFound) {
        return next(appErr("Invalid login credentials"));
      }
    }

    res.json({
      status: "success",
      data: {
        firstname: userFound.firstname,
        lastname: userFound.lastname,
        email: userFound.isAdmin,
        token: generateToken(userFound._id),
      },
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//who view my profile
const whoViewedMyProfileCtrl = async (req, res, next) => {
  try {
    //1. Find the original
    const user = await User.findById(req.params.id);
    //2. Find the user who viewed the original user
    const userWhoViewed = await User.findById(req.userAuth);
    //3. Check if original and who viewed are found
    if (user && userWhoViewed) {
      //4. check if userWhoViewed is already in the users viewers array
      const isUserAlreadyViewed = user.viewers.find(
        (viewer) => viewer.toString() === userWhoViewed._id.toJSON()
      );
      if (isUserAlreadyViewed) {
        return next(appErr("You already viewed this profile"));
      } else {
        //5. push the userWhoViewed to the users viewers array
        user.viewers.push(userWhoViewed._id);
        //6. save the user()
        await user.save();
        res.json({
          status: "success",
          data: "You have successfully viewed this profile",
        });
      }
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//Following
const followingCtrl = async (req, res, next) => {
  try {
    //1.Find the user to follower
    const userToFollow = await User.findById(req.params.id);
    //2. Find the user who is following
    const userWhoFollowed = await User.findById(req.userAuth);

    //3. Check if user and userWhoFollowed are found

    if (userToFollow && userWhoFollowed) {
      //4. Check if userWhofollowed is already in the users followers array
      const isUserAlreadyFollowed = userToFollow.following.find(
        (follower) => follower.toString() === userWhoFollowed._id.toString()
      );
      if (isUserAlreadyFollowed) {
        return next(appErr("You already followed this user"));
      } else {
        //5.push userwhoFollowed into the users followers array
        userToFollow.followers.push(userWhoFollowed._id);
        // push userToFollow to the userWhoFollowed following array
        userWhoFollowed.following.push(userToFollow._id);

        //save
        await userWhoFollowed.save();
        await userToFollow.save();
        res.json({
          status: "success",
          data: "You have succesfully followed this user",
        });
      }
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//Unfollow
const unFollowCtrl = async (req, res, next) => {
  try {
    //1.Find the user to unfollow
    const userToBeUnFollowed = await User.findById(req.params.id);
    //2. Find the user who is unfollowing
    const userWhoUnFollowed = await User.findById(req.userAuth);

    //3. Check if user and userWhoUnFollowed are found

    if (userToBeUnFollowed && userWhoUnFollowed) {
      //4. Check if userWhoUnfollowed is already in the users followers array
      const isUserAlreadyFollowed = userToBeUnFollowed.followers.find(
        (follower) => follower.toString() === userWhoUnFollowed._id.toString()
      );
      if (!isUserAlreadyFollowed) {
        return next(appErr("You have not followed this user"));
      } else {
        //5.push userwhoFollowed into the users followers array
        userToBeUnFollowed.followers = userToBeUnFollowed.followers.filter(
          (follower) => follower.toString() !== userWhoUnFollowed._id.toString()
        );
        //6.save the user
        await userToBeUnFollowed.save();
        //7. Remove userToBeUnfollowed from the userWhoUnfollowed's following array
        userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
          (following) =>
            following.toString() !== userToBeUnFollowed._id.toString()
        );

        //8.save the user
        await userWhoUnFollowed.save();
        res.json({
          status: "success",
          data: "You have succesfully unfollowed this user",
        });
      }
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//All
const usersCtrl = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//blocked
const blockUsersCtrl = async (req, res, next) => {
  try {
    //1.Find the user to blocked
    const userToBeBlocked = await User.findById(req.params.id);
    //2. Find the user who is blocking
    const userWhoBlocked = await User.findById(req.userAuth);

    //3. Check if userToBeBlocked and userWhoBlocked are found

    if (userWhoBlocked && userToBeBlocked) {
      //4. Check if userWhoUnfollowed is already in the users blocked array
      const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
        (blocked) => blocked.toString() === userWhoBlocked._id.toString()
      );
      if (isUserAlreadyBlocked) {
        return next(appErr("You already blocked this user"));
      }
      //7. Remove userToBeBlocked to the userWhoBlocked's blocked array
      userWhoBlocked.blocked.push(userToBeBlocked._id);

      //8.save the user
      await userWhoBlocked.save();
      res.json({
        status: "success",
        data: "You have successfully blocked this user",
      });
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//unBlocked
const unblockUsersCtrl = async (req, res, next) => {
  try {
    //1.Find the user to unblocked
    const userToBeUnBlocked = await User.findById(req.params.id);
    //2. Find the user who is unblocking
    const userWhoUnBlocked = await User.findById(req.userAuth);

    //3. Check if userToBeUnBlocked and userWhoUnBlocked are found

    if (userToBeUnBlocked && userWhoUnBlocked) {
      //4. Check if userToBeUnblocked is already in the userswhoUnblocked array
      const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
        (blocked) => blocked.toString() === userWhoUnBlocked._id.toString()
      );
      if (isUserAlreadyBlocked) {
        return next(appErr("You have not blocked this user"));
      }
      //5. Remove userToBeUnBlocked from the main user
      userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
        (blocked) => blocked.toString() !== userToBeUnBlocked._id.toString()
      );

      //6.save
      await userWhoUnBlocked.save();
      res.json({
        status: "success",
        data: "You have successfully unblocked this user",
      });
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//Admin-block
const adminBlockusersCtrl = async (req, res, next) => {
  try {
    //1. find the user to be blocked
    const userToBeBlocked = await User.findById(req.params.id);
    //2. check if user found
    if (!userToBeBlocked) {
      return next(appErr("User not found"));
    }
    //Change the isBlocked to true
    userToBeBlocked.isBlocked = true;
    //4. save
    await userToBeBlocked.save();
    res.json({
      status: "success",
      data: "You have successfully blocked this user",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//Admin-Unblock
const adminUnBlockusersCtrl = async (req, res, next) => {
  try {
    //1. find the user to be blocked
    const userToBeUnBlocked = await User.findById(req.params.id);
    //2. check if user found
    if (!userToBeUnBlocked) {
      return next(appErr("User not found"));
    }
    //Change the isBlocked to true
    userToBeUnBlocked.isBlocked = false;
    //4. save
    await userToBeUnBlocked.save();
    res.json({
      status: "success",
      data: "You have successfully unblocked this user",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//Profile
const userProfileCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.userAuth);
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//Update
const updateUserCtrl = async (req, res, next) => {
  const { email, lastname, firstname } = req.body;
  try {
    //Check if email is not taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(appErr("Email is taken, 400"));
      }
    }

    //update the user
    const user = await User.findByIdAndUpdate(
      req.userAuth,
      {
        lastname,
        firstname,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    //send response

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//Update password
const updatePasswordUserCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    //Check if user is updating password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      //update user
      const user = await User.findByIdAndUpdate(
        req.userAuth,
        { password: hashedPassword },
        { new: true, runValidators: true }
      );
      res.json({
        status: "success",
        data: "Password has been changed successfully",
      });
    } else {
      return next(appErr("Please provide password field"));
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//delete account
const deleteUserAccountCtrl = async (req, res, next) => {
  try {
    //1. Find the user to be deleted
    const userTodelete = await User.findById(req.userAuth);
    //2. find all posts to be deleted
    await Post.deleteMany({ user: req.userAuth });
    //3. Delete all comments of the user
    await Comment.deleteMany({ user: req.userAuth });
    //4. Delete all category of the user
    await Category.deleteMany({ user: req.userAuth });
    //5. Delete User
    await User.findByIdAndDelete(userTodelete._id);

    //send response
    return res.json({
      status: "success",
      data: "Your account has been deleted successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//Delete
// const deleteUserCtrl = async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       data: "delete user route",
//     });
//   } catch (error) {
//      next(appErr(error.message));
//   }
// };

//Profile photo upload
const profilePhotoUploadCtrl = async (req, res, next) => {
  try {
    //1. Find the user to be updated
    const userToUpdate = await User.findById(req.userAuth);
    //2. Check if user is found
    if (!userToUpdate) return next(appErr("User not found", 404));

    //3. Check if user is blocked
    if (userToUpdate.isBlocked)
      return next(
        appErr("ACTION is not allowed, your account is blocked", 404)
      );

    //4. Check if a user is updating their photo
    if (req.file) {
      console.log(req.file, "req.file");

      //5. Update profile photo
      await User.findByIdAndUpdate(
        req.userAuth,
        {
          $set: {
            profilePhoto: req.file.path,
          },
        },
        {
          new: true,
        }
      );
    }
    res.json({
      status: "success",
      data: "You have successfully updated your profile photo",
    });
  } catch (error) {
    console.log(error.message);

    next(appErr(error.message, 500));
  }
};

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  usersCtrl,
  userProfileCtrl,
  updateUserCtrl,
  // deleteUserCtrl,
  getTokenFromHeader,
  profilePhotoUploadCtrl,
  whoViewedMyProfileCtrl,
  followingCtrl,
  unFollowCtrl,
  blockUsersCtrl,
  unblockUsersCtrl,
  adminBlockusersCtrl,
  adminUnBlockusersCtrl,
  updatePasswordUserCtrl,
  deleteUserAccountCtrl,
};
