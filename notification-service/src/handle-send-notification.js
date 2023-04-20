import nodemailer from 'nodemailer';
import axios from 'axios';
import { DATA_SERVICE_URL } from './url.js';

const EMPLOYEES_QUERY = `
    query Employees($saloonId: Int!) {
        employee(where: {saloonId: {_eq: $saloonId}}) {
            id
            name
        }
    }
`;

async function sendNotification(employeeIds) {
  console.log('Sending notification to eployees:', employeeIds);

  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"AASS" <aass@fiit.sk>', // sender address
    to: 'xvajda@stuba.sk, xstriz@stuba.sk', // list of receivers
    subject: 'Success', // Subject line
    text: 'Your booking has been accepted', // plain text body
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return nodemailer.getTestMessageUrl(info);
}

export async function handleSendNotification(job) {
  const { saloonId } = job.variables;

  return await axios
    .post(DATA_SERVICE_URL, {
      query: EMPLOYEES_QUERY,
      variables: { saloonId },
    })
    .then(async ({ data }) => {
      const employeeIds = data.data.employee.map((employee) => employee.id);

      const emailUrl = await sendNotification(employeeIds);

      return job.complete({
        emailUrl,
      });
    })
    .catch((error) => {
      console.log(error);

      return job.error();
    });
}
