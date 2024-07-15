require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

/* Models */
const Person = require('./models/person')

/* Middlewares */
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

/* Morgan middleware */
morgan.token('body', request =>
{
  return JSON.stringify(request.body)
})

/* Tiny format + token */
const tiny_format = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(tiny_format))

/* Defined data */

let persons =
[
  {
    'name': 'Arto Hellas',
    'number': '040-123456',
    'id': '1'
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': '2'
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': '3'
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': '4'
  }
]

/* ROUTES, main */

/*
app.get("/", (request, response) =>
{

});

*/

/* ROUTES, post */

app.post('/api/persons', (request, response, next) =>
{
  const body = request.body

  if (!body.name || !body.number)
  {
    return response.status(400).json({ error: 'name or number missing.' })
  }

  if(persons.map(person => person.name).some(name => name === body.name))
  {
    request.method = 'PUT'
    request.url = `/api/persons/${request.body.id}`
    next()
    return
  }

  const person = new Person
  ({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson =>
  {
    response.json(savedPerson)
  }).catch(error => next(error))
})

/* ROUTES, put */

app.put('/api/persons/:id', (request, response, next) =>
{
  const body = request.body

  const person =
    {
    	name: body.name,
    	number: body.number
    }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' }).then(updatedPerson =>
  {
    response.json(updatedPerson)
  }).catch(error => next(error))
})

/* GET routes */

app.get('/info', (request, response) =>
{
  Person.countDocuments({}).then(count =>
  {
    const date_time = new Date()
    const info = `<p>Phonebook has info for ${count} people</p><p>${date_time}</p>`
    response.send(info)
  })
})

app.get('/api/persons', (request, response) =>
{
  //response.json(persons);
  Person.find({}).then(people =>
  {
    response.json(people)
  })
})


app.get('/api/persons/:id', (request, response, next) =>
{
  Person.findById(request.params.id).then(person =>
  {
    if(person)
    {
      response.json(person)
    }
    else
    {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

/* ROUTES, delete */
app.delete('/api/persons/:id', (request, response, next) =>
{
  Person.findByIdAndDelete(request.params.id).then( () =>
  {
    response.status(204).end()

  }).catch(error => next(error))
})

/* Wrong routes */

const unknownEndpoint = (request, response) =>
{
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

/* Error handling */
const errorHandler = (error, request, response, next) =>
{
  console.error(error.message)

  if(error.name === 'CastError')
  {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if(error.name === 'ValidationError')
  {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

/* Pääohjelma */

const PORT = process.env.PORT || 3001

app.listen(PORT, () =>
{
  console.log(`Server running on port ${PORT}`)
})