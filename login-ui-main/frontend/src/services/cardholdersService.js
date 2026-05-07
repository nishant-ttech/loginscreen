const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("netpay-auth-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const cardholdersService = {
  async getCardholderStats() {
    const response = await fetch(`${API_BASE_URL}/cardholders/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch cardholder stats");
    return response.json();
  },

  async getCardholders(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/cardholders?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch cardholders");
    return response.json();
  },

  async getCardholder(id) {
    const response = await fetch(`${API_BASE_URL}/cardholders/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch cardholder");
    return response.json();
  },

  async updateCardholderStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/cardholders/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update cardholder status");
    return response.json();
  },

  async updateCardholder(id, data) {
    const response = await fetch(`${API_BASE_URL}/cardholders/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update cardholder");
    return response.json();
  },

  async linkHolder(id, holderType, holderId) {
    const response = await fetch(`${API_BASE_URL}/cardholders/${id}/link`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ holderType, holderId }),
    });
    if (!response.ok) throw new Error("Failed to link holder");
    return response.json();
  },

  async unlinkHolder(id) {
    const response = await fetch(`${API_BASE_URL}/cardholders/${id}/unlink`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to unlink holder");
    return response.json();
  },

  async createCardholder(data) {
    const response = await fetch(`${API_BASE_URL}/cardholders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create cardholder");
    return response.json();
  },

  async deleteCardholder(id) {
    const response = await fetch(`${API_BASE_URL}/cardholders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete cardholder");
    return response.json();
  },
};

export default cardholdersService;