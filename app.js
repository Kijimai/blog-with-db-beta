const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejs = require('ejs')
const Post = require('./models/postModel')
const app = express()
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

//connects to the local mongo database
mongoose.connect('mongodb://localhost:27017/userPostsDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
  console.log("Database connected")
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', async(req, res) =>  {
  const posts = await Post.find({})
  res.render('home', { posts })
})

app.get('/post/:id', async(req, res, next) => {
  const post = await Post.findById(req.params.id)
  if(!post) {
    return next(new ExpressError('Post not found!', 404))
  }
  res.render('displayPost', { post:post })
})

app.post('/', async(req, res) => {
  const { postTitle, postContent } = req.body
  const currentdate = new Date() 
  const dateTime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds()

  const userPost = new Post({
    title: postTitle,
    postContent: postContent,
    datePosted: dateTime
  })
  await userPost.save()
  res.redirect(`/post/${userPost._id}`) 
})

// app.delete('/posts/:id', async(req, res) => {

// })

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went terribly wrong!' } = err
  console.log("Something wrong has occured!")
  res.status(status).render('error', { message: message , errStack: err.stack})
})

app.listen(process.env.PORT || 3000,  () => {
  console.log("App listening on port 3000.")
})
