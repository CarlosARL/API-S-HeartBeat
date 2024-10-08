const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoURI = mongodbatlasURL;

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

app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).send('Erro ao buscar pacientes');
  }
});

app.get('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.json(patient);
  } catch (error) {
    res.status(500).send('Erro ao buscar paciente');
  }
});

app.post('/patients', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).send('Erro ao criar paciente');
  }
});

app.put('/patients/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).send('Erro ao atualizar paciente');
  }
});

app.delete('/patients/:id', async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.send('Paciente deletado com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao deletar paciente');
  }
});

app.get('/patients/:id/vitalsigns', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.json(patient.vitalSigns);
  } catch (error) {
    res.status(500).send('Erro ao buscar sinais vitais');
  }
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor de pacientes rodando na porta ${PORT}`));
