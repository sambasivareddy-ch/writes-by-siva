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

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import styles from '@/styles/blog.module.css';

export default function BlogPost(props) {
    const { slug, content, meta } = props;
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState(meta?.tags);

    // Set the URL to the current page's URL
    useEffect(() => {
        setUrl(window.location.href);
    }, []);

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
            <div className={styles["blog-post-header"]}>
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
            <div className={styles["blog-post-tags"]}>
                {tags.map((tag, index) => (
                    <span key={index} className={styles["blog-post-tag"]}>
                        {tag}
                    </span>
                ))} 
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
        </div>
    );
} 