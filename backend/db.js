import mongoose from 'mongoose';
import dotenv from 'dotenv';  // Import dotenv
dotenv.config();  // Load environment variables from .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,  // Enable new parser
      useUnifiedTopology: true, // Enable unified topology
      // Remove the useFindAndModify option
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err);
    process.exit(1); // Exit the process with a failure code
  }
};

connectDB();
