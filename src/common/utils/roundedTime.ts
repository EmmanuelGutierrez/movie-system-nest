export function roundedTime(timestamp: number, minutesDuration: number) {
  // Convertir timestamp a objeto Date
  const date = new Date(timestamp * 1000); // Se multiplica por 1000 porque los timestamps suelen estar en segundos, no en milisegundos

  // Calcular la nueva date sumando la duración y 15 minutes adicionales
  date.setMinutes(date.getMinutes() + minutesDuration + 15);

  // Redondear los minutes al múltiplo de 10 más cercano
  const minutes = date.getMinutes();
  let minutesRounded: number;
  if (minutes % 10 === 0) {
    minutesRounded = minutes;
  } else {
    minutesRounded = Math.ceil(minutes / 10) * 10;
  }

  date.setMinutes(minutesRounded);

  // Devolver el nuevo timestamp
  return Math.floor(date.getTime() / 1000);
}
