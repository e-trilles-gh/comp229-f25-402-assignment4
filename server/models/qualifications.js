import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema({
    title: String,
    firstname: String,
    lastname: String,
    email: String,
    completion: Date,
    description: String,
    user: String
});

export default mongoose.model('Qualification', qualificationSchema);