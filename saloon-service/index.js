import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import express from 'express';
import { DATA_SERVICE_URL } from './src/url.js';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'saloon-service',
  brokers: ['localhost:29092'],
});

const producer = kafka.producer();
await producer.connect();

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/ping', (_, res) => {
  res.status(200).end();
});

app.post('/api/v1/saloon/:id/book', (req, res) => {
  const { id: saloonId } = req.params;
  const { serviceIds, booking: date } = req.body;

  const CREATE_BOOKING_QUERY = `
    mutation MyMutation {
      insertBooking(
        objects: {
          date: "${date}"
          status: "created"
          saloonId: ${saloonId}
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

      await producer.send({
        topic: 'verify-booking',
        messages: [
          {
            key: String(bookingId),
            value: JSON.stringify({
              saloonId,
              date,
            }),
          },
        ],
      });

      res.json({ bookingId });
    })
    .catch((error) => {
      res.status(400).end();
      console.log(error);
    });
});

const admin = kafka.admin();
await admin.connect();
await admin.createTopics({
  topics: [
    {
      topic: 'verify-booking',
      numPartitions: 1,
      replicationFactor: 1,
    },
    {
      topic: 'decline-booking',
      numPartitions: 1,
      replicationFactor: 1,
    },
    {
      topic: 'approve-booking',
      numPartitions: 1,
      replicationFactor: 1,
    },
  ],
});
await admin.disconnect();

const consumer = kafka.consumer({
  groupId: 'saloon-service-consumer',
});

await consumer.connect();
await consumer.subscribe({
  topics: ['verify-booking', 'approve-booking', 'decline-booking'],
});

await consumer.run({
  eachMessage: async ({ message, topic }) => {
    if (topic === 'approve-booking') {
      const bookingId = Number(message.key.toString());

      const CONFIRM_BOOKING_QUERY = `
          mutation ConfirmBookingMutation {
            updateBookingByPk(pkColumns: {id: ${bookingId}}, _set: {status: "approved"}) {
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
          return producer.send({
            topic: 'approve-notification',
            messages: [message],
          });
        })
        .catch((error) => {
          console.log(error);

          return producer.send({
            topic: 'decline-notification',
            messages: [message],
          });
        });
    } else if (topic === 'decline-booking') {
      const bookingId = Number(message.key.toString());

      const REJECT_BOOKING_QUERY = `
          mutation RejectBookingMutation {
            updateBookingByPk(pkColumns: {id: ${bookingId}}, _set: {status: "rejected"}) {
              id
            }
          }
        `;

      return await axios
        .post(DATA_SERVICE_URL, {
          query: REJECT_BOOKING_QUERY,
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          return producer.send({
            topic: 'decline-notification',
            messages: [message],
          });
        });
    } else if (topic === 'verify-booking') {
      const { date } = JSON.parse(message.value.toString());
      const bookingId = Number(message.key.toString());

      const today = new Date();
      const bookingDate = new Date(date);
      if (today > bookingDate) {
        return await producer.send({
          topic: 'decline-booking',
          messages: [message],
        });
      }

      const VERIFY_BOOKING_QUERY = `
          mutation VerifyBookingMutation {
            updateBookingByPk(pkColumns: {id: ${bookingId}}, _set: {status: "verified"}) {
              id
            }
          }
        `;

      return await axios
        .post(DATA_SERVICE_URL, {
          query: VERIFY_BOOKING_QUERY,
        })
        .then(() => {
          return producer.send({
            topic: 'approve-booking',
            messages: [message],
          });
        })
        .catch((error) => {
          console.log(error);

          return producer.send({
            topic: 'decline-booking',
            messages: [message],
          });
        });
    }
  },
});

console.log('Kafka consumer is running');

app.listen(port, async () => {
  console.log(`Saloon service is running at http://localhost:${port}`);
});
