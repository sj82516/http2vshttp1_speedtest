const express = require("express");
const fs = require("fs")
const spdy = require("spdy");
const https = require("https");
const pug = require("pug");

const app = express();

app.get('/img/:pic', function (req, res) {
    // 判斷是大圖還小圖
    let pic = /^([a-zA-Z]*)[0-9]/.exec((req.params["pic"]))[1]
    res.sendfile(pic + (pic == 'big' ? ".jpg" : ".png"), {
        root: './public/img'
    });
});

app.set('view engine', 'pug');

// 因為內容不多，直接寫
// @params testName
// @params amount
// @params size
const pugContent = `
doctype html
html(lang="en")
  head
    title= testName
  body
    h1= testName
    h2 圖片數: #{amount.length}
    ul
        each n,i in amount
            li
                img(
                    src='/img/'+ size + i + (size=="big"?'.jpg':'.png')
                    width= size=="big"?'500px':'50px'
                )

    
`

// 返回html file
// size為big / sm ，前者為500kb圖檔，後者為50kb圖檔
// amount，圖片數量
app.get('/:size/:amount', function (req, res) {
    let size = req.params["size"]
    let testName = size == "big" ? "大圖加載測試" : "小圖加載測試"
    let amount = Array(+req.params["amount"]).fill(0)
    res.send(
        pug.render(pugContent, {
            testName,
            size,
            amount
        })
    )
})

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

// 以下兩者擇一開啟
// https.createServer(options, app).listen(443);

spdy.createServer(options, app).listen(443);