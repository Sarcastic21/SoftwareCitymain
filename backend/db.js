import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false); // Set strict query parsing

mongoose.connect(process.env.MONGO_URI, {
  useFindAndModify: false,  // Use the newer `findOneAndUpdate` function
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Failed:', err));

export default mongoose;
