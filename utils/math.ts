export function calcEntregadorGain(orderTotal: number, km: number) {
  // ganha 5% do total + 3% por km
  const base = Math.floor(orderTotal * 0.05);
  const kmPercent = Math.floor(orderTotal * 0.03 * km);
  return base + kmPercent;
}
