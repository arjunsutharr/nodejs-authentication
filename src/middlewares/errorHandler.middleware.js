export const ErrorHandlerMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({ success: false, error: err.message });
};

// handling uncaughtError Rejection
export const handleUncaughtError = () => {
  process.on("uncaughtException", (err) => {
    console.log(`Error: ${err}`);
    console.log("Shutting down because of uncaughtException");
  });
};
