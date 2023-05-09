import { createMollieClient } from '@mollie/api-client';
import dotenv from 'dotenv';

dotenv.config();

async function getMollieClient() {

  const mollieClient = createMollieClient({
    apiKey: process.env.MOLLIE_API_KEY,
  });

  return mollieClient;
}

export default getMollieClient;

