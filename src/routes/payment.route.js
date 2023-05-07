import express from 'express';
/* import { Router } from "express";
 */
import verifyToken from "../middleware/verifyToken.js";
import createMollieClient from "../middleware/mollieClient.js";
import Order from "../model/order.payment.model.js";

const router = express.Router();

// Route zum Abrufen aller Zahlungen

router.get("/", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.tokenPayload.id });
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
    const { amount, description, redirectUrl, webhookUrl } = req.body;

    try {
        const mollieClient = await createMollieClient();

        const payment = await mollieClient.payments.create({
            amount: {
                currency: "EUR",
                value: amount.toFixed(2),
            },
            description: description,
            redirectUrl: redirectUrl,
            webhookUrl: webhookUrl,
        });

        // Speichern Sie die Zahlungsinformationen in Ihrer Datenbank
        const order = new Order({
            orderId: payment.id,
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
        res.status(400).json({ message: `An error occurred while creating the payment: ${error.message}` });
    }
});

//  erstellt die Route /create-payment eine neue Zahlung mit dem mollieClient. Zuerst extrahieren wir die erforderlichen Informationen (amount, description, redirectUrl und webhookUrl) aus dem Anfragekörper.
// Dann verwenden wir den mollieClient, um eine neue Zahlung mit diesen Informationen zu erstellen. Nachdem die Zahlung erstellt wurde, speichern wir die Zahlungsinformationen in der Datenbank, indem wir ein neues Order-Dokument erstellen und speichern.
// Schließlich senden wir eine Antwort zurück, die den Erfolg der Zahlungserstellung anzeigt und die Zahlungs-URL enthält, an die der Benutzer weitergeleitet werden sollte, um die Zahlung abzuschließen.




export default router;