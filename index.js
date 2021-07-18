const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req, res) => req.body.name ? JSON.stringify(req.body) : '')


app.get('/api/persons', ((req, res) =>
        Person.find({}).then(persons => {
            res.json(persons)
        })
))

app.get('/info', ((req, res) =>
        Person.find({}).then(persons => {
            res.send(
                `<div>Phonebook has info for ${persons.length} people</div>
                   <div>${new Date().toString()}</div>`)
        })
))

app.get('/api/persons/:id', ((req, res) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
}))

app.delete('/api/persons/:id', ((req, res) => {
    Person.findByIdAndDelete(req.params.id).then(person => {
        res.status(204).end()
    })
}))

app.post('/api/persons', ((req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(404).json({
            error: 'content is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
}))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})