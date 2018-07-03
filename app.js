var express=require('express');

var emailController = require('./controllers/tweetcontroller');

var app=express();

app.set('view engine','ejs');

app.use('/assets',express.static('./public/assets'));

emailController(app);

app.listen(3000);

console.log('listening to port 3000');
