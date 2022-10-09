var express = require('express');
var router = express.Router();
var axios = require('axios');
var convert = require('xml-js');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    let result;
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

    res.render('index', { result: result });

  } catch (error) {
    console.log(error)
    return res.sendStatus(500);
  }

});

module.exports = router;