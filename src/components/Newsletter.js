import React, { useEffect, useState } from "react";

import styles from '@/styles/blog.module.css';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setTimeout(() => {
            setMessage('');
        }, 3000)
    }, [message]);

    const formSubmitHandler = async (e) => {
        e.preventDefault();

        if (!email.trim().length) {
            setMessage('Please enter your Email Address')
        }

        try {
            const response = await fetch(`https://writes-by-siva-server-production.up.railway.app/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                })
            })

            if (!response.ok) {
                setMessage('Unable to subscribe');
            }

            const data = await response.json();

            setMessage(data.message);
            setEmail('');
        } catch(err) {
            setMessage('Error occurred at server');
        }
    }

    return (
        <div className={styles['news-letter_wrapper']}>
            <h3>Join our Newsletter</h3>
            <form onSubmit={formSubmitHandler}>
                <input 
                    type="email" 
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p>{message.length !== 0 && message}</p>
                <button type="submit">Subscribe</button>
            </form>
        </div>
    )
}

export default Newsletter;