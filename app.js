const express = require('express');
const path = require('path');

const app = express();

app.get('/*/index.js', (req, res)  => {
  res.sendFile(path.resolve('js') + '/index.js')
})

app.get('/*/index.css', (req, res)  => {
  res.sendFile(path.resolve('css') + '/index.css')
})

app.use('/index.css', express.static(path.resolve('css')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve() + '/index.html');
})

app.listen(3000, (req, res) => {
  console.log('--Listening on port 3000--')
})