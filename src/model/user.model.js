
import mongoose from "mongoose";
import * as RoleModel from './role.model.js';

// Definiere Todo Schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        isLength: {
            options: {
                min: 5,
                max: 10
            },
            errorMessage: 'Username must have a length of 5 to 10'
        }
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        isLength: {
            options: {
                min: 8,
                max: 30
            },
            errorMessage: 'Password must have a length of 8 to 30'
        }
    },

    fullname: {
        type: String,
        required: true
    },

    city: {
        type: String
    },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },

    emailHash: {
        type: String
    }

},

    { timestamps: true });


// Erstelle ein neues Model Objekt fuer User
// Erstellt automatisch users Collection in der MongoDB, wenn noch nicht vorhanden
const User = mongoose.model('User', userSchema);
// DB-Funktion zum Abrufen eines bestimmten User-Eintrags per username
export async function findUserByUsername(username) {
    return await User.findOne({ username: username }).populate('role');
}

// DB-Funktion zum Abrufen eines bestimmten User-Eintrags per username
export async function findUserById(id) {
    return await User.findOne({ id }).populate('role');
}


// DB-Funktion zum Erstellen eines neuen User-Eintrags
export async function insertNewUser(userBody) {
    try {
        // Finde Rolleneintrag per Name der Rolle
        const role = await RoleModel.findByName(RoleModel.rolesEnum.unverified);

        // Ersetze role-Feld im Body durch die gefunden ID des Role-Eintrags aus der DB
        userBody.role = role._id;

        // Erstelle neue Instanz des User Models
        const newUser = new User(userBody);

        // Speichere neue Instanz
        return await newUser.save();

    } catch (error) {
        // Pruefe, ob Conflict durch Dupletten-Verletzung
        if ((error.hasOwnProperty('code')) && (error.code === 11000)) {
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
export async function getAll() {
    return await User.find();
}


export async function getByEmailHash(hash) {
    return await User.findOne({ emailHash: hash });
}

// Setze User per ID auf Rolle "user"
export async function setVerified(id) {
    const user = await User.findById(id);

    

    const userRole = await RoleModel.findByName(RoleModel.rolesEnum.user);

    user.role = userRole._id;

    user.emailHash = undefined;

    return await user.save();
}

// Ueberschreibe mailHash fuer User Eintrag, der mittels email Adresse gefunden wird
export async function updateEmailHash(email, hash) {
    const user = await User.findOne({ email: email });

    if (user === null) throw {
        code: 404,
        message: `This e-mail address is unknown`
    };

    user.emailHash = hash;

    await user.save();
}