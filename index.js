const express = require('express')
const {engine} = require('express-handlebars')
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app  = express()

const conn = require('./db/conn')
//Models
const Tought = require('./models/Tought')
const User = require('./models/User')

// Import Routers
const toughtRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

// Import Controller
const ToughtController = require('./controllers/ToughtController')
app.use(express.static("public"));

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

// receber resposta do body
app.use(
    express.urlencoded({
        extended:true
    })
)


app.use(express.json())

//session middleware
app.use(session({
    name:"session",
    secret:"nosso_secret",
    resave:false,
    saveUninitialized: false,
    store: new fileStore({
        logFn: function() {},
        path: require('path').join(require('os').tmpdir(), 'session'),
    }),
    cookie:{
        secure:false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly:true
    }
}))

//Flash message
app.use(flash())

// set session to res
app.use((req, res, next) =>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})
// Routers
app.use('/toughts', toughtRoutes)
app.use('/', authRoutes)

app.get('/', ToughtController.showToughts)

conn
    .sync()
    .then(()=>{
        app.listen(3001)
}).catch(error=>console.log(error))