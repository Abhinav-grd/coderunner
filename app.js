var express = require("express");
var app = express();
var fs = require("fs");
var { exec } = require("child_process");
var async = require("async");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || '8080';
const HOST = process.env.HOST || '0.0.0.0';

app.use(bodyParser.urlencoded({extended: true,}));
app.use(bodyParser.json());

/* ******************************* */
//     DB COMMUNICATION SETUP
/* ******************************* */

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



/* ******************************* */
//         MAIN CODE
/* ******************************* */

app.get("/", function (req, res) {
    res.send("Ya I am here");
});

var files = {};
app.post("/judge", function (req, res) {
  files = { code: './tmp/q' + req.body.codeid + '.cpp', exe: './tmp/q' + req.body.codeid + '.out', in: './tmp/q' + req.body.inpid + '.txt', check: './tmp/q' + req.body.outid + '.txt', out: './tmp/q' + req.body.codeid + "_out.txt" };
  console.log(files);
  async.waterfall([createfiles, compile, execute, test], function (err, type) {
    if (err)
      type = err;
    Object.values(files).forEach((file) => {
      console.log("deleting "+file);
      exec("rm -rf " + file, function (err) {
        if (err)
          console.log(`deletion issue {err}`);
      });
    });
    res.send(type);
  });
});

function createfiles(callback) {
  console.log("Downloading Files....");
  async.parallel([
    createfile.bind(null, files.code),
    createfile.bind(null, files.in),
    createfile.bind(null, files.check),
  ], function (err) {
    if (err)
      return callback(err, 'System_issue');
    callback(null);
  });
}

function compile(callback) {
  console.log("compling Code....");
  var compileProcess =
    "g++ --std=c++14 -o " + files.exe + " " + files.code;
  exec(compileProcess, function (err, stdout, stderr) {
    if (err) {
      // console.error(`exec error: ${err}`);
      return callback(err, "CE");
    }
    callback(null);
  });
}

function execute(callback) {
  console.log("executing....");
  var execProcess = files.exe + " < " + files.in + " > " + files.out;
  exec(execProcess, function (err, stdout, stderr) {
    if (err) {
      // console.error(`exec error: ${err}`);
      return callback(err, "RE");
    }
    callback(null);
  });
}

function test(callback) {
  console.log("testing....");
  exec("diff -w " + files.out + " " + files.check, function (err, stdout, stderr) {
    if (stdout) {
      return callback(null, "WA");
    }
    callback(null, "AC");
  });
}

function createfile(filename, callback) {
  var fileid = filename.substr(7).slice(0, -4);
  Text.findById(fileid).then((file) => {
    // console.log(file);
    fs.writeFile(filename, file.data, function (err) {
      if (err)
        console.log(err);
      callback(null);
    });
  });
}
app.listen(PORT, HOST, function () {
  console.log(" coderunner Started!!....");
});
