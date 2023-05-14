import Vehicle from '../model/vehicle.model.js'; 
// Importieren Sie das Vehicle-Modell, das Sie erstellt haben

//----------------------------Fahrzeug hinzufügen--------------------------------------------
// In diesem Beispiel wird eine Funktion addVehicles erstellt, die vehicleData und count als Argumente akzeptiert. 
// Die Funktion verwendet eine Schleife, um count Fahrzeuge zu erstellen und in der Datenbank zu speichern. Sie können die Fahrzeugdaten und die Anzahl der hinzuzufügenden Fahrzeuge entsprechend Ihren Anforderungen anpassen.


// Funktion, um eine bestimmte Anzahl von Fahrzeugen hinzuzufügen
export const addVehicles = async (vehicleData, count) => {
  try {
    for (let i = 0; i < count; i++) {
      const newVehicle = new Vehicle(vehicleData);
      await newVehicle.save();
      console.log(`Fahrzeug #${i + 1} hinzugefügt:`, newVehicle);
    }
    console.log(`${count} Fahrzeuge erfolgreich hinzugefügt!`);
  } catch (err) {
    console.error('Fehler beim Hinzufügen von Fahrzeugen:', err);
  }
};
/* 
    // Beispiel-Daten für ein Fahrzeug
   const vehicleData = {
    type: 'car',
    name: 'Tesla Model 3',
    driveRange: 350,
    weight: 1610,
    price: 250,
    imageUrls: ['public/images/Tesla-Model-3.webp'],
    chargingTime: 8,
    quantity: 5,
    
  };
  
  const numberOfVehiclesToAdd = 1; // Die Anzahl der Fahrzeuge, die Sie hinzufügen möchten
  
  addVehicles(vehicleData, numberOfVehiclesToAdd); // Führen Sie die Funktion aus, um die Fahrzeuge hinzuzufügen
   
        
 */
//----------------------------ANZAHL DER FAHRUZEUGEN ------------------------------------------

// In diesem Beispiel wird eine Funktion showAvailableVehicleCounts erstellt, die die aggregate() Funktion verwendet, 
// um die Fahrzeuge nach Typ zu gruppieren und die Anzahl der Fahrzeuge in jeder Gruppe zu zählen. 
// Die Funktion gibt die verfügbaren Fahrzeugmengen für jeden Fahrzeugtyp in der Konsole aus.
// geändert nach Modellnamen 
// Fahrzeuge nach Modellnamen zu gruppieren und die Gesamtmenge für jedes Modell zu berechnen:
export const showAvailableVehicleCounts = async () => {
  try {
    const vehicleCounts = await Vehicle.aggregate([
      {
        $group: {
          _id: '$name', // Gruppieren Sie Fahrzeuge nach Modellnamen
          count: { $sum: '$quantity' }, // Berechnen Sie die Gesamtmenge für jedes Modell
        },
      },
    ]);
    console.log("Fahrzeuganzahlen:", vehicleCounts); // Debugging-Information hinzufügen
    return vehicleCounts;
  } catch (err) {
    console.error('Fehler beim Abrufen der verfügbaren Fahrzeugmengen:', err);
  }
};

  showAvailableVehicleCounts(); // Führen Sie die Funktion aus, um die verfügbaren Fahrzeugmengen anzuzeigen
  
  