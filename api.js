var http = require('http');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myapp'
});

// 进行数据库连接
connection.connect();

var server = http.createServer(function(req, res){
    var url_info = require('url').parse(req.url, true);
    if(url_info.pathname === '/getData.node' ){
        res.writeHead(200, {'Content-type': 'text/plain;charset=utf-8'});
        var $list = [
            {name: 'rexhang', age: 24},
            {name: 'rexhang2', age: 25}
        ];
        var resultArr = {
            errno: 0,
            msg: '获取数据成功',
            data: $list
        };
        // mysql 取出数据
        connection.query('SELECT * FROM `news` order by id limit 1, 2', function(err, rows, fields){
            res.end(JSON.stringify(rows));
            console.log(rows);
            console.log(err);
            console.log(fields);
        });
        //res.end( JSON.stringify(resultArr) );
    } else{
        res.writeHead(404, {'Content-type': 'text/plain;charset=utf-8'});
        var resultArr = {
          errno: 1000,
          msg: '此接口还未开放',
          data: []
        };
        res.end( JSON.stringify(resultArr) );
    }
});
server.listen(8888, '192.168.1.127');
server.on('close', function(){
    connection.end();
});

console.log('listening on port 8888');
