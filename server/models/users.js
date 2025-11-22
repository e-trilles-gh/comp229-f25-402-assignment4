import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true},
    password: String,
    created: Date,
    updated: Date
});

userSchema.pre('save', async function (next) {
    if(this.isModified('password') || this.isNew) {
        // Hashing - the example shuffles the password x10
        this.password = await bcrypt.hash(this.password, 10) 
        
    }
    next();
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
    this.setUpdate(update);
  }

  next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model('User', userSchema);