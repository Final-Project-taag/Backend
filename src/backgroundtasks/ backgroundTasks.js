import Vehicle from '../model/vehicle.model.js'


// Hintergrundprozess, der regelmäßig prüft, ob Reservierungen abgelaufen sind,
// und den Status der Fahrzeuge entsprechend aktualisiert:

async function checkExpiredReservations() {
  try {
    const now = new Date();
    const vehicles = await Vehicle.find({ reserved: true, reservedUntil: { $lt: now } });

    for (const vehicle of vehicles) {
      await Vehicle.findByIdAndUpdate(vehicle._id, { reserved: false, reservedUntil: null });
    }
  } catch (error) {
    console.error("Error checking expired reservations:", error);
  }
}

export function startBackgroundTasks() {
  // Run the checkExpiredReservations function every hour
  setInterval(checkExpiredReservations, 60 * 60 * 1000);
}