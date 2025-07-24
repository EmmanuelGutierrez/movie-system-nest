export const screeningKey = (
  screeningId: number,
  seatReservationId: number,
  userId: number,
  temporalTransactionId: string,
) =>
  `screening:${screeningId}:seatreservation:${seatReservationId}:${userId}:temporary:${temporalTransactionId}`;
