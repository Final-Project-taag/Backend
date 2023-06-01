 
import Vehicle from '../model/vehicle.model.js'; // Importieren Sie das Vehicle-Modell, das Sie erstellt haben

//------------------------------------------Fahrzeug hinzufügen--------------------------------------------
// In diesem Beispiel wird eine Funktion addVehicles erstellt, die vehicleData und count als Argumente akzeptiert. 
// Die Funktion verwendet eine Schleife, um count Fahrzeuge zu erstellen und in der Datenbank zu speichern. Sie können die Fahrzeugdaten und die Anzahl der hinzuzufügenden Fahrzeuge entsprechend Ihren Anforderungen anpassen.


// Funktion, um eine bestimmte Anzahl von Fahrzeugen hinzuzufügen
// controllers/vehicleController.js


export const addVehicles = async (vehicleData, count) => {
  try {
    for (let i = 0; i < count; i++) {
      const newVehicle = new Vehicle(vehicleData);
      await newVehicle.save();
    }
  } catch (err) {
    console.error('Fehler beim Hinzufügen von Fahrzeugen:', err);
  }
};

