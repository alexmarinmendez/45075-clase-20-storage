import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'

const app = express()
const uri =  "mongodb://localhost:27017"

app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: "clase-20-45075",
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100
    }),
    secret: 'c0d3r',
    resave: true,
    saveUninitialized: true
}))

const auth = (req, res, next) => {
    if (req.session?.user) return next()
    return res.status(401).send('Auth error')
}

app.get('/', (req, res) => res.send('Ok'))

app.get('/login', (req, res) => {
    const { username } = req.query
    if ((username == '') || !username) return res.send('Need a username')
    req.session.user = username
    res.send('Login success')
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => res.send(err))
})

app.get('/private', auth, (req, res) => {
    res.send('Private Page')
})

app.listen(8080, () => console.log('Server Up'))

