var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
var { exec } = require("child_process");
var async = require("async");
var bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.render("submit-form");
});
var code;
var fileName='program';
app.post("/submit", function (req, res) {
  code = req.body.code;
 
  // console.log(code);
  async.waterfall([createfile, compile, execute, test], function (err, result) {
     exec("rm -rf out.txt program.out program.cpp", function () {
      res.send(result);
     });
  });
});

function createfile(callback) {
  fs.writeFile(fileName + ".cpp", code, function (err) {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }
    callback(null);
  });
}

function compile(callback) {
  var compileProcess =
    "g++ --std=c++14 -o " + fileName + ".out" + " " + fileName + ".cpp";
  exec(compileProcess, function (err, stdout, stderr) {
    if (err) {
      // console.error(`exec error: ${err}`);
      callback(err, "CE");
      return;
    }
    callback(null);
  });
}

function execute(callback) {
  var execProcess = "./" + fileName + ".out" + "<in.txt >out.txt";
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
  exec("diff -w req.txt out.txt", function (err, stdout, stderr) {
    if (stdout != "") {
      callback(null, "WA");
      return;
    }
    callback(null, "AC");
  });
}

app.listen("3000", "127.0.0.1", function () {
  console.log(" coderunner Started!!....");
});
