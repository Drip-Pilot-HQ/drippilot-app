export function formatNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith("+1")) {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length === 11) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
  }
  return phoneNumber;
}
