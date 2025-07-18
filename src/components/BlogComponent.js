import React from "react";
import Link from "next/link";

import styles from '@/styles/blog.module.css';

const BlogComponent = (props) => {
    return (
        <Link href={`/blog/${props.slug}`} className={styles["blog-comp__link"]} passHref>
            <div className={styles["blog-comp__wrapper"]}>
                <div className={styles["blog-comp__meta_wrapper"]}>
                    <div className={styles["blog-comp__meta"]}>
                        <h3>
                            {props.title}
                        </h3>
                        <p>{(new Date(props.date)).toLocaleDateString('en-US',{ year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className={styles['blog-description']}>{props.description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogComponent;