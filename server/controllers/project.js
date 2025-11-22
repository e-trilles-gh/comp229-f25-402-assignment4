import ProjectModel from '../models/projects.js';


// Get All Projects = Same as db.projects.find()
export const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find();
        res.status(200).json(projects);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Read a project by ID = Same as db.projects.findOne({_id: ObjectId("id")})
export const getProjectById = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project) {
            // 404 HTTP status code for file not found
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Create a new project = Same as db.projects.insertOne()
export const createProject = async (req, res) => {
    try {
        const newProject = new ProjectModel(req.body);
        const savedProject = await newProject.save();

        // 201 HTTP status code for created
        res.status(201).json(savedProject);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Update a project by ID = Same as db.projects.updateOne({_id: ObjectId("id")}, {$set: {...}})
export const updateProject = async (req, res) => {
    try {
        const updatedProject = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        if (!updatedProject) {
            // 404 HTTP status code for not found
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}

// Delete a project by ID = same as db.projects.deleteOne({_id: ObjectId("id")})
export const deleteProject = async (req, res) => {
    try {
        const deletedProject = await ProjectModel.findByIdAndDelete(req.params.id);

        if (!deletedProject) {
            // 404 HTTP status code for not found
            return res.status(404).json({ message: 'Project not found' }); 
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message }); 
    }
}

// Delete all projects = same as db.projects.drop()
export const deleteAllProjects = async (req, res) => {
    try {
        const deletedProjects = await ProjectModel.deleteMany({});
    
        if (!deletedProjects.deletedCount === 0) {
            // 404 HTTP status code
            return res.status(404).json({ message: "Projects not found" });
        }
        res.status(200).json({ message: "All projects deleted successfully" });
    } catch (error) {
        // 500 HTTP status code for server error
        res.status(500).json({ message: error.message });
    }
}