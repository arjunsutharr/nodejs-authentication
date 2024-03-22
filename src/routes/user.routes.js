import express from "express";
import UserController from "../controllers/user.controller.js";
import passport from "../config/passport.js";
import { auth } from "../middlewares/auth.middlerware.js";
import {
  newPasswordValidationMiddleware,
  resetPasswordValidationMiddleware,
  userLoginValidationMiddleware,
  userRegistrationValidationMiddleware,
} from "../middlewares/validation.middleware.js";
import verifyRecaptcha from "../middlewares/recaptcha.middleware.js";
import UserModel from "../models/user.schema.js";

const router = express.Router();
const userController = new UserController();

// get signup view
router.get("/signup", userController.getSignUp);

// post signup view
router.post(
  "/signup",
  userRegistrationValidationMiddleware,
  verifyRecaptcha,
  userController.postSignUp
);

// get signin view
router.get("/signin", userController.getSignIn);

// post signin view
router.post(
  "/signin",
  userLoginValidationMiddleware,
  verifyRecaptcha,
  userController.postSignIn
);

// Google login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google signin callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/signin" }),

  async (req, res) => {
    req.session.userId = req.user._id;
    const { user } = req.session.passport;
    const userDetails = await UserModel.findById(user);
    res.status(200).render("user", {
      error: null,
      user: { name: userDetails.name, email: userDetails.email },
    });
  }
);

// post signin view
router.get("/signOut", auth, userController.signOut);

// get user view
router.get("/", auth, userController.getUser);

// get reset password view
router.get("/resetPassword", auth, userController.getResetPassword);

// post reset password
router.post(
  "/resetPassword",
  auth,
  resetPasswordValidationMiddleware,
  userController.postResetPassword
);

// get Forgot password view
router.get("/forgotPassword", userController.getForgetPassword);

// post Forgot password
router.post("/forgotPassword", userController.postForgetPassword);

//get set New Password through mail link
router.get("/newPassword", userController.getNewPassword);

//post set New Password through mail link
router.post(
  "/newPassword",
  newPasswordValidationMiddleware,
  userController.postNewPassword
);

export default router;
