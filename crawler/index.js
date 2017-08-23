var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var url = "http://news.qq.com/";



function startRequest(x) {

    http.get(x, function (res) {

        var html = '';

        res.on('data', function (chunk) {
            html += chunk;
        });

        res.on('end', function () {

         var $ = cheerio.load(html);



        $("a.linkto").each(function(i,e) {

        http.get($(this).attr("href"), function (res) {

        var newshtml = '';

        res.on('data', function (chunk) {
            newshtml += chunk;
        });

        res.on('end', function () {

         var $ = cheerio.load(newshtml);

         var news_item = {

            title: $('div.hd h1').text().trim(),

            Time: $('.a_time').text().trim(),

            author: $('.a_source a').text().trim(),

            i: i,
            }

        $('p.text').each(function (index, item) {

            var x = $(this).text();

            fs.writeFile('data/'+index+ '.txt', x, function (err) {
                if (err) throw err;
                console.log('saved');
            });

        })

            console.log(news_item);



    $('img').each(function (index, item) {
        var img_title = $(this).parent().next().text().trim();  //获取图片的标题
        if(img_title.length>35||img_title==""){
         img_title="Null";}
        var img_filename = img_title + '.jpg';

        var img_src = 'http://news.qq.com/' + $(this).attr('src'); //获取图片的url


        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./image/' + index + '.jpg'));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })




        });

            });

        });


        });

    });

}


startRequest(url);