import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// -------------------- Schema Setup --------------------
const roleSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},

}, {timestamps: true});

const Role = mongoose.model('Role', roleSchema);

// Enum fuer die User Rollen
export const rolesEnum = {
    admin: 'admin',
    user: 'user',
    unverified: 'unverified',
    premiumUser: 'premiumUser'
};


// -------------------- Seeding --------------------
export async function seedRoles() {
    // Loesche alle bisherigen Rolleneintraege
    await Role.deleteMany({});

    // Neue Rolle fuer admin
    const adminRole = new Role({
        _id: new ObjectId('6405ac7d6b2564cd76c42603'),
        name: rolesEnum.admin
    });
    await adminRole.save();
    
    // Neue Rolle fuer user
    const userRole = new Role({
        _id: new ObjectId('6405ac7d6b2564cd76c42604'),
        name: rolesEnum.user
    });
    await userRole.save();

    // Neue Rolle fuer user, der noch nicht verifiziert ist
    const unverifiedRole = new Role({
        _id: new ObjectId('6405ac7d6b2564cd76c42605'),
        name: rolesEnum.unverified
    });
    await unverifiedRole.save();

      // Neue Rolle fuer Premium User
      const premiumUser = new Role({
        _id: new ObjectId('6405ac7d6b2564cd76c42606'),
        name: rolesEnum.premiumUser
    });
    await premiumUser.save();
}



// -------------------- Model-Functions --------------------
export async function getAll() {
    return await Role.find();
}

export async function findByName(name) {
    const role = await Role.findOne({name: name});

    if (role === null) throw {
        code: 404,
        message: `No such Role found: ${name}`
    };

    return role;
}
