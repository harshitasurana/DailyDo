import { log } from 'console';
import express from 'express';
import path from 'path'
import { MongoClient, ObjectId } from 'mongodb';

const dbName = 'ToDo'
const url = "mongodb://localhost:27017"
const client = new MongoClient(url)

const app = express()
const publicPath = path.resolve('public')

app.use(express.static(publicPath))

app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

client.connect().then((connection) => {
    const db = connection.db(dbName)

    app.get('/', async(req, res) => {
        const collection=db.collection('dailyDo')
        const result=await collection.find().toArray()
        res.render("list",{result})
    })
    app.get('/add', (req, res) => {
        res.render("add")
    })
    app.get('/update/:id', async(req, res) => {
        const collection=db.collection('dailyDo')
        const result= await collection.findOne({
            _id:new ObjectId(req.params.id)
        })
        res.render("update",{result})
    })
    app.post('/addTask', async(req, res) => {
        log(req.body)
        const { title, description } = req.body
        if (!title || !description) {
            res.send({ message: "operation Failed", success: false })
            return false
        }
        const collection=db.collection('dailyDo')
        const result =await collection.insertOne(req.body)
        res.redirect('/')
    })
    app.post('/updateTask/:id',async (req, res) => {
        const collection=db.collection('dailyDo')
        const result= await collection.updateOne(
            {_id:new ObjectId(req.params.id)},
            {$set:req.body}
        )
        res.redirect('/')
    })
    app.get('/delete',async(req,res)=>{
        const collection=db.collection('dailyDo')
        const id=req.query.id
        const result=await collection.findOneAndDelete({
            _id:new ObjectId(id)

        })
        res.redirect('/')
    })
})

app.listen(3200)
