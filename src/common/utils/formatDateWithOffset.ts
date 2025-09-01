export function formatDateWithOffset(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');

  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  // milisegundos siempre en 3 dígitos
  const SSS = String(date.getMilliseconds()).padStart(3, '0');

  // timezone offset en minutos
  const tzOffset = -date.getTimezoneOffset();
  const sign = tzOffset >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  const offsetMinutes = pad(Math.abs(tzOffset) % 60);

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.${SSS}${sign}${offsetHours}:${offsetMinutes}`;
}
