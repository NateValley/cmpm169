var client_id = '42a7f5d1899844ccbf8a184bf775a00e';
var client_secret = '24d3e47601c04cdd92cc3d1608428a63';
var redirect_uri = 'http://localhost:8080/callback';

var express = require('express');
var querystring = require('querystring');
var app = express();

function generateRandomString(length) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

app.get('/login', function(req, res) {

	var state = generateRandomString(16);
	var scope = 'user-read-private user-read-email';
  
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		}));
});

app.get('/callback', function(req, res) {

	var code = req.query.code || null;
	var state = req.query.state || null;
  
	if (state === null) {
	  res.redirect('/#' +
		querystring.stringify({
		  error: 'state_mismatch'
		}));
	} else {
	  var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
		  code: code,
		  redirect_uri: redirect_uri,
		  grant_type: 'authorization_code'
		},
		headers: {
		  'content-type': 'application/x-www-form-urlencoded',
		  'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
		},
		json: true
	  };
	}
});

app.listen(8080, () => {
	console.log('Server running on http://localhost:8080');
});
