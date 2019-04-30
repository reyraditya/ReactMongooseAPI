const mongoose = require('mongoose')

const localhost = 'mongodb://127.0.0.1:27017/jc8ReactMongoose'

mongoose.connect('mongodb+srv://reyraditya:satuduatiga123@cluster0-im2il.mongodb.net/jc8ReactMongoose?retryWrites=true', { // Generate connection to database
    useNewUrlParser: true, // Parsing URL to the form mongodb needs
    useCreateIndex: true, // Auto generate Indexes from mongodb, to get access to the data
    useFindAndModify: false //  deprecated
})