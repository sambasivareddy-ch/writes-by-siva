import React from "react";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "@/styles/blog.module.css";

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
    const {
        slug,
        title,
        description,
        date,
        searchQuery,
        domains,
        views,
        likes,
    } = props;

    return (
        <Link
            href={`/blog/${slug}`}
            className={styles["blog-comp__link"]}
            passHref
        >
            <div className={styles["blog-comp__wrapper"]}>
                <div className={styles["blog-comp__meta_wrapper"]}>
                    <div className={styles["blog-comp__meta"]}>
                        <h3>{highlightText(title, searchQuery)}</h3>
                        <div className={styles['blog-some_meta']}>
                            <p>
                                {new Date(date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <div className={styles["analytics"]}>
                                <VisibilityIcon />
                                <p>{views}</p>
                            </div>
                        </div>
                        <p className={styles["blog-description"]}>
                            {highlightText(description, searchQuery)}
                        </p>
                        <div className={styles["blog-domains"]}>
                            <div className={styles['blog-tag_wrapper']}>
                                {domains.map((tag) => {
                                    return (
                                        <p
                                            key={Math.random()}
                                            className={styles["tag"]}
                                        >
                                            {tag}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogComponent;
