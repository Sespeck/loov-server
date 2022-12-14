const User = require('../models/user');
const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');

// ------------ SIGN UP ----------------
router.post('/register', async (req, res) => {
  try {
    // fetch data
    const { fname, lname, email, password, type } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'User with the same email already exists.' });
    }

    // save data to database
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      email,
      password: hashedPassword,
      fname,
      lname,
      userType: type,
    });
    user = await user.save();

    // response
    const userSaved = await User.findOne({ email });
    const token = jwt.sign({ id: userSaved._id }, JWT_SECRET);
    res.status(201).json({ token, user: { ...user._doc }, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------ LOG IN ----------------
router.post('/login', async (req, res) => {
  try {
    // fetch user
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    // check password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).json({ token, user: { ...user._doc }, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------ Update User Profile ----------------
router.post('/update-profile', async (req, res) => {
  const { token, avatarFile, fname, lname } = req.body;

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    if (!verified)
      return res.status(400).json({ message: 'Verfication failed' });
    const fieldToUpdate = {
      avatarFile: avatarFile,
      fname: fname,
      lname: lname,
    };

    const user = await User.findByIdAndUpdate(
      verified.id,
      { $set: { ...fieldToUpdate } },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!user) return res.status(400).json({ message: 'User not found.' });
    res.status(200).json({ user: { ...user._doc }, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------ Update Favorite Songs ----------------
router.post('/update-songs', async (req, res) => {
  const { token, songList } = req.body;

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    if (!verified)
      return res.status(400).json({ message: 'Verfication failed' });
    const fieldToUpdate = {
      favoriteSongs: songList,
    };

    const user = await User.findByIdAndUpdate(
      verified.id,
      { $set: { ...fieldToUpdate } },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!user) return res.status(400).json({ message: 'User not found.' });
    res.status(200).json({ user: { ...user._doc }, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------ Update Favorite Artists ----------------
router.post('/update-artists', async (req, res) => {
  const { token, artistList } = req.body;

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    if (!verified)
      return res.status(400).json({ message: 'Verfication failed' });
    const fieldToUpdate = {
      favoriteArtists: artistList,
    };

    const user = await User.findByIdAndUpdate(
      verified.id,
      { $set: { ...fieldToUpdate } },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!user) return res.status(400).json({ message: 'User not found.' });
    res.status(200).json({ user: { ...user._doc }, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------ Update Recently Played Songs ----------------
router.post('/update-recently-played', async (req, res) => {
  const { token, recentlyPlayed } = req.body;

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    if (!verified)
      return res.status(400).json({ message: 'Verfication failed' });
    const fieldToUpdate = {
      recentlyPlayed: recentlyPlayed,
    };

    const user = await User.findByIdAndUpdate(
      verified.id,
      { $set: { ...fieldToUpdate } },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!user) return res.status(400).json({ message: 'User not found.' });
    res.status(200).json({ user: { ...user._doc }, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------ Update Playlists ----------------
router.post('/update-playlists', async (req, res) => {
  const { token, playlists } = req.body;

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    if (!verified)
      return res.status(400).json({ message: 'Verfication failed' });
    const fieldToUpdate = {
      playlists: playlists,
    };

    const user = await User.findByIdAndUpdate(
      verified.id,
      { $set: { ...fieldToUpdate } },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!user) return res.status(400).json({ message: 'User not found.' });
    res.status(200).json({ user: { ...user._doc }, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------ Get All Users ----------------
router.post('/get-users', async (req, res) => {
  const { token } = req.body;

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    if (!verified)
      return res.status(400).json({ message: 'Verfication failed' });

    const users = await User.find({});
    if (!users) return res.status(400).json({ message: 'User not found.' });
    res.status(200).json({ users: users, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------ Delete User ----------------
router.post('/delete-user', async (req, res) => {
  const { token, userId } = req.body;
  console.log(userId);
  try {
    const verified = jwt.verify(token, JWT_SECRET);

    if (!verified)
      return res.status(400).json({ message: 'Verfication failed' });

    const user = await User.findByIdAndDelete(userId);

    const users = await User.find({});
    if (!users) return res.status(400).json({ message: 'User not found.' });
    res.status(200).json({ userDeleted: user, users: users, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------ Edit User ----------------
router.post('/edit-user', async (req, res) => {
  const { token, userId, fname, lname, avatarFile, userType } = req.body;
  console.log(userId);
  try {
    const verified = jwt.verify(token, JWT_SECRET);

    if (!verified)
      return res.status(400).json({ message: 'Verfication failed' });
    const fieldToUpdate = {
      fname: fname,
      lname: lname,
      avatarFile: avatarFile,
      userType: userType,
    };
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { ...fieldToUpdate } },
      {
        runValidators: true,
        new: true,
      }
    );
    const users = await User.find({});
    if (!users) return res.status(400).json({ message: 'User not found.' });
    res.status(200).json({ userDeleted: user, users: users, status: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
