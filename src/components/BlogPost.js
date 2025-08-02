"use client";
import React, { useState, useEffect} from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BarLoader } from "react-spinners";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsightsIcon from '@mui/icons-material/Insights';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import styles from '@/styles/blog.module.css';

export default function BlogPost(props) {
    const { slug, content, meta, post } = props;
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState(meta?.tags);
    const [likes, setLikes] = useState(post.likes? post.likes:0);
    const [views, setViews] = useState(post.views? post.views:0);

    // Set the URL to the current page's URL
    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    useEffect(() => {
        const updateViewHandler = async () => {
            if (sessionStorage.getItem(`viewed-${slug}`)) {
                return;
            }
            try {
                const response = await fetch(`https://writes-by-siva-server-production.up.railway.app/analytics/${slug}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'views'
                    })
                })
    
                if (!response.ok) {
                    return
                }
    
                await response.json();
                sessionStorage.setItem(`viewed-${slug}`, "true");
                setViews((prev) => prev+1);
            } catch(err) {
                console.log(err)
            }
        }

        updateViewHandler();
    }, [])

    const likeClickHandler = async () => {
        try {
            const response = await fetch(`https://writes-by-siva-server-production.up.railway.app/analytics/${slug}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'likes'
                })
            })

            if (!response.ok) {
                return
            }

            await response.json();
            setLikes((prev) => prev+1);
        } catch(err) {
            console.log(err)
        }
    }

    const copyToClipboardHandler = () => {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert("URL copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy URL: ", err);
                alert("Failed to copy URL.");
            });
    };

    if (!content) {
        return <div className={styles["blog-loading"]}>
            <BarLoader/>
        </div>;
    }
    
    return (
        <div className={styles["blog-post-wrapper"]}>
            <Link href={'/'} passHref>
                <ArrowBackIcon/>
            </Link>
            <div>
                <div className={styles["blog-post-tags"]}>
                    {tags.map((tag, index) => (
                        <span key={index} className={styles["blog-post-tag"]}>
                            {tag}
                        </span>
                    ))} 
                </div>
                <div className={styles['blog-insights']}>
                    <button onClick={likeClickHandler}>
                        <FavoriteIcon/>
                        <p>{likes}</p>
                    </button>
                    <div className={styles['insights']}>
                        <InsightsIcon/>
                        <p>{views} Views</p>
                    </div>
                </div>
            </div>
            <ReactMarkdown
                rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        >
                        {String(children).replace(/\n$/, '')}
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
                        <button onClick={copyToClipboardHandler} className={styles["copy-url-button"]}>
                            <ContentCopyIcon/>
                        </button>
                        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon/>
                        </a>
                    </div>
                </div>
                {/* <div className={styles["blog-post-tags"]}>
                    {tags.map((tag, index) => (
                        <span key={index} className={styles["blog-post-tag"]}>
                            {tag}
                        </span>
                    ))} 
                </div> */}
            </div>
        </div>
    );
} 