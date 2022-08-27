const express = require('express');



const {
  userSignup,
  userLogin,
  allUsers,
  getUserByPhoneNumber,
  isBlocked,
  
} = require('../controllers/user.controlller');
const { isAuth } = require('../middleware/isAuth');

const router = express.Router();




// user signup
router.post('/signup', userSignup);
// user login
router.post('/login', userLogin);

// user to retrieve his by phone_number 
router.get('/user/:phone_number', isAuth, getUserByPhoneNumber);

// view all users by admin
router.get('/users', isAuth, allUsers);


// to block a user by admin
router.put('/user/:id', isAuth, isBlocked);







module.exports = router;
