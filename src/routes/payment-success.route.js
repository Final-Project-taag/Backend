import express from 'express';
import { verifyPaymentAndUpdateReservation } from '../controller/payment.controller.js';


const paymentSuccessRouter = express.Router();


// Route zum Überprüfen des Zahlungsstatus und Aktualisieren der Reservierungsinformationen
paymentSuccessRouter.get('/:reservationId', verifyPaymentAndUpdateReservation);



export default paymentSuccessRouter;

//     redirectUrl:

// Die redirectUrl ist die URL, zu der der Benutzer nach einer erfolgreichen Zahlung weitergeleitet wird. 
// Sie sollten eine Route in Ihrer Anwendung erstellen, die den Erfolg der Zahlung anzeigt und alle erforderlichen Schritte ausführt, wie 
// z. B. das Aktualisieren der Reservierungsinformationen oder das Senden einer Bestätigungsnachricht an den Benutzer.