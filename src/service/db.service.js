
<<<<<<< HEAD
=======
// import mongoose from "mongoose";


// export async function connectToDb(callback) {
//     try {
//         // Setze den 'strict' Mode fuer mongoose (Felder, die nicht im Schema enthalten sind, werden nicht mitgespeichert)
//         mongoose.set('strictQuery', true);

//         await mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, {
//             maxPoolSize: 10
//         });

//         // Falls callback direkt nach Verbindung ausgefuehrt werden soll
//         // Bspw. ein Seeding von intialen DB Eintraegen
//         if (callback) {
//             // fuehre callback aus
//             callback();
//         }

//         console.log('Connection to DB established');

//     } catch (error) {
//         console.error(error);
//     }
// }

// /* import mongoose from "mongoose";


// export async function connectToDb(callback) {
//     try {
//         // Setze den 'strict' Mode fuer mongoose (Felder, die nicht im Schema enthalten sind, werden nicht mitgespeichert)
//         mongoose.set('strictQuery', true);

//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             maxPoolSize: 10
//         });

//         // Falls callback direkt nach Verbindung ausgefuehrt werden soll
//         // Bspw. ein Seeding von intialen DB Eintraegen
//         if (callback) {
//             // fuehre callback aus
//             callback();
//         }

//         console.log('Verbindung zu MongoDB Atlas hergestellt');
//     } catch (error) {
//         console.error(error);
//     }
// } */
// export default connectToDb;


 

import mongoose from "mongoose";

>>>>>>> feature/email-verification-backend
export async function connectToDb(callback) {
    try {
        // Setze den 'strict' Mode fuer mongoose (Felder, die nicht im Schema enthalten sind, werden nicht mitgespeichert)
        mongoose.set('strictQuery', true);

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10
        });

        // Falls callback direkt nach Verbindung ausgefuehrt werden soll
        // Bspw. ein Seeding von intialen DB Eintraegen
        if (callback) {
            // fuehre callback aus
            callback();
        }

        console.log('Verbindung zu MongoDB Atlas hergestellt');
    } catch (error) {
        console.error(error);
    }
}