import React, { useState, useEffect } from "react";

import styles from "../styles/suggestions.module.css";

const Suggestions = ({ primary }) => {
    const [suggestedBlogs, setSuggestedBlogs] = useState([]);

    useEffect(() => {
        const getTopBlogs = async () => {
            try {
                const response = await fetch(
                    `https://writes-by-siva-server-production.up.railway.app/topblogs/${primary}`
                );

                if (!response.ok) {
                    return;
                }

                const json = await response.json();

                setSuggestedBlogs(json?.posts.slice(0, 4));
            } catch (err) {
                console.log(err);
            }
        };

        getTopBlogs();
    }, [primary]);

    return (
        <div className={styles["suggestion-wrapper"]}>
            <h2>Related Articles</h2>
            <div className={styles["suggestions"]}>
                {suggestedBlogs.map((blog, idx) => {
                    return (
                        <div key={Math.random()} className={styles['top-blog']}>
                            <a
                                href={`https://www.bysiva.blog/blog/${blog.slug}`}
                            >
                                {idx+1}. {blog.title} ({blog.readtime} Min)
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Suggestions;
