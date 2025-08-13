import React from "react";

import styles from '@/styles/blog.module.css';

const Newsletter = () => {
    const formSubmitHandler = (e) => {
        e.preventDefault();
    }

    return (
        <div className={styles['news-letter_wrapper']}>
            <h3>Join our Newsletter</h3>
            <form onSubmit={formSubmitHandler}>
                <input type="email" placeholder="Enter your Email"/>
                <button type="submit">Subscribe</button>
            </form>
        </div>
    )
}

export default Newsletter;