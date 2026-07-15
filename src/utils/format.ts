export function formatCurrency(value: number, currency: string = "VND"): string {
  return Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(value);
}

export function formatDate(date: Date, format: string = "vi-VN"): string {
  return date.toLocaleDateString("vi-VN");
}