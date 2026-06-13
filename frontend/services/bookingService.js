import API from "./api";

export const createBooking = async (bookingData) => {
  const response = await API.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await API.get("/bookings/my/bookings");
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await API.get(`/bookings/${id}`);
  return response.data;
};

export const getBookingByReference = async (reference) => {
  const response = await API.get(`/bookings/reference/${reference}`);
  return response.data;
};
