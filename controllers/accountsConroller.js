const User = require('../modles/userModle');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;
const signupGet = (req, res) => {
  try {
    res.render('sign-up.ejs');
  } catch (err) {
    res.redirect('/blackHole');
  }
};

const signinGet = async (req, res) => {
  try {
    res.render('sign-in');
  } catch (err) {
    res.redirect('/blackHole');
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if(token){
       res.cookie('token', '', { expires: new Date(0) });
    }
    res.redirect('/home')
  } catch (err) {
    res.redirect('/blackHole')
  }
};
module.exports = {
  signupGet,
  signinGet,
  logout,
};
