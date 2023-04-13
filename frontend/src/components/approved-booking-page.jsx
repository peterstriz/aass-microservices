export function ApprovedBookingPage() {
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
      <h1>Your booking has been created</h1>
      <p>
        Thank you for booking with us, you will receive a confirmation
        notification shortly.
      </p>
    </div>
  );
}
