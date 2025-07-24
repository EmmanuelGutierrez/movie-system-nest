export const screeningKey = (
  screeningId: number,
  seatReservationId: number,
  userId: number,
) => `screening:${screeningId}:seatreservation:${seatReservationId}:${userId}`;
