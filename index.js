const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const passport = require('./passport-config');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const cartRouter = require('./routes/cart');
const checkOutRouter = require('./routes/checkout')

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
app.use('/cart/:id/checkout', checkOutRouter);


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ecommerce api doc"
        },
        servers: [
            {
                url: "http://localhost:3000/",
            },
        ]
    },
    apis: ["./routes/*.js"],
}
const spaces = swaggerjsdoc(options);
app.use(
    "/api-docs/",
    swaggerui.serve,
    swaggerui.setup(spaces)
)
app.listen(port)

