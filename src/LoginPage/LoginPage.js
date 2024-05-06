import React, { useState } from 'react';
import './LoginPage.scss';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [loginValid, setLoginValid] = useState({ data: true });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                axios.post('https://personal-budget-app-4cx6.onrender.com/api/login', userCredential)
                    .then(res => {
                        const token = res.data.token;
                        localStorage.setItem('jwt', token);
                        navigate("/")

                    });
                setUser(userCredential);
            })
            .catch((error) => {
                setLoginValid({ ...loginValid, data: false })
            });

    }

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <main>
                <section className='loginForm' id="main">
                    <div>
                        <h1>Login</h1>
                        <form>
                            <div className='info'>
                                <label htmlFor="email-address">
                                    Email Address:
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email Address"
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className='info'>
                                <label htmlFor="password">
                                    Password:
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    required
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className='info'>
                                <button onClick={onLogin}>Login</button>
                            </div>
                        </form>
                        {!(loginValid.data) &&
                            <div className='info'>
                                <div className='incorrectInfo'>
                                    <p>The email/password entered is incorrect</p>
                                </div>
                            </div>
                        }

                        <div className='info'>

                            <p className="text-sm text-white text-center">
                                No account yet? {' '}
                                <NavLink to="/signup">
                                    Sign up
                                </NavLink>
                            </p>
                        </div>

                    </div>
                </section>
            </main>
        </>
    )
}

export default Login