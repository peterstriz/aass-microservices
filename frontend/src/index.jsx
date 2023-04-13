import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from './components/home-page';
import { SaloonDetailPage } from './components/saloon-detail-page';
import { ApprovedBookingPage } from './components/approved-booking-page';
import { ApproveBookingPage } from './components/approve-booking-page';
import { RejectedBookingPage } from './components/rejected-booking-page';

// init axios
axios.defaults.headers.post['Content-Type'] = 'application/json';

// init apollo client
const DATA_SERVICE_URL = 'http://localhost:8085/v1/graphql';
const client = new ApolloClient({
  uri: DATA_SERVICE_URL,
  cache: new InMemoryCache(),
});

// init router
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/saloon/:saloonId',
    element: <SaloonDetailPage />,
  },
  {
    path: '/booking-success',
    element: <ApprovedBookingPage />,
  },
  {
    path: '/booking-rejected',
    element: <RejectedBookingPage />,
  },
  {
    path: '/confirm-booking/:bookingId',
    element: <ApproveBookingPage />,
  },
]);

// init react
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
