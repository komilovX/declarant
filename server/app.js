const app = require('express')()
const bodyParser = require('body-parser')
const passport = require('passport')
const passportStrategy = require('./middleware/passport')
const authRoutes = require('./routes/auth.routes')
const documentRoutes = require('./routes/document.routes')
const ordersRoutes = require('./routes/orders.routes')
const serviceRoutes = require('./routes/service.routes')
const clientRoutes = require('./routes/clients.routes')
const notificationRoutes = require('./routes/notification.routes')
const sequelize = require('./database')
sequelize
  .sync()
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => console.log(`Database error: ${err}`))

app.use(passport.initialize())
passport.use(passportStrategy)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/document', documentRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/service', serviceRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/notification', notificationRoutes)

module.exports = app
