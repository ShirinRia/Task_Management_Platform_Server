const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const express = require('express')
var cors = require('cors')
require('dotenv').config()
var app = express()

// app.use(cors())
app.use(cors({
        origin: ['http://localhost:5173'],
        credentials: true

    }

))
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

USERNAME = process.env.S3_BUCKET
PASS = process.env.SECRET_KEY
const uri = `mongodb+srv://${USERNAME}:${PASS}@cluster0.xrp2z6o.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const productcollection = client.db("task").collection("productdata");
        const usercollection = client.db("task").collection("userdata");
        const cartcollection = client.db("task").collection("cartdata");
        const assignmentscollection = client.db("task").collection("assignmentsdata");


        // add new user to database
        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await usercollection.insertOne(user);
            res.send(result)
        })


        // update userdata
        app.patch('/users', async (req, res) => {

            const user = req.body
            const query = {
                email: user.email
            }

            const updateuserdb = {
                $set: {
                    lastloggedat: user.lastloggedat
                },
            };
            // Update the first document that matches the filter
            const result = await usercollection.updateOne(query, updateuserdb);
            res.send(result)
        })
        // update task status
        app.patch('/assignments', async (req, res) => {

            const task = req.body
            const query = {
                _id: new ObjectId(task.id)
            }

            const updatetaskdb = {
                $set: {
                    status: task.status
                },
            };
            // Update the first document that matches the filter
            const result = await assignmentscollection.updateOne(query, updatetaskdb);
            res.send(result)
        })

        // add advertise to database
        app.post('/assignments', async (req, res) => {
            const assignments = req.body
            console.log(assignments)
            const result = await assignmentscollection.insertOne(assignments);
            res.send(result)
        })

        // get task data from mongodb
        app.get('/assignments', async (req, res) => {

            const cursor = assignmentscollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        
        // delete task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
           
            const query = {
                _id: new ObjectId(id)
            }
            const result = await assignmentscollection.deleteOne(query)
            res.send(result)
        })
       
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})