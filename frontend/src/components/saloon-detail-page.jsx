import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

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
    // TODO: send booking to backend
    console.log('selectedTime', selectedTime);
    console.log('selectedServices', selectedServices);
  };

  if (loading) return <div>Loading...</div>;

  const saloon = data?.saloonByPk;

  return (
    <div>
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

      <button onClick={handleBook}>Book</button>
    </div>
  );
}
