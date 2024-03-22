# Nodejs Authentication System

A complete authentication system which can be used as a starter code for creating any new application.

[Demo](https://nodejs-authentication-joud.onrender.com): https://nodejs-authentication-joud.onrender.com

## Table of Contents

- [Overview](#overview)
- [Key Features](#Key-Features)
- [Folder Structure](#folder-structure)
- [File Descriptions](#file-descriptions)
- [Setup and Installation](#setup-and-installation)
- [Security Considerations](#Security-Considerations)
- [Usage](#usage)
- [Contributing](#contributing)

## Overview

This project provides a well-structured, secure, and scalable authentication system for Node.js applications. It offers user registration, login, sign-out, password reset, and Google Sign-In, all designed with best practices in mind.

## Key Features

- User Registration: Sign up with email.
- Login and Sessions: Secure login with session management
- Password Management: Secure password hashing (bcrypt)
- Reset Password: Reset password functionality
- Forgot Password: Forgot password functionality with email notification and expiration link
- Google Sign-In: Social authentication integration using Passport.js
- Scalable Structure: Organized folder structure for models, controllers, routes, and services
- Well-Commented Code: Clear and concise code comments for easier understanding
- Responsive UI: Clean user interface inspired by leading authentication systems
- User Notifications: Informative messages for password mismatches, login errors, and password reset confirmations
- reCAPTCHA : reCAPTCHA integration for enhanced security
- User-Specific Focus - Built with a technology stack including Node.js, Express, MongoDB, and EJS for a smooth and efficient user experience.

## Folder Structure

The project follows a structured folder organization:

- nodejs-authentication/
  - |- public/ # Contains static assets like CSS and JavaScript files
  - |- config/ # Configuration files
  - |- controllers/ # Controllers handling business logic
  - |- middleware/ # Middleware functions for request processing
  - |- models/ # Models defining data structures and operations
  - |- routes/ # API routs for authentication functionality
  - |- services/ # Containing services for handling forgot password emails
  - |- utils/ # Utility functions for common tasks.
  - |- views/ # UI templates for login, signup etc.
  - |- app.js # Main entry point of the application
  - |- package.json # Project dependencies
  - |- .env.example # Provides a template for environment variables.
  - |- README.md # This file

## File Descriptions

- **views/**: Contains EJS templates for rendering different views of the application.

  - `layout.ejs`: Common layout view.
  - `signup.ejs`: User registration form.
  - `signin.ejs`: Landing page with user login form.
  - `user.ejs`: User profile page.
  - `forgotPassword.ejs`: Form to initiate password reset via email.
  - `resetPassword.ejs`: Form to change old password with new password.
  - `newPassword.ejs`: email link redirect user to this page and user can set new password.

- **controllers/**: Contains controller files responsible for handling business logic.

  - `user.controller.js`: Handles user operations.

- **models/**: Defines data structures .

  - `user.schema.js`: Defines the database schema for user data
  - `passwordForgotToken.schema.js`: Defines the database schema for forgot password token data

- **middleware/**: Contains middleware functions for request processing.

  - `auth.middleware.js`: Middleware function checks if the user is authenticated.
  - `errorHandler.middleware.js`: Middleware for handling errors.
  - `recaptcha.middleware.js`: Middleware function that verifies reCAPTCHA tokens for enhanced security during signup or login.
  - `validation.middleware.js`: Middleware function for req form data validation.
  - `invalidRoutesHandler.middleware.js`: Middleware for handling invalid routes.

- **routes/**: Defines Express routes for API endpoints.

  - `user.routes.js`: Routes for user.

- **services/**: Containing services for handling forgot password emails.

  - `emailSender.js`: Responsible for sending emails.
  - `passwordReset.js`: Containing logic for forgot password functionality

- **utils/**: Utility functions for common tasks.

  - `errorHandler.js`: defines a custom error class for improved error handling.

- **public/**: Contains static assets like CSS and JavaScript files used in the frontend.

- **.env.example/**: Provides a template for environment variables.

- **app.js**: Main entry point of the application where server setup and configuration occur.

## Setup and Installation

To run the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/arjunsutharr/nodejs-authentication`
2. Install dependencies: `npm install`
3. Configure environment variables.

   - Create a .env file in the project root directory and add the following environment variables:

     - PORT:
     - DATABASE_URL: Your MongoDB database URI connection string
     - RECAPTCHA_SECRET_KEY: Your MongoDB database URI connection string
     - RECAPTCHA_SITE_KEY: Your MongoDB database URI connection string
     - SESSION_SECRET_KEY: A strong secret key for session encryption
     - REDIS_HOST: Redis host
     - REDIS_PORT: Redis port
     - REDIS_PASSWORD: Redis password
     - EMAIL_SERVICE: Email service provider
     - EMAIL_USER: Email address for mail service
     - EMAIL_PASSWORD: Email service password
     - PASSWORD_RESET_BASE_LINK: (eg. http://localhost:3000/user/newPassword)
     - GOOGLE_CLIENT_ID: Your Google Client ID for Google Sign-In
     - GOOGLE_CLIENT_SECRET: Your Google Client Secret for Google Sign-In

4. Start the server: `node app.js`
5. Visit (`http://localhost:3000` or the port specified in your .env file) in your browser to access the application.

## Security Considerations

- Password Hashing: The system uses bcrypt to securely store passwords in hashed form, protecting them from compromise.
- Session Management: Session data is encrypted using the secret key specified in the .env file.
- reCAPTCHA Integration: Enhance security by integrating reCAPTCHA for signup and login forms. Safeguard against brute-force attacks.

## Usage

1. Access the application in your browser (typically http://localhost:3000 or the port specified in your .env file).
2. Visit the signup page to create a new account.
3. Use the login form to enter your credentials and sign in.
4. Once logged in, you'll have access to features requiring authentication.
5. Sign out when you're finished using the application.

## Contributing

Contributions to the project are welcome! Feel free to open issues or submit pull requests to help improve the project.
I hope this README content is helpful!😊
