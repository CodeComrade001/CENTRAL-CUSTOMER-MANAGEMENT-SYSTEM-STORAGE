
export function getNewAccountStatusMessage(status?: number): string {
  if (!status) return "❌ No response from server";

  const statusMap: Record<number, string> = {
    200: "✅ Success: New Account Created ",
    400: "❌ Bad Request",
    401: "❌ Account Creation Failed",
    403: "⛔ Access forbidden",
    404: "❌ User not found",
    429: "🚫 Too many requests. Please try again later.",
    500: "🔥 Server error. Try again later.",
  };

  return statusMap[status] || `❌ Unexpected error from server (Status: ${status})`;
}
