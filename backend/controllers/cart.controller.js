import Product from '../models/product.model.js';


// -----------------------------------------------------------------------------
// 1. AJOUTER UN PRODUIT AU PANIER
// -----------------------------------------------------------------------------


export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Vérifie si le produit existe déjà dans le panier de l'utilisateur
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      // S'il existe, on augmente la quantité de 1
      existingItem.quantity += 1;
    } else {
      // Sinon, on l'ajoute au tableau
      user.cartItems.push( productId );
    }

    await user.save();
    res.json(user.cartItems);

  } catch (error) {
    console.log("Error in addToCart:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// 2. SUPPRIMER TOUT UN PRODUIT DU PANIER (Peu importe la quantité)
// -----------------------------------------------------------------------------
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body || {};
    const user = req.user;

    if (!productId) {
      user.cartItems = []; // Si aucun productId n'est fourni, on vide le panier
    }

    // Filtre pour retirer totalement l'élément correspondant au productId
    user.cartItems = user.cartItems.filter((item) => item.id !== productId);

    await user.save();
    res.json(user.cartItems);

  } catch (error) {
    console.log("Error in removeAllFromCart:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// 3. METTRE À JOUR LA QUANTITÉ D'UN PRODUIT
// -----------------------------------------------------------------------------
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // Renommé en productId pour plus de clarté
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      // Si la nouvelle quantité demandée est 0, on retire le produit du panier
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }

      // Sinon on attribue la quantité transmise (ex: 2, 3, etc.)
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);

    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }

  } catch (error) {
    console.log("Error in updateQuantity controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -----------------------------------------------------------------------------
// 4. OBTENIR LES PRODUITS DU PANIER
// -----------------------------------------------------------------------------
export const getCartProducts = async (req, res) => {
  try {
    // Récupère les IDs de tous les produits présents dans le panier de l'utilisateur
    const productIds = req.user.cartItems.map(item => item.id);

    // Trouve tous les produits correspondant à ces IDs ($in)
    const products = await Product.find({ _id: { $in: productIds } });

    // Injecte la propriété 'quantity' dans chaque objet produit retourné
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return {
        ...product.toJSON(),
        quantity: item ? item.quantity : 1
      };
    });

    res.json(cartItems);

  } catch (error) {
    console.log("Error in getCartProducts controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};