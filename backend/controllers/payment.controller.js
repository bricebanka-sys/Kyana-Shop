import { stripe } from '../lib/stripe.js';
import Coupon from '../models/coupon.model.js';
import Order from '../models/order.model.js';

// -----------------------------------------------------------------------------
// 1. CRÉER UNE SESSION DE PAIEMENT STRIPE (CHECKOUT SESSION)
// -----------------------------------------------------------------------------

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    // Validation du tableau de produits
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "The products array is invalid or empty" });
    }

    let totalAmount = 0;

    // Formatage des articles pour l'API Stripe (line_items)
    const lineItems = products.map((product) => {
      // Conversion du prix en centimes
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: [product.image], // Stripe exige un tableau d'URLs
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    // Vérification et application éventuelle d'un coupon de réduction
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        // Déduction du pourcentage de remise sur le montant total
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }

    // Création de la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card",],
      line_items: lineItems,
      mode: "payment",
      locale: "fr", // ✅ ajouté — force l'interface en français, quel que soit le navigateur du client
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,

      // Application de la réduction Stripe si un coupon est présent
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],

        // Métadonnées clés transmises à Stripe pour traitement ultérieur (Webhooks)
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || '',
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },

    })

    // 5. Condition d'attribution d'un nouveau coupon (Commande >= 200 $)
    // 200 $ = 20 000 centimes
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }

    // 6. Réponse renvoyée au Front-End
    res.status(200).json({
      id: session.id,
      url: session.url, // ✅ ajouté — nécessaire pour la redirection window.location.href côté frontend
      totalAmount: totalAmount / 100, // Conversion des centimes en dollars pour le Front-End
    });

  } catch (error) {
    console.log("Error processing checkout :", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: 'once', // Coupon valide uniquement pour une seule transaction
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  // Suppression d'un éventuel coupon existant pour cet utilisateur avant d'en créer un nouveau
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: 'GIFT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valide 30 jours
    userId: userId,
  });

  await newCoupon.save();
  return newCoupon;
}



/**
 * Traite la validation de commande post-paiement Stripe
 */
export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // 1. Validation de l'identifiant de session
    if (!sessionId) {
      return res.status(400).json({ message: "The Stripe session ID is required." });
    }

    // 2. Récupération des détails de la session auprès de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 3. Vérification de l'état du paiement
    if (session.payment_status === 'paid') {

      // 3bis. Idempotence : si une commande existe déjà pour ce session_id, on la renvoie
      // directement au lieu de tenter d'en recréer une (évite le double-appel de StrictMode
      // en dev, mais aussi un double-clic ou un rechargement de page en production)
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: "Order already processed for this session.",
          orderId: existingOrder._id,
        });
      }

      // A. Désactivation du coupon utilisé (si applicable)
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }

      // B. Désérialisation de la liste des produits stockés dans les métadonnées
      const products = JSON.parse(session.metadata.products);

      // C. Création du document Order (Commande)
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        // Conversion du montant total retourné par Stripe (en centimes) vers la valeur en dollars/euros
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });

      try {
        await newOrder.save();
      } catch (saveError) {
        // Race condition : un appel concurrent a créé la commande entre notre
        // findOne ci-dessus et ce save(). MongoDB a bloqué la duplication via
        // l'index unique — ce n'est pas une vraie erreur, on récupère la commande
        // déjà créée par l'autre appel et on répond normalement.
        if (saveError.code === 11000) {
          const concurrentOrder = await Order.findOne({ stripeSessionId: sessionId });
          return res.status(200).json({
            success: true,
            message: "Order already processed for this session.",
            orderId: concurrentOrder._id,
          });
        }
        throw saveError; // toute autre erreur reste gérée normalement par le catch global
      }

      return res.status(200).json({
        success: true,
        message: "Payment succesfull, order created and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    } else {
      return res.status(400).json({ message: "The payment was not validated by Stripe." });
    }

  } catch (error) {
    console.error("Error processing successful checkout:", error.message);
    res.status(500).json({
      message: "Error while processing order validation",
      error: error.message,
    });
  }
};