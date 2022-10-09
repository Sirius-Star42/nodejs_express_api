var express = require('express');
var router = express.Router();
var axios = require('axios');
var convert = require('xml-js');

/* GET home page. */
router.get('/', async function (req, res, next) {

  res.render('index', {result: {}, isLoad: ""});

});

router.post('/', async function (req, res, next) {
  try {
    const { price } = req.body
    let result = {}

    var config = {
      method: 'get',
      url: 'https://cdn1.xmlbankasi.com/p1/freze/image/data/xml/urunler.xml',
      headers: {}
    };

    function sendReq() {
      return new Promise(async (resolve, reject) => {
        let response = await axios(config)
        if (response) {
          resolve(response.data)
        } else {
          reject(false)
        }
      })
    }

    let apiResp = await sendReq()
    if (apiResp) {
      result = convert.xml2json(apiResp, { compact: true, spaces: 4 });
      result = JSON.parse(result)
      result = result.Urunler.Urun
    } else {
      return res.sendStatus(404);
    }

    for (let index = 0; index < result.length; index++) {
      result[index]['changedPrice'] = Number(result[index].skfiyat['_text']) + Number(price)
    }
    res.render('index', {result: result, isLoad: ""});

  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }

});


module.exports = router;
