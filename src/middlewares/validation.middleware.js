import { body, validationResult } from "express-validator";

// For user signup form data validation
export const userRegistrationValidationMiddleware = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const rules = [
      body("name")
        .isLength({
          min: 1,
          max: 25,
        })
        .withMessage("Name should contain a maximum of 25 characters"),
      body("email").isEmail().withMessage("Please Enter valid mail address"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be longer then 8 characters"),
      body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) =>
          value === req.body.password
            ? Promise.resolve()
            : Promise.reject("Password and Confirm Password do not match")
        ),
    ];

    await Promise.all(rules.map((rule) => rule.run(req)));

    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(401).render("signup", {
        error: validationErrors.array(),
        userData: { name, email, password, confirmPassword },
      });
    }

    next();
  } catch (error) {
    return next(
      new ErrorHandler(500, "Error while user registration validation.")
    );
  }
};

// For user signin data validation
export const userLoginValidationMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const rules = [
      body("email").isEmail().withMessage("Please Enter valid mail address"),
      body("password").notEmpty().withMessage("Password is required"),
    ];

    await Promise.all(rules.map((rule) => rule.run(req)));

    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(401).render("signin", {
        error: validationErrors.array(),
        successMessage: null,
        userData: { email, password },
      });
    }

    next();
  } catch (error) {
    return next(new ErrorHandler(500, "Error while user login validation."));
  }
};

// For reset password form data validation
export const resetPasswordValidationMiddleware = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const rules = [
      body("oldPassword").notEmpty().withMessage("old password is required."),
      body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New Password must be longer then 8 characters"),
      body("newPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) =>
          value === req.body.confirmNewPassword
            ? Promise.resolve()
            : Promise.reject(
                "New Password and Confirm New Password do not match"
              )
        ),
    ];

    await Promise.all(rules.map((rule) => rule.run(req)));

    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(401).render("resetPassword", {
        error: validationErrors.array(),
        userData: { oldPassword, newPassword, confirmNewPassword },
      });
    }

    next();
  } catch (error) {
    return next(
      new ErrorHandler(500, "Error while reset password validation.")
    );
  }
};

// For new password form data validation
export const newPasswordValidationMiddleware = async (req, res, next) => {
  try {
    const { newPassword, confirmNewPassword, userId } = req.body;
    const rules = [
      body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New Password must be longer then 8 characters"),
      body("newPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) =>
          value === req.body.confirmNewPassword
            ? Promise.resolve()
            : Promise.reject(
                "New Password and Confirm New Password do not match"
              )
        ),
    ];

    await Promise.all(rules.map((rule) => rule.run(req)));

    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(401).render("newPassword", {
        error: validationErrors.array(),
        userData: { userId, newPassword, confirmNewPassword },
      });
    }

    next();
  } catch (error) {
    return next(
      new ErrorHandler(500, "Error while forgot password validation.")
    );
  }
};
