import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Contact() {
    const [showForm, setShowForm] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        user: ""
    });

    const startEditing = (contact) => {
        setEditingId(contact._id);
        setFormData({
            firstname: contact.firstname,
            lastname: contact.lastname,
            email: contact.email,
            user: contact.user
        });
        setShowForm(true);
    };

    // initialize the useNavigate
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const fetchContacts = async () => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token) {
            console.log("Check your credentials");
            setContacts([]);
            return;
        }

        let user;
        try {
            user = JSON.parse(userString);
            if (!user || !user._id) {
                throw new Error("Invalid user");
            }
        } catch {
            navigate("/signin");
            return;
        }

        const userId = user._id;

        try {
            const res = await fetch("/api/contacts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!res.ok) {
                console.error("Unauthorized fetching contacts");
                setContacts([]);
                return;
            }

            const data = await res.json();

            setContacts(data);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    };

    useEffect(() => {
        fetchContacts();

        const handleEvent = () => fetchContacts();

        window.addEventListener("userLogin", handleEvent);
        window.addEventListener("userLogout", handleEvent);

        return () => {
            window.removeEventListener("userLogin", handleEvent);
            window.removeEventListener("userLogout", handleEvent);
        }
    }, []);

    const submitContact = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        const userString = localStorage.getItem("user");
        let user;
        try {
            user = JSON.parse(userString);
            if (!user || !user._id) {
                throw new Error("Invalid user");
            }
        } catch {
            navigate("/signin");
            return;
        }

        user = user._id;

        const payload = { ...formData, user };

        const method = editingId ? "PUT" : "POST";
        const url = editingId
            ? `/api/contacts/${editingId}`
            : "/api/contacts";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                alert("Error saving data.");
                navigate("/signup");
                return;
            }

            alert(editingId ? "Updated successfully!" : "Saved successfully!");

            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                user: ""
            });

            setEditingId(null);
            setShowForm(false);
            fetchContacts();

        } catch (error) {
            console.error("Message:", error);
        }
    };

    const deleteContact = async (id) => {
        const token = localStorage.getItem("token");

        if (!confirm("Delete this item?")) {
            return;
        }


        try {
            const res = await fetch(`/api/contacts/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Deleted!");
                fetchContacts();
            } else {
                alert("Delete failed.");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    return (
        <>
            <h2>Contact</h2>
            <div className="leftMessage">Welcome to my Contact Page</div>
            <div className="centerDiv">
                <div>
                    {localStorage.getItem("token") && !showForm && (
                        <button onClick={() => setShowForm(true)}>Add Contact</button>
                    )}

                    {showForm && (
                        <form onSubmit={submitContact}>
                            <fieldset>
                                <legend>Contact Details</legend>
                                <label className="block" htmlFor="firstname">First Name:</label>
                                <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required />

                                <label className="block" htmlFor="lastname">Last Name:</label>
                                <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required />

                                <label className="block" htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                            </fieldset>

                            <fieldset>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                            </fieldset>
                        </form>
                    )}
                </div>

                <div>
                    <h3>Contact List</h3>
                </div>

                <div className="tableWrapper">
                    {contacts.length === 0 ? <p>No entries yet.</p> : (
                        <>
                            <table className="tableList">
                                <thead>
                                    <tr>
                                        <td className="tdName"><b>Name</b></td>
                                        <td><b>Email</b></td>
                                        <td><b>Options</b></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact) => (
                                        <tr key={contact._id} className="contact-card">
                                            <td className="tdName">{`${contact.firstname} ${contact.lastname}`}</td>
                                            <td>{contact.email}</td>
                                            <td>
                                                <button onClick={() => startEditing(contact)}>Edit</button>
                                                <button onClick={() => deleteContact(contact._id)}>Delete</button>
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
            </div>
        </>
    )
}