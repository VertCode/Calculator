export default function formatNumber(number: number | string) {
  if (!number) {
    return '0';
  }

  try {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  } catch (ex) {
    return number;
  }
}
