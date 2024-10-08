const net = require('net');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://carlisdjandres6:OzcBVqlCnmAIPDgu@cluster0.tuet2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));
const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  diagnosis: String,
  medications: [String],
  vitalSigns: [{
    timestamp: Date,
    bpm: Number,
    spo2: Number
  }]
});

const Patient = mongoose.model('Patient', PatientSchema);

const server = net.createServer((socket) => {
  console.log('Client connected');
  
  socket.on('data', async (data) => {
    const { patientId, bpm, spo2 } = JSON.parse(data.toString());
    console.log(`Received data: Patient ID ${patientId}, BPM ${bpm}, SPO2 ${spo2}`);
    
    try {
      const patient = await Patient.findById(patientId);
      if (patient) {
        patient.vitalSigns.push({ timestamp: new Date(), bpm, spo2 });
        await patient.save();
        io.emit('vitalSigns', { patientId, bpm, spo2 });
      }
    } catch (error) {
      console.error('Error updating patient vital signs:', error);
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});

const httpServer = http.createServer();
const io = socketIO(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected to WebSocket');
  socket.on('disconnect', () => {
    console.log('Client disconnected from WebSocket');
  });
});

httpServer.listen(5001, () => {
  console.log('WebSocket server listening on port 5001');
});