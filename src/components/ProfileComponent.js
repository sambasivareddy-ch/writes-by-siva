import React from "react";
import Link from "next/link";

import styles from '../styles/blog.module.css';

const ProfileComponent = () => {
    return (
        <div className={styles['profile-wrapper']}>
            <Link href={`/`}>Go to Home</Link>
            <div className={styles['profile-intro']}>
                <h3>Namaste, I'm</h3>
                <h1>Samba Siva Reddy</h1>
                <p>
                I'm a Full Stack Web Developer with over 2 years of experience working on core PostgreSQL internals, developing distributed systems on top of it. With deep expertise in the MERN stack and backend development using Golang, I focus on building clean, scalable, and maintainable architectures. I'm also well-versed in Docker-based containerization, ensuring efficient development and deployment pipelines. Recently, I’ve expanded into cross-platform mobile development using React Native. Currently, I serve as a Member of Technical Staff at Zoho Corporation, where I work on high-performance software systems that solve complex, real-world problems.
                </p>
            </div>
            <div className={styles['profile-links']}>
                <h2>Links</h2>
                <span>
                    Phone: <a href="tel:+917337375243" aria-label="phone">(+91)73373 75243</a>
                </span>
                <span>
                    Email: <a href="mailto:sambasivareddychinta@gmail.com" aria-label="email">sambasivareddychinta@gmail.com</a>
                </span>
                <span>
                    Github: <a href="https://github.com/sambasivareddy-ch" aria-label="github" target="_blank" referrerPolicy="no-referrer">sambasivareddy-ch</a>
                </span>
                <p>For more details, please visit my portfolio at ⤵️</p>
                <a href="https://sambasiva.vercel.app/" className={styles['portfolio']} target="_blank" aria-label="portfolio" referrerPolicy="no-referrer">Portfolio</a>
            </div>
        </div>
    )
}

export default ProfileComponent;