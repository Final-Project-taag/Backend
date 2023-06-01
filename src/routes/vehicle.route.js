 import {Router} from "express"
 import verifyToken from "../middleware/verifyToken.js"
import Vehicle from '../model/vehicle.model.js';



function isAdmin(req, res, next) {
  const { role } = req.tokenPayload;
  if (role !== "admin") {
    return res
      .status(403)
      .send({ success: false, message: "Access forbidden, not an admin" });
  }
  next();
}
//-------------------------------------------------F A H R Z E U G E-----------------------------------------//

// Route für alle vehicles auf der Homepage anzuzeigen
const vehicleRouter = Router()

vehicleRouter.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
  

//Diese Route verwendet die findById-Methode, um ein Fahrzeug anhand der angegebenen ID zu suchen.
vehicleRouter.get("/:vehicleId", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found with the given ID" });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Route zum Hinzufügen eines Fahrzeugs
vehicleRouter.post('/', verifyToken, async (req, res) => {
  const { type, name, driveRange, weight, price, chargingTime, quantity, reserved , reservedUntil, imageUrls } = req.body;

  const vehicle = new Vehicle({
    type,
    name,
    driveRange,
    weight,
    price,
    chargingTime,
    quantity,
    reserved , 
    reservedUntil,
    imageUrls
  });
console.log(req.body)
  try {
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route zum Updaten
vehicleRouter.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { type, name, driveRange, weight, price, chargingTime, reserved , reservedUntil } = req.body;
  
  try {
  const updatedVehicle = await Vehicle.findByIdAndUpdate(
  req.params.id,
  {
  type,
  name,
  driveRange,
  weight,
  price,
  chargingTime,
  reserved,
  reservedUntil
  },
  { new: true }
  );
  if (!updatedVehicle) {
    return res
      .status(404)
      .json({ message: "Vehicle not found with the given ID" });
  }
  
  res.json(updatedVehicle);
} catch (error) {
  res.status(400).json({ message: error.message });
  }
  });


//Diese Route stellt sicher, dass nur ein Admin ein Fahrzeug löschen kann, indem sie die verifyToken und isAdmin Middleware verwendet. 
vehicleRouter.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
      const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
  
      if (!deletedVehicle) {
        return res
          .status(404)
          .json({ message: "Vehicle not found with the given ID" });
      }
  
      res.json({ message: "Vehicle successfully deleted", vehicle: deletedVehicle });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
//-------------------------------------------------F I L T E R-----------------------------------------//

vehicleRouter.get('/filter', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, minDriveRange, maxDriveRange } = req.query;
    const filter = {};

    if (type) {
      filter.type = type;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }
    if (minDriveRange || maxDriveRange) {
      filter.driveRange = {};
      if (minDriveRange) {
        filter.driveRange.$gte = Number(minDriveRange);
      }
      if (maxDriveRange) {
        filter.driveRange.$lte = Number(maxDriveRange);
      }
    }

    const vehicles = await Vehicle.find(filter);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





export default vehicleRouter

