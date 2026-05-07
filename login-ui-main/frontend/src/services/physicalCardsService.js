const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("netpay-auth-token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const physicalCardsService = {
  async getPhysicalCardsStats() {
    const response = await fetch(`${API_BASE_URL}/physical-cards/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch physical cards stats");
    return response.json();
  },

  async getPhysicalCards(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/physical-cards?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch physical cards");
    return response.json();
  },

  async getPhysicalCard(id) {
    const response = await fetch(`${API_BASE_URL}/physical-cards/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch physical card");
    return response.json();
  },

  async batchCreatePhysicalCards(cardNumbers, options = {}) {
    const response = await fetch(`${API_BASE_URL}/physical-cards/batch`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        cardNumbers,
        batchLabel: options.batchLabel,
        merchantId: options.merchantId,
        assignImmediately: options.assignImmediately || false,
      }),
    });
    if (!response.ok) throw new Error("Failed to batch create physical cards");
    return response.json();
  },

  async assignPhysicalCard(cardId, userId, preAssign = false) {
    const endpoint = preAssign ? "pre-assign" : "assign";
    const response = await fetch(`${API_BASE_URL}/physical-cards/${cardId}/${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error(`Failed to ${preAssign ? "pre-assign" : "assign"} card`);
    return response.json();
  },

  async markCardUsed(cardId, userId, note = "") {
    const response = await fetch(`${API_BASE_URL}/physical-cards/${cardId}/mark-used`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, note }),
    });
    if (!response.ok) throw new Error("Failed to mark card as used");
    return response.json();
  },

  async updateCardNote(cardId, note) {
    const response = await fetch(`${API_BASE_URL}/physical-cards/${cardId}/note`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ note }),
    });
    if (!response.ok) throw new Error("Failed to update card note");
    return response.json();
  },

  async deletePhysicalCard(cardId) {
    const response = await fetch(`${API_BASE_URL}/physical-cards/${cardId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete physical card");
    return response.json();
  },

  async bulkUpdateStatus(cardIds, status) {
    const response = await fetch(`${API_BASE_URL}/physical-cards/bulk/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ cardIds, status }),
    });
    if (!response.ok) throw new Error("Failed to bulk update card status");
    return response.json();
  },

  async getMerchants() {
    const response = await fetch(`${API_BASE_URL}/merchants`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch merchants");
    return response.json();
  },

  async getCardNumberSuggestions(count = 10) {
    const response = await fetch(`${API_BASE_URL}/physical-cards/suggestions?count=${count}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch card number suggestions");
    return response.json();
  },
};

export const STATUS = {
  AVAILABLE: "Available",
  PRE_ASSIGNED: "Pre-assigned",
  ASSIGNED: "Assigned",
  USED: "Used",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export const SOURCES = {
  SHENO_PAY: "Sheno Pay",
  ZENTORA: "ZentoraCapital",
};

export default physicalCardsService;
