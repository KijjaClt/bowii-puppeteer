const express = require('express')
const router = express()

const resData = require('../../middlewares/responseResult')

const puppeteer = require('puppeteer');
const imageToBase64 = require('image-to-base64');
const request = require('request-promise-native');
const poll = require('promise-poller').default;
const fs = require('fs')
// var deposit = require("./depositmodel");
const apiKey = 'ef5955d807a91afa822fe49542d41c2e'
// GET all
// router.get("/", (req, res) => {
//     deposit.find().exec((err, data) => {
//     if (err) return res.status(400).send(err);
//     res.status(200).send(data);
//   });
// });

// // GET 1
// router.get("/:_id", (req, res) => {
//     deposit.findById(req.params._id).exec((err, data) => {
//     if (err) return res.status(400).send(err);
//     res.status(200).send(data);
//   });
// });

// POST (create new data)
router.post("/", async (req, res) => {
      let result = null;

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });
    
      const page = await browser.newPage();
      await page.goto('https://ag1.ufabet.com/Public/Default11.aspx', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
      });
     
      //get captcha img
      const IMAGE_SELECTOR = '#divImgCode > img';
      let imageHref = await page.evaluate((sel) => {
      return document.querySelector(sel).getAttribute('src').replace('/', '');
      }, IMAGE_SELECTOR);
      console.log('imageHref',imageHref)
      
      //converts captcha img url to base 64
      const mainUrl = page.url().substr(0,30) 
      const maindeposit = page.url().substr(0,22) 
      const imgUrl = mainUrl + imageHref;
      const page2 = await browser.newPage();
      await page2.goto(imgUrl);

      await page2.screenshot({path: 'captcha.png'});

      const img_base64 = await imageToBase64('captcha.png') // you can also to use url
        .then(
            (response) => {
                return response;
            }
        )
        .catch(
            (error) => {
                console.log(error); //Exepection error....
            }
        )

    // ;
      // await console.log('img_base64',img_base64)

      //connect 2captcha
      const requestId = await initiateCaptchaRequest(apiKey,img_base64);
      console.log(requestId);
      const response = await pollForRequestResults(apiKey, requestId);
       console.log('response',response);
      await page.type('#txtUserName','ufpaptest');
      await page.type('#txtPassword','ton089089++');
      await page.type('#txtCode',response);
    
      await Promise.all([
            page.click('#btnSignIn'),
            page.waitForNavigation(),    
    ]);


      console.log('new url', page.url());
      await page.screenshot({path: 'login_ag.png'});

      res.status(200).send(data);
      console.log(data);


 //function requestId (nickname, amount)
      const pagedeposit = await browser.newPage();
      await pagedeposit.goto( maindeposit + `/_SubAg/AccPay.aspx?userName=${data.nickname}&role=sa&amt=${data.amount}`, {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
      });
      await pagedeposit.click('#AccPay_cm1_btnSubmit')
      await browser.close();

      return resData.resData(result , "Database error occurred ", request, response)
});

// PUT (update current data)
router.put("/:_id", (req, res) => {
    deposit.findByIdAndUpdate(req.params._id, req.body, (err, data) => {
    if (err) return res.status(400).send(err);
    res.status(200).send("อัพเดทข้อมูลเรียบร้อย");
  });
});

// DELETE (delete 1 data)
router.delete("/:_id", (req, res) => {
    deposit.findByIdAndDelete(req.params._id, (err, data) => {
    if (err) return res.status(400).send(err);
    res.status(200).send("ลบข้อมูลเรียบร้อย");
  });
});

async function initiateCaptchaRequest(apiKey,base64) {
  console.log(apiKey)
  const data = {
    method: 'base64',
    body:base64,
    key: 'ef5955d807a91afa822fe49542d41c2e',
    json: 1
  };
  console.log('data', data)
  const response = await request.post('http://2captcha.com/in.php', {form: data});
  console.log('response',response)
  return JSON.parse(response).request;
}
async function pollForRequestResults(key, id, retries = 30, interval = 1500, delay = 15000) {
  await timeout(delay);
  return poll({
    taskFn: requestCaptchaResults(key, id),
    interval,
    retries
  });
}
function requestCaptchaResults(apiKey, requestId) {
  const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
  return async function() {
    return new Promise(async function(resolve, reject){
      const rawResponse = await request.get(url);
      const resp = JSON.parse(rawResponse);
      if (resp.status === 0) return reject(resp.request);
      resolve(resp.request);
    });
  }
}
const timeout = millis => new Promise(resolve => setTimeout(resolve, millis))

module.exports = router

