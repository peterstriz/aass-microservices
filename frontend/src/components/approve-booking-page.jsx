import { gql, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GET_BOOKING = gql`
  query GetBooking($id: Int!) {
    bookingByPk(id: $id) {
      id
      serviceIds
      date
      status
    }
  }
`;

export function ApproveBookingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { loading, data } = useQuery(GET_BOOKING, {
    variables: { id: Number(bookingId) },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  function handleConfirm() {
    axios
      .post(`http://localhost:3002/api/v1/booking/${bookingId}/confirm`)
      .then(({ data }) => {
        window.open(data, '_blank');
        navigate('/booking-success');
      });
  }

  function handleReject() {
    axios
      .post(`http://localhost:3002/api/v1/booking/${bookingId}/reject`)
      .then(() => {
        navigate('/booking-rejected');
      });
  }

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
      <h1>Booking {bookingId}</h1>
      <p>Booking date: {data?.bookingByPk?.date}</p>
      <p>Booking status: {data?.bookingByPk?.status}</p>
      <p>Booking services:{data?.bookingByPk?.serviceIds}</p>
      <button onClick={handleConfirm}>Approve</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
}
