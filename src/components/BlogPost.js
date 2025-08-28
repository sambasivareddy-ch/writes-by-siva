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
import InsightsIcon from "@mui/icons-material/Insights";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import styles from "@/styles/blog.module.css";

export default function BlogPost(props) {
    const { slug, content, meta, post } = props;
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState(meta?.tags);
    const [likes, setLikes] = useState(post.likes ? post.likes : 0);
    const [views, setViews] = useState(post.views ? post.views : 0);
    const [tldr, setTldr] = useState(null);
    const [showTldr, setShowTldr] = useState(false);
    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const [isScrollVisible, setIsScrollVisible] = useState(false);

    // Set the URL to the current page's URL & check whether the blog is liked or not
    useEffect(() => {
        setUrl(window.location.href);

        // Fetch the like status of this blog
        const liked = localStorage.getItem(`liked-${slug}`);
        setAlreadyLiked(liked !== null && liked !== '');

        const toggleVisibility = () => {
            setIsScrollVisible(window.scrollY > 200);
        }
        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTopHandler = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        const liked = localStorage.getItem(`liked-${slug}`);
        setAlreadyLiked(liked !== null && liked !== '');
    }, [likes]);

    const summarizeBlogHandler = async () => {
        if (!showTldr) {
            setShowTldr(true);
            try {
                const response = await fetch(
                    `https://writes-by-siva-server-production.up.railway.app/summarize/${slug}`
                );
    
                if (!response.ok) {
                    return;
                }
    
                const json = await response.json();
                setTldr(json.text);
            } catch (err) {
                console.log(err);
            }
        } else {
            setShowTldr(false);
        }
    };

    useEffect(() => {
        const updateViewHandler = async () => {
            if (sessionStorage.getItem(`viewed-${slug}`)) {
                return;
            }
            try {
                const response = await fetch(
                    `https://writes-by-siva-server-production.up.railway.app/analytics/${slug}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            type: "views",
                        }),
                    }
                );

                if (!response.ok) {
                    return;
                }

                const json = await response.json();
                if (json.success) {
                    sessionStorage.setItem(`viewed-${slug}`, "true");
                    setViews((prev) => prev + 1);
                }
            } catch (err) {
                console.log(err);
            }
        };

        updateViewHandler();
    }, []);

    const likeClickHandler = async () => {
        if (alreadyLiked) {
            return;
        }
        try {
            const response = await fetch(
                `https://writes-by-siva-server-production.up.railway.app/analytics/${slug}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "likes",
                    }),
                }
            );

            if (!response.ok) {
                return;
            }

            const json = await response.json();
            if (json.success) {
                setLikes(likes + 1);
                localStorage.setItem(`liked-${slug}`, "true");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const copyToClipboardHandler = () => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                alert("URL copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy URL: ", err);
                alert("Failed to copy URL.");
            });
    };

    if (!content) {
        return (
            <div className={styles["blog-loading"]}>
                <BarLoader />
            </div>
        );
    }

    return (
        <div className={styles["blog-post-wrapper"]}>
            <Link href={"/"} passHref>
                <ArrowBackIcon />
            </Link>
            <div>
                <div className={styles["blog-post-tags"]}>
                    {tags.map((tag, index) => (
                        <span key={index} className={styles["blog-post-tag"]}>
                            {tag}
                        </span>
                    ))}
                </div>
                <div className={styles["blog-insights"]}>
                    <button onClick={likeClickHandler} aria-label="Like" className={alreadyLiked? styles['liked']: styles['not-liked']}>
                        {alreadyLiked ? <ThumbUpAltIcon/> : <ThumbUpOffAltIcon/>}
                        <p>{likes}</p>
                    </button>
                    <button className={styles['summarize-btn']} onClick={summarizeBlogHandler}>
                        {showTldr ? 'Hide': 'Show'} Summary
                    </button>
                    <div className={styles["insights"]}>
                        <InsightsIcon />
                        <p>{views} Views</p>
                    </div>
                </div>
            </div>
            <div className={styles["tldr-wrapper"]}>
                {showTldr && <div className={styles["tldr"]}>
                    <h1>tl;dr</h1>
                    {tldr ? 
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
                        {tldr}
                    </ReactMarkdown>
                    : "Loading...."}
                </div>}
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
            {isScrollVisible && <button onClick={scrollToTopHandler} className={styles['scroll-top_btn']}>
                <ArrowUpwardIcon/>
            </button>}
            <div className={styles["post-footer"]}>
                <div className={styles["blog-post-footer"]}>
                    <p>Share on:</p>
                    <div className={styles["blog-post-share"]}>
                        <button
                            onClick={copyToClipboardHandler}
                            className={styles["copy-url-button"]}
                            aria-label="Copy"
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
