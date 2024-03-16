const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/User');
const Document = require('./models/Document');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = 'mongodb+srv://Nikh####:###############@cluster1.6tx8sri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Passport JWT Strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.user._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

const app = express(); // Express app instance

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/api', documentRoutes);

// WebSocket Logic
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('New WebSocket Connection');

  socket.on('join', async (documentId) => {
    socket.join(documentId);
    console.log(`Socket ${socket.id} joined room ${documentId}`);
  });

  socket.on('edit', async (data) => {
    // Handle edit operation
    io.to(data.documentId).emit('update', data);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket Disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to Real-Time Collaboration Tool');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
