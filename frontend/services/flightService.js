import API from "./api";

export const getFlights = async () => {
  const response = await API.get("/flights");
  return response.data;
};

export const getFlightById = async (id) => {
  const response = await API.get(`/flights/${id}`);
  return response.data;
};

export const searchFlights = async (params) => {
  const response = await API.get("/flights", { params });
  return response.data;
};
