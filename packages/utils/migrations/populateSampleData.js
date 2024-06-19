/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* Populate database with a bunch of sample data for testing the dashboard */
const Client = require('lib/models/Client');
const Exercise = require('lib/models/Exercise');
const HealthRecord = require('lib/models/HealthRecord');
const Injury = require('lib/models/Injury');
const Message = require('lib/models/Message');
const Note = require('lib/models/Note');
const Practice = require('lib/models/Practice');
const Practitioner = require('lib/models/Practitioner');
const User = require('lib/models/User');
const Visit = require('lib/models/Visit');
const mongoose = require('lib/mongoose');
const { dropRecordsTable, createRecordsTable } = require('lib/services/sql.service');
const slugify = require('slugify');
const data = require('../data/populateSampleData');
const connect = require('../helpers/connect');

async function populateSampleData() {
  await connect();

  /* Reset DB */
  await mongoose.connection.db.dropDatabase();

  /* Reset SQL table */
  await dropRecordsTable();
  await createRecordsTable();

  /* Create users for Alex, Robert, and Immanuel */
  const alexUser1 = await User.create({
    email: 'ablasber@andrew.cmu.edu',
    phone: '+17744040650',
  });
  const robertUser1 = await User.create({
    email: 'robertmay2003@gmail.com',
    phone: '+16102338511',
  });
  const immanuelUser1 = await User.create({
    email: 'ichuksokoh@gmail.com',
    phone: '+19294314265',
  });

  /* Create a practice */
  const practice = await Practice.create({
    name: 'Recoverise Dev',
    owner: robertUser1.id,
    staff: [robertUser1.id, alexUser1.id, immanuelUser1.id],
    address: {
      city: 'Pittsburgh',
      country: 'USA',
      line1: '5032 Forbes Ave',
      line2: 'SMC 4445',
      postal_code: 15213,
      state: 'PA',
    },
    email: 'dev@recoverise.com',
    website: 'https://recoverise.com',
  });

  /* Create +practitioner users for Alex, Robert, and Immanuel */
  const alexUser2 = await User.create({
    email: 'ablasber+practitioner@andrew.cmu.edu',
    phone: '+17744040650',
  });
  const robertUser2 = await User.create({
    email: 'robertmay2003+practitioner@gmail.com',
    phone: '+16102338511',
  });
  const immanuelUser2 = await User.create({
    email: 'ichuksokoh+practitioner@gmail.com',
    phone: '+19294314265',
  });

  /* Create practitioners for Alex+practitioner and Robert+practitioner */
  const alexPractitioner = await Practitioner.create({
    name: 'Alex Blasberg',
    user: alexUser2.id,
    practice: practice.id,
    email: alexUser2.email,
    phone: alexUser2.phone,
  });

  const robertPractitioner = await Practitioner.create({
    name: 'Robert May',
    user: robertUser2.id,
    practice: practice.id,
    email: robertUser2.email,
    phone: robertUser2.phone,
  });

  const immanuelPractitioner = await Practitioner.create({
    name: 'Immanuel Chuks-Okoh',
    user: immanuelUser2.id,
    practice: practice.id,
    email: immanuelUser2.email,
    phone: immanuelUser2.phone,
  });

  /* Create +client users for Alex, Robert, and Immanuel */
  const alexUser3 = await User.create({
    email: 'ablasber+client@andrew.cmu.edu',
    phone: '+17744040650',
  });
  const robertUser3 = await User.create({
    email: 'robertmay2003+client@gmail.com',
    phone: '+16102338511',
  });
  const immanuelUser3 = await User.create({
    email: 'ichuksokoh+client@gmail.com',
    phone: '+19294314265',
  });

  /* Create clients for Alex+client and Robert+client */
  // eslint-disable-next-line no-unused-vars
  const alexClient = await Client.create({
    name: 'Alex Blasberg',
    user: alexUser3.id,
    practitioner: alexPractitioner.id,
    practice: practice.id,
    sex: 'male',
    birthdate: new Date('Aug 19 2000'), // IDK your birthday :'(
    email: alexUser3.email,
    phone: alexUser3.phone,
    ai_consent: true,
  });

  // eslint-disable-next-line no-unused-vars
  const robertClient = await Client.create({
    name: 'Robert May',
    user: robertUser3.id,
    practitioner: robertPractitioner.id,
    practice: practice.id,
    sex: 'male',
    birthdate: new Date('Jan 29 2003'),
    email: robertUser3.email,
    phone: robertUser3.phone,
    ai_consent: true,
  });

  // eslint-disable-next-line no-unused-vars
  const immanuelClient = await Client.create({
    name: 'Immanuel Chuks-Okoh',
    user: immanuelUser3.id,
    practitioner: immanuelPractitioner.id,
    practice: practice.id,
    sex: 'male',
    birthdate: new Date('Oct 4 2008'), // IDK your birthday :'(
    email: immanuelUser3.email,
    phone: immanuelUser3.phone,
    ai_consent: true,
  });

  console.log('Created user clients');

  for (const practitioner of [alexPractitioner, robertPractitioner, immanuelPractitioner]) {
    /* Create 5 miscellaneous clients per practitioner */
    for (let i = 0; i < 5; i++) {
      // Create the user
      const user = await User.create({ email: `client+${slugify(practitioner.name)}_${i}@gmail.com` });

      // Create the client
      await Client.create({
        name: data.names[Math.floor(Math.random() * data.names.length)],
        user: user.id,
        practitioner: practitioner.id,
        practice: practice.id,
        sex: Math.random() < 0.5 ? 'male' : 'female',
        birthdate: new Date(
          data.earliestBirthdate.getTime()
          + Math.floor(Math.random() * (data.latestBirthdate - data.earliestBirthdate)),
        ),
        ai_consent: Math.random() < 0.85,
      });
    }

    console.log(`Created miscellaneous clients for ${practitioner.name}`);

    // Find all clients for this practitioner
    const clients = await Client.find({ practitioner: practitioner.id });

    // Only allow one client with no injuries!
    let skippedInjuries = false;

    for (const client of clients) {
      /* Create 0 - 3 messages per client */
      for (let i = 0; i < Math.round(Math.random() * 3); i++) {
        const from = Math.random() < 0.5 ? 'practitioner' : 'client';
        await Message.create({
          practitioner: practitioner.id,
          client: client.id,
          from,
          ...(data.messages[from][Math.floor(Math.random() * data.messages[from].length)]),
        });

        /* Create 0 - 3 replies per message */
        for (let j = 0; j < Math.round(Math.random() * 3); j++) {
          const replyFrom = Math.random() < 0.5 ? 'practitioner' : 'client';
          await Message.create({
            practitioner: practitioner.id,
            client: client.id,
            from: replyFrom,
            ...(data.messages[replyFrom][Math.floor(Math.random() * data.messages[replyFrom].length)]),
          });
        }
      }

      console.log(`Created messages for ${client.name}`);

      /* Create 0 - 3 visits per client (hard code to 3 for devs) */
      const nVisits = [robertClient.id, alexClient.id, immanuelClient.id].includes(client.id) ? 3 : Math.round(Math.random() * 3);
      const visits = []; // This will be useful for health records
      for (let i = 0; i < nVisits; i++) {
        const date = new Date(
          data.earliestAppointment.getTime()
          + Math.floor(Math.random() * (data.latestAppointment - data.earliestAppointment)),
        );

        const statusOptions = date < Date.now() ? ['upcoming', 'canceled'] : ['canceled', 'missed', 'visited'];

        const visit = await Visit.create({
          client: client.id,
          practitioner: practitioner.id,
          practice: practice.id,
          date,
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        });
        visits.push(visit);

        /* Create 0 - 2 notes per visit */
        for (let j = 0; j < Math.round(Math.random() * 2); j++) {
          await Note.create({
            client: client.id,
            practitioner: practitioner.id,
            visit: visit.id,
            ...(data.notes[Math.floor(Math.random() * data.notes.length)]),
          });
        }
      }

      console.log(`Created visits for ${client.name}`);

      /* Create 0 - 3 injuries per client (hard code to 3 for devs) */
      const nInjuries = [robertClient.id, alexClient.id, immanuelClient.id].includes(client.id) ? 3 : Math.round(Math.random() * 3);
      if (nInjuries === 0) skippedInjuries = true;

      for (let i = 0; i < Math.max(skippedInjuries ? 1 : 0, nInjuries); i++) {
        const joints = ['ankle', 'knee', 'wrist', 'elbow', 'shoulder', 'hip'];
        const sources = ['client', 'practitioner', 'model'];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const joint = joints[Math.floor(Math.random() * joints.length)];
        const diagnosis = data.diagnoses[joint][Math.floor(Math.random() * data.diagnoses[joint].length)];

        const injury = await Injury.create({
          client: client.id,
          practitioner: practitioner.id,
          source: Math.random() < 0.7 ? 'practitioner' : 'client',
          injured_at: new Date(
            data.earliestInjury.getTime()
            + Math.floor(Math.random() * (data.latestInjury - data.earliestInjury)),
          ),
          joint,
          side: Math.random() < 0.5 ? 'left' : 'right',
          diagnosis: {
            tear: Math.random() < 0.5,
            diagnosis: diagnosis.diagnosis,
            treatment: diagnosis.treatment,
            estimated_recovery_time: diagnosis.estimatedRecoveryTime,
            source,
            model_accuracy: source === 'model' ? Math.random() : null,
          },
          recovered: Math.random() < 0.2, // Most should be unrecovered
        });

        console.log(`Created injury "${injury.diagnosis.diagnosis}" for client ${client.name}`);

        /* Create a health record for every visit after this injury */
        for (const visit of visits.filter((v) => injury.injured_at < v.date)) {
          // We don't awlays need a health record -- we need to ensure our UI & arch can handle visits with no health records
          if (Math.random() < 0.2) continue;

          const painRatings = ['none', 'low', 'medium', 'high', 'very_high'];
          await HealthRecord.create({
            created: new Date(
              visit.date
              + Math.floor(Math.random() * (1000 * 60 * 60 * 3)), // Within 3 hours of the visit
            ),
            client: client.id,
            practitioner: practitioner.id,
            injury: injury.id,
            visit: visit.id,
            source: 'practitioner',
            rom: {
              forward_flexion: Math.floor(Math.random() * 180),
              abduction: Math.floor(Math.random() * 180),
              external_rotation: Math.floor(Math.random() * 90),
              internal_rotation: Math.floor(Math.random() * 90),
            },
            strength: {
              supraspinatus: Math.floor(Math.random() * 150),
              adduction: Math.floor(Math.random() * 150),
              external_rotation: Math.floor(Math.random() * 150),
              internal_rotation: Math.floor(Math.random() * 150),
              liftoff: Math.floor(Math.random() * 150),
            },
            pain: {
              sleep: painRatings[Math.floor(Math.random() * painRatings.length)],
              rest: painRatings[Math.floor(Math.random() * painRatings.length)],
              active: painRatings[Math.floor(Math.random() * painRatings.length)],
            },
          });
        }

        /* Create 0 - 2 imported/self-reported health records */
        for (let j = 0; j < Math.round(Math.random() * 2); j++) {
          const painRatings = ['none', 'low', 'medium', 'high', 'very_high'];
          await HealthRecord.create({
            created: new Date(
              injury.injured_at
              + Math.floor(Math.random() * (Date.now() - injury.injured_at)),
            ),
            client: client.id,
            practitioner: practitioner.id,
            injury: injury.id,
            source: Math.random() < 0.5 ? 'client' : 'imported',
            rom: {
              forward_flexion: Math.floor(Math.random() * 180),
              abduction: Math.floor(Math.random() * 180),
              external_rotation: Math.floor(Math.random() * 90),
              internal_rotation: Math.floor(Math.random() * 90),
            },
            strength: {
              supraspinatus: Math.floor(Math.random() * 150),
              adduction: Math.floor(Math.random() * 150),
              external_rotation: Math.floor(Math.random() * 150),
              internal_rotation: Math.floor(Math.random() * 150),
              liftoff: Math.floor(Math.random() * 150),
            },
            pain: {
              sleep: painRatings[Math.floor(Math.random() * painRatings.length)],
              rest: painRatings[Math.floor(Math.random() * painRatings.length)],
              active: painRatings[Math.floor(Math.random() * painRatings.length)],
            },
          });
        }

        console.log(`Created health records for injury "${injury.diagnosis.diagnosis}" for client ${client.name}`);

        /* Create exercises per visit per injury */
        for (const visit of visits.filter((v) => injury.injured_at < v.date)) {
          // Don't always create exercisess -- we need to ensure our UI & arch can handle visits with no exercises
          if (Math.random() < 0.2) continue;

          await Exercise.create({
            client: client.id,
            practitioner: practitioner.id,
            injury: injury.id,
            visit: visit.id,
            source: 'practitioner', // Clients can't assign during visits, GPT taken care of by worker
            ...(data.exercises[injury.joint][Math.floor(Math.random() * data.exercises[injury.joint].length)]),
            weight: Math.random() < 0.5 ? null : (Math.floor(Math.random() * 10) * 5), // Can be null or some multiple of 5 up to 50
            repetitions: Math.floor(Math.random() * 20) + 1,
            sets: Math.floor(Math.random() * 10) + 1,
            per_day: Math.floor(Math.random() * 3) + 1,
            per_week: Math.floor(Math.random() * 7) + 1,
          });
        }

        /* Create 0 - 2 exercises per injury */
        for (let j = 0; j < Math.round(Math.random() * 2); j++) {
          await Exercise.create({
            client: client.id,
            practitioner: practitioner.id,
            injury: injury.id,
            source: Math.random() < 0.5 ? 'client' : 'practitioner',
            ...(data.exercises[injury.joint][Math.floor(Math.random() * data.exercises[injury.joint].length)]),
            weight: Math.random() < 0.5 ? null : (Math.round(Math.random() * 10) * 5), // Can be null or some multiple of 5 up to 50
            repetitions: Math.round(Math.random() * 20) + 1,
            sets: Math.round(Math.random() * 10) + 1,
            per_day: Math.round(Math.random() * 3) + 1,
            per_week: Math.round(Math.random() * 7) + 1,
          });
        }

        console.log(`Created exercises for injury "${injury.diagnosis.diagnosis}" for client ${client.name}`);

        /* Create notes per visit per injury */
        for (const visit of visits.filter((v) => injury.injured_at < v.date)) {
          // Don't always create notes -- we need to ensure our UI & arch can handle visits with no notes
          if (Math.random() < 0.5) continue;

          await Note.create({
            client: client.id,
            practitioner: practitioner.id,
            injury: injury.id,
            visit: visit.id,
            ...(data.notes[Math.floor(Math.random() * data.notes.length)]),
          });
        }

        /* Create 0 - 2 notes per injury */
        for (let j = 0; j < Math.round(Math.random() * 2); j++) {
          await Note.create({
            client: client.id,
            practitioner: practitioner.id,
            injury: injury.id,
            ...(data.notes[Math.floor(Math.random() * data.notes.length)]),
          });
        }

        console.log(`Created notes for injury "${injury.diagnosis.diagnosis}" for client ${client.name}`);
      }

      console.log(`Created all injuries for client ${client.name}`);

      /* Create 0 - 2 notes per client */
      for (let i = 0; i < Math.round(Math.random() * 2); i++) {
        await Note.create({
          client: client.id,
          practitioner: practitioner.id,
          ...(data.notes[Math.floor(Math.random() * data.notes.length)]),
        });
      }

      console.log(`Created notes for client ${client.name}`);
      console.log(`Done with client ${client.name}!`);
    }
    console.log(`Done with practitioner ${practitioner.name}!`);
  }

  console.log('Done!');
  process.exit(0);
}

(async () => populateSampleData())();
