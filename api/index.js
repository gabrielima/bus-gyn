var express = require('express')
var request = require('request');

var app = express()

app.get('/:number', function (req, res) {
	var data;

	request('http://easybus.tk/api/v1/point/' + req.params.number, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    data = body;
	  }
	})
  res.send(data)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
