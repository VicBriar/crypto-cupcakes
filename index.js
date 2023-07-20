require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3000 } = process.env;
const {
  SECRET,
  AUDIENCE,
  CLIENT,
  BASE_URL
} = process.env;
const { auth, requiresAuth } = require('express-openid-connect');
const config = {
  authRequired: true,
  auth0Logout: true,
  secret: SECRET,
  baseURL: AUDIENCE,
  clientID: CLIENT,
  issuerBaseURL: BASE_URL,
}

const { User, Cupcake } = require('./db');

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(auth(config));


app.get('/cupcakes', requiresAuth(), async (req, res, next) => {
  if(true){
    try {
      const cupcakes = await Cupcake.findAll();
      res.send(cupcakes);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});


app.get('/', async (req, res, next) => {
  console.log(req.oidc.user);
  const user = req.oidc.user;
  const html = `<h1>cupcakes app</h1>
<h2>Welcome, ${user.name}</h2>
<p>username: ${user.email}</p>
<img src=${user.picture}  referrerpolicy="no-referrer" />`;

res.send(html);

})
// error handling middleware
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

app.listen(PORT, () => {
  console.log(`Cupcakes are ready at http://localhost:${PORT}`);
});

