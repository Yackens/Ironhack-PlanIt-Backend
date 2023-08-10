const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET route ==> get the username of the authenticated user
router.get('/username', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.payload.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    const { username } = user;
    res.status(200).json({ username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route ==> to save the log-in info
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide an email and password.' });
  }

  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({ message: 'The credentials are incorrect. please try again.' });
    }

    if (bcrypt.compareSync(password, foundUser.password)) {
      const { email, username } = foundUser;
      const payload = { email, username };
      const authToken = jwt.sign({
        expiresIn: "6h",
        user: foundUser._id
      }, process.env.TOKEN_SECRET, {algorithm: "HS256"});
      return res.status(200).json({ token: authToken });
    } else {
      return res.status(400).json({ message: 'The credentials are incorrect. Please, try again.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route ==> to save the sign-up information
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  console.log(req.body);
  if (!email || !password || !username) {
    res.status(400).json({ message: 'Provide all the fields, please (email, password, and username).' });
    return;
  }

  // Use email required formatting
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }

  // Use password required formatting
//   const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
//   if (!passwordRegex.test(password)) {
//     res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase, and one uppercase letter.' });
//     return;
//   }

  try {
    let userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400).json({ message: 'User already exists.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    let newUser = await User.create({ email, password: hashedPassword, username });

    // Return the created user data instead of constructing an object again
    return res.status(201).json({ user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET route ==> verify you are authenticated
router.get('/verify', isAuthenticated, async (req, res, next) => {
 
  console.log(`req.payload`, req.payload);
  const user = await User.findById(req.payload.user);
  const userSent = user._doc;
  delete userSent.password;
  res.status(200).json(userSent);
});

module.exports = router;