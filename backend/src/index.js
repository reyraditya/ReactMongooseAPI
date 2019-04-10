const express  = require('express');
const port = require('./config');
const cors = require('cors');
const User = require('./models/user');
require('./config/mongose');


const app = express();
app.use(cors())
app.use(express.json());

// Register new user
app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        res.status(200).send(user)
    } catch (e){
        res.status(400).send(e.message)
    }
});


// Get users in login
// app.get("/users", async (req, res) => {
//     const {email, password} = req.query

//     try {
//       const users = await User.find({email, password}); // mongoose documentation: Queries > Model.find(), result: array of users
//       res.status(200).send(users); // send array of users by email and password to front end
//     } catch (e) {
//       res.status(500).send(e); //status: internal server error
//     }
//   });

app.post('/users/login', async (req, res) => {
    const {email, password} = req.body

     try {
        const user = await User.findByCredentials(email, password) // Function buatan sendiri
        res.status(200).send(user)
    } catch (e) {
        res.status(201).send(e)
    }
})


app.listen(port, () => {console.log("API Running on port " + port)})