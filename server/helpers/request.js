const requests = require("request-promise")

exports.httpRequest = async (options) => {
    return await requests(options)
}

exports.checkReuestGet = async (data) => {
    return !data || data == 'null' || data == undefined  ? false : true
}