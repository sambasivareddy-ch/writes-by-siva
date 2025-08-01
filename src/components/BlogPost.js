"use client";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BarLoader } from "react-spinners";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import styles from "@/styles/blog.module.css";

export default function BlogPost({ slug }) {
    const [url, setUrl] = useState("");
    const [content, setContent] = useState(null);
    const [meta, setMeta] = useState(null);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    useEffect(() => {
        const updateViews = async () => {
            const viewedKey = `viewed-${slug}`;
            if (!sessionStorage.getItem(viewedKey)) {
                const response = await fetch(`${process.env.URL}/api/posts/${slug}/analytics`, {
                    method: 'PATCH',
                    body: JSON.stringify({ type: 'views' }),
                });
                if (!response.ok) {
                    return;
                }
                await response.json();
                sessionStorage.setItem(viewedKey, 'true');
            }
        }
        updateViews();
    }, []);

    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await fetch(
                    `${process.env.URL}/api/posts/${slug}`
                );
                if (!res.ok) return;
                const data = await res.json();
                setLikes(data.post.likes)
                setViews(data.post.views)
                setContent(data.content);
                setMeta(data.meta);
            } catch (err) {
                console.error(err);
            }
        };
        getPost();
    }, [slug]);

    const copyToClipboardHandler = () => {
        navigator.clipboard
            .writeText(url)
            .then(() => alert("URL copied to clipboard!"))
            .catch((err) => {
                console.error("Failed to copy URL: ", err);
                alert("Failed to copy URL.");
            });
    };

    const likeButtonClickHandler = async () => {
        try {
            const response = fetch(`${process.env.URL}/api/posts/${slug}/analytics`, {
                method: 'PATCH',
                body: JSON.stringify({ type: 'likes' }),
            });
            if (!response.ok) {
                return;
            }
            const json = await response.json();
            setLikes(json.likes)
        } catch(err) {
            console.log(err)
        }
    }

    if (!content || !meta) {
        return (
            <div className={styles["blog-loading"]}>
                <BarLoader />
            </div>
        );
    }

    return (
        <div className={styles["blog-post-wrapper"]}>
            <Link href="/" passHref>
                <ArrowBackIcon />
            </Link>
            <div className={styles["post-footer"]}>
                <div className={styles["blog-post-tags"]}>
                    {meta.tags?.map((tag, i) => (
                        <span key={i} className={styles["blog-post-tag"]}>
                            {tag}
                        </span>
                    ))}
                </div>
                <div className={styles['blog-analytics']}>
                    <button className={styles['like-btn']} onClick={likeButtonClickHandler}>
                        <ThumbUpAltIcon/>
                        <p>{likes} likes</p>
                    </button>
                    <div className={styles['analytics']}>
                        <VisibilityIcon/>
                        <p>{views} views</p>
                    </div>
                </div>
            </div>
            <ReactMarkdown
                rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
            <div className={styles["post-footer"]}>
                <div className={styles["blog-post-footer"]}>
                    <p>Share on:</p>
                    <div className={styles["blog-post-share"]}>
                        <button
                            onClick={copyToClipboardHandler}
                            className={styles["copy-url-button"]}
                        >
                            <ContentCopyIcon />
                        </button>
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                url
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <WhatsAppIcon />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
