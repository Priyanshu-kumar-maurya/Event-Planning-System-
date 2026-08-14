// src/services/api.js
// Robust REST API client connecting React frontend with Express + MongoDB backend

import { mockEvents } from "../data/mockEvents";

// Detect API base URL
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0");

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isLocal ? "http://localhost:5000/api" : "/api");

// Helper with automatic JWT Bearer token attachment and safe JSON parsing
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

    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        if (!res.ok) {
          throw new Error(`Server response error (${res.status})`);
        }
        return { success: true, data: text };
      }
    }

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Network error");
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
  try {
    const res = await request("/auth/users");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    return [];
  }
}

export async function getAdminStats() {
  try {
    const res = await request("/auth/admin-stats");
    return res.data || null;
  } catch (err) {
    return null;
  }
}

// ── Events APIs ─────────────────────────────────────────────
export async function getEvents(params = {}) {
  let list = [];
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== "All") query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.sort) query.set("sort", params.sort);

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await request(`/events${qs}`);

    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      list = res.data;
    } else if (res && Array.isArray(res)) {
      list = res;
    } else {
      list = mockEvents;
    }
  } catch (err) {
    console.warn("Using fallback mock event data:", err.message);
    list = mockEvents;
  }

  // Ensure list is strictly an Array
  if (!Array.isArray(list)) {
    list = mockEvents;
  }

  // Apply filters in memory
  if (params.category && params.category !== "All") {
    list = list.filter((e) => e.category === params.category);
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (e) =>
        e.title?.toLowerCase().includes(s) ||
        e.description?.toLowerCase().includes(s) ||
        e.category?.toLowerCase().includes(s)
    );
  }

  return list;
}

export async function getEventById(id) {
  try {
    const res = await request(`/events/${id}`);
    if (res && res.data && typeof res.data === "object") {
      return res.data;
    }
    const fallback = mockEvents.find((e) => e.id === id || e._id === id);
    if (fallback) return fallback;
    return mockEvents[0];
  } catch (err) {
    const fallback = mockEvents.find((e) => e.id === id || e._id === id);
    if (fallback) return fallback;
    return mockEvents[0];
  }
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
  try {
    const res = await request("/events/user/registered");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    return [];
  }
}

export async function getUserCreatedEvents() {
  try {
    const res = await request("/events/user/created");
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    return [];
  }
}
