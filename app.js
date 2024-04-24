require('dotenv').config()
var express = require('express');
var path = require('path');
const expressLayout = require('express-ejs-layouts')
var cookieParser = require('cookie-parser');
const session = require('express-session')
const methodOverride = require('method-override');

const connectDB = require('./server/config/db')
const MongoStore = require('connect-mongo')

var app = express();

// view engine setup

app.use(expressLayout)
app.set('view engine', 'ejs');
app.set('layout','./layouts/main')

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use(session({
    secret:"keyboard cat", 
    saveUninitialized: true,
    resave:false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie:{
        maxAge: 60000,
       
      },
    
    }))

app.use('/',require('./server/routes/main'))
app.use('/',require('./server/routes/admin'))




app.use(express.static(path.join(__dirname, 'public')));




module.exports = app;
