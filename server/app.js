const http = require("http")
const app = require("./configs/express")

http.createServer(app).listen(3000, () => console.log("Server Start HTTP !!!!! "))
