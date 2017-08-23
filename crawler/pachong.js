const http = required('http')
const fs = required('fs')
const cheerio = required('cheerio')
const request = required('request')
let i = 0
let url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391"

function fetchPage(x) {
	http.get(x,(res) => {
		var html = ''
		var titles = []
		res.setEncoding('utf-8')

		res.on('data',(chunk) => {
			html = html + chunk
		})

		res.on('end',() => {
			var $ = cheerio.load(html)
			var time = $('.article-info a:first-child').next().text().trim()
			var news_item = {
				title : $('div.article-title a').text().trim(),
				Time : time,
				link : 'http://www.ss.pku.edu.cn' + $('div.article-title a').attr('href'),
				author : $('[title=供稿]').text().trim()
			}

			console.log(news_item)

			var news_title = $('div.article-title a').text().trim()

			saveContent($,news_title)

			saveImg($,news_title)

			var nextLink = "http://www.ss.pku.edu.cn" + $("li.next a").attr('href')

			strl = nextLink.split('-')
			str = encodeURI(str1[0])

			if (i <= 9) {                
                fetchPage(str)
            }
		})

	}).on('error',(err) => {
		console.log(err)
	})
}



function savedContent(news_title) {
    $('.article-content p').each(function (index, item) {
        var x = $(this).text();       

       var y = x.substring(0, 2).trim();

        if (y == '') {
        x = x + '\n';   

        fs.appendFile('./data/' + news_title + '.txt', x, 'utf-8', function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    })
}


function savedImg($,news_title) {
    $('.article-content img').each(function (index, item) {
        var img_title = $(this).parent().next().text().trim();  //获取图片的标题
        if(img_title.length>35||img_title==""){
         img_title="Null";}
        var img_filename = img_title + '.jpg';

        var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); //获取图片的url

//采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./image/'+news_title + '---' + img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })
}
fetchPage(url);  