const server = require('express')(),
  port = process.env.PORT || 8080,
  environment = server.get('env'),
  path = require("path"),
  spawn = require('child_process').spawn,
  bodyParser = require('body-parser'),
  fs = require('fs');


server
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))

  .post('/', function(req, res) {
  })

  .listen(port, () => {
    console.log(`Server is running on port ${port} and is running with a ${environment} environment.`);
  });