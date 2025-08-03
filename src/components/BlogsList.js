"use client";
import React, { useState, useEffect, useContext } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import BlogComponent from "@/components/BlogComponent";
import styles from "@/styles/blog.module.css";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import TagsContext from "@/store/tagsContext";
import useDebounce from "@/hooks/useDebounce";

const BlogList = () => {
    const {
        selectedTags,
        matchAllTags,
        setSelectedTags,
        removeSelectedTag,
        toggleMatchAllTags,
    } = useContext(TagsContext);

    const primaryTags = ["tech", "personal", "tech-events"];
    const [blogTags, setBlogTags] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [topicBasedBlogs, setTopicBasedBlogs] = useState([]);
    const [currentBlogs, setCurrentBlogs] = useState(blogs);
    const [showMoreStatus, setShowMoreStatus] = useState(false);
    const [blogWrapperClass, setBlogWrapperClass] = useState(
        styles["blog-tags"]
    );
    const [tagsCount, setTagsCount] = useState({});
    const [presentPageIndex, setPresentPageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedText = useDebounce(searchQuery, 500);
    const [selectedPrimaryTag, setSelectedPrimaryTag] = useState(
        primaryTags[0]
    );

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`https://writes-by-siva-server-production.up.railway.app/all`);

                if (!response.ok) {
                    return
                }

                const json = await response.json();
                setBlogs(json.blogs)
            } catch(err) {
                console.log(err);
            }
        }

        fetchPosts();
    }, [])

    useEffect(() => {
        const query = debouncedText.trim().toLowerCase();

        const filtered = topicBasedBlogs.filter((blog) => {
            let matchesSearch = true;
            if (query.length >= 3) {
                matchesSearch =
                    blog.title.toLowerCase().includes(query) ||
                    blog.description.toLowerCase().includes(query) ||
                    blog.slug.toLowerCase().includes(query) ||
                    blog.domains.split(',').some((d) => d.toLowerCase().includes(query));
            }

            // Tag match
            const matchesTags =
                selectedTags.length === 0
                    ? true
                    : matchAllTags
                    ? selectedTags.every((tag) => blog.domains.split(',').includes(tag))
                    : selectedTags.some((tag) => blog.domains.split(',').includes(tag));

            return matchesSearch && matchesTags;
        });

        setCurrentBlogs(filtered);
    }, [selectedTags, matchAllTags, debouncedText, topicBasedBlogs, selectedPrimaryTag]);

    useEffect(() => {
        if (!showMoreStatus) {
            setBlogWrapperClass(styles["blog-tags"]);
        } else {
            setBlogWrapperClass(styles["blog-tags_more"]);
        }
    }, [showMoreStatus]);

    useEffect(() => {
        if (blogs) {
            const selectedBlogsBasedOnTopic = blogs.filter((blog) => blog['primary_category'] === selectedPrimaryTag);
            setTopicBasedBlogs(selectedBlogsBasedOnTopic)

            // Initialize blogTags with all unique tags from blogs
            const initialTags = Array.from(
                new Set(selectedBlogsBasedOnTopic.flatMap((blog) => blog.domains.split(',')))
            );
            initialTags.sort((a, b) => a.localeCompare(b)); // Sort tags alphabetically
            setBlogTags(initialTags);

            // Initialize tagsCount with the count of each tag
            const initialTagsCount = {};
            initialTags.forEach((tag) => {
                initialTagsCount[tag] = selectedBlogsBasedOnTopic.filter((blog) =>
                    blog.domains.split(',').includes(tag)
                ).length;
            });
            setTagsCount(initialTagsCount);
        }
    }, [selectedPrimaryTag, blogs]);

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            removeSelectedTag(tag);
        } else {
            setSelectedTags((prevTags) => [...prevTags, tag]);
        }
    };

    return (
        <div className={styles["blog-wrapper"]}>
            <div className={styles["blog-main"]}>
                <div className={styles["blog-input_header"]}>
                    <select
                        className={styles["primary-tag_select"]}
                        value={selectedPrimaryTag}
                        onChange={(e) => setSelectedPrimaryTag(e.target.value)}
                    >
                        {primaryTags.map((pTag) => {
                            return (
                                <option key={Math.random()} value={pTag}>
                                    {pTag}
                                </option>
                            );
                        })}
                    </select>
                    <div>
                        <input
                            type="text"
                            placeholder="Search Blogs here..."
                            className={styles["search-input"]}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                        />
                    </div>
                </div>
                {topicBasedBlogs.length !== 0 && <div className={styles["blog-header"]}>
                    <label className={styles["filtering-option"]}>
                        <input
                            type="checkbox"
                            aria-label="strict filter"
                            checked={matchAllTags}
                            onChange={() => {
                                toggleMatchAllTags();
                            }}
                        />
                        Match All Tags
                    </label>
                    <div className={blogWrapperClass}>
                        {selectedTags.length !== 0 && (
                            <button
                                className={styles["blog-tag_reset"]}
                                onClick={() => {
                                    setSelectedTags([]);
                                }}
                                aria-label={`reset applied filter`}
                            >
                                <ClearIcon fontSize="small" />
                            </button>
                        )}
                        {blogTags.map((tag) => (
                            <button
                                key={tag}
                                className={`${styles["blog-tag"]} ${
                                    selectedTags.includes(tag)
                                        ? styles["active"]
                                        : ""
                                }`}
                                onClick={() => {
                                    handleTagClick(tag);
                                    setPresentPageIndex(0);
                                }}
                                aria-label={`${tag} filter`}
                            >
                                <span>{tag}</span>
                                <span className={styles["blog-tag_count"]}>
                                    {tagsCount[tag] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>}
                {topicBasedBlogs.length !== 0 && <div className={styles["blog-controls"]}>
                    <button
                        className={styles["show-more_tag_btn"]}
                        onClick={() => {
                            setShowMoreStatus(!showMoreStatus);
                        }}
                        aria-label={`show more tags`}
                    >
                        {!showMoreStatus ? "More Tags" : "Less Tags"}
                    </button>
                    <div className={styles["blog-pagination"]}>
                        <button
                            className={styles["blog-pagination-btn"]}
                            onClick={() => {
                                if (presentPageIndex > 0) {
                                    setPresentPageIndex(presentPageIndex - 1);
                                }
                            }}
                            disabled={presentPageIndex === 0}
                            aria-label={`previous page`}
                        >
                            <ArrowBackIosIcon fontSize="small" />
                        </button>
                        <span className={styles["blog-pagination-index"]}>
                            {presentPageIndex + 1} /{" "}
                            {currentBlogs.length === 0
                                ? 1
                                : Math.floor(currentBlogs.length / 10) +
                                  (currentBlogs.length % 10 !== 0)}
                        </span>
                        <button
                            className={styles["blog-pagination-btn"]}
                            onClick={() => {
                                if (
                                    presentPageIndex <
                                    Math.ceil(currentBlogs.length / 10) - 1
                                ) {
                                    setPresentPageIndex(presentPageIndex + 1);
                                }
                            }}
                            disabled={
                                presentPageIndex * 10 + 10 >=
                                currentBlogs.length
                            }
                            aria-label={`next page`}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </button>
                    </div>
                </div>}
                {topicBasedBlogs.length !== 0 && <div className={styles["blogs-count"]}>
                    {(presentPageIndex + 1) * 10 > currentBlogs.length ? (
                        <p>
                            {presentPageIndex * 10} - {currentBlogs.length} of{" "}
                            {currentBlogs.length} blogs
                        </p>
                    ) : (
                        <p>
                            {presentPageIndex * 10} -{" "}
                            {(presentPageIndex + 1) * 10} of{" "}
                            {currentBlogs.length} blogs
                        </p>
                    )}
                </div>}
                <div className={`${styles["blogs"]} ${topicBasedBlogs.length === 0 && styles['zero-blogs']}`}>
                    {topicBasedBlogs.length !== 0 && currentBlogs
                        .slice(
                            presentPageIndex * 10,
                            presentPageIndex * 10 + 10
                        )
                        .map((blog) => {
                            return (
                                <BlogComponent
                                    key={blog.id}
                                    title={blog.title}
                                    description={blog.description}
                                    domains={blog.domains.split(',')}
                                    slug={blog.slug}
                                    date={blog.date}
                                    likes={blog.likes? blog.likes:0}
                                    views={blog.views? blog.views:0}
                                    readtime={blog.readtime? blog.readtime:0}
                                    searchQuery={
                                        searchQuery.trim().length >= 3
                                            ? searchQuery
                                            : ""
                                    }
                                />
                            );
                        })}
                    {topicBasedBlogs.length === 0 && 
                        <div className={styles['no-blogs']}>Yet to Add blogs on {selectedPrimaryTag} topic.</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default BlogList;
