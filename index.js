const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// app.use(cors({ origin: "https://cycle-parts-hut.web.app" }))
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jdsn640.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        console.log('database connected');
        const shoesCollection = client.db('famous-footwear').collection('shoes');
        const userAddedCollection = client.db('famous-footwear').collection('userItems');
        const blogCollection = client.db('famous-footwear').collection('blogs');
        // const completedTaskCollection = client.db('to_do_app').collection('completed_task');



        // get all products 
        app.get('/allShoes', async (req, res) => {
            const query = {};
            const cursor = shoesCollection.find(query);
            const shoe = await cursor.toArray();
            res.send(shoe);
        });

        // get single product for product details 
        app.get('/allShoes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleProduct = await shoesCollection.findOne(query);
            res.send(singleProduct);
        });

        //add shoes by user 
        app.post('/addShoe', async (req, res) => {
            const newShoe = req.body;
            const result = await userAddedCollection.insertOne(newShoe);
            res.send(result);
        });

        // get user added items  
        app.get('/userAddedItems', async (req, res) => {
            const query = {};
            const cursor = userAddedCollection.find(query);
            const shoe = await cursor.toArray();
            res.send(shoe);
        });

        //delete a shoe 
        // app.delete('/allShoes/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await userAddedCollection.deleteOne(query);
        //     res.send(result);
        // });

        //delete a shoe by user
        app.delete('/userAddedItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userAddedCollection.deleteOne(query);
            res.send(result);
        });


        // restock Quantity by input value
        app.put("/allShoes/:id", async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: data.name,
                    description: data.description,
                    brand: data.brand,
                    gender: data.gender,
                    originalPrice: data.originalPrice,
                    discountPrice: data.discountPrice,
                    available: data.available,
                    imgUrl: data.imgUrl,
                    discountRoundPrice: data.discountRoundPrice,
                },
            };
            const options = { upsert: true };
            const result = await shoesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // delivery btn decreace qunatity by one   
        app.put("/allShoes/:id", async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: data.name,
                    description: data.description,
                    brand: data.brand,
                    gender: data.gender,
                    originalPrice: data.originalPrice,
                    discountPrice: data.discountPrice,
                    available: data.available,
                    imgUrl: data.imgUrl,
                    discountRoundPrice: data.discountRoundPrice,
                },
            };
            const options = { upsert: true };
            const result = await shoesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        //blog
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query);
            const blog = await cursor.toArray();
            res.send(blog);

        });
        // get single blog details 
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleProduct = await blogCollection.findOne(query);
            res.send(singleProduct);
        });

        // update blog viewers
        app.put("/blogs/:id", async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set:
                {
                    reaction: data.reaction,
                    category: data.category,
                    blog_title: data.blog_title,
                    blog_description: data.blog_description,
                    viewers: data.viewers
                }
            }
            console.log(updateDoc)
            const options = { upsert: true };
            const result = await blogCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Famous Footwear BD')
})

app.listen(port, () => {
    console.log(`listening to Famous footwear Feetz ${port}`)
})