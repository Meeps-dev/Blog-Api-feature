const User = require("../model/User/User");
const { appErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);
  //verify the token
  const decodedUser = verifyToken(token);
  //save the user into req obj
  req.userAuth = decodedUser.id;
  //   console.log("admin", decodedUser.id);

  //Find The User in DB
  const user = await User.findById(decodedUser.id);
  //Check if admin

  if (decodedUser) {
    return next();
  }
  if (!decodedUser) {
    return next();
  } else {
    next(appErr("Access Denied, Admin Only", 403));
  }
};

module.exports = isAdmin;
