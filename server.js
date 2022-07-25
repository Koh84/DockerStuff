const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs'); 
const cors = require('cors');
const knex = require('knex');
const nodefetch = require('node-fetch');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const morgan = require('morgan');

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();
console.log('check...');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send('it is working')})
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))
app.get('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileGet(req, res, db))
app.post('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => image.handleImage(req, res, db))
app.post('/imageurl', auth.requireAuth, (req, res) => image.handleApiCall(req, res, nodefetch))

app.listen(process.env.PORT || 3000, ()=>{
     console.log(`app is running on port ${process.env.PORT}`);
});

