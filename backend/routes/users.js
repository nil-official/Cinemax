const express = require('express');
// const upload = require('../utils/multer');
const User = require('../models/user');
const auth = require('../middlewares/auth');

const router = new express.Router();

// Create a user
router.post('/register', async (req, res) => {
  try {
    const {role,username,email,phone} = req.body;
    // console.log(req.body)
    // if (role) throw new Error('you cannot set role property.');
    
    // Check for existing username, email, or phone
    const existingUser  = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser ) {
      if (existingUser.username === username) throw new Error('Username already exists.');
      if (existingUser.email === email) throw new Error('Email already exists.');
      if (existingUser.phone === phone) throw new Error('Phone number already exists.');
    }
    const user = new User(req.body);
    // const existingUser = await User.findOne({username: req.body.username});
    // if (existingUser) return res.status(400).send({"error": "A user already exists with that username."});
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ message: 'User created successfully',user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// router.post('/users/photo/:id', upload('users').single('file'), async (req, res, next) => {
//   const url = `${req.protocol}://${req.get('host')}`;
//   const { file } = req;
//   const userId = req.params.id;
//   try {
//     if (!file) {
//       const error = new Error('Please upload a file');
//       error.httpStatusCode = 400;
//       return next(error);
//     }
//     const user = await User.findById(userId);
//     if (!user) return res.sendStatus(404);
//     user.imageurl = `${url}/${file.path}`;
//     await user.save();
//     res.send({ message : 'Image uploaded successfully', user, file });
//   } catch (e) {
//     console.log(e);
//     res.sendStatus(400).send({ error: e.message });
//   }
// });

// Login User
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ message: 'You have successfully logged in', user, token });
  } catch (e) {
    res.status(400).send({
      error: 'You have entered an invalid username or password' 
    });
  }
});

// router.post('/users/login/facebook', async (req, res) => {
//   const { email, userID, name } = req.body;
//   const nameArray = name.split(' ');

//   const user = await User.findOne({ facebook: userID });
//   if (!user) {
//     const newUser = new User({
//       name,
//       username: nameArray.join('') + userID,
//       email,
//       facebook: userID,
//     });
//     try {
//       await newUser.save();
//       const token = await newUser.generateAuthToken();
//       res.status(201).send({ user: newUser, token });
//     } catch (e) {
//       res.status(400).send(e);
//     }
//   } else {
//     const token = await user.generateAuthToken();
//     res.send({ user, token });
//   }
// });

// router.post('/users/login/google', async (req, res) => {
//   const { email, googleId, name } = req.body;
//   const nameArray = name.split(' ');

//   const user = await User.findOne({ google: googleId });
//   if (!user) {
//     const newUser = new User({
//       name,
//       username: nameArray.join('') + googleId,
//       email,
//       google: googleId,
//     });
//     try {
//       await newUser.save();
//       const token = await newUser.generateAuthToken();
//       res.status(201).send({ user: newUser, token });
//     } catch (e) {
//       res.status(400).send(e);
//     }
//   } else {
//     const token = await user.generateAuthToken();
//     res.send({ user, token });
//   }
// });

// Logout user
router.post('/users/logout', auth.simple, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({
      message: 'You have been logged out!',
    });
  } catch (e) {
    res.status(400).send({
      error: 'You are not logged in!',
    });
  }
});

// Logout all
router.post('/users/logoutAll', auth.enhance, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(
      {
        message: 'You have been logged out from all devices!',
      },
    );
  } catch (e) {
    res.status(400).send({
      error: 'You are not logged in!',
    });
  }
});

// Get all users
router.get('/users', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'Only the god can see all the users!',
    });
  try {
    const users = await User.find({});
    res.send({message: 'All users fetched successfully', users});
  } catch (e) {
    res.status(400).send({
      error: 'Could not fetch users at this time!',
    });
  }
});

// User infos
router.get('/users/me', auth.simple, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(400).send({
      error: "You're not logged in!",
    });
  }
});

// Get user by id only for admin
router.get('/users/:id', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'Only the god can see the user!',
    });
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.sendStatus(404);
    res.send(user);
  } catch (e) {
    res.sendStatus(400);
  }
});

// Edit/Update user
router.patch('/users/me', auth.simple, async (req, res) => {
  console.log(req.body);
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'phone', 'username', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const { user } = req;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send({
      message: 'User updated successfully',
      user,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Admin can update user by id
router.patch('/users/:id', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'Only the god can update the user!',
    });
  const _id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'phone', 'username', 'email', 'password', 'role'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const user = await User.findById(_id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    if (!user) return res.sendStatus(404);
    res.send({
      message: 'User updated successfully',
      user,
    });
  } catch (e) {
    res.status(400).send({
      error: 'Could not update user at this time!',
    });
  }
});

// Delete by id
router.delete('/users/:id', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'Only the god can delete the user!',
    });
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) return res.sendStatus(404);

    res.send({
      message: 'User deleted successfully'
    });
  } catch (e) {
    res.sendStatus(400).send({
      error: 'Could not delete user at this time!',
      });
  }
});

router.delete('/users/me', auth.simple, async (req, res) => {
  if (req.user.role !== 'superadmin')
    return res.status(400).send({
      error: 'You cannot delete yourself!',
    });
  try {
    await req.user.remove();
    res.send({
      message: 'User deleted successfully',
      user: req.user,
    });
  } catch (e) {
    res.sendStatus(400).send({
      error: 'Could not delete user at this time!',
    });
  }
});

module.exports = router;
