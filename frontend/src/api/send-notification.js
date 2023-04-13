import axios from 'axios';

const NOTIFICATION_SERVICE_URL = 'http://localhost:3000/api/v1';

export function sendNotification() {
  axios.post(`${NOTIFICATION_SERVICE_URL}/send-notification`, {
    saloonId: 1,
  });
}
