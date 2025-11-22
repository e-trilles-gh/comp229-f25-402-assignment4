import { Link } from "react-router-dom";
import logo from "/images/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        loadUser();

        window.addEventListener("userLogin", loadUser);
        window.addEventListener("userLogout", loadUser);

        return () => {
            window.removeEventListener("userLogin", loadUser);
            window.removeEventListener("userLogout", loadUser);
            window.removeEventListener("storage", loadUser);
        };
    }, []);

    const handleLogout = async () => {
        // Clear localStorage and state on frontend
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        window.dispatchEvent(new Event("userLogout"));
        navigate("/");
    };

    const handleDeleteUser = async () => {
        if (!user) return;
        if (!window.confirm("Are you sure you want to delete your account?")) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Delete failed:", err);
                alert("Failed to delete account.");
                return;
            }

            alert("Account deleted successfully.");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            window.dispatchEvent(new Event("userLogout"));
            navigate("/");

        } catch (error) {
            console.error("Network error:", error);
            alert("Something went wrong.");
        }
    };


    return (
        <>
            <h1>My Portfolio</h1>
            <div className="logoContainer">
                <div>
                    <img className="imageLogo" src={logo} alt="Logo" />
                </div>
                <nav>
                    <Link to="/">Home</Link> {" "}
                    <Link to="/about">About</Link> {" "}
                    <Link to="/contact">Contact</Link> {" "}
                    <Link to="/education">Education</Link> {" "}
                    <Link to="/projects">Projects</Link> {" "}
                    <Link to="/services">Services</Link>
                </nav>
            </div>
            <div className="signup">
                {user ? (
                    <>
                        <nav>
                            <button onClick={handleLogout}>Sign Out</button>
                            <button onClick={handleDeleteUser}>Delete {user.name}</button>
                        </nav>
                    </>
                ) : (
                    <>
                        <nav>
                            <Link to="/signup">Register</Link>
                            <Link to="/signin">Sign In</Link>
                        </nav>
                    </>
                )}
            </div>
        </>
    );
}