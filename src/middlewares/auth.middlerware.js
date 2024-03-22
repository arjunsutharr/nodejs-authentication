// This middleware function checks if the user is authenticated
// and redirects them to the login page if they are not.

export const auth = (req, res, next) => {
  if (req.session.userId || req.session.passport) {
    next();
  } else {
    res.redirect("/user/signin");
  }
};
