const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("netpay-auth-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const withdrawalsService = {
  async getWithdrawals(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/withdrawals?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch withdrawals");
    return response.json();
  },

  async getWithdrawalsStats() {
    const response = await fetch(`${API_BASE_URL}/withdrawals/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch withdrawal stats");
    return response.json();
  },

  async processWithdrawal(id, action) {
    const response = await fetch(`${API_BASE_URL}/withdrawals/${id}/${action}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to ${action} withdrawal`);
    return response.json();
  },

  async approveWithdrawal(id) {
    return this.processWithdrawal(id, "approve");
  },

  async rejectWithdrawal(id) {
    return this.processWithdrawal(id, "reject");
  },
};

export default withdrawalsService;