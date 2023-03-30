import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const NOTIFICATION_API = 'http://localhost:3000/api/v1';

function App() {
  function sendNotification() {
    axios.post(`${NOTIFICATION_API}/send-notification`, {
      saloonId: 1,
    });
  }

  function HairsaloonList(props) {
    const hairsaloons = props.hairsaloons;
    const listItems = hairsaloons.map((hairsaloon) => (
      <li key={hairsaloon.toString()}>
        <a href="/">Kaderníctvo {hairsaloon}</a>
      </li>
    ));
    return <ul>{listItems}</ul>;
  }

  // todo getnut nazvy hairsaloonov
  // nejde mi naimportovat tu databazu a metadata do tej hasury :(
  const hairsaloons = ['AMY', 'King-kong', 'Sigma-male'];

  return (
    <div className="App">
      <h1>Vyberte si zo zoznamu kaderníctiev</h1>
      <HairsaloonList hairsaloons={hairsaloons} />
      <button onClick={() => sendNotification()}>sendNotification()</button>
    </div>
  );
}

export default App;
