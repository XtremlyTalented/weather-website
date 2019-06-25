const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// define Paths for Express Config
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// SetUp Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectory))



app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Xtermly Talented'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Issac XT'
    })
})

app.get('/help',(req, res) => {
    res.render('help', {
        title: 'Help',
        Message: 'This is NO Help. stay out!',
        help: 'Help yourself!'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a Search tearm'
        })
    }
    console.log(req.query)
    res.send({
        products:[]
    })
})

app.get('/help/*', (req, res)=> {
    res.render('404error', {
        Message: 'The Help Arcticle is not Found'
    })
})

app.get('*', (req, res) => {
    res.render('404error', {
        Message: 'Error. Page Doest Exist'
    })
})

app.listen(port, () => {
    console.log('Server is Up on port ' + port + '!')
})