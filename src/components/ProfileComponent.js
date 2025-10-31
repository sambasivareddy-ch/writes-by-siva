import React from "react";
import Link from "next/link";

import styles from "../styles/profile.module.css";

const ProfileComponent = () => {
    return (
        <div className={styles["profile-wrapper"]}>
            <Link href={`/`}>Go to Home</Link>
            <div className={styles["profile-intro"]}>
                <h4>Namaste, Hope you&apos;re doing great!!</h4>
                <h1>I&apos;m Samba Siva Reddy</h1>
                <p>
                    A Software Developer with over 2 years of
                    experience working on <i>"Core PostgreSQL internals"</i>, developing
                    distributed systems on top of it in order to scale the large data horizontally in 
                    cost effective and optimized way. In addition to work experience in PostgreSQL, I have 
                    deep expertise in the <ins>MERN stack and backend development using Golang</ins>, I focus on
                    building clean, scalable, and maintainable architectures. I
                    am also well-versed in <ins>Docker-based containerization</ins>,
                    ensuring efficient development and deployment pipelines.
                    Recently, I’ve started expanding my knowledge on <ins>Machine Learning</ins>. 
                </p>
                <p>
                    Currently, I serve as a
                    Member of Technical Staff at Zoho Corporation, where I work
                    on high-performance software systems that solve complex,
                    real-world problems.
                </p>
            </div>
            <div className={styles["profile-links"]}>
                <h2>Links</h2>
                <span>
                    Github:{" "}
                    <a
                        href="https://github.com/sambasivareddy-ch"
                        aria-label="github"
                        target="_blank"
                        referrerPolicy="no-referrer"
                    >
                        sambasivareddy-ch
                    </a>
                </span>
                <p>For more details, please visit my portfolio at ⤵️</p>
                <a
                    href="https://sambasiva.vercel.app/"
                    className={styles["portfolio"]}
                    target="_blank"
                    aria-label="portfolio"
                    referrerPolicy="no-referrer"
                >
                    Portfolio
                </a>
            </div>
        </div>
    );
};

export default ProfileComponent;
