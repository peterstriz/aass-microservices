import React from 'react';
import { sendNotification } from '../api/send-notification';
import { SaloonList } from './saloon-list';

export function HomePage() {
  return (
    <div
      style={{
        fontFamily: 'arial',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <button onClick={() => sendNotification()}>sendNotification()</button>
      <h1>Hair Saloons</h1>
      <SaloonList />
    </div>
  );
}
