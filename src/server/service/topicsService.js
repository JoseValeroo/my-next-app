// src/services/topicsService.js
export async function getDynamicTopics() {
    try {
      const response = await fetch("http://localhost:3001/api/topics", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error fetching topics");
      }
      return response.json();
    } catch (error) {
      console.error("Error in getDynamicTopics service:", error);
      return { topics: [] };
    }
  }  