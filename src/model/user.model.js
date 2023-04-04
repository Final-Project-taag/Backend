import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    city: { type: String },
    booking: { type: mongoose.Types.ObjectId, ref: 'Booking' },
}, { timestamps: true });



// Erstelle ein neues Model Objekt fuer User
// Erstellt automatisch users Collection in der MongoDB, wenn noch nicht vorhanden
const User = mongoose.model('User', userSchema);



// DB-Funktion zum Abrufen eines bestimmten User-Eintrags per username
export async function findUserByUsername(username) {
    return await User.findOne({username: username});
}

// DB-Funktion zum Erstellen eines neuen User-Eintrags
export async function insertNewUser(userBody) {
    try {
        // Erstelle neue Instanz des User Models
        const newUser = new User(userBody);

        // Speichere neue Instanz
        return await newUser.save();

    } catch (error) {
        // Pruefe, ob Conflict durch Dupletten-Verletzung
        if ( (error.hasOwnProperty('code')) && (error.code === 11000) ) {
            // Schmeisse entsprechendes Fehlerobjekt
            throw {
                code: 409,
                message: error.message
            };

        } else {
            // Muss ein Validierungsproblem sein
            // Schmeisse entsprechendes Fehlerobjekt
            throw {
                code: 400,
                message: error.message
            };
        }
    }
}

// DB-Funktion zum Abrufen aller User-Eintraege
// Funktion zum Abrufen aller Benutzer aus der Datenbank
export async function getAll() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error(`Could not get users: ${error}`);
    }
  }
export default User