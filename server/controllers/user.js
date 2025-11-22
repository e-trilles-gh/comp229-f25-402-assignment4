import UserModel from '../models/users.js';
import generateToken from '../utils/jwts.js';

// Get All Users = Same as db.users.find()
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Read a user by ID = Same as db.users.findOne({_id: ObjectId("id")})
export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            // 404 HTTP status code for file not found
            return res.status(404).json({ message: 'User not found'});
        }
        res.status(200).json(user);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Create a new user = Same as db.users.insertOne()
export const createUser = async (req, res) => {
    try {
        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();

        const token = generateToken(savedUser);

        // 201 HTTP status code for created
        res.status(201).json({ message: 'User Created successfully', user: savedUser, token });
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Update a user by ID = Same as db.users.updateOne({_id: ObjectId("id")}, {$set: {...}})
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,req.body, {
            new: true
        });

        if (!updatedUser) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Delete a user by ID = same as db.users.deleteOne({_id: ObjectId("id")})
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'User not found'});
        } 
        res.status(200).json({ message: 'User deleted successfully' });
    }  catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    } 
}

// Delete all users = same as db.users.drop()
export const deleteAllUsers = async (req, res) => {
    try {
        const deletedUsers = await UserModel.deleteMany({});

        if (deletedUsers.deletedCount === 0) {
            // 404 HTTP status code
            return res.status(404).json({ message: 'Users not found'});
        } 
        res.status(200).json({ message: 'Users deleted successfully' });
    }  catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    } 
}

// Login user
export const loginUser = async (req, res) => {
    try {
        // destructuring from body
        const {email, password} = req.body;
        const user = await UserModel.findOne({email})

        if (!user) {
            // 404 HTTP status cond for not found
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            // 401 HTTP status code for unauthorized
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken(user);
        
        return res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Signout user
export const signoutUser = async (req, res) => {
    try {

        const user = await UserModel.findById(req.params.id)

        if (!user) {
            // 404 HTTP status cond for not found
            return res.status(404).json({ message: 'User not found' });
        }
        res.clearCookie("t")
        return res.status(200).json({ message: "User signed out." })
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}