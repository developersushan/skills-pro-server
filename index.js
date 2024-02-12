const express = require('express')
const cors = require('cors')
const multer  = require('multer')
const path = require('path'); 
const mongoSanitize = require('express-mongo-sanitize');

const app = express()
require('dotenv').config()
const port = process.env.PORT ||8500
//middleware
app.use(cors())
app.use(express.json())
app.use(mongoSanitize());
app.use(express.static('uploads'))
app.get('/', (req,res)=>{
    res.send('server running port  8500 complete')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `${process.env.MONGODB_CONNECT_URL}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,}});


async function run() {
  try {
    const userCollection = client.db('portfolio').collection('home')
    app.get('/home' ,async(req,res)=>{
        const query = {}
        const cursor =  userCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
//banner slide content api
async function  home(){
    try{
        const bannerCollection = client.db('portfolio').collection('banner')
        const bannerImageCollection = client.db('portfolio').collection('bannerImage')
        const aboutCollection = client.db('portfolio').collection('About')
        const aboutImageCollection = client.db('portfolio').collection('AboutImage')
        app.post('/addUser', async(req,res)=>{
            const query = req.body
            const result = await bannerCollection.insertOne(query)
            res.send(result)
            console.log(req.body)
        });
        app.delete('/banner/:id' ,async(req,res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await bannerCollection.deleteOne(query)
            res.send(result.deletedCount>0)
            console.log(id)

        })
        app.get('/banner',async(req,res)=>{
            const cursor =  bannerCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
                //image upload home page
                const storage = multer.diskStorage({
                    destination:(req,file,cb)=>{
                        cb(null,"uploads/")
                    },
                    filename:(req,file,cb)=>{
                        cb(null, file.fieldname + "_" + Date.now()+ path.extname(file.originalname))
                    }
                })
                const upload = multer({ storage:storage})
                //storage
                app.post('/uploadBanner',upload.single('file'),async (req,res)=>{
                    const image = req.file
                    console.log(image)
                    const result =  await bannerImageCollection.insertOne(image)
                    res.send(result)
                     
                 })
                 app.get('/bannerImage' , async (req,res)=>{
                    const query = bannerImageCollection.find({})
                    const result = await query.toArray()
                    res.send(result)
                 })
                 app.delete('/bannerImage/:id', async (req,res)=>{
                    const id = req.params.id
                    const query = {_id:new ObjectId(id)}
                    const result = await bannerImageCollection.deleteOne(query)
                    res.send(result.deletedCount>0)
                 })
        //about api
        app.post('/addAbout', async (req,res)=>{
            const query = req.body
            const result = await aboutCollection.insertOne(query)
            res.send(result)
        })
        app.get('/addAbout', async (req,res)=>{
            const cursor = aboutCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/addAbout/:id' ,async(req,res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await aboutCollection.deleteOne(query)
            res.send(result.deletedCount>0)
            console.log(id)

        })
        //image upload about page
        app.post('/uploadAbout',upload.single('file'),async (req,res)=>{
            const image = req.file
            console.log(image)
            const result =  await aboutImageCollection.insertOne(image)
            res.send(result)
             
         })
         app.get('/aboutImage' , async (req,res)=>{
            const query = aboutImageCollection.find({})
            const result = await query.toArray()
            res.send(result)
         })
         app.delete('/aboutImage/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await aboutImageCollection.deleteOne(query)
            res.send(result.deletedCount>0)
         })

    }finally{

    }
}
 home().catch(console.dir)
//image upload server
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname + "_" + Date.now()+ path.extname(file.originalname))
    }
})
// dest: 'uploads/' 
const upload = multer({ storage:storage})

async function imageAll(){
    try{
        const imageUserCollection = client.db('portfolio').collection('image')
        app.post('/upload',upload.single('file'),async (req,res)=>{
           const image = req.file
           console.log(image)
           const result =  await imageUserCollection.insertOne(image)
           res.send(result)
            
        })
        app.get('/image', async (req,res)=>{
            const query = {}
            const cursor = imageUserCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/image/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await imageUserCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
    }finally{

    }
}
imageAll().catch(console.dir)
//contact api 
async function contactApi(){
    try{
        const contactCollection = client.db('portfolio').collection('contact')
        app.post('/contact',async (req,res)=>{
            const query = req.body
            const result = await contactCollection.insertOne(query)
            res.send(result)
        })
        app.get('/contact', async (req,res)=>{
            const query =contactCollection.find({})
            const result = await query.toArray()
            res.send(result)
        })
        app.delete('/contact/:id' , async (req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await contactCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })

    }finally{

    }
}
contactApi().catch(console.dir)
//social media link
async function socialMedia(){
    try{
        const facebookCollection = client.db('portfolio').collection('facebook')
        const instagramCollection = client.db('portfolio').collection('instagram')
        const linkedinCollection = client.db('portfolio').collection('linkedin')
        const twitterCollection = client.db('portfolio').collection('twitter')

        //facebook api
        app.post('/facebook', async(req,res)=>{
            const query = req.body
            const result  = await facebookCollection.insertOne(query)
            res.send(result)
        })
        app.get('/facebook',async (req,res)=>{
            const query = { }
            const cursor = facebookCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/facebook/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await facebookCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
        //instagram api
        app.post('/instagram', async(req,res)=>{
            const query = req.body
            const result=await instagramCollection.insertOne(query)
            res.send(result)
        })
        app.get('/instagram',async (req,res)=>{
            const query = { }
            const cursor = instagramCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/instagram/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await instagramCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
        //linkedin api
        app.post('/linkedin', async(req,res)=>{
            const query = req.body
            const result=await linkedinCollection.insertOne(query)
            res.send(result)
        })
        app.get('/linkedin',async (req,res)=>{
            const query = { }
            const cursor = linkedinCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/linkedin/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await linkedinCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
        //twitter api
        app.post('/twitter', async(req,res)=>{
            const query = req.body
            const result=await twitterCollection.insertOne(query)
            res.send(result)
        })
        app.get('/twitter',async (req,res)=>{
            const query = { }
            const cursor = twitterCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete('/twitter/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await twitterCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
        

    }finally{}
}
socialMedia().catch(console.dir)

//gig publish api
async function gigApi(){
    try{
        const gigCollection = client.db('portfolio').collection('gig')
        app.get('/addGig' , async (req,res)=>{
            const query = { }
            const cursor = gigCollection.find(query)
            const result = await cursor.toArray()
            res.send(result) 
        })
        app.get('/addGig/:id' , async (req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await gigCollection.findOne(query)
            res.send(result)
        })
        app.delete('/addGig/:id' , async (req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await gigCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
        app.post('/addGig', upload.array('file',10) , async (req,res)=>{
       
        const { title, description, basicTitle,basicPrice ,basicDescription , basicDelivery,basicRevision ,standardTitle ,standardPrice ,standardDescription ,standardDelivery , standardRevision, premiumTitle, premiumPrice,premiumDescription ,premiumDelivery , premiumRevision,ComparePackage , StandardPackage, PremiumPackage} = req.body;

            const filePaths = req.files.map(file => file);
            const basic = {basicTitle,basicPrice ,basicDescription , basicDelivery,basicRevision,ComparePackage}
            const standard = {standardTitle ,standardPrice ,standardDescription ,standardDelivery , standardRevision,StandardPackage}
            const premium ={premiumTitle, premiumPrice,premiumDescription ,premiumDelivery , premiumRevision,PremiumPackage}
            // const query = req.body
            // console.log(query)
            const newGig = {
                title, description,
                basic:basic,
                standard:standard,
                premium:premium,
                files: filePaths,
              };

            const result = await gigCollection.insertOne(newGig)
            res.send(result)
            console.log(result)
            
        })


    }finally{

    }
}

gigApi().catch(console.dir)

//count publish api

async function AllCountManage(){
    try{
        const completeCollection = client.db('portfolio').collection('complete')
        const partnerCollection = client.db('portfolio').collection('partner')
        const clientCollection = client.db('portfolio').collection('client')
        const awardCollection = client.db('portfolio').collection('award')
        //complete count api 

        app.post('/completeCount' , async (req,res)=>{
            const query = req.body
            const result = await completeCollection.insertOne(query)
            res.send(result)
        })
        app.get('/completeCount', async(req,res)=>{
            const query = {} 
            const cursor = completeCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/completeCount/:id', async(req,res)=>{
            const id =req.params.id
            const query = {_id:new ObjectId(id)} 
            const result = completeCollection.findOne(query)
            res.send(result)
        })
        app.delete('/completeCount/:id' , async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await completeCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
        

        //partner count api
        app.post('/partner' , async(req,res)=>{
            const query = req.body
            const result  = await partnerCollection.insertOne(query)
            res.send(result)
        })
        app.get('/partner', async(req,res)=>{
            const query = {} 
            const cursor = partnerCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/partner/:id', async(req,res)=>{
            const id =req.params.id
            const query = {_id:new ObjectId(id)} 
            const result = partnerCollection.findOne(query)
            res.send(result)
        })
        app.delete('/partner/:id' , async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await partnerCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })

        //client count api
        app.post('/client', async(req,res)=>{
            const query = req.body
            const result = await clientCollection.insertOne(query)
            res.send(result)
        })
        app.get('/client', async(req,res)=>{
            const query = {} 
            const cursor = clientCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/client/:id', async(req,res)=>{
            const id =req.params.id
            const query = {_id:new ObjectId(id)} 
            const result = clientCollection.findOne(query)
            res.send(result)
        })
        app.delete('/client/:id' , async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await clientCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
        //award count api 
        app.post('/award' , async(req,res)=>{
            const query = req.body
            const result = await awardCollection.insertOne(query)
            res.send(result)
        })
        app.get('/award', async(req,res)=>{
            const query = {} 
            const cursor = awardCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/award/:id', async(req,res)=>{
            const id =req.params.id
            const query = {_id:new ObjectId(id)} 
            const result = awardCollection.findOne(query)
            res.send(result)
        })
        app.delete('/award/:id' , async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await awardCollection.deleteOne(query)
            res.send(result.deletedCount>0)
        })
        
    }finally{}
}
AllCountManage().catch(console.dir)

async function clickCount(){
    try{
        const clickCountCollection = client.db('portfolio').collection('ClickCount')
        app.post('/clickCount' ,async (req,res)=>{
            const query = req.body
            const result = await clickCountCollection.insertOne(query)
            res.send(result)
        })
        app.get('/clickCount', async(req,res)=>{
            const query = {}
            const cursor = clickCountCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/clickCount/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id:new ObjectId(id)}
            const result = await clickCountCollection.findOne(query)
            res.send(result)
        })
        app.delete('/clickCount' , async(req,res)=>{
            const  query = { }
            const result = await clickCountCollection.deleteMany(query)
            res.send(result.deletedCount>0)
        })

    }finally{}
}
clickCount().catch(console.dir)
app.listen(port, ()=>{
    console.log(`app listen port running ${port}`)
})
