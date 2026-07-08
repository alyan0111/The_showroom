const BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
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
  updateCarSpecification: (id, data) => request(`/cars/${id}/specification`, { method: "PUT", body: JSON.stringify(data) }),
};