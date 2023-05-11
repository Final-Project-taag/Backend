
import express from 'express';
import { handlePaymentWebhook } from '../controller/paymentWebhook.controller.js';


const paymentWebhookRouter = express.Router();


// Route zum Empfangen von Webhooks von Mollie (oder einem anderen Zahlungsanbieter)
paymentWebhookRouter.post('/', handlePaymentWebhook);



export default paymentWebhookRouter;


// webhookUrl:

// Die webhookUrl ist die URL, die von Mollie (oder einem anderen Zahlungsanbieter) aufgerufen wird,
// um den Status der Zahlung zu aktualisieren. Diese URL sollte eine Route in Ihrem Backend-Server sein, 
// die auf eingehende Webhooks von Mollie hört und die Zahlungsstatusänderungen entsprechend verarbeitet.