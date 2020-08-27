const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

// var server = http.createServer(
//   (request, response) => {
//     fs.readFile('./index.html', 'utf-8',
//       //第一引数のerrorは読みこみ時にエラーなどが起こった場合、そのエラーに関する情報をまとめたオブジェクトが渡される
//       //第二引数のdataは、ファイルから読み込んだデータ
//       (error, data) => {
//         response.writeHead(200, {'content-Type': 'text/html'});
//         response.write(data);
//         response.end
//       }
//     );
//   }
// );

// server.listen(3000);
// console.log('Server Start');

//関数を切り離す
// var server = http.createServer(getFromClient);

// server.listen(3000);
// console.log('Server Start');

// //createServerの処理
// function getFromClient(req, res) {
//   request = req;
//   response = res;
//   fs.readFile('./index.html', 'utf-8',
//     (error, data) => {
//       response.writeHead(200, {'Content-Type' : 'text/html'});
//       response.write(data);
//       response.end();
//     }
//   );
// }

//関数とコールバック関数を切り分ける
// var request;
// var response;

// var server = http.createServer(getFromClient);

// server.listen(3000);
// console.log('Server Start');

// createServerの処理
// function getFromClient(req, res) {
//   request = req;
//   response = res;
//   fs.readFile('./index.html', 'utf-8', writeToResponse);
// }

// function writeToResponse(error, data) {

//   var content = data.replace(/dummy_title/g, 'This is title').replace(/dummy_content/g, 'This is content');

//   response.writeHead(200, {'Content-Type' : 'text/html'});
//   response.write(data);
//   response.end();
// }

const index_page = fs.readFileSync('./index.ejs', 'utf-8');
const other_page = fs.readFileSync('./other.ejs', 'utf-8');
const style_css = fs.readFileSync('./styles.css', 'utf-8');

var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server Start');

function getFromClient(request, response) {
  var url_parts = url.parse(request.url, true);
  switch (url_parts.pathname) {
    case '/':
      // var content = "This is Practice Page";
      // var query = url_parts.query;
      // if (query.msg != undefined) {
      //   content += 'You send + query.msg'
      // }
      // var content = ejs.render(index_page, {
      //   title: 'Node Practice',
      //   content: 'This is Page'
      // });
      // response.writeHead(200, {"Content-Type" : "text/html"});
      // response.write(content);
      // response.end();
      response_index(request, response);
      break;

    case '/other.ejs':
      // var content = ejs.render(other_page, {
      //   title: "Other",
      //   content: "This is Other Page"
      // });
      // response.writeHead(200, {'Content-Type' : 'text/html'});
      // response.write(content);
      // response.end();
      response_other(request, response);
      break;

    case '/styles.css':
      response.writeHead(200, {'Content-Type' : 'text/css'});
      response.write(style_css);
      response.end();
      break;

    default:
      response.writeHead(200, {'Content-Type' : 'text/html'});
      response.end('no page ...');
      break;
  }
}

function response_index(request, response) {
  var msg = 'This is Practice Page';
  var content = ejs.render(index_page, {
    title: 'Node Practice',
     content: msg
  });
  response.writeHead(200, {'Content-Type' : 'text/html'});
  response.write(content);
  response.end();
}

function response_other(request, response) {
  var msg = 'This is Other Page';
  if (request.method == 'POST') {
    var body = '';

    request.on('data', (data) => {
      body += data;
    });

    request.on('end',() => {
      var post_data = qs.parse(body);
      msg += 'You write 「' + post_data.msg + '」';
      var content = ejs.render(other_page, {
        title: 'Other',
        content: msg,
      });
      response.writeHead(200, {'Content-Type' : 'text/html'});
      response.write(content);
      response.end();
    });
  } else {
    var content = 'Page Not found';
    var content = ejs.render(other_page, {
      title: 'Other',
      content: msg,
    });
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(content);
    response.end();
  }
}