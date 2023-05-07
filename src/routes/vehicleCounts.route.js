import { showAvailableVehicleCounts } from '../controller/vehicle.add.controller.js';
import Router from "express";


const vehicleCountsRouter = Router();

vehicleCountsRouter.get("/", async (req, res) => {

    const vehicleCounts = await showAvailableVehicleCounts();

    const vehicleCountsMap = vehicleCounts.reduce((acc, count) => {
      acc[count._id] = count.count;
      return acc;
    }, {});
    res.json(vehicleCountsMap);
  });

  export default vehicleCountsRouter;