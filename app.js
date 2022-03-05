const express = require('express');
const app = express();
const { port } = require('./config/env');

app.get('/', (req, res) => {
  res.send('Hello !')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})