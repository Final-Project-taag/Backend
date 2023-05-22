import Vehicle from '../model/vehicle.model.js'
import Reservation from '../model/reservation.model.js'
import cron from 'node-cron';

// Hintergrundfunktion, die regelmäßig überprüft, ob Reservierungen abgelaufen sind
// und den Status der Fahrzeuge entsprechend aktualisiert:
export const calculatePrice = (startDate, endDate, price) => {
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    const durationHours = Math.abs(endTime - startTime) / 36e5; // convert duration from milliseconds to hours
    return durationHours * price;
}
async function checkExpiredReservations() {
  try {
    // Aktuelle Zeit holen
    const now = new Date();

    // Alle Fahrzeuge finden, die reserviert sind und deren Enddatum vor der aktuellen Zeit liegt
    const vehicles = await Vehicle.find({ reserved: true, endDate: { $lt: now } });

    // Durchlaufen Sie jedes abgelaufene Fahrzeug und aktualisieren Sie seinen Status
    for (const vehicle of vehicles) {
      await Vehicle.findByIdAndUpdate(vehicle._id, { reserved: false, endDate: null });
    }
  } catch (error) {
    // Bei einem Fehler, loggen Sie die Fehlermeldung
    console.error("Fehler beim Prüfen abgelaufener Reservierungen:", error);
  }
}

export function startBackgroundTasks() {
  // Führe die Funktion checkExpiredReservations jede Stunde aus
  setInterval(checkExpiredReservations, 60 * 60 * 1000);
}


// Plane eine Aufgabe, die jeden Tag um 00:00 Uhr ausgeführt wird
cron.schedule('0 0 * * *', async () => {
  try {
    // Hole alle Reservierungen
    const allReservations = await Reservation.find();

    // Filtere die Reservierungen heraus, die abgelaufen sind
    const expiredReservations = allReservations.filter((res) => {
      const endDate = new Date(res.endDate);
      return endDate < new Date();
    });

    // Lösche alle abgelaufenen Reservierungen
    for (let res of expiredReservations) {
      await Reservation.findByIdAndDelete(res._id);
    }

    // Logge eine Erfolgsmeldung
    console.log('Abgelaufene Reservierungen erfolgreich gelöscht');
  } catch (error) {
    // Bei einem Fehler, loggen Sie die Fehlermeldung
    console.error("Fehler beim Löschen abgelaufener Reservierungen:", error);
  }
});

// export const cleanUpReservations = async (reservations)=>{
//   return reservations.map(async reservation => {
//     const now = new Date()
//     const reservedUntil = reservation.reservedUntil
//     if(reservedUntil<now) {
//       if(!reservation.isBooked) {
//         const vehicle = await Vehicle.findById(reservation.vehicle._id)
//         vehicle.quantity = vehicle.quantity +1
//        await Reservation.findByIdAndDelete(reservation._id)
//       }
//       else {
//         return reservation
//       }
//     }
//   })
// }

