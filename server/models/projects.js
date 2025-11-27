import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: String,
    firstname: String,
    lastname: String,
    email: String,
    completion: Date,
    description: String,
    user: String
});

export default mongoose.model('Project', projectSchema);