/** Ghana Cedis — amounts stored as integer pesewas (1 GHS = 100 pesewas). */
export function formatGhs(pesewas: number): string {
  return `₵${(pesewas / 100).toFixed(2)}`;
}
