const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const passport = require('./passport-config');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const cartRouter = require('./routes/cart');

const port = 3000

const upload = multer();

app.use(bodyParser.json());
app.use(upload.none());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());


app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/cart', cartRouter);


app.listen(port)

