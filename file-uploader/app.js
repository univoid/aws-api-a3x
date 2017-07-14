var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
// var Base64 = require('js-base64').Base64;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();
  var ans = "Are you OK?"

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    var content;
    fs.readFile(file.path, function read(err, data) {
      if (err) throw err;
      // content = data.toString("utf-8");
      // code = Base64.encode(content);
      code = data.toString("base64");
      comm = {"name": file.name, "base64": code}; 
      // send and get
      // console.log(comm);
      var ans;
      var request = require('request');
      var headers = {
        'Content-Type':'application/json',
        'x-api-key':'cbR4FBezb1jPIUIp0aTW9bn7y7xWzED5YQ7D00s8' 
      };
      var options = {
        uri: 'https://xfxkautttb.execute-api.us-east-1.amazonaws.com/dev/face',
        method: 'POST',
        headers: headers,
        json: comm
      };
      request.post(options,
        function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
            endit(JSON.stringify(body));
          }
        });
      fs.unlink(file.path);
    });
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    // res.end(ans);
  });
  function endit(ans) {
    res.end(ans);
  }

  // parse the incoming request containing the form data
  form.parse(req);
});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
