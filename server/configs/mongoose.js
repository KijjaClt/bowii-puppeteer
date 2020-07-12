const mongoose = require("mongoose")

mongoose.set('useFindAndModify', false)

mongoose.Promise = require('bluebird')

let databaseConnected = {
    name: "ROBOT",
    conected: (mongoose.createConnection("mongodb://robot:robot%402020@178.128.96.32:27017/robot", { useNewUrlParser: true, useUnifiedTopology: true }))
}

module.exports = databaseConnected