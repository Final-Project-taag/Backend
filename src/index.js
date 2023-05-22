

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDb } from './service/db.service.js';
import authRouter from './routes/auth.route.js';
import vehicleRouter from './routes/vehicle.route.js';
 import reservationsRouter from './routes/reservations.route.js';
 import bookingRouter from './routes/booking.route.js';
import { startBackgroundTasks } from './backgroundtasks/ backgroundTasks.js';
import paymentRouter from "./routes/payment.route.js";
import vehicleCountsRouter from './routes/vehicleCounts.route.js';
import paymentSuccessRouter from './routes/payment-success.route.js';
import paymentWebhookRouter from './routes/paymentWebhook.route.js';
import { seedRoles } from './model/role.model.js';
import * as MailService from './service/mail.service.js';
//-------------------------------------------------------------------------------------
dotenv.config();

// Initialisiere den Mail Client
MailService.initSgMail();

// Initialisiere express
const app = express();

const corsWhitelist = process.env.CORS_WHITELIST.split(",");

// Middleware fuer das body-Parsing
app.use(express.json());

// Middleware fuer CROSS-ORIGIN-REQUEST
app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true
}));

// Middleware fuer CROSS-ORIGIN-REQUEST
const corsOptions = {
  origin: function (origin, callback) {
    if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));


// --------------------- ROUTES -------------------------
app.use('/auth', authRouter);
app.use('/vehicles/:vehicleId', vehicleRouter);
app.use('/vehicles', vehicleRouter);
app.use('/reservations', reservationsRouter);
app.use('/booking', bookingRouter);
app.use('/payment', paymentRouter);
app.use('/api/vehicleCounts', vehicleCountsRouter);
app.use('/payment/payment-update', paymentSuccessRouter);
app.use('/payment/webhook', paymentWebhookRouter);

//die Fahrzeugtypen und die verfügbare Menge jedes Fahrzeugs zurückzugeben:


// Einmalig Verbindung ueber default Connection aufbauen
// Uebergebe Seeding-Funktion zum Einfuegen von Userrollen
await connectToDb(seedRoles);
// Start background tasks
startBackgroundTasks();
// ----------------------------------------------------------

app.listen(process.env.API_PORT, () => {
    console.log(`Server is listening on http://localhost:${process.env.API_PORT}`);
});
