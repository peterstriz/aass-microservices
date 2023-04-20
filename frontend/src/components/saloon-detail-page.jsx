import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';

import { useQuery, gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';

const GET_SALOON = gql`
  query GetSaloon($id: Int!) {
    saloonByPk(id: $id) {
      id
      name
      services {
        id
        name
      }
    }
  }
`;

export function SaloonDetailPage() {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedServices, setSelectedServices] = useState([]);
  const [booked, setBooked] = useState(false);

  const navigate = useNavigate();

  const { saloonId } = useParams();
  const { loading, data } = useQuery(GET_SALOON, {
    variables: { id: Number(saloonId) },
  });

  const handleCheck = (event) => {
    const selectedService = Number(event.target.value);
    var newSelectedServices = [...selectedServices];

    if (event.target.checked) {
      newSelectedServices.push(selectedService);
    } else {
      newSelectedServices.splice(selectedServices.indexOf(selectedService), 1);
    }

    setSelectedServices(newSelectedServices);
  };

  const handleBook = () => {
    setBooked(true);
    console.log('selectedTime', selectedTime);
    console.log('selectedServices', selectedServices);

    axios
      .post(`http://localhost:3002/api/v1/saloon/${saloonId}/book`, {
        booking: selectedTime,
        serviceIds: selectedServices,
      })
      .then(({ data }) => {
        window.open(data, '_blank');
        navigate(`/booking-success`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) return <div>Loading...</div>;

  const saloon = data?.saloonByPk;

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
      <a href="/">Back to home</a>
      <h1>{saloon?.name}</h1>

      <h2>Services</h2>
      <ul>
        {saloon?.services?.map((service) => (
          <div key={service.id}>
            <input
              value={service.id}
              type="checkbox"
              onChange={handleCheck}
              name={`service-${service.id}`}
              id={`service-${service.id}`}
            />
            <label htmlFor={`service-${service.id}`}>{service.name}</label>
          </div>
        ))}
      </ul>

      <h2>Booking</h2>
      <DateTimePicker onChange={setSelectedTime} value={selectedTime} />

      <button
        onClick={handleBook}
        style={{
          background: booked ? 'green' : 'lightblue',
          padding: 5,
        }}
      >
        Book
      </button>
    </div>
  );
}
