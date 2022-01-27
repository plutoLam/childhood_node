const express = require('express')

const app = express()
const router = require('./router')

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', router)

app.listen(8080, () => {
  console.log('8080服务已开启');
})