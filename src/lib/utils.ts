// Format paise to INR display string
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

// Clamp a number between min and max
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Generate a short, readable order ID
export function shortOrderId(fullId: string): string {
  return fullId.slice(0, 8).toUpperCase();
}

// Debounce helper
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}
