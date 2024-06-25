const Queue = require('bull');
const Employer = require('lib/models/Employer');

const scheduleCycleQueue = new Queue('scheduleCycle', process.env.REDIS_URL);

module.exports = async function scheduleCycles(message) {
  console.log('Scheduling due cycles');
  message.ack();

  try {
    // Get all employers due for scheduling
    const employers = await Employer.find({
      $and: [
        {
          'settings.shifts_per_cycle': { $ne: null },
          'settings.cycle_length': { $ne: null },
          'settings.cycles_scheduled': { $ne: null },
          'settings.last_cycle_end': { $ne: null },
        }, {
          $expr: {
            $gt: [
              {
                $dateAdd: {
                  startDate: new Date(),
                  unit: 'week',
                  amount: {
                    $multiply: [
                      '$settings.cycle_length',
                      '$settings.cycles_scheduled',
                    ],
                  },
                },
              },
              '$last_cycle_end',
            ],
          },
        },
      ],
    });

    // Add em to tha queue
    employers.forEach((employer) => scheduleCycleQueue.add(employer.toJSON(), {
      removeOnComplete: true,
      removeOnFail: true,
      jobId: employer.id,
    }));
  } catch (err) {
    console.error(err);
  }
};
