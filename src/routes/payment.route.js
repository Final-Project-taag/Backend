import express from 'express';
import verifyToken from "../middleware/verifyToken.js";
import getMollieClient from "../service/mollieClient.js";
import Reservation from "../model/reservation.model.js"

const router = express.Router();

// Route zum Abrufen aller Zahlungen

router.get("/", verifyToken, async (req, res) => {
    try {
        const orders = await Booking.find({ user: req.tokenPayload.id });
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for the current user." });
        }
        res.json(orders);
    } catch (error) {
        if (error.name === "CastError" && error.kind === "ObjectId") {
            // Dieser Fehler tritt auf, wenn die übergebene Benutzer-ID ungültig ist
            return res.status(400).json({ message: "Invalid user ID." });
        }
        // Wenn es sich um einen unbekannten Fehler handelt, senden Sie eine allgemeine Fehlermeldung
        res.status(500).json({ message: `An error occurred while fetching orders: ${error.message}` });
    }
});




// Route zum Erstellen einer neuen Zahlung
router.post('/create-payment', verifyToken, async (req, res) => {
    const {reservationId, description, redirectUrl, webhookUrl } = req.body;
    // Finden Sie die Reservierung anhand der reservationId
    const reservation = await Reservation.findById(reservationId).populate('vehicle');
    if (!reservation) {
        // Wenn keine Reservierung gefunden wurde, senden Sie einen Fehler zurück
        return res.status(404).json({ message: "Reservation not found." });
    }

    // Extrahieren Sie den totalPrice aus der Reservierung
    const totalPrice = reservation.vehicle.price;  // Benutzen Sie den Preis des Fahrzeugs

    try {
        const mollieClient = await getMollieClient();

        const payment = await mollieClient.payments.create({
            amount: {
                currency: "EUR",
                value: totalPrice.toFixed(2),
            },
            description: description,
            redirectUrl: redirectUrl,
            webhookUrl: webhookUrl,
        });

        // Speichern Sie die Zahlungsinformationen in Ihrer Datenbank
        const order = new Reservation({
             orderId: reservationId,  // Verwenden Sie die Reservierungs-ID aus dem Anfragekörper als orderId
            paymentId: payment.id,
            status: payment.status,
            user: req.tokenPayload.id,
        });

        const newOrder = await order.save();

        res.status(201).json({
            message: "Payment created successfully.",
            paymentId: payment.id,
            paymentUrl: payment.getCheckoutUrl(),
            order: newOrder,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: `An error occurred while creating the payment: ${error.message}` });
    }
});




//  erstellt die Route /create-payment eine neue Zahlung mit dem mollieClient. Zuerst extrahieren wir die erforderlichen Informationen (amount, description, redirectUrl und webhookUrl) aus dem Anfragekörper.
// Dann verwenden wir den mollieClient, um eine neue Zahlung mit diesen Informationen zu erstellen. Nachdem die Zahlung erstellt wurde, speichern wir die Zahlungsinformationen in der Datenbank, indem wir ein neues Order-Dokument erstellen und speichern.
// Schließlich senden wir eine Antwort zurück, die den Erfolg der Zahlungserstellung anzeigt und die Zahlungs-URL enthält, an die der Benutzer weitergeleitet werden sollte, um die Zahlung abzuschließen.




export default router;