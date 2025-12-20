"use client";
import React, { useState, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BarLoader } from "react-spinners";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGrinTears,
    faFire,
    faHeart,
    faFaceAngry,
} from "@fortawesome/free-solid-svg-icons";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

import Suggestions from "@/components/Suggestions";
import Comments from "@/components/Comments";
import ZoomImage from "@/components/ZoomImage";
import styles from "@/styles/blog.module.css";

import CursorContext from "@/store/cursorContext";

export default function BlogPost(props) {
    const { slug, content, meta, post, primary, domains } = props;
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState(meta?.tags);
    const [likes, setLikes] = useState(post.likes ? post.likes : 0);
    const [fires, setFires] = useState(post.fires ? post.fires : 0);
    const [laughs, setLaughs] = useState(post.laugh ? post.laugh : 0);
    const [anger, setAnger] = useState(post.anger ? post.anger : 0);
    const [views, setViews] = useState(post.views ? post.views : 0);
    const [tldr, setTldr] = useState(null);
    const [showTldr, setShowTldr] = useState(false);
    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const [alreadyFired, setAlreadyFired] = useState(false);
    const [alreadyLaughed, setAlreadyLaughed] = useState(false);
    const [alreadyAnger, setAlreadyAnger] = useState(false);
    const [isScrollVisible, setIsScrollVisible] = useState(false);
    const [theme, setTheme] = useState("dark");

    const { setCursor } = useContext(CursorContext);

    // Set the URL to the current page's URL & check whether the blog is liked or not
    useEffect(() => {
        setUrl(window.location.href);

        // Fetch the like status of this blog
        const liked = localStorage.getItem(`liked-${slug}`);
        setAlreadyLiked(liked !== null && liked !== "");

        // Fetch the fire status of this blog
        const fired = localStorage.getItem(`fired-${slug}`);
        setAlreadyFired(fired !== null && fired !== "");

        // Fetch the laugh status of this blog
        const laughed = localStorage.getItem(`laughed-${slug}`);
        setAlreadyLaughed(laughed !== null && laughed !== "");

        // Fetch the laugh status of this blog
        const angered = localStorage.getItem(`angered-${slug}`);
        setAlreadyAnger(angered !== null && angered !== "");

        const toggleVisibility = () => {
            setIsScrollVisible(window.scrollY > 200);
        };
        window.addEventListener("scroll", toggleVisibility);

        const theme = localStorage.getItem("blog-theme");
        if (theme) setTheme(theme);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTopHandler = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const liked = localStorage.getItem(`liked-${slug}`);
        setAlreadyLiked(liked !== null && liked !== "");
    }, [likes]);

    useEffect(() => {
        const fired = localStorage.getItem(`fired-${slug}`);
        setAlreadyFired(fired !== null && fired !== "");
    }, [fires]);

    useEffect(() => {
        const laughed = localStorage.getItem(`laughed-${slug}`);
        setAlreadyLaughed(laughed !== null && laughed !== "");
    }, [laughs]);

    useEffect(() => {
        const angered = localStorage.getItem(`angered-${slug}`);
        setAlreadyAnger(angered !== null && angered !== "");
    }, [anger]);

    const summarizeBlogHandler = async () => {
        if (!showTldr) {
            setShowTldr(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/summarize/${slug}`
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
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/${slug}`,
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
                `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/${slug}`,
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

    const fireClickHandler = async () => {
        if (alreadyFired) {
            return;
        }
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/${slug}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "fires",
                    }),
                }
            );

            if (!response.ok) {
                return;
            }

            const json = await response.json();
            if (json.success) {
                setFires(fires + 1);
                localStorage.setItem(`fired-${slug}`, "true");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const laughClickHandler = async () => {
        if (alreadyLaughed) {
            return;
        }
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/${slug}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "laugh",
                    }),
                }
            );

            if (!response.ok) {
                return;
            }

            const json = await response.json();
            if (json.success) {
                setLaughs(laughs + 1);
                localStorage.setItem(`laughed-${slug}`, "true");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const angerClickHandler = async () => {
        if (alreadyAnger) {
            return;
        }
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/analytics/${slug}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "anger",
                    }),
                }
            );

            if (!response.ok) {
                return;
            }

            const json = await response.json();
            if (json.success) {
                setAnger(anger + 1);
                localStorage.setItem(`angered-${slug}`, "true");
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
            <Link 
                className={styles.navLink} 
                href={"/"} 
                aria-label="Go Back" 
                onMouseEnter={() => setCursor('go-back')}
                onMouseLeave={() => setCursor('default')}
                passHref
            >
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
                    <button
                        onClick={likeClickHandler}
                        aria-label="Like"
                        className={
                            alreadyLiked
                                ? styles["reacted"]
                                : styles["not-reacted"]
                        }
                        onMouseEnter={() => setCursor('like')}
                        onMouseLeave={() => setCursor('default')}
                        aria-pressed={alreadyLiked}
                    >
                        <FontAwesomeIcon icon={faHeart} />
                        <span>{likes}</span>
                    </button>
                    <button
                        onClick={fireClickHandler}
                        aria-label="fire"
                        className={
                            alreadyFired
                                ? styles["reacted"]
                                : styles["not-reacted"]
                        }
                        aria-pressed={alreadyFired}
                        onMouseEnter={() => setCursor('fire')}
                        onMouseLeave={() => setCursor('default')}
                    >
                        <FontAwesomeIcon icon={faFire} />
                        <span>{fires}</span>
                    </button>
                    <button
                        onClick={laughClickHandler}
                        aria-label="laugh"
                        className={
                            alreadyLaughed
                                ? styles["reacted"]
                                : styles["not-reacted"]
                        }
                        aria-pressed={alreadyLaughed}
                        onMouseEnter={() => setCursor('laugh')}
                        onMouseLeave={() => setCursor('default')}
                    >
                        <FontAwesomeIcon icon={faGrinTears} />
                        <span>{laughs}</span>
                    </button>
                    <button
                        onClick={angerClickHandler}
                        aria-label="anger"
                        className={
                            alreadyAnger
                                ? styles["reacted"]
                                : styles["not-reacted"]
                        }
                        aria-pressed={alreadyAnger}
                        onMouseEnter={() => setCursor('anger')}
                        onMouseLeave={() => setCursor('default')}
                    >
                        <FontAwesomeIcon icon={faFaceAngry} />
                        <span>{anger}</span>
                    </button>
                    <div className={styles["insights"]} aria-label="Blog Views">
                        <VisibilityIcon />
                        <span>{views} Views</span>
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
                                customStyle={{
                                    color: "#e5e7eb",
                                    background: "#000",
                                  }}
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

                    img: ({ node, ...props }) => <ZoomImage {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
            {isScrollVisible && (
                <button
                    onClick={scrollToTopHandler}
                    className={styles["scroll-top_btn"]}
                    aria-label="Scroll to Top"
                >
                    <ArrowUpwardIcon />
                </button>
            )}
            <div className={styles["post-footer"]}>
                <div className={styles["blog-post-footer"]}>
                    <p>Share on:</p>
                    <div className={styles["blog-post-share"]}>
                        <button
                            onClick={copyToClipboardHandler}
                            className={styles["copy-url-button"]}
                            aria-label="Copy Link"
                        >
                            <ContentCopyIcon />
                        </button>
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                url
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share to Whatsapp"
                        >
                            <WhatsAppIcon />
                        </a>
                    </div>
                </div>
            </div>
            <Comments post_slug_id={slug} />
            <Suggestions primary={primary} domains={domains} />
        </div>
    );
}
