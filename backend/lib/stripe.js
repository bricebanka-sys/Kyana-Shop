import Stripe from 'stripe';
import dotenv from 'dotenv';



dotenv.config();

// Instanciation du client Stripe avec la clé secrète
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);