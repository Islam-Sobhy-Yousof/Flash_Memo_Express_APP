const express = require('express');
const accountesRoute = require('./routes/accountsRoute');
const overviewRoute = require('./routes/overviewRoute');
const cookieParser = require('cookie-parser')
const app = express();
app.use(express.json());

// register view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(cookieParser())
//to encode tha data at the url and retrieve it at the req.body
app.use(express.urlencoded({ extended: true }));
app.get('/',(req,res) => {
  res.redirect('/overview/home');
})

app.get('/home', (req, res) => {
  res.redirect('/overview/home');
});
app.use('/overview',overviewRoute);
app.use('/accounts', accountesRoute);
// app.use(autMiddleWare);
app.use((req, res) => {
  res.render('404.ejs');
});
module.exports = app;
