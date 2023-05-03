import dotenv from 'dotenv';

dotenv.config();

async function createMollieClient() {
  const Mollie = await import('@mollie/api-client');

  const mollieClient = new Mollie.default({
    apiKey: process.env.MOLLIE_API_KEY,
  });

  return mollieClient;
}

export default createMollieClient;

 