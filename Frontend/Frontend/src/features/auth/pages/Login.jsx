import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            // We await the login response
            await handleLogin({ email, password })

            // ✅ FIXED: Changed Maps to navigate
            navigate("/", { replace: true });

        } catch (err) {
            // Displays specific error from backend or a generic message
            setError(err.response?.data?.message || "Login failed. Check your connection.")
            console.error("Login Error:", err)
        }
    }

    if (loading) {
        return (<main className="loading-state"><h1>Authenticating...</h1></main>)
    }

    return (
        <main className="auth-page">
            <div className="form-container">
                <div className="brand-header">
                    <span className="brand-icon">💠</span>
                    <h1>Interview<span className="highlight">Ace</span></h1>
                </div>

                {error && <p className="error-message" style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            required
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email"
                            id="email"
                            name='email'
                            placeholder='Enter email address'
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            required
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password"
                            id="password"
                            name='password'
                            placeholder='Enter password'
                        />
                    </div>
                    <button type="submit" className='button primary-button'>Login</button>
                </form>

                {/* ESSENTIAL UPDATE: Dynamic route mapping to initiate Passport OAuth flow */}
                <div style={{ marginTop: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                    <a
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/google`}
                        className="button secondary-button"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
                    >
                        <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.055 14.982 0 12 0 7.354 0 3.307 2.67 1.242 6.577l4.024 3.188z" />
                            <path fill="#4285F4" d="M23.727 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.582a5.63 5.63 0 01-2.445 3.691l3.8 2.945c2.227-2.055 3.51-5.073 3.51-8.773z" />
                            <path fill="#FBBC05" d="M5.266 14.235A7.09 7.09 0 014.909 12c0-.79.136-1.545.357-2.235L1.242 6.577A11.934 11.934 0 000 12c0 1.927.455 3.745 1.259 5.373l4.007-3.138z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.955-1.073 7.94-2.918l-3.8-2.945c-1.055.709-2.409 1.127-4.14 1.127-3.182 0-5.873-2.155-6.836-5.055L1.137 17.327C3.173 21.33 7.255 24 12 24z" />
                        </svg>
                        <span>Continue with Google</span>
                    </a>
                </div>

                <p>Don't have an account? <Link to={"/register"}>Register</Link> </p>
            </div>
        </main>
    )
}

export default Login