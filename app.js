const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const process = require('process')
const { PORT = 3000 } = process.env;

const routerUser = require('./routes/users')
const routerCard = require('./routes/card')

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: "6457c58c35d9935766858ce4"
  }

  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/users', routerUser)
app.use('/cards', routerCard)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});