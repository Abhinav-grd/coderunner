var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
var { exec } = require("child_process");
var async = require("async");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || '8080';
const HOST = process.env.HOST || '0.0.0.0';

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var mongoDB = 'mongodb+srv://dbuser:strongPass@cluster0-jn6qi.mongodb.net/Codeforces_clone_db?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const textSchema = new Schema({
  type: String,
  data: Buffer
});

const Text = mongoose.model('Text', textSchema);


app.get("/", function (req, res) {
  res.send('HIHIHIHI');
});

var files = {};
app.post("/judge", function (req, res) {
  files = { code: 'q'+req.body.codeid+'.cpp', exe: 'q'+req.body.codeid+'.out',in: 'q'+req.body.inpid+'.txt', check: 'q'+req.body.outid+'.txt' ,out:'q'+req.body.codeid+"_out.txt"};
  // console.log(files);
  async.series([createfiles, compile, execute, test], function (err, type) {
    if (err)
      result = err;
    for (var file in files) {
      exec("rm -rf "+file, function (err) {
        console.log(err);
      });
    }
    res.send(result);
  });
});

function createfiles(callback) {
  async.parallel([
    createfile.bind(null,files.code),
    createfile.bind(null,files.in),
    createfile.bind(null,files.check),
  ],function(err){
    if(err)
      return callback(err);
    return callback(null);
  }); 
  }

function compile(callback) {

  var compileProcess =
    "g++ --std=c++14 -o " + files.exe + " " + files.code;
  exec(compileProcess, function (err, stdout, stderr) {
    if (err) {
      // console.error(`exec error: ${err}`);
      return callback(err, "CE");
    }
    return callback(null);
  });
}

function execute(callback) {
  var execProcess = "./" + files.exe + " < "+files.in+" > "+files.out;
  exec(execProcess, function (err, stdout, stderr) {
    if (err) {
      // console.error(`exec error: ${err}`);
      callback(err, "RE");
      return;
    }
    callback(null);
  });
}

function test(callback) {
  exec("diff -w "+files.out+" "+files.check, function (err, stdout, stderr) {
    if (stdout != "") {
      callback(null, "WA");
      return;
    }
    callback(null, "AC");
  });
}

function createfile(filename){
  var fileid=filename.substr(1).slice(0,-4);
  console.log(fileid);
  Text.findById(fileid).then((file)=>{
    fs.writeFile("./tmp/"+filename,file.data,function(err){
      console.log(err);
    });
  });
}
app.listen(PORT, HOST, function () {
  console.log(" coderunner Started!!....");
});
