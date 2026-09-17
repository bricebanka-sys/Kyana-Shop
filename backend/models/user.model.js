
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
    },
    email: {
      type: String,
      required: [true, "The email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "The password is required"],
      minlength: [6, "The password must contain at least 6 characters"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Référence au modèle Product (qui sera créé ultérieurement)
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true, // Génère automatiquement les champs createdAt et updatedAt
  }
);


// Hook exécuté AVANT la sauvegarde (enregistrement ou modification) du document
userSchema.pre("save", async function (){
  // Si le mot de passe n'a pas été modifié, on passe au middleware suivant
  if (!this.isModified("password")) return;

  try {
    // Génération du sel (salt) avec un facteur de coût de 10
    const salt = await bcrypt.genSalt(10);
    // Hachage du mot de passe avec le sel
    this.password = await bcrypt.hash(this.password, salt);
    //next();
  } catch (error) {
    //next(error);
  }
});

// Méthode personnalisée attachée au schéma utilisateur
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;