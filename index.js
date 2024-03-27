const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

const port = 3000

const upload = multer();

app.use(bodyParser.json());
app.use(upload.none());


app.use('/products', productsRouter);
app.use('/users', usersRouter)


app.listen(port)

