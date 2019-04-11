const express  = require('express');
const port = require('./config');
const cors = require('cors');
const User = require('./models/user');
const Task = require('./models/task')
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


// Login users in login
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

// Tasks (utk personalise To-Do List sesuai user yang login)
app.post('/tasks/:userid', async (req, res) => {
    try {
        const user = await User.findById(req.params.userid) // search user by id
        if (!user) { // jika user tidak ditemukan
            throw new Error("Unable to create task")
        }
        const task = new Task({ ...req.body, owner: user._id }) // membuat task dengan menyisipkan user id di kolom owner
        user.tasks = user.tasks.concat(task._id) // tambahkan id dari task yang dibuat ke dalam field 'tasks' user yg membuat task
        await task.save() // save task
        await user.save() // save user
        res.status(201).send(task)
    } catch (e) {
        res.status(404).send(e)
    }
}) 

// Grouping tasks sesuai dengan user pemilik tasks
app.get('/tasks/:userid', async (req, res) => {
    try {
        // find mengirim dalam bentuk array
       const user = await User.find({_id: req.params.userid})
                    .populate({path:'tasks'}).exec()
        res.send(user[0].tasks)
    } catch (e) {

     }
})

// Delete tasks
app.delete('/tasks', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.body.id})

         if(!task){
            return res.status(404).send("Delete failed")
        }

         res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Edit tasks
app.patch('/tasks/:taskid/:userid', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

     if(!isValidOperation) {
        return res.status(400).send({err: "Invalid request!"})
    }

     try {
        const task = await Task.findOne({_id: req.params.taskid, owner: req.params.userid})

         if(!task){
            return res.status(404).send("Update Request")
        }

         updates.forEach(update => task[update] = req.body[update])
        await task.save()

         res.send("update berhasil")


     } catch (e) {

     }
})

app.listen(port, () => {console.log("API Running on port " + port)})