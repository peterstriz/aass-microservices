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
}

export async function handleSendNotification(req, res) {
  const saloonId = req.body.saloonId;

  axios
    .post(DATA_SERVICE_URL, {
      query: EMPLOYEES_QUERY,
      variables: { saloonId },
    })
    .then(async ({ data }) => {
      const employeeIds = data.data.employee.map((employee) => employee.id);

      await sendNotification(employeeIds);

      res.send(employeeIds);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
}
