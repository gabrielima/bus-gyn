var express = require('express')
var request = require('request');

var app = express()

var port = process.env.PORT || 8080;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/:number', function (req, res) {
	request('http://easybus.tk/api/v1/point/' + req.params.number, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    res.send(body);
	  }
	})
})

app.get('*', function(req, res) {
	res.send('Não tem nada aqui.');
})

app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})
