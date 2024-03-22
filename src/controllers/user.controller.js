import UserModel from "../models/user.schema.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import sendPasswordResetEmail from "../services/passwordReset.js";
import forgotPasswordTokenModel from "../models/passwordForgotToken.schema.js";

export default class UserController {
  async getSignUp(req, res, next) {
    try {
      res.status(200).render("signup", {
        error: null,
        userData: {
          name: null,
          email: null,
          password: null,
          confirmPassword: null,
        },
      });
    } catch (error) {
      return next(new ErrorHandler(500, error));
    }
  }

  async postSignUp(req, res, next) {
    try {
      const { name, email, password } = req.body;
      await new UserModel({ name, email, password }).save();
      res.status(201).render("signin", {
        error: null,
        userData: {
          email: null,
          password: null,
        },
        successMessage: "Signup successful. Continue with login.",
      });
    } catch (error) {
      console.log(error);
      if (error.name == "MongoServerError" && error.code === 11000) {
        res.status(401).render("signup", {
          error: [{ msg: "User already exists with this mail." }],
          userData: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: null,
          },
        });
      } else {
        return next(
          new ErrorHandler(500, "Error while adding creating new user")
        );
      }
    }
  }

  async getSignIn(req, res, next) {
    try {
      res.status(200).render("signin", {
        error: null,
        successMessage: null,
        userData: { email: null },
      });
    } catch (error) {
      return next(new ErrorHandler(500, "Error while getting signin page."));
    }
  }

  async postSignIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(200).render("signin", {
          error: [
            {
              msg: "No user found with that email. Would you like to sign up?",
            },
          ],
          successMessage: null,
          userData: { email: email },
        });
      }

      const passwordMatch = await user.comparePassword(password);

      if (!passwordMatch) {
        return res.status(200).render("signin", {
          error: [
            {
              msg: "Invalid password or email.",
            },
          ],
          successMessage: null,
          userData: { email: email },
        });
      }

      req.session.userId = user._id;

      res
        .status(200)
        .render("user", { user: { name: user.name, email: user.email } });
    } catch (error) {
      return next(new ErrorHandler(500, "Error while sign in account."));
    }
  }

  async getUser(req, res, next) {
    try {
      const { userId } = req.session;
      if (userId) {
        const user = await UserModel.findById(userId);
        res
          .status(200)
          .render("user", { user: { name: user.name, email: user.email } });
      } else {
        const userId = req.session.passport.user;
        const user = await UserModel.findById(userId);
        res
          .status(200)
          .render("user", { user: { name: user.name, email: user.email } });
      }
    } catch (error) {
      return next(new ErrorHandler(500, "Error white getting user view."));
    }
  }

  async signOut(req, res, next) {
    try {
      await req.session.destroy();
      res.status(200).redirect("signin");
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(500, "Error white destroying session."));
    }
  }

  async getResetPassword(req, res, next) {
    try {
      res.status(200).render("resetPassword", { error: null });
    } catch (error) {
      return next(
        new ErrorHandler(500, "Error while geeting reset password page.")
      );
    }
  }

  async postResetPassword(req, res, next) {
    try {
      const { userId } = req.session;
      const { oldPassword, password, newPassword } = req.body;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.redirect("signin");
      }

      const passwordMatch = await user.comparePassword(oldPassword);

      if (!passwordMatch) {
        return res.status(401).render("resetPassword", {
          error: [{ msg: "Invalid old password" }],
        });
      }

      user.password = newPassword;
      await user.save();

      await req.session.destroy();

      res.status(200).render("signin", {
        error: null,
        userData: {
          name: null,
          email: null,
          password: null,
        },
        successMessage: "Password changed successfully.",
      });
    } catch (error) {
      return next(new ErrorHandler(500, "Error while reseting user password."));
    }
  }

  async getForgetPassword(req, res, next) {
    try {
      res.status(200).render("forgotPassword", {
        error: null,
        userData: { email: null },
        successMessage: null,
      });
    } catch (error) {
      return next(
        new ErrorHandler(500, "Error while getting forgot password page.")
      );
    }
  }

  async postForgetPassword(req, res, next) {
    const { email } = req.body;
    try {
      if (!email) {
        return res.status(401).render("forgotPassword", {
          error: [{ msg: "email is required." }],
          userData: { email: email },
          successMessage: null,
        });
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).render("forgotPassword", {
          error: [{ msg: "No user found with this email address." }],
          userData: { email: email },
          successMessage: null,
        });
      }

      await sendPasswordResetEmail(user._id, user.email, user.name);

      res.status(200).render("forgotPassword", {
        error: null,
        userData: { email: email },
        successMessage:
          "Password reset link successfully sent to your mail address",
      });
    } catch (error) {
      return next(
        new ErrorHandler(500, "Error while getting forgot password page.")
      );
    }
  }

  async getNewPassword(req, res, next) {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(401).render("newPassword", {
          error: [{ msg: "Unauthorized action." }],
          userData: null,
        });
      }

      const foundToken = await forgotPasswordTokenModel.findOne({ token });

      if (!foundToken) {
        return res.status(401).render("newPassword", {
          error: [{ msg: "Link expired. Try again with new Link." }],
          userData: null,
        });
      }

      res.status(200).render("newPassword", {
        error: null,
        userData: { userId: foundToken.user },
      });
    } catch (error) {
      return next(
        new ErrorHandler(500, "Error while getting forgot password page.")
      );
    }
  }

  async postNewPassword(req, res, next) {
    try {
      const { userId, newPassword, confirmNewPassword } = req.body;
      const user = await UserModel.findById(userId);
      user.password = newPassword;
      await user.save();

      await forgotPasswordTokenModel.deleteMany({ user: userId });

      await req.session.destroy();

      res.status(200).render("signin", {
        error: null,
        userData: {
          name: null,
          email: null,
          password: null,
        },
        successMessage: "Password changed successfully.",
      });
    } catch (error) {
      return next(
        new ErrorHandler(500, "Error while getting forgot password page.")
      );
    }
  }
}
