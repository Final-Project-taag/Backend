
import Reservation from "../model/reservation.model.js";

export const newReservation = await Reservation.create({
    vehicle: vehicleId,
    user: userId,
    startDate,
    reserved: true,
    reservedUntil: endDate,
  });
  
  await Vehicle.updateQuantity(vehicleId, 1);
   