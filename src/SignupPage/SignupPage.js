import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const SignupPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
            axios.post('https://personal-budget-app-4cx6.onrender.com/api/login', user)
            .then(res => {
                const token = res.data.token;
                localStorage.setItem('jwt', token);
                navigate("/")
            });
                // ...
            })
            .catch((error) => {
                alert(error);
                // ..
            });
    }

    return (
        <main >
            <section>
                <div>
                    <div>
                        <h1> Welcome! </h1>
                        <form>
                            <div>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    type="email"
                                    label="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    label="Create password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                />
                            </div>
                            <button
                                type="submit"
                                onClick={onSubmit}
                            >
                                Sign up
                            </button>

                        </form>
                        <p>
                            Already have an account?{' '}
                            <NavLink to="/" >
                                Sign in
                            </NavLink>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default SignupPage