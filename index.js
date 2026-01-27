require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = 3000 || process.env.PORT 


app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

async function run() {
    const db = client.db("MEAL-MIND")
    const usercoll = db.collection('users')
    const recipescoll = db.collection('recipes')
    try {

        app.post('/users', async (req, res) => {
         
            const data = req.body 
            data.createdAt = new Date().toISOString()
            data.role = "user"

            const isexist = await usercoll.findOne({ email: data.email })
            if (isexist) {
                return res.send({massage: "Already have this account"})
            }
            else {
                const result = await usercoll.insertOne(data)
                res.send(result)
                
            }

        })
        app.post("/recipes", async (req, res) => {
            
            const data = req.body
            const result = await recipescoll.insertOne(data)
            res.send(result)
        })
        app.get("/recipes", async (req, res) => {
           
            const result = await recipescoll.find().toArray()
            res.send(result)
       })
  





        await client.db('admin').command({ ping: 1 })
        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        )
    } finally {
       
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
