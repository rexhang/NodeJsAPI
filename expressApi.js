var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var fs = require('fs');

var multer = require('multer');

app.use(multer({
    dest: '/tmp/'
}).array('filename'));

app.use(express.static('public'));

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myapp'
});

// 进行数据库连接
connection.connect();

// 允许跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 处理getinfo.node 请求  get 方式
app.get('/getinfo.node/*', function(req, res) {
    var $name = req.query.name;
    var $age = req.query.age;
    if ($name && $age) {
        var $list = [{
            name: $name,
            age: $age
        }];
        var $result = {
            errno: 0,
            msg: '获取成功',
            data: $list
        };
        // ExpressJS框架提供了更高层的方法，比如res.send()，它可以省去诸如添加Content-Length之类的事情
        res.send(JSON.stringify($result));
    } else {
        // mysql 取出数据
        connection.query('SELECT * FROM `news` order by id limit 1, 2', function(err, rows, fields) {
            $list = rows;
            var $result = {
                errno: 0,
                msg: '获取成功',
                data: $list
            };
            res.send(JSON.stringify($result));
            console.log(rows);
            console.log(err);
            console.log(fields);
        });
    }
});

// sendinfo.node 请求  post 方式
app.post('/sendinfo.node/', urlencodedParser, function(req, res) {
    console.log(req.query);
    console.log(req.body);
    var $name = req.body.name;
    var $age = req.body.age;
    if ($name && $age) {
        console.log($name, $age);
        var $list = [{
            name: $name,
            age: $age
        }];
        var $result = {
            errno: 0,
            msg: '发送成功',
            data: $list
        };
    } else {
        $result = {
            errno: 1000,
            msg: '未接收到数据',
            data: []
        };
    }
    res.send(JSON.stringify($result));
});


// 创建多层文件夹 同步
function mkdirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            } else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
}

// file_upload 文件上传
app.post('/file_upload', function(req, res, next) {
    res.setHeader('X-Powered-By', 'express');
    mkdirsSync('uploadImg', 777); // 创建文件夹
    console.log(req.files[0]); // 上传的文件信息
    var des_file = __dirname + "/uploadImg/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function(err, data) {
        fs.writeFile(des_file, data, function(err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: '文件上传成功',
                    filename: req.files[0].originalname
                };
            }
            console.log(response);
            res.end(JSON.stringify(response));
        });
    });
})


var server = app.listen(5566, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("访问地址为：http://localhost", host, port);
})