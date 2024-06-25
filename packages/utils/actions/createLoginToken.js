/* Creates a login token for a dev user */
const inquirer = require('inquirer');
const Employee = require('lib/models/Employee');
const Employer = require('lib/models/Employer');
const Token = require('lib/models/Token');
const User = require('lib/models/User');
const connect = require('../helpers/connect');

async function main() {
  await connect();

  const devEmployer = await Employer.findOne({ 'business.name': 'ProSa Dev' });

  const questions = [
    {
      type: 'input',
      name: 'email',
      message: 'What is your email?',
    },
  ];

  const answers = await inquirer.prompt(questions);

  // Find a user with this email
  let user = await User.findOne({ email: answers.email });

  if (!user) {
    const questions2 = [
      {
        type: 'confirm',
        name: 'newUser',
        default: true,
        message: 'No sample data exists for this email address. Would you like to createa new user?',
      },
    ];

    const answers2 = await inquirer.prompt(questions2);

    if (!answers2.newUser) {
      console.log('Logging you in as Robert :)');
      user = await User.findOne({ email: 'robertmay2003@gmail.com' });
    } else {
      user = await User.create({ email: answers.email });

      // Create a new employee on the development employer
      await Employee.create({
        name: answers.email.split('@')[0],
        employer: devEmployer.id,
        user: user.id,
      });
    }
  }

  const token = await Token.create({ user: user.id });

  console.log(`Token: ${token.id}`);
  console.log(`Login link: ${token.getLoginLink()}`);
  if (answers.role === 'employer') console.log(`Employer ID: ${devEmployer.id}`);
  console.log('The login link may not work if auth has not been implemented or tested thoroughly.');
  console.log('If the login link does not work, re-run the script to get a new token, then add an cookie to your browser with the key "auth" and the token as its value.');
  if (answers.role === 'employer') console.log('Set the local storage item for \'Recoverise-Practice\' to the employer ID.');

  process.exit(0);
}

main();
