const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("admin_token");
}


async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

async function uploadRequest(endpoint, formData) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Upload failed");
  }
  return res.json();
}

export const api = {
getQueryLogs: () => request("/query-logs"),
clearQueryLogs: () => request("/query-logs", { method: "DELETE" }),

  getManufacturers: () => request("/manufacturers"),
  createManufacturer: (data) => request("/manufacturers", { method: "POST", body: JSON.stringify(data) }),
  updateManufacturer: (id, data) => request(`/manufacturers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteManufacturer: (id) => request(`/manufacturers/${id}`, { method: "DELETE" }),

  getCars: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== "All")
    );
    return request(`/cars?${params.toString()}`);
  },
  getCar: (id) => request(`/cars/${id}`),
  createCar: (data) => request("/cars", { method: "POST", body: JSON.stringify(data) }),
  updateCar: (id, data) => request(`/cars/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  updateCarSpecification: (id, data) => request(`/cars/${id}/specification`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCar: (id) => request(`/cars/${id}`, { method: "DELETE" }),
  addCarFeature: (carId, featureId) => request(`/cars/${carId}/features/${featureId}`, { method: "POST" }),
  removeCarFeature: (carId, featureId) => request(`/cars/${carId}/features/${featureId}`, { method: "DELETE" }),

  getFeatures: (category) => request(`/features${category ? `?category=${category}` : ""}`),
  createFeature: (data) => request("/features", { method: "POST", body: JSON.stringify(data) }),
  updateFeature: (id, data) => request(`/features/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFeature: (id) => request(`/features/${id}`, { method: "DELETE" }),

  getMessages: () => request("/messages"),
  sendMessage: (data) => request("/messages", { method: "POST", body: JSON.stringify(data) }),
  markMessageRead: (id) => request(`/messages/${id}/read`, { method: "PATCH" }),
  deleteMessage: (id) => request(`/messages/${id}`, { method: "DELETE" }),

  uploadMainImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return uploadRequest("/upload/main", fd);
  },
  uploadCarouselImages: (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));
    return uploadRequest("/upload/carousel", fd);
  },
  attachCarImages: (carId, urls) =>
    request(`/upload/cars/${carId}/images`, { method: "POST", body: JSON.stringify({ urls }) }),
  getCarImages: (carId) => request(`/upload/cars/${carId}/images`),
  deleteCarImage: (carId, imageId) =>
    request(`/upload/cars/${carId}/images/${imageId}`, { method: "DELETE" }),

  changePassword: (data) => request("/auth/change-password", { method: "PUT", body: JSON.stringify(data) }),
getAdmins: () => request("/auth/admins"),
createAdmin: (data) => request("/auth/admins", { method: "POST", body: JSON.stringify(data) }),
deleteAdmin: (id) => request(`/auth/admins/${id}`, { method: "DELETE" }),
};
