var jwt = require('..');
var payload = {x: 'y'};
var token = jwt.encode(payload, 'pass', 'HS512');
jwt.decode(token, 'pass');
//=>

jwt.decode(token, 'whatever')
//=>
