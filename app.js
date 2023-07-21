const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve()))

app.get('/', (req, res) => {
  res.sendFile(path.resolve() + '/index.html');
})

app.listen(3000, (req, res) => {
  console.log('--Listening on port 3000--')
})