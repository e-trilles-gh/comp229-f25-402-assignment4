import QualificationModel from '../models/qualifications.js';


// Get All Qualifications = Same as db.qualifications.find()
export const getAllQualifications = async (req, res) => {
    try {
        const qualifications = await QualificationModel.find({ user : req.userId });
        res.status(200).json(qualifications);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Read a qualification by ID = Same as db.qualifications.findOne({_id: ObjectId("id")})
export const getQualificationById = async (req, res) => {
    try {
        const qualification = await QualificationModel.findById(req.params.id);
        if (!qualification) {
            // 404 HTTP status code for file not found
            return res.status(404).json({ message: 'Qualification not found' });
        }
        res.status(200).json(qualification);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Create a new qualification = Same as db.qualifications.insertOne()
export const createQualification = async (req, res) => {
    try {
        const newQualification = new QualificationModel(req.body);
        const savedQualification = await newQualification.save();

        // 201 HTTP status code for created
        res.status(201).json(savedQualification);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Update a qualification by ID = Same as db.qualifications.updateOne({_id: ObjectId("id")}, {$set: {...}})
export const updateQualification = async (req, res) => {
    try {
        const updatedQualification = await QualificationModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        if (!updatedQualification) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'Unauthorized access' });
        }

        res.status(200).json(updatedQualification);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Delete a qualification by ID = same as db.qualifications.deleteOne({_id: ObjectId("id")})
export const deleteQualification = async (req, res) => {
    try {
        const deletedQualification = await QualificationModel.findByIdAndDelete(req.params.id);

        if (!deletedQualification) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'Qualification not found' });
        }

        res.status(200).json({ message: 'Qualification deleted successfully' });
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Delete all qualifiations = same as db.qualifiations.drop()
export const deleteAllQualifications = async (req, res) => {
    try {
        const deletedQualifications = await QualificationModel.deleteMany();

        if (deletedQualifications.deletedCount === 0) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'Qualifications not found' });
        }
        res.status(200).json({ message: 'Qualifications deleted successfully' });
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}