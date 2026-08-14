// src/services/api.js
// Central API service communicating with Express + MongoDB backend

const BASE_URL = "http://localhost:5000/api";

// Helper with automatic JWT Bearer token attachment
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("eventhub_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    return data;
  } catch (err) {
    throw new Error(err.message || "Network error — is the backend server running?");
  }
}

// ── Auth APIs ───────────────────────────────────────────────
export async function loginUser(email, password) {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res;
}

export async function registerUser(userData) {
  const res = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  return res;
}

export async function getMe() {
  const res = await request("/auth/me");
  return res.user;
}

export async function getAllUsers() {
  const res = await request("/auth/users");
  return res.data;
}

export async function getAdminStats() {
  const res = await request("/auth/admin-stats");
  return res.data;
}

// ── Events APIs ─────────────────────────────────────────────
export async function getEvents(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString() ? `?${query.toString()}` : "";
  const res = await request(`/events${qs}`);
  return res.data;
}

export async function getEventById(id) {
  const res = await request(`/events/${id}`);
  return res.data;
}

export async function createEvent(eventData) {
  const res = await request("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
  return res.data;
}

export async function updateEvent(id, eventData) {
  const res = await request(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
  return res.data;
}

export async function deleteEvent(id) {
  const res = await request(`/events/${id}`, { method: "DELETE" });
  return res;
}

export async function registerForEvent(id, attendeeInfo = {}) {
  const res = await request(`/events/${id}/register`, {
    method: "POST",
    body: JSON.stringify(attendeeInfo),
  });
  return res.data;
}

export async function unregisterFromEvent(id, attendeeInfo = {}) {
  const res = await request(`/events/${id}/unregister`, {
    method: "POST",
    body: JSON.stringify(attendeeInfo),
  });
  return res.data;
}

export async function getUserRegisteredEvents() {
  const res = await request("/events/user/registered");
  return res.data;
}

export async function getUserCreatedEvents() {
  const res = await request("/events/user/created");
  return res.data;
}
