require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');

// Create an Express application
const app = express();
const port = 8800;

connectDB();

// Set up middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  })
}));

// Middleware for setting isAuthenticated
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.cookies.token ? true : false;
  next();
});

// Configure EJS and layouts
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure the views directory path is correct

// Define routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { successMessage: null, title: 'Contact Us' });
});

app.get('/privacy', (req, res) => {
  res.render('privacy', { successMessage: null, title: 'Privacy Policy' });
});

app.get('/tos', (req, res) => {
  res.render('tos', { successMessage: null, title: 'Terms and Conditions' });
});

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Set up the email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.NODEMAILER_EMAIL,
    subject: 'Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      res.render('contact', { successMessage: 'Failed to send email. Please try again later.' });
    } else {
      console.log('Email sent:', info.response);
      res.render('contact', { successMessage: 'Your message has been sent successfully!' });
    }
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('404', { title: '404 Not Found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
