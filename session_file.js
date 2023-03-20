import express from 'express'
import session from 'express-session'
import FileStore from 'session-file-store'

const app = express()
const fileStore = FileStore(session)

app.use(session({
    store: new fileStore({
        path: './sessions',
        ttl: 100,
        retries: 2
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

