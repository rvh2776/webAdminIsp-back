import { MercadoPagoConfig } from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

const config = {
  accessToken: process.env.MERCADO_PAGO_API_KEY,
  options: { timeout: 5000 },
};

const mercadoPagoClient = new MercadoPagoConfig(config);

export default mercadoPagoClient;
