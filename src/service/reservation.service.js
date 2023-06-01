import Reservation from "../model/reservation.model.js";

//-------------------------------UPDATERESERVATION FÜR ZAHLUNG---------------------------------------------//


// Diese Funktion aktualisiert eine Reservierung in der Datenbank basierend auf der übergebenen reservationId und den neuen Daten
export const updateReservation = async (reservationId, newData) => {
    try {
      const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, newData, { new: true });
      return updatedReservation;
    } catch (error) {
      console.error("Error updating reservation:", error);
      throw error;
    }
  };
  
  //  aktualisiert die updateReservation-Funktion die Reservierung in der Datenbank basierend auf der übergebenen 
  // breservationId und den neuen Daten. Sie können diese Funktion verwenden,
  // um den Zahlungsstatus und andere relevante Informationen in der Reservierung zu aktualisieren.
  
  
  
  
  
  //-----------------------------------------------------------------------------------------------------------------//
  