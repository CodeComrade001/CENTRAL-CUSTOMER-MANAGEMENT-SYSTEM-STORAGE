/**
 * Returns a user-friendly message based on an HTTP status code
 * received during function calls like login/signup.
 *
 * @param status - HTTP status code
 * @returns string - status message
 */
export function getFunctionStatusMessage(status?: number): string {
  if (!status) return "❌ No response from server";

  const statusMap: Record<number, string> = {
    200: "✅ Success",
    201: "✅ Created successfully",
    204: "✅ No Content - Operation completed",
    400: "❌ Bad Request - Check your input",
    401: "❌ Unauthorized - Incorrect email or password",
    403: "⛔ Forbidden - You don't have access",
    404: "❌ Not Found - Resource doesn't exist",
    409: "⚠️ Conflict - Possibly already exists",
    422: "⚠️ Unprocessable - Invalid data format",
    429: "🚫 Too many requests - Slow down",
    500: "🔥 Server error - Try again later",
    502: "❌ Bad Gateway - Server unreachable",
    503: "⏳ Service Unavailable - Try again later",
    504: "⏱️ Gateway Timeout - Server too slow",
  };

  return statusMap[status] || `❌ Unexpected server response (Status: ${status})`;
}
