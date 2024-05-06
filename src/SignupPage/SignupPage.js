import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import './SignupPage.scss'

const SignupPage = () => {
    const navigate = useNavigate();
    const [signupValid, setSignupValid] = useState({ data: true });
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
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
                setSignupValid({ ...signupValid, data: false })
                if(error.code == "auth/invalid-email"){
                    setErrorMessage("Please enter a valid email")
                }
                else if (error.code == "auth/weak-password"){
                    setErrorMessage("Password has to be at least 6 characters long")
                }
                else if (error.code == "auth/missing-password"){
                    setErrorMessage("Please enter a password")
                }
                else if (error.code == "auth/email-already-in-use"){
                    setErrorMessage("This email already has an account with this site")
                }
            });
    }

    return (
        <main >
            <section className='signupForm' id="main">
                <div>
                    <div>
                        <h1>Sign Up</h1>
                        <form>
                            <div className='info'>
                                <label htmlFor="email-address">
                                    Email Address:
                                </label>
                                <input
                                    id="email-address"
                                    type="email"
                                    label="Email address"
                                    value={email}
                                    autoComplete='off'
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Email address"
                                />
                            </div>
                            <div className='info'>
                                <label htmlFor="password">
                                    Password:
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    label="Create password"
                                    value={password}
                                    autoComplete='off'
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                />
                            </div>
                            <div className='info'>
                            <button
                                type="submit"
                                onClick={onSubmit}
                            >
                                Sign up
                            </button>
                            </div>
                            {!(signupValid.data) &&
                            <div className='info'>
                                <div className='incorrectInfo'>
                                    <p>{errorMessage}</p>
                                </div>
                            </div>
                        }

                        </form>
                        <p className='info'>
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