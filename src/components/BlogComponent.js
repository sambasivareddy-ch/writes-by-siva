import React from "react";
import Link from "next/link";
import styles from '@/styles/blog.module.css';

const highlightText = (text, query) => {
    if (!query) return text;

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return text;

    const regex = new RegExp(`(${trimmedQuery})`, "gi");

    const parts = text.split(regex);
    return parts.map((part, i) =>
        part.toLowerCase() === trimmedQuery.toLowerCase() ? (
            <mark key={i}>{part}</mark>
        ) : (
            part
        )
    );
};

const BlogComponent = (props) => {
    const { slug, title, description, date, searchQuery } = props;

    return (
        <Link href={`/blog/${slug}`} className={styles["blog-comp__link"]} passHref>
            <div className={styles["blog-comp__wrapper"]}>
                <div className={styles["blog-comp__meta_wrapper"]}>
                    <div className={styles["blog-comp__meta"]}>
                        <h3>{highlightText(title, searchQuery)}</h3>
                        <p>
                            {(new Date(date)).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                        <p className={styles["blog-description"]}>
                            {highlightText(description, searchQuery)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogComponent;
