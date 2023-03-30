import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { handleSendNotification } from './src/handle-send-notification.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/ping', (_, res) => {
  res.status(200).end();
});

app.post('/api/v1/send-notification', handleSendNotification);

app.listen(port, () => {
  console.log(`Notification service is running at http://localhost:${port}`);
});
