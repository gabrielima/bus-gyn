var express = require('express')
var request = require('request');

var app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/:number', function (req, res) {
	request('http://easybus.tk/api/v1/point/' + req.params.number, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body);
	    res.send(body);
	  }
	})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
