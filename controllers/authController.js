// const jwt = require('jsonwebtoken');
// const jwtSecret = process.env.JWTSECRET;
// const autMiddleWare = (req, res, next) => {
//   if (req.url === '/blackHole') {
//     return next();
//   }
//   const token = req.cookies.token;
//   if (!token) {
//     return res.redirect('/home');
//   }
//   try {
//     const decoded = jwt.decode(token, jwtSecret);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     return res.redirect('/home');
//   }
// };
const User = require('../modles/userModle')
const { promisify } = require('util');
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWTSECRET;
const jwtToken = (id) => {
return jwt.sign({ id: id }, jwtSecret);
}
const signupPost = async (req, res) => {
  try {
    console.log('pancack 🥞');
    const data = req.body;
    const userName = data.userName;
    const password = data.password;
    const confirmPass = data.confirmPass;
    //first make sure the passwords match | the user exists
    // other wise redirect to sing-up/GET with error messge
    const userExists = await User.findOne({ userName: userName });
    if (password !== confirmPass || userExists) {
      return res.redirect('/accounts/sign-up');
    }

    //here everything is valid you've to rendr the /overview/userID
    const user = await User.create({
      userName,
      password,
    });
    //here we will redirect this user to his overview
    //GET /overview/userID
    const token = jwtToken(user._id);
    res.cookie('token', token);
    res.redirect(`/overview/${user._id}`);
  } catch (err) {
    res.redirect('/blackHole');
  }
};


const signinPost = async (req, res) => {
  try {
    const userName = req.body.userName;
    const passWord = req.body.password;
    const user = await User.findOne({ userName: userName, password: passWord });
    if (!user || user.length === 0) {
      return res.redirect('/accounts/sign-in');
    }
      const token =  jwtToken(user._id)
      res.cookie('token', token);
    res.redirect(`/overview/${user._id}`);
  } catch (err) {
    res.redirect('/blackHole');
  }
};

const protect = async (req,res,next) => {
  try{
    //1) validate the token is exist
    const { token } = req.cookies;
    if (!token) {
      return res.redirect('/blackHole');
    }
    const decoded = await promisify(jwt.verify)(token, jwtSecret);
    const logedUserId = req.params.id;
    
    //check if the current user is the logged one already
    if(!decoded.id === logedUserId){
      return res.redirect('/blackHole')
    }
    next();
    //2) see if the token is valid or not
  }catch(err){
    res.redirect('/blackHole')
  }
}
const logout = (req,res) => {
  try{
     res.clearCookie('token');
     res.redirect('/overview/home')
  }catch(err){
    res.redirect('/blackHole')
  }
}
module.exports = {
  signupPost,
  signinPost,
  protect,
  logout
};
// module.exports = autMiddleWare;
