require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = 3000 || process.env.PORT 


app.use(cors())
app.use(express.json())

// const client = new MongoClient(process.env.MONGODB_URI, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
// })

async function run() {
    // const db = client.db("Stack-Foods")
    // const allFoodscoll = db.collection('AllFoods')
    // const usercoll = db.collection('users')
    try {

     

  





        // await client.db('admin').command({ ping: 1 })
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
