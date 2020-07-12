exports.resBoolean = (checkResult,message,request,response) => {
    let result = checkResult ? {
        status: true,
        message: message+" success"
    } : {
        status: false,
        message: message+" failure"
    }
    return  response.status(checkResult ? 200 : 403).json(result)
}

exports.resData = (checkResult,message,request,response) => {  
    // let result = checkResult ? {
    //     status: true,
    //     result: checkResult
    // } : {
    //     status: false,
    //     message: message
    // }

    console.log(checkResult);
    
  
    return response.status(checkResult ? 200 : 403).json(checkResult)
}

exports.resAuthEror = (message,request,response) => {
    let result =  {
        status: false,
        message: message + ' is unauthorized'
    }
    return response.status(200).json(result)
}