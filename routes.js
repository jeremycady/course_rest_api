const express = require('express');
const router = express.Router();
const { sequelize, User, Course } = require('./models');
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

// Handler function to wrap each async route.
const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

async function authenticateUser(req, res, next) {
  const credentials = auth(req);
  let message = null;

  if (credentials) { 
    const user = await User.findOne({ 
      where: {
        emailAddress: credentials.name
      }});
    if (user) {
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
      if (authenticated) {
        req.currentUser = user;
      } else {
        message = `Authentication failure for user: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for email: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied'});
  } else {
    next();
  }
};

router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
  const user = req.currentUser;

  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
  });
}));

router.post('/users', asyncHandler( async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).send({message: 'Account has been created'});
    
  } catch(error) {
    if (error.name === 'SequelizeValidationError' || 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

router.get('/courses', async (req, res) => {
  const courses = await Course.findAll({
    attributes: [
      'id',
      'title',
      'description',
      'estimatedTime',
      'materialsNeeded'
    ],
    include: [
      {
        model: User,
        as: 'owner',
        attributes: [
          'firstName',
          'lastname',
          'emailAddress',
        ],
      },
    ],
  });
  // console.log(courses.map(course => course.get({ plain: true })));
  res.json(courses);
});

router.post('/courses', authenticateUser, asyncHandler( async (req, res) => {
  const user = req.currentUser;
  const course = req.body;

  course.UserId = user.id;
  console.log(course.UserId)
  console.log(user.id);
  
  try {
    await Course.create(course);
    res.status(201).send({message: 'Course has been created'});
    
  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

router.get('/courses/:id', asyncHandler( async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: [
      'id',
      'title',
      'description',
      'estimatedTime',
      'materialsNeeded'
    ],
    include: [
      {
        model: User,
        as: 'owner',
        attributes: [
          'firstName',
          'lastname',
          'emailAddress',
        ],
      },
    ],
  });

  res.json(course);
}));

module.exports = router;