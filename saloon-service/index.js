import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import express from 'express';
import { DATA_SERVICE_URL } from './src/url.js';
import { ZBClient } from 'zeebe-node';

const zbc = new ZBClient();
const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/ping', (_, res) => {
  res.status(200).end();
});

app.post('/api/v1/saloon/book', (req, res) => {
  const { id } = req.query;
  const { serviceIds, booking } = req.body;

  const CREATE_BOOKING_QUERY = `
    mutation MyMutation {
      insertBooking(
        objects: {
          date: "${booking}"
          status: "created"
          saloonId: ${id}
          serviceIds: "${serviceIds.map((id) => id).join(',')}"
        }
      ) {
        returning {
          id
        }
      }
    }
  `;

  axios
    .post(DATA_SERVICE_URL, {
      query: CREATE_BOOKING_QUERY,
    })
    .then(async (response) => {
      const bookingId = response.data?.data?.insertBooking?.returning?.[0]?.id;

      const outcome = await zbc.createProcessInstanceWithResult('new-booking', {
        bookingId,
        date: booking,
      });

      res.json({ outcome, bookingId });
    })
    .catch((error) => {
      res.status(400).end();
      console.log(error);
    });
});

const confirmWorker = zbc.createWorker({
  taskType: 'confirm-booking',
  taskHandler: async (job) => {
    const { id } = job.variables;

    const CONFIRM_BOOKING_QUERY = `
      mutation ConfirmBookingMutation {
        updateBookingByPk(pkColumns: {id: ${id}}, _set: {status: "approved"}) {
          id
          saloonId
        }
      }
    `;

    // update booking state
    return await axios
      .post(DATA_SERVICE_URL, {
        query: CONFIRM_BOOKING_QUERY,
      })
      .then(() => {
        return job.complete();
      })
      .catch((error) => {
        console.log(error);

        confirmWorker.log(error);

        return job.error();
      });
  },
});

const rejectWorker = zbc.createWorker({
  taskType: 'reject-booking',
  taskHandler: async (job) => {
    const { id } = job.variables;

    const REJECT_BOOKING_QUERY = `
        mutation RejectBookingMutation {
          updateBookingByPk(pkColumns: {id: ${id}}, _set: {status: "rejected"}) {
            id
          }
        }
      `;

    return await axios
      .post(DATA_SERVICE_URL, {
        query: REJECT_BOOKING_QUERY,
      })
      .then(() => {
        return job.complete();
      })
      .catch((error) => {
        console.log(error);

        rejectWorker.log(error);

        return job.error();
      });
  },
});

const verifyWorker = zbc.createWorker({
  taskType: 'verify-booking',
  taskHandler: async (job) => {
    const { id, date } = job.variables;

    verifyWorker.log('Verifying booking', id);

    // compare two dates
    const today = new Date();
    const bookingDate = new Date(date);
    if (today > bookingDate) {
      return job.complete({
        valid: false,
      });
    }

    const VERIFY_BOOKING_QUERY = `
      mutation VerifyBookingMutation {
        updateBookingByPk(pkColumns: {id: ${id}}, _set: {status: "verified"}) {
          id
        }
      }
    `;

    return await axios
      .post(DATA_SERVICE_URL, {
        query: VERIFY_BOOKING_QUERY,
      })
      .then(() => {
        return job.complete({
          valid: true,
        });
      })
      .catch((error) => {
        console.log(error);

        verifyWorker.log(error);

        return job.error({
          valid: false,
        });
      });
  },
});

app.listen(port, () => {
  console.log(`Saloon service is running at http://localhost:${port}`);
});
