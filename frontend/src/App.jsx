import axios from 'axios';
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

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
    let selectedHairsaloon = '';

    // const selectHairsaloon = () => {
    //   // selectedHairsaloon = e.target.value;
    //   alert('hehe');
    // };
    const listItems = hairsaloons.map((hairsaloon) => (
      <li key={hairsaloon.toString()}>
        <a href="/">Kaderníctvo {hairsaloon}</a>
      </li>
    ));
    return <ul>{listItems}</ul>;
  }

  function SelectDateTime(props) {
    const [value, onChange] = useState(new Date());

    return (
      <div>
        <DateTimePicker onChange={onChange} value={value} />
      </div>
    );
  }

  // todo getnut nazvy hairsaloonov
  // nejde mi naimportovat tu databazu a metadata do tej hasury :(
  const hairsaloons = ['AMY', 'King-kong', 'Sigma-male'];

  return (
    <div className="App" style={{ fontFamily: 'arial' }}>
      <h1>Vyberte si zo zoznamu kaderníctiev</h1>
      <HairsaloonList hairsaloons={hairsaloons} />
      <h1>Zvoľte termín</h1>
      <SelectDateTime></SelectDateTime>
      <button onClick={() => sendNotification()}>sendNotification()</button>
    </div>
  );
}

export default App;
