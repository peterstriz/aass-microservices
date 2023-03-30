import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const NOTIFICATION_API = 'http://localhost:3000/api/v1';

function App() {
  function sendNotification() {
    axios.post(`${NOTIFICATION_API}/send-notification`, {
      saloonId: 1,
    });
  }

  return (
    <div className="App">
      <button onClick={() => sendNotification()}>sendNotification()</button>
    </div>
  );
}

export default App;
