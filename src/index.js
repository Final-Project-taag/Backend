import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDb } from './service/db.service.js';
import authRouter from './routes/auth.route.js';
import vehicleRouter from './routes/vehicle.route.js';
import reservationsRouter from './routes/reservations.route.js';
import bookingRouter from './routes/booking.route.js';
// Lade Umgebungsvariablen (engl. enviroment variables) aus der .env Datei
dotenv.config();

// Initialisiere express
const app = express();

// Middleware fuer das body-Parsing
app.use(express.json());

// Middleware fuer CROSS-ORIGIN-REQUEST
app.use(cors({
    origin: 'http://localhost:5173',
    // credentials: true
}));

// --------------------- ROUTES -------------------------
app.use('/auth', authRouter);

app.use('/vehicles', vehicleRouter);
app.use('/reservation', reservationsRouter);
app.use('/booking', bookingRouter);


// Einmalig Verbindung ueber default Connection aufbauen
// es kann noch ein Callback mitgeliefert werden
await connectToDb();

// ----------------------------------------------------------
// Starte Server auf in der Config hinterlegtem Port
app.listen(process.env.API_PORT, () => {
    console.log(`Server is listening on http://localhost:${process.env.API_PORT}`);
});




