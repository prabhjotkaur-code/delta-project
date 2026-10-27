const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const UserController = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// signup routes
router
  .route("/signup")
  .get(UserController.renderSignup)
  .post(wrapAsync(UserController.signup));

// login routes
router
  .route("/login")
  .get(UserController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserController.login,
  );

router.get("/logout", UserController.logout);

module.exports = router;
