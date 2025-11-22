import ContactModel from '../models/contacts.js';


// Get All Contacts = Same as db.contacts.find()
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.find();
        res.status(200).json(contacts);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Read a contact by ID = Same as db.contacts.findOne({_id: ObjectId("id")})
export const getContactById = async (req, res) => {
    try {
        const contact = await ContactModel.findOne(req.params.id);
        if (!contact) {
            // 404 HTTP status code for file not found
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Create a new contact = Same as db.contacts.insertOne()
export const createContact = async (req, res) => {
    try {
        const newContact = new ContactModel(req.body);
        const savedContact = await newContact.save();

        // 201 HTTP status code for created
        res.status(201).json(savedContact);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Update a contact by ID = Same as db.contacts.updateOne({_id: ObjectId("id")}, {$set: {...}})
export const updateContact = async (req, res) => {
    try {
        const updatedContact = await ContactModel.findByIdAndUpdate( req.params.id, req.body, {
            new: true
        });

        if (!updatedContact) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Delete a contact by ID = same as db.contacts.deleteOne({_id: ObjectId("id")})
export const deleteContact = async (req, res) => {
    try {
        const deletedContact = await ContactModel.findOne(req.params.id);

        if (!deletedContact) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Delete all contacts = same as db.contacts.drop()
export const deleteAllContacts = async (req, res) => {
    try {
        const deletedContacts = await ContactModel.deleteMany();

        if (deletedContacts.deletedCount === 0) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'Contacts not found' });
        }
        res.status(200).json({ message: 'All contacts deleted successfully' });
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}