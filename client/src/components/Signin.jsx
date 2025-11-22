import { useNavigate } from "react-router-dom";

export default function Signin() {
    // initialize the useNavigate
    const navigate = useNavigate();

    const signInUser = async (event) => {
        // prevent the default response on the form submission
        event.preventDefault();

        // captures the data from the form and stores it as key value pair in an object
        const formData = new FormData(event.target);

        const data = Object.fromEntries(formData.entries());

        try {
            const loginRes = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, password: data.password }),
            });

            if (loginRes.ok) {
                const loginData = await loginRes.json();

                localStorage.setItem("token", loginData.token);
                localStorage.setItem("user", JSON.stringify(loginData.user));
                alert("Signed in successfully!");

                window.dispatchEvent(new Event("userLogin"));

                // Navigate to homepage
                navigate("/");

            } else {
                const error = await response.json();
                console.error("message:", error);
                alert("Check your email and password.");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Unable to reach the server.");
        }
    }

    return (
        <>
            <h2>Signin</h2>
            <div className="leftMessage">Welcome to my Sign In Page</div>
            <div className="homeGrid">
                <form onSubmit={signInUser}>
                    <fieldset>
                        <label className="block" htmlFor="email">email</label>
                        <input type="email" id="email" name="email" required></input>

                        <label className="block" htmlFor="password">password</label>
                        <input type="password" id="password" name="password" required></input>
                    </fieldset>

                    <fieldset>
                        <input type="submit" value="Sign In"></input>
                    </fieldset>
                </form>
            </div>
        </>
    )
}