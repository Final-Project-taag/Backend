import axios from 'axios';
import { updateReservation } from '../service/reservation.service.js';

export const handlePaymentWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.WEBHOOK_SECRET; // Optional: Falls Sie ein Webhook Secret verwenden möchten
    const receivedSecret = req.headers['x-webhook-secret']; // Optional: Falls Sie ein Webhook Secret verwenden möchten

    // Optional: Überprüfen Sie das Webhook Secret, um sicherzustellen, dass der Webhook von Mollie stammt
    if (webhookSecret && receivedSecret !== webhookSecret) {
      return res.status(401).json({ status: 'error', message: 'Invalid webhook secret.' });
    }

    const paymentId = req.body.id; // Mollie sendet die Payment-ID im Webhook

    // Rufen Sie die Zahlungsinformationen von Mollie ab
    const mollieResponse = await axios.get(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${process.env.MOLLIE_API_KEY}` },
    });

    // Überprüfen Sie den Zahlungsstatus und aktualisieren Sie die Reservierungsinformationen entsprechend
    const paymentStatus = mollieResponse.data.status;
    const reservationId = mollieResponse.data.metadata.reservationId; // Angenommen, Sie haben die Reservierungs-ID in der Zahlungs-Metadaten gespeichert

    await updateReservation(reservationId, { paymentStatus });

    // Senden Sie eine Erfolgsmeldung an Mollie
    res.status(200).json({ status: 'success', message: 'Payment webhook handled successfully.' });
  } catch (error) {
    console.error("Error handling payment webhook:", error);
    res.status(500).json({ status: 'error', message: 'An error occurred while handling the payment webhook.' });
  }
};