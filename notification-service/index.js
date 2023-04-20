import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { handleSendNotification } from './src/handle-send-notification.js';
import { ZBClient } from 'zeebe-node';

const zbc = new ZBClient();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/ping', (_, res) => {
  res.status(200).end();
});

zbc.createWorker({
  taskType: 'send-notification',
  taskHandler: handleSendNotification,
});

app.listen(port, () => {
  console.log(`Notification service is running at http://localhost:${port}`);
});
