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
    const weeklyPlancoll = db.collection('weeklyPlan')
    const reviewscoll = db.collection('reviews')
    try {

        app.post('/users', async (req, res) => {

            const data = req.body
            data.createdAt = new Date().toISOString()
            data.role = "user"

            const isexist = await usercoll.findOne({ email: data.email })
            if (isexist) {
                return res.send({ massage: "Already have this account" })
            }
            else {
                const result = await usercoll.insertOne(data)
                res.send(result)

            }

        })
        app.get('/users', async (req, res) => {

            const result = await usercoll.find().toArray()

            res.send(result)


        })
        app.patch('/users/:id', async (req, res) => {
            const data = req.body
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    role: data?.role
                }
            }
            const result = await usercoll.updateOne(query, updatedDoc)

            res.send(result)


        })
        app.delete('/users/:id', async (req, res) => {
        
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
          
            const result = await usercoll.deleteOne(query)

            res.send(result)


        })

        app.post("/recipes", async (req, res) => {

            const data = req.body
            const result = await recipescoll.insertOne(data)
            res.send(result)
        })

        app.patch("/recipes/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const data = req.body

            const updatedDoc = {
                $set: {

                    status: data.status
                }
            }

            const result = await recipescoll.updateOne(query, updatedDoc)
            res.send(result)
        })
        app.patch("/recipes/featured/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const data = req.body

            const updatedDoc = {
                $set: {
                    isFeatured: data.isFeatured
                }
            }
     
            console.log(updatedDoc)
            const result = await recipescoll.updateOne(query, updatedDoc)
            res.send(result)
        })

        app.patch("/category/recipes/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const data = req.body
          
            console.log(data)
            const updatedDoc = {
                $set: {
                    category: data?.category,
                }
            }

            console.log(updatedDoc)

           

            const result = await recipescoll.updateOne(query, updatedDoc)
            res.send(result)
        })
        app.delete("/recipes/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await recipescoll.deleteOne(query)
            res.send(result)
        })
        app.get("/recipes", async (req, res) => {

            const { search = "" } = req.query
            console.log(search)

            const tremmedSearch = search.trim()

            const query = {}

            if (tremmedSearch.length > 0) {
                query.name = { $regex: tremmedSearch, $options: 'i' }
            }
            const result = await recipescoll.find(query).toArray()
            res.send(result)
        })
        app.get("/recipes/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await recipescoll.findOne(query)
            res.send(result)
        })

        // cook-book


        app.post("/weeklyPlan", async (req, res) => {

            const data = req.body
            const result = await weeklyPlancoll.insertOne(data)
            res.send(result)
        })


        // users collections 
        app.get("/user/role/:email", async (req, res) => {

            const email = req.params.email

            const query = { email: email }
            const result = await usercoll.findOne(query)
            res.send(result)
        })


        // review api

        app.post("/review", async (req, res) => {
            
            const data = req.body 
            const result = await reviewscoll.insertOne(data)
            res.send(result)
        })
        app.get("/review", async (req, res) => {
            
            
            const result = await reviewscoll.find().toArray()
            res.send(result)
        })
        app.get("/review/:id", async (req, res) => {
            
            const id = req.params.id 
            const query = { recipeId: id }
            const result = await reviewscoll.find(query).toArray()
            res.send(result)
        })
        app.delete("/reviews/:id", async (req, res) => {
            
            const id = req.params.id 
            const query = { _id: new ObjectId(id) }
            const result = await reviewscoll.deleteOne(query)
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
