const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("netpay-auth-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const depositsService = {
  async getDeposits(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/deposits?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch deposits");
    return response.json();
  },

  async getDepositsStats() {
    const response = await fetch(`${API_BASE_URL}/deposits/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch deposit stats");
    return response.json();
  },

  async getDepositsBreakdown() {
    const response = await fetch(`${API_BASE_URL}/deposits/breakdown`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch deposit breakdown");
    return response.json();
  },

  async processDeposit(id, action) {
    const response = await fetch(`${API_BASE_URL}/deposits/${id}/${action}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to ${action} deposit`);
    return response.json();
  },

  async verifyDeposit(id) {
    return this.processDeposit(id, "verify");
  },

  async rejectDeposit(id) {
    return this.processDeposit(id, "reject");
  },
};

export default depositsService;