import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { handleSendNotification } from './src/handle-send-notification.js';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['localhost:29092'],
});

const producer = kafka.producer();
await producer.connect();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/ping', (_, res) => {
  res.status(200).end();
});

const admin = kafka.admin();
await admin.connect();
await admin.createTopics({
  topics: [
    {
      topic: 'decline-notification',
      numPartitions: 1,
      replicationFactor: 1,
    },
    {
      topic: 'approve-notification',
      numPartitions: 1,
      replicationFactor: 1,
    },
  ],
});
await admin.disconnect();

const consumer = kafka.consumer({
  groupId: 'notification-service-consumer',
});

await consumer.connect();
await consumer.subscribe({
  topics: ['approve-notification', 'decline-notification'],
});

await consumer.run({
  eachMessage: handleSendNotification,
});

app.listen(port, () => {
  console.log(`Notification service is running at http://localhost:${port}`);
});
