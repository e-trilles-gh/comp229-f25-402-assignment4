import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Education() {
    const [showForm, setShowForm] = useState(false);
    const [qualifications, setQualifications] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        firstname: "",
        lastname: "",
        email: "",
        completion: "",
        description: ""
    });

    const startEditing = (item) => {
        setEditingId(item._id);
        setFormData({
            title: item.title,
            firstname: item.firstname,
            lastname: item.lastname,
            email: item.email,
            completion: item.completion?.split("T")[0],
            description: item.description
        });
        setShowForm(true);
    };

    // initialize the useNavigate
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const fetchQualifications = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Check your credentials");
            setQualifications([]);
            return;
        }
        try {
            const res = await fetch("/api/qualifications", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            //const filtered = data.filter(qualification => qualification.email === user.email);
            setQualifications(data);
        } catch (error) {
            console.error("message:", error);
        }
    }

    useEffect(() => {
        fetchQualifications();

        const handleEvent = () => fetchQualifications();

        window.addEventListener("userLogin", handleEvent);
        window.addEventListener("userLogout", handleEvent);

        return () => {
            window.removeEventListener("userLogin", handleEvent);
            window.removeEventListener("userLogout", handleEvent);
        }
    }, []);


    const submitEducation = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        const method = editingId ? "PUT" : "POST";
        const url = editingId
            ? `/api/qualifications/${editingId}`
            : "/api/qualifications";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                alert("Error saving data.");
                navigate("/signup");
                return;
            }

            alert(editingId ? "Updated successfully!" : "Saved successfully!");

            setFormData({
                title: "",
                firstname: "",
                lastname: "",
                email: "",
                completion: "",
                description: ""
            });

            setEditingId(null);
            setShowForm(false);
            fetchQualifications();

        } catch (error) {
            console.error("Message:", error);
        }
    };

    const deleteQualification = async (id) => {
        const token = localStorage.getItem("token");

        if (!confirm("Delete this item?")) {
            return;
        }

        try {
            const res = await fetch(`/api/qualifications/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Deleted!");
                fetchQualifications();
            } else {
                alert("Delete failed.");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    }



    return (
        <>
            <h2>Education</h2>
            <div className="leftMessage">Welcome to my Education Page</div>
            <div className="centerDiv">
                <div>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)}>Add Education</button>
                    )}

                    {showForm && (
                        <form onSubmit={submitEducation}>
                            <fieldset>
                                <legend>Education Details</legend>
                                <label className="block" htmlFor="title">Title:</label>
                                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />

                                <label className="block" htmlFor="firstname">First Name:</label>
                                <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required />

                                <label className="block" htmlFor="lastname">Last Name:</label>
                                <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required />

                                <label className="block" htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                                <label className="block" htmlFor="completion">Completion Date:</label>
                                <input type="date" id="completion" name="completion" value={formData.completion} onChange={handleChange} required />

                                <label className="block" htmlFor="description">Description:</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required />
                            </fieldset>

                            <fieldset>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                            </fieldset>
                        </form>
                    )}
                </div>

                <div>
                    <h3>Qualification List</h3>
                </div>

                <div>
                    {qualifications.length === 0 ? <p>No entries yet.</p> : (
                        <>
                            <table className="tableList">
                                <thead>
                                    <tr>
                                        <td><b>Title</b></td>
                                        <td><b>Name</b></td>
                                        <td><b>Completion Date</b></td>
                                        <td><b>Description</b></td>
                                        <td><b>Options</b></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {qualifications.map((qualification) => (
                                        <tr key={qualification._id} className="qualification-card">
                                            <td>{qualification.title}</td>
                                            <td>{`${qualification.firstname} ${qualification.lastname}`}</td>
                                            <td>{qualification.completion?.split("T")[0]}</td>
                                            <td>{qualification.description}</td>
                                            <td>
                                                <button onClick={() => startEditing(qualification)}>Edit</button>
                                                <button onClick={() => deleteQualification(qualification._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
            <div className="homeGrid">
                <div>
                    <h3>Software Engineering Technology</h3>
                    <p>Centennial College</p>
                    <p>Ontario, Canada</p>
                    <p>Currently enrolled</p>
                </div>
                <div>
                    <h3>Bachelor of Science in Nursing</h3>
                    <p>Universidad de Sta. Isabel</p>
                    <p>Naga City, Philippines</p>
                    <p>2010</p>
                </div>
            </div>
        </>
    );
}
