const express = require('express')
const router = express()

// const customerModel = require('../../databases/Customer/model')

const puppeteer = require('puppeteer');

const resData = require('../../middlewares/responseResult')

router.get("/",async (request, response) => {
    let result = null;

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage(); 
    await page.goto('https://ufabet.com/Default8.aspx?lang=EN-GB',{ 
        waitUntil: 'load',
        timeout: 0
    });

    //set data to page by id texbox
    await page.type('#txtUserName','bow0002');
    await page.type('#password','bow12345678');
        
    await Promise.all([
        page.click('#btnLogin'),
        page.waitForNavigation(),
    ]);
    
    console.log('new url', page.url());

    if(page.url() == 'https://ufabet.com/Agreement8.aspx'){
        result = {
            ...result,
            url: page.url()
        }
    }
    else{
        result = {
            ...result,
            status: false
        }
    }
    await browser.close();

    return resData.resData(result , "Database error occurred ", request, response)
})

module.exports = router

