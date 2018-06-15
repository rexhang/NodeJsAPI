const express = require('express');
const mongoose = require('mongoose'); // 对MongoDB进行更建议操作的库

// creact app
const app = express();

// connect db use demo group
const db_url = 'mongodb://localhost:27017/demo';
mongoose.connect(db_url);
mongoose.connection.on('connected', function () {
   console.log('mongo connect success');
});

// 类似于mysql里面的表 mongo里有文档、字段的概念
const User = mongoose.model('user', new mongoose.Schema({
    user: {type: String, require: true},
    age: {type: Number, require: true},
}));

app.get('/', function (req, res) {
    res.send("<h1>hello express</h1>");
});





// 获取固定的测试数据
app.get('/gettest', function (req, res) {
    let lists = {name: 'jery app', age: 22};
    res.json(lists);
});

// 新增数据
app.get('/add', function (req, res) {
    User.create({
        user: '顾航',
        age: 26
    }, function (err, doc) {
        if(!err){
            console.log('新增用户成功');
            res.json({data: '新增用户成功'});
        } else{
            console.log(err);
        }
    })
});

// 获取列表 查
app.get('/getList', function (req, res) {
    // 4:find
    User.find({}, function (err, doc) {
        if(!err){
            res.json(doc);
        } else{
            res.send(err);
        }
    });

    // User.findOne({user: '顾恩'}, function (err, doc) {
    //     if(!err){
    //         res.json(doc);
    //     } else{
    //         res.send(err);
    //     }
    // });

});

// 删除数据 删除age=22的数据
app.get('/delete', function (req, res) {
    User.remove({user: '顾航'}, function (err, doc) {
       if(!err){
           console.log('删除成功');
           res.json({data: '删除成功', doc: doc});
       } else{
           console.log(err);
       }
    });
});

// 更新数据
app.get('/update', function (req, res) {
   User.update({user: '顾恩'}, {$set: {age: 33}}, function (err, doc) {
       if(!err){
           console.log("更新成功");
           res.json({data: '更新成功'});
       }
   })
});


app.get('/*', function (req, res) {
    res.send("404");
});

app.listen(9577, function () {
   console.log('server in port 9577');
});