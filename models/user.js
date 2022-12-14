const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    unique: true,
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: 'Please enter a valid email address.',
    },
  },
  password: {
    required: true,
    type: String,
    validate: {
      validator: (value) => value.length >= 6,
      message: 'Please enter a valid password with at least six characters.',
    },
  },
  avatarFile: {
    type: String,
    default: '',
  },
  userType: {
    type: String,
    required: true,
  },
  favoriteSongs: {
    type: Object,
    default: {},
  },
  favoriteArtists: {
    type: Object,
    default: {},
  },
  playlists: { type: Object, default: {} },
  recentlyPlayed: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
