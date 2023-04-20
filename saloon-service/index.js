import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import express from 'express';
import { DATA_SERVICE_URL } from './src/url.js';

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/ping', (_, res) => {
  res.status(200).end();
});

app.post('/api/v1/saloon/:id/book', (req, res) => {
  const { id } = req.params;
  const { serviceIds, booking } = req.body;

  const CREATE_BOOKING_QUERY = `
    mutation MyMutation {
      insertBooking(
        objects: {
          date: "${booking}"
          status: "open"
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
    .then((response) => {
      res.json({ id: response.data?.data?.insertBooking?.returning?.[0]?.id });
    })
    .catch((error) => {
      res.status(400).end();
      console.log(error);
    });
});

app.post('/api/v1/booking/:id/confirm', (req, res) => {
  const { id } = req.params;

  const CONFIRM_BOOKING_QUERY = `
      mutation ConfirmBookingMutation {
        updateBookingByPk(pkColumns: {id: ${id}}, _set: {status: "approved"}) {
          id
          saloonId
        }
      }
    `;

  // update booking state
  axios
    .post(DATA_SERVICE_URL, {
      query: CONFIRM_BOOKING_QUERY,
    })
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.status(400).end();
      console.log(error);
    });
});

app.post('/api/v1/booking/:id/reject', (req, res) => {
  const { id } = req.params;

  const REJECT_BOOKING_QUERY = `
        mutation RejectBookingMutation {
          updateBookingByPk(pkColumns: {id: ${id}}, _set: {status: "rejected"}) {
            id
          }
        }
      `;

  axios
    .post(DATA_SERVICE_URL, {
      query: REJECT_BOOKING_QUERY,
    })
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.status(400).end();
      console.log(error);
    });
});

app.post('/api/v1/booking/:id/verify', (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  // compare two dates
  const today = new Date();
  const bookingDate = new Date(date);
  if (today > bookingDate) {
    res.status(400).json({ valid: false });
    return;
  }

  const VERIFY_BOOKING_QUERY = `
    mutation VerifyBookingMutation {
      updateBookingByPk(pkColumns: {id: ${id}}, _set: {status: "verified"}) {
        id
      }
    }
  `;

  axios
    .post(DATA_SERVICE_URL, {
      query: VERIFY_BOOKING_QUERY,
    })
    .then(() => {
      res.json({ valid: true });
    })
    .catch((error) => {
      res.status(400).json({ valid: false });
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Saloon service is running at http://localhost:${port}`);
});
