require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const corsOptions = require('./config/cors');
const connectDB = require('./config/database');
const credentials = require('./middleware/credentials');
const errorHandlerMiddleware = require('./middleware/error_handler');
const authenticationMiddleware = require('./middleware/authentication');

const server = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = server;

// Allow Credentials
app.use(credentials);

// CORS
app.use(cors(corsOptions));

const swaggerDefinition = YAML.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

const PORT = 4000;

connectDB();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.post(
  '/updateUser2',
  upload.single('avatar'),
  async function (req, res, next) {
    try {
      const { username, email } = req.body;
      const avatar = req.file.buffer; // This is your uploaded file

      if (!username || !email || !avatar) {
        return res.status(422).json({ message: 'Invalid fields' });
      }

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.username = username;
      user.email = email;
      user.avatar = avatar.toString('base64');

      await user.save();

      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error updating user', error: error.message });
    }
  }
);

// application.x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// application/json response
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use(authenticationMiddleware);

// static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Default error handler
app.use(errorHandlerMiddleware);

//root route
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello World!' });
});

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/project', require('./routes/api/project'));
app.use('/api/board', require('./routes/api/board'));
app.use('/api/task', require('./routes/api/task'));

// 404
app.all('*', (req, res) => {
  res.status(404);

  if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('text').send('404 Not Found');
  }
});

mongoose.connection.once('open', () => {
  console.log('DB connected');
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = server;
