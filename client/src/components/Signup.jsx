import { useNavigate } from "react-router-dom";
import { useState } from 'react';

export default function Signup() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        retypePassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleReset = () => {
        setForm({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            retypePassword: ''
        });
        setError('');
    };

    const registerUser = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.retypePassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Create user
            const userRes = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${form.firstName} ${form.lastName}`,
                    email: form.email,
                    password: form.password
                })
            });

            if (!userRes.ok) {
                const err = await userRes.json();
                setError(err.message || 'Failed to create user.');
                return;
            }

            // Login immediately
            const loginRes = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password })
            });

            if (!loginRes.ok) {
                const err = await loginRes.json();
                setError(err.message || 'Login failed after signup.');
                return;
            }

            const loginData = await loginRes.json();

            // Save token and user
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('user', JSON.stringify(loginData.user));

            // Trigger Layout rerender
            window.dispatchEvent(new Event('userLogin'));

            // Navigate after successful login
            navigate('/');

        } catch (err) {
            console.error(err);
            setError('Network error. Please try again.');
        }
    };

    return (
        <div className="homeGrid">
            <h2>Signup</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={registerUser}>
                <fieldset>
                    <legend>Personal Information</legend>
                    <label className="block" htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />

                    <label className="block" htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />

                    <label className="block" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />

                    <label className="block" htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />

                    <label className="block" htmlFor="retypePassword">Retype Password</label>
                    <input type="password" id="retypePassword" name="retypePassword" value={form.retypePassword} onChange={handleChange} required />
                </fieldset>

                <fieldset>
                    <button type="submit">Register</button>
                    <button type="button" onClick={handleReset}>Reset</button>
                </fieldset>
            </form>
        </div>
    );
}
