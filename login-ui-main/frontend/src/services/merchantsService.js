const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("netpay-auth-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const merchantsService = {
  async getMerchants(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/merchants?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch merchants");
    return response.json();
  },

  async getMerchantStats() {
    const response = await fetch(`${API_BASE_URL}/merchants/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch merchant stats");
    return response.json();
  },

  async createMerchant(data) {
    const response = await fetch(`${API_BASE_URL}/merchants`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create merchant");
    return response.json();
  },

  async updateMerchant(id, data) {
    const response = await fetch(`${API_BASE_URL}/merchants/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update merchant");
    return response.json();
  },

  async deleteMerchant(id) {
    const response = await fetch(`${API_BASE_URL}/merchants/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete merchant");
    return response.json();
  },

  async toggleMerchantStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/merchants/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update merchant status");
    return response.json();
  },
};

export default merchantsService;