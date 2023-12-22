const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config({ path: './config.env' });
require('./auth');

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);

app.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure',
  }),
);

app.get('/auth/success', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.send('Protected.');
});

app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong..');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.send('');
});

const port = process.env.PORT || 5000;
app.listen(port);
