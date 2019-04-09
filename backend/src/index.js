const express  = require('express');
const port = require('./config');
const cors = require('cors');
const User = require('./models/user');
require('./config/mongose');


const app = express();
app.use(cors())
app.use(express.json());

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        res.status(200).send(user)
    } catch (e){
        res.status(400).send(e)
    }
})


app.listen(port, () => {console.log("API Running on port " + port)})