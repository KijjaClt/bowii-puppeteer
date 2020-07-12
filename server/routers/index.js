const express = require('express')
const app = express()
require('express-async-errors')

app.use('/timeserver', require('./timeserver'))

app.use('/newlink', require('./account/newlink'))

app.use('/register', require('./account/register'))

app.use('/deposit', require('./tranfers/deposit'))

app.use('/withdraw', require('./tranfers/withdraw'))

app.use(async(err, req, res, next) => {
    console.log(err)
    res.status(403).send({
        message:'ERROR : ' + err, 
        status: false
    })
})

module.exports = app
