const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const methodOverride = require("method-override")
const fileUpload = require("express-fileupload")

const app = express()

app.use(cors({
    origin: "*",
    methods: "GET, HEAD, PUT, POST, DELETE,OPTIONS",
    optionSuccessStatus: 200
}))

app.use(bodyParser.json({limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb'}))
app.use(methodOverride())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 * 1024 * 1024  },
}))
app.use(morgan((tokens, request, response) => {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, "content-length"), "-",
        tokens["response-time"](request, response), "ms"
    ].join(" ")
}))

app.use("/api", require("../routers"))

module.exports = app 