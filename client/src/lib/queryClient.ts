import { QueryClient } from '@tanstack/react-query';

const STRAPI_URL = import.meta.env.VITE_STRAPI_API_URL;

const BACKEND_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_LOCAL_URL
  : import.meta.env.VITE_BACKEND_SERVER_URL;

export async function apiRequest<T = any>(
  method: string,
  url: string,
  body?: any,
  sessionId?: string
): Promise<T> {
  const fullUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
  const token = localStorage.getItem("token");

  const res = await fetch(fullUrl, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    // If response is not JSON
    const error: any = new Error("Invalid JSON response from server.");
    error.status = res.status;
    error.response = { status: res.status, data: null };
    throw error;
  }

  if (!res.ok) {
    const error: any = new Error("API error");
    error.status = res.status;
    error.response = {
      status: res.status,
      data,
    };
    throw error;
  }

  return data;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});