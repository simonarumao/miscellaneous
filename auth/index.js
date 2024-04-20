require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')
const path = require('path')
const Joi = require('joi')

const bcrypt = require('bcrypt')
const methodoverride = require('method-override')
const { User } = require("./models/user") // Importing User model
const { log } = require('console')
const cookieParser = require('cookie-parser')

//database
connection()

//middleware
app.use(express.json())
app.use(cors())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodoverride('_method'))
app.use(cookieParser());

app.get('/main', (req, res) => {
    res.render('main')
})

// Render signup form
app.get('/register', (req, res) => {
    res.render('signup')
})

// Render login form
app.get('/login', (req, res) => {
    res.render('login')
})

// User registration endpoint
app.post('/api/users', async (req, res) => {
    try {
        const { error } = validateUser(req.body) // Use validateUser function
        if (error)
            console.log(error.details[0].message);
            // return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res.status(409).send({ message: "User with given email already exists" })

        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await new User({ ...req.body, password: hashPassword }).save()
        // res.status(201).send({ message: "user created successfully" })
        res.redirect('/login')
    }
    catch (error) {
        res.status(500).send({ message: "internal server error" })
    }
})

// User authentication endpoint
app.post("/api/auth", async (req, res) => {
    try {
        const { error } = validateUser(req.body); // Use validateUser function
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(400).send({ message: "invalid email or password" })

        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if (!validPassword)
            return res.status(401).send({ message: "invalid email or password" })

        const token = user.generateAuthToken();
        // res.status(200).send({ data: token, message: "logged in successfully" })
        res.redirect('/main')

    } catch (error) {
        res.status(500).send({ message: "internal server error" })
    }
})

// Validate user input function
const validateUser = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().label("Email"),
        password: Joi.string().required().label("Password")
    })
    return schema.validate(data)
}

// app.post('/logout', (res, req) => {
//     res.clearCookie('token')
//     res.redirect('/login')
// })


// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
