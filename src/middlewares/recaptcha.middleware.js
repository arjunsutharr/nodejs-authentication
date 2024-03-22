import axios from "axios";

// This function for recaptcha verification
const verifyRecaptcha = async (req, res, next) => {
  const recaptchaToken = req.body["g-recaptcha-response"];
  const currentPath = req.route.path.replace(/^\//, "");
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const { name, email, password, confirmPassword } = req.body;

  if (!recaptchaToken) {
    return res.status(400).render(currentPath, {
      successMessage: null,
      error: [{ msg: "Please verify using reCAPTCHA" }],
      userData: {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
  }

  try {
    const verificationResult = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      }
    );

    if (verificationResult.data.success) {
      next();
    } else {
      return res.status(400).render(currentPath, {
        successMessage: null,
        error: [{ msg: "Invalid reCAPTCHA token" }],
        userData: {
          name: name,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error verifying reCAPTCHA" });
  }
};

export default verifyRecaptcha;
