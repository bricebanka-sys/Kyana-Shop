import mongoose from 'mongoose';


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connecté avec succès : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB : ${error.message}`);
    // Arrête le processus Node.js en cas d'échec critique (Code 1)
    process.exit(1);
  }
};