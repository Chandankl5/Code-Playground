const express = require('express');
const path = require('path');

const app = express();

app.use('/css', express.static(path.resolve('css')))
app.use('/js', express.static(path.resolve('js')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve() + '/index.html');
})

app.listen(3000, (req, res) => {
  console.log('--Listening on port 3000--')
})