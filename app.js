const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')


require("dotenv/config")
const port = 8000
const api = process.env.API_URL

const productsRouter = require('./routers/products.js')
const usersRouter = require('./routers/users.js')
const categoriesRouter = require('./routers/categories.js')

app.use(cors())
app.options('*', cors())

// middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))

// routers
app.use(`${api}/products`, productsRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/categories`, categoriesRouter)



mongoose.connect(process.env.DBConnection)
.then(()=> {
    console.log('DB connection is ready...')
})
.catch((err) => {
    console.log(err)
})

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`)
})