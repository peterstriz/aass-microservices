import React from 'react';
import { sendNotification } from '../api/send-notification';
import { SaloonList } from './saloon-list';

export function HomePage() {
  return (
    <div style={{ fontFamily: 'arial' }}>
      <button onClick={() => sendNotification()}>sendNotification()</button>
      <h1>Saloons</h1>
      <SaloonList />
    </div>
  );
}
