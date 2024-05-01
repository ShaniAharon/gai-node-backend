const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require("passport");
require('./passport');  // Importing passport configurations

const app = express()
const http = require('http').createServer(app)

app.use(session({
    secret: 'your session secret', // This should be a random string for security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' } // Secure cookies, auto-set based on the request protocol
}));

// Express App Config
app.use(cookieParser())
// app.use(express.json())
// app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(passport.initialize());
app.use(passport.session());
// app.use((req, res, next) => {
//     console.log(`Incoming request with body size: ${req.get('content-length')}`);
//     next();
// });

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.resolve(__dirname, 'public')))
// } else {
const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000', "http://localhost:80",
        "http://localhost", "http://localhost:5173"],
    credentials: true,
}
app.use(cors(corsOptions))
// }

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const wapRoutes = require('./api/wap/wap.routes')
const { setupSocketAPI } = require('./services/socket.service')

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/wap', wapRoutes)
setupSocketAPI(http)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
// app.get('/**', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})
