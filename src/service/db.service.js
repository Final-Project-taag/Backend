import mongoose from "mongoose";


export async function connectToDb(callback) {
    try {
        // Setze den 'strict' Mode fuer mongoose (Felder, die nicht im Schema enthalten sind, werden nicht mitgespeichert)
        mongoose.set('strictQuery', true);

        await mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, {
            maxPoolSize: 10
        });

        // Falls callback direkt nach Verbindung ausgefuehrt werden soll
        // Bspw. ein Seeding von intialen DB Eintraegen
        if (callback) {
            // fuehre callback aus
            callback();
        }

        console.log('Connection to DB established');

    } catch (error) {
        console.error(error);
    }
}