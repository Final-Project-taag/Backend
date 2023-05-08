import axios from 'axios';
import { updateReservation } from '../service/reservation.service.js';

export const verifyPaymentAndUpdateReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    // Annehmen, dass Sie die Payment-Id in Ihrer Reservierung gespeichert haben
    const reservation = await getReservationById(reservationId);
    const paymentId = reservation.paymentId;

    // Rufen Sie die Zahlungsinformationen von Mollie (oder einem anderen Zahlungsanbieter) ab
    const mollieResponse = await axios.get(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${process.env.MOLLIE_API_KEY}` },
    });

    // Überprüfen Sie den Zahlungsstatus
    const paymentStatus = mollieResponse.data.status;
    if (paymentStatus === 'paid') {
      // Aktualisieren Sie die Reservierungsinformationen, z. B. den Zahlungsstatus und andere relevante Daten
      await updateReservation(reservationId, { paymentStatus });

      // Senden Sie eine Erfolgsmeldung an das Frontend
      res.status(200).json({ status: 'success', message: 'Payment verified and reservation updated.' });
    } else {
      // Senden Sie eine Fehlermeldung an das Frontend
      res.status(400).json({ status: 'failed', message: 'Payment verification failed or payment not completed.' });
    }
  } catch (error) {
    console.error("Error verifying payment and updating reservation:", error);
    res.status(500).json({ status: 'error', message: 'An error occurred while verifying payment and updating reservation.' });
  }
};


//  wird die verifyPaymentAndUpdateReservation Funktion den Zahlungsstatus mithilfe der Mollie API 
// abrufen und die Reservierungsinformationen aktualisieren, falls die Zahlung erfolgreich war. 