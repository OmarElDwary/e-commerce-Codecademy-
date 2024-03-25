const express = require('express')
const app = express()
const productsRouter = require('./routes/products')

const port = 3000


app.use('/products', productsRouter);


app.listen(port)

