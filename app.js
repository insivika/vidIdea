const express = require ('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session')
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport')
const mongoose = require('mongoose');

const app = express();

// Load Routes 
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);
// DB config
const db = require('./config/database')

//Connect to mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
}) 
  .then(() => console.log('MongoDb connected...'))
  .catch((err) => console.log(err))

// Handlebars middle ware 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname)))

// Method override Middleware
app.use(methodOverride('_method'));

// Express session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash())


// Global Variabeles
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

// Index Route
app.get('/', (req, res) =>{
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about')
})




// Use routes
app.use('/ideas', ideas);
app.use('/users', users)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on Port: ${port}`)
})