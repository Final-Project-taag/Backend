import Mollie from '@mollie/api-client';
import dotenv from 'dotenv';

// 1. Konto erstellen und API-Schlüssel erhalten:
// Gehen Sie zu https://www.mollie.com/ und erstellen Sie ein Konto. Nachdem Sie sich angemeldet haben, navigieren Sie zum Bereich "Entwickler" und generieren Sie Ihre API-Schlüssel (einen Test- und einen Live-Schlüssel).

//2. Mollie API-Client installieren:
// npm install @mollie/api-client


dotenv.config();

// Verwenden Sie den Mollie-API-Schlüssel aus der .env-Datei, um den Mollie-API-Client zu initialisieren:

const mollieClient = new Mollie.ApiClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

export default mollieClient;
