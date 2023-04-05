import axios from 'axios';

const NOTIFICATION_API = 'http://localhost:3000/api/v1';

export function sendNotification() {
  axios.post(`${NOTIFICATION_API}/send-notification`, {
    saloonId: 1,
  });
}
