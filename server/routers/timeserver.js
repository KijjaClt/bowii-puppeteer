const express = require('express')
const router = express()

const resData = require('../middlewares/responseResult')

router.get("/",async (request, response) => {
    let time = (Date.now())
    return resData.resData(time , "", request, response)
})

module.exports = router
