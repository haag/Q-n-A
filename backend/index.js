const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');


const app = express()

let questions = []


app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))


// app.get('/', (req,res) => {
//     res.send("The app is running")
// })

app.get('/', (req,res) => {
    const qs = questions.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        answers: q.answers.length,
    }))
    res.send(qs)
})

app.get('/:id', (req,res) => {
    const question = questions.filter(q => (q.id === parseInt(req.params.id)))
    if (question.length > 1) return res.status(500).send()
    if (question.length === 0) return res.status(404).send()
    res.send(question[0])
})

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://sirk.auth0.com/.well-known/jwks.json`,
    }),
    audience: '2Lq20Gd0FgASA4LwjWFPS74AYBqmcvJL',
    issuer: `https://sirk.auth0.com/`,
    algorithms: ['RS256']
})

app.post('/', checkJwt, (req, res) => {
    const {title, description} = req.body
    const newQuestion = {
        id: questions.length + 1,
        title,
        description,
        answers: [],
        author: req.user.name
    }
    questions.push(newQuestion)
    res.status(201).send()
})

app.post('/answer/:id', checkJwt, (req,res) => {
    const {answer} = req.body
    const question = questions.filter(q => (q.id === parseInt(req.params.id)))
    if (question.length > 1) return res.status(500).send()
    if (question.length === 0) return res.status(404).send()
    question[0].answers.push({
        answer,
        author: req.user.name,
    })
    res.status(200).send()
})

app.delete('/:id', checkJwt, (req, res) => {
    const { id } = req.params
    questions = questions.filter(q => (q.id != id))
    res.status(200).json(questions)
})

app.put('/:id', checkJwt, (req, res) => {
    const { id } = req.params
    let questionIndex = questions.findIndex(q => q.id == id)
    if (questionIndex >= 0) {
        questions[questionIndex] = {...questions[questionIndex], ...req.body}
        res.status(200).json(questions)
    } else {
        res.status(404).json({ msg: `cannot find q with id ${id}`})
    }
})

app.listen(8081, () => {
    console.log('Listening on port 8081')
})