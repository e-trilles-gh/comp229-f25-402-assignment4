import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Contact() {
    const [showForm, setShowForm] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: ""
    });

    const startEditing = (contact) => {
        setEditingId(contact._id);
        setFormData({
            firstname: contact.firstname,
            lastname: contact.lastname,
            email: contact.email
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

        if (!token) {
            console.log("Check your credentials");
            setContacts([]);
            return;
        }

        try {
            const res = await fetch("/api/contacts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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
                body: JSON.stringify(formData)
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
                email: ""
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
                    {!showForm && (
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

                <div>
                    {contacts.length === 0 ? <p>No entries yet.</p> : (
                        <>
                            <table className="tableList">
                                <thead>
                                    <tr>
                                        <td><b>Name</b></td>
                                        <td><b>Email</b></td>
                                        <td><b>Options</b></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact) => (
                                        <tr key={contact._id} className="contact-card">
                                            <td>{`${contact.firstname} ${contact.lastname}`}</td>
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
                <form onSubmit="submitData">
                    <fieldset>
                        <legend>Personal Information</legend>

                        <label className="block" htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" required></input>

                        <label className="block" htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" name="firstName" required></input>

                        <label className="block" htmlFor="contactNumber">Contact Number</label>
                        <input type="tel" id="contactNumber" name="contactNumber" placeholder="123-456-78-90" pattern="[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}" required></input>

                        <label className="block" htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="sample@email.com" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" required></input>
                    </fieldset>
                    <fieldset>
                        <legend>Message</legend>
                        <label className="block" htmlFor="message">Provide short message or comment</label>
                        <textarea name="message" id="message"></textarea>
                    </fieldset>
                    <fieldset>
                        <legend>Submission</legend>
                        <input type="submit" value="Submit Message"></input>
                        <input type="reset" value="Reset Fields"></input>
                    </fieldset>
                </form>
            </div>
        </>
    )
}