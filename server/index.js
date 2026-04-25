const express = require('express')
const dbconnection = require('./db')
const cors = require('cors')
const upload = require('./Middleware/ImageUpload')
const { verifyToken, isAdmin } = require('./Middleware/Auth')

//express is a web framework which is responsible for handle incoming request and response.

const app = express()
//app is an instance of express which we is used to define routes and middleware and handle incoming request and response.

const PORTNUMBER = 7000
//portnumber which server listens to

//app.listen is a method which is used to start the server and listen to incoming request on specified port number.
//the callback function is executed when the server is successfully started
app.listen(PORTNUMBER,()=>{
    console.log(`Server is running on port ${PORTNUMBER}`)
})
dbconnection()



//app.get is a method which is used to define a route for handling request(POST,GET,PUT,DELETE)

// /api is endpoint
// req is the request object which contains information about the incoming request
// res is the response object which is used to send response back to the client
app.get('/apitest',(req,res)=>{
    res.send('API is working fine') // response text from server
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['auth-token']
}))
app.use(express.json())
app.use('/user', require('./Routes/UserRoutes'))
app.use('/admin', require('./Routes/AdminRoutes'))

app.use('/product', require('./Routes/ProductRoutes'))
app.use('/category',require('./Routes/CategoryRoutes'))
app.use('/booking', require('./Routes/BookingRoutes'))
app.use('/payment', require('./Routes/PaymentRoutes'))
app.use('/adopt', require('./Routes/AdoptRoutes'))
app.use('/pet', require('./Routes/PetRoutes'))

app.post('/image/upload', verifyToken, isAdmin, upload.single('petimage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the URL path that can be stored in DB
  const imageUrl = `/image/${req.file.filename}`;
  res.json({ filename: req.file.filename, url: imageUrl });
});

app.use('/image', express.static("./Uploads"))
