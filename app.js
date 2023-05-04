const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { PORT = 3000 } = process.env;
const router = require('./routes/users')

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/users', router)
app.use('/users/:userId', router)


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});