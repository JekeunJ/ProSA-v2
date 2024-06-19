/* Creates a login token for a dev user -- palceholder until auth is built */
const inquirer = require('inquirer');
const Practice = require('lib/models/Practice');
const Token = require('lib/models/Token');
const User = require('lib/models/User');
const connect = require('../helpers/connect');

async function main() {
  await connect();

  const questions = [
    {
      type: 'input',
      name: 'email',
      message: 'What is your email?',
    },
    {
      type: 'list',
      name: 'role',
      message: 'What role are you logging in as?',
      choices: ['Employer', 'Employee'],
      filter(val) {
        return val.toLowerCase();
      },
    },
  ];

  const answers = await inquirer.prompt(questions);

  // Find a user with this email
  const extensions = { employer: '', employee: '+employee' };
  const userEmail = `${answers.email.split('@')[0]}${extensions[answers.role]}@${answers.email.split('@')[1]}`;

  let user = await User.findOne({ email: userEmail });

  if (!user) {
    const questions2 = [
      {
        type: 'confirm',
        name: 'newUser',
        default: true,
        message: 'No sample data exists for this email address. Would you like to createa new user?',
      },
      {
        type: 'confirm',
        name: 'addToPractice',
        default: true,
        message: 'Would you like to be added to the development practice?',
        when: (answers) => answers.newUser,
      },
    ];

    const answers2 = await inquirer.prompt(questions2);

    if (!answers2.newUser) {
      console.log('Logging you in as Robert ;)');
      user = await User.findOne({ email: `robertmay2003${extensions[answers.role]}@gmail.com` });
    } else {
      user = await User.create({ email: userEmail });

      if (answers2.addToPractice) await Practice.findOneAndUpdate(
        { name: 'ProSa Dev' }, // There should only be one of these at a time, hopefully
        { $addToSet: { staff: user.id } }, // Add user to staff
      );
    }
  }

  const token = await Token.create({ user: user.id });
  const practice = await Practice.findOne({ name: 'ProSa Dev' });

  console.log(`Token: ${token.id}`);
  console.log(`Login link: ${token.getLoginLink()}`);
  if (answers.role === 'practice') console.log(`Practice ID: ${practice.id}`);
  console.log('The login link may not work if auth has not been implemented or tested thoroughly.');
  console.log('If the login link does not work, re-run the script to get a new token, then add an cookie to your browser with the key "auth" and the token as its value.');
  if (answers.role === 'practice') console.log('Set the local storage item for \'Recoverise-Practice\' to the practice ID.');

  process.exit(0);
}

main();
