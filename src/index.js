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
//-------------------------------------------------------------------------------------
dotenv.config();

// Initialisiere express
const app = express();

const corsWhitelist = process.env.CORS_WHITELIST.split(",");

// Middleware fuer das body-Parsing
app.use(express.json());

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

//die Fahrzeugtypen und die verfügbare Menge jedes Fahrzeugs zurückzugeben:
/* app.get('/api/vehicleCounts', async (req, res) => {
  const vehicleCounts = await showAvailableVehicleCounts();
  const vehicleCountsMap = vehicleCounts.reduce((acc, count) => {
    acc[count._id] = count.count;
    return acc;
  }, {});
  res.json(vehicleCountsMap);
});
 */
await connectToDb();
// Start background tasks
startBackgroundTasks();
// ----------------------------------------------------------

app.listen(process.env.API_PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.API_PORT}`);
});
