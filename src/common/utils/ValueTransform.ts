export const valueTransform = (valor: string) => {
  const value = valor.toString();
  console.log(value, typeof value);
  if (value.includes(',') || (value.includes('[') && value.includes(']'))) {
    const result = value.split(',').map((elemento) => {
      const fixElement = elemento.replace(/\[|\]/g, '');
      if (!fixElement) {
        return;
      }
      const valueLower = fixElement.toLowerCase();
      if (valueLower === 'true' || valueLower === 'false') {
        return valueLower === 'true';
      } else {
        const numero = Number(fixElement);
        const finalValue = isNaN(numero) ? fixElement : numero;
        return finalValue;
      }
    });
    return result;
  } else {
    const valueLower = value.toLowerCase();
    if (valueLower === 'true' || valueLower === 'false') {
      const result = valueLower === 'true';
      return result;
    } else {
      if (!value) {
        return value;
      }
      const numero = Number(value);
      return isNaN(numero) ? value : numero;
    }
  }
};
