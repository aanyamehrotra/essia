// lib/errors.ts
export function getApiErrorMessage(error: any): string {
  if (!error) return "Unknown error. Please try again.";

  if (!error.response) {
    return "🌐 Network error. Please check your connection.";
  }

  const status = error.response.status;
  const data = error.response.data;

  const apiMessage =
    typeof data?.message === "string"
      ? data.message
      : Array.isArray(data?.message)
      ? data.message[0]
      : data?.error || data?.detail;

  switch (status) {
    case 400:
      return apiMessage || "❌ Invalid input. Please check the form.";
    case 401:
      return apiMessage || "🔒 Invalid credentials. Please try again.";
    case 403:
      return apiMessage || "🚫 You don’t have permission.";
    case 404:
      return apiMessage || "❓ Service not found.";
    case 409:
      return apiMessage || "📧 This account already exists.";
    case 500:
      return apiMessage || "🔥 Server error. Try again later.";
    default:
      return apiMessage || `Unexpected error (status ${status}).`;
  }
}
