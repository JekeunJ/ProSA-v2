const express = require('express');
const Client = require('lib/models/Client');
const Practice = require('lib/models/Practice');
const Practitioner = require('lib/models/Practitioner');
const client = require('../controllers/client');
const exercise = require('../controllers/exercise');
const healthRecord = require('../controllers/healthRecord');
const injury = require('../controllers/injury');
const message = require('../controllers/message');
const note = require('../controllers/note');
const practice = require('../controllers/practice');
const practitioner = require('../controllers/practitioner');
const user = require('../controllers/user');
const visit = require('../controllers/visit');
const auth = require('../middlewares/auth');

const router = express.Router();

// Practices
router.get('/practices/:id', auth([Practice, Client, Practitioner]), practice.retrievePractice);
router.patch('/practices/:id', auth([Practice]), practice.updatePractice);
router.delete('/practices/:id', auth([Practice]), practice.deletePractice);

// Practitioners
router.get('/practitioners/:id', auth([Practice, Client, Practitioner]), practitioner.retrievePractitioner);
router.patch('/practitioners/:id', auth([Practice, Practitioner]), practitioner.updatePractitioner);
router.delete('/practitioners/:id', auth([Practice, Practitioner]), practitioner.deletePractitioner);
router.get('/practitioners', auth([Practice]), practitioner.listPractitioners);

// Clients
router.get('/clients/:id', auth([Practice, Client, Practitioner]), client.retrieveClient);
router.patch('/clients/:id', auth([Client]), client.updateClient);
router.delete('/clients/:id', auth([Client]), client.deleteClient);
router.get('/clients', auth([Practice, Practitioner]), client.listClients);

// Notes
router.post('/notes', auth([Practitioner]), note.createNote);
router.get('/notes/:id', auth([Practitioner]), note.retrieveNote);
router.patch('/notes/:id', auth([Practitioner]), note.updateNote);
router.delete('/notes/:id', auth([Practitioner]), note.deleteNote);
router.get('/notes', auth([Practitioner]), note.listNotes);

// Message
router.post('/messages', auth([Client, Practitioner]), message.createMessage);
router.get('/messages/:id', auth([Client, Practitioner]), message.retrieveMessage);
router.delete('/messages/:id', auth([Client, Practitioner]), message.deleteMessage);
router.get('/messages', auth([Client, Practitioner]), message.listMessages);

// Injury
router.post('/injuries', auth([Client, Practitioner]), injury.createInjury);
router.get('/injuries/:id', auth([Practice, Client, Practitioner]), injury.retrieveInjury);
router.patch('/injuries/:id', auth([Client, Practitioner]), injury.updateInjury);
router.delete('/injuries/:id', auth([Client, Practitioner]), injury.deleteInjury);
router.get('/injuries', auth([Practice, Client, Practitioner]), injury.listInjuries);

// Visits
router.post('/visits', auth([Client, Practitioner]), visit.createVisit);
router.get('/visits/:id', auth([Practice, Client, Practitioner]), visit.retrieveVisit);
router.patch('/visits/:id', auth([Client, Practitioner]), visit.updateVisit);
router.delete('/visits/:id', auth([Client, Practitioner]), visit.deleteVisit);
router.get('/visits', auth([Practice, Client, Practitioner]), visit.listVisits);

// Exercises
router.post('/exercises', auth([Client, Practitioner]), exercise.createExercise);
router.get('/exercises/:id', auth([Practice, Client, Practitioner]), exercise.retrieveExercise);
router.patch('/exercises/:id', auth([Client, Practitioner]), exercise.updateExercise);
router.delete('/exercises/:id', auth([Client, Practitioner]), exercise.deleteExercise);
router.get('/exercises', auth([Client, Practitioner]), exercise.listExercises);

// Health Records
router.post('/health_records', auth([Client, Practitioner]), healthRecord.createHealthRecord);
router.get('/health_records/:id', auth([Client, Practitioner]), healthRecord.retrieveHealthRecord);
router.patch('/health_records/:id', auth([Client, Practitioner]), healthRecord.updateHealthRecord);
router.delete('/health_records/:id', auth([Client, Practitioner]), healthRecord.deleteHealthRecord);
router.get('/health_records', auth([Client, Practitioner]), healthRecord.listHealthRecords);

// Users
router.get('/users/:id', auth(), user.retrieveUser);
router.patch('/users/:id', auth(), user.updateUser);

module.exports = router;
