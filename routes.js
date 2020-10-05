const express = require('express');
const { sequelize, User, Course } = require('./models');
const router = express.Router();

// Handler function to wrap each async route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

router.get('/users', asyncHandler( async (req, res) => {
  const users = await User.findAll();
  res.json(users);
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
  const courses = await Course.findAll();
  res.json(courses);
});

module.exports = router;