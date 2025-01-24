import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  mobile: String,
  password: String,
  favoriteSport: String,
});

const User = mongoose.model('User', userSchema);

export default User;
