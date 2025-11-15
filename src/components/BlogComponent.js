import React, { useContext, useState } from "react";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGrinTears,
    faFire,
    faHeart,
    faFaceAngry,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/component.module.css";

import TagsContext from "@/store/tagsContext";

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
    const { selectedTags, setSelectedTags, removeSelectedTag } =
        useContext(TagsContext);

    const {
        slug,
        title,
        description,
        date,
        searchQuery,
        domains,
        views,
        likes,
        readtime,
        author,
        fires,
        laugh,
        anger,
    } = props;

    const [hovered, setHovered] = useState(null);

    const handleClickHandler = (tag) => {
        if (selectedTags.includes(tag)) {
            removeSelectedTag(tag);
        } else {
            setSelectedTags((prevTags) => [...prevTags, tag]);
        }
    };

    return (
        <div className={styles["blog-comp__wrapper"]}>
            <div className={styles["blog-comp__meta_wrapper"]}>
                <div className={styles["blog-comp__meta"]}>
                    <Link
                        href={`/blog/${slug}`}
                        className={styles["blog-comp__link"]}
                        aria-label="Open the Blog"
                        passHref
                    >
                        <h3>{highlightText(title, searchQuery)}</h3>
                    </Link>
                    <div className={styles["blog-meta"]}>
                        {/* {author && ( */}
                        {/* <div className={styles["blog-insights_author"]}> */}
                        {/* <PersonOutlineIcon /> */}
                        {/* <p> */}
                        {/* By:{" "} */}
                        {/* {author[0].toUpperCase() + */}
                        {/* author.substring(1)} */}
                        {/* </p> */}
                        {/* </div> */}
                        {/* )} */}
                        <p className={styles["blog-date"]}>
                            {new Date(date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    {/* <p className={styles["blog-description"]}>
                        {highlightText(description, searchQuery)}
                    </p> */}
                    <div className={styles["blog-component_insights"]}>
                        <div className={styles["blog-insights"]}>
                            <div className={styles["blog-insights_read"]}>
                                <MenuBookIcon />
                                <p>{readtime} Min</p>
                            </div>
                            <div className={styles["blog-reactions"]}>
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className={styles.reactionIcon}
                                    onMouseEnter={() => setHovered("likes")}
                                    onMouseLeave={() => setHovered(null)}
                                />
                                <FontAwesomeIcon
                                    icon={faFire}
                                    className={styles.reactionIcon}
                                    onMouseEnter={() => setHovered("fires")}
                                    onMouseLeave={() => setHovered(null)}
                                />
                                <FontAwesomeIcon
                                    icon={faGrinTears}
                                    className={styles.reactionIcon}
                                    onMouseEnter={() => setHovered("laugh")}
                                    onMouseLeave={() => setHovered(null)}
                                />
                                <FontAwesomeIcon
                                    icon={faFaceAngry}
                                    className={styles.reactionIcon}
                                    onMouseEnter={() => setHovered("anger")}
                                    onMouseLeave={() => setHovered(null)}
                                />
                                <p>
                                    {hovered === null &&
                                        likes + fires + laugh + anger}
                                    {hovered === "likes" && likes}
                                    {hovered === "fires" && fires}
                                    {hovered === "laugh" && laugh}
                                    {hovered === "anger" && anger}
                                </p>
                            </div>
                            <div className={styles["blog-insights_view"]}>
                                <VisibilityIcon />
                                <p>{views}</p>
                            </div>
                        </div>
                        {domains && domains.length > 0 && (
                            <div>
                                <ul>
                                    {domains.map((domain, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() =>
                                                    handleClickHandler(domain)
                                                }
                                                className={`${
                                                    styles[
                                                        "blog-insights_domains"
                                                    ]
                                                } ${
                                                    selectedTags.includes(
                                                        domain
                                                    )
                                                        ? styles["active_btn"]
                                                        : ""
                                                }`}
                                                aria-label={`Filter based on tag ${domain}`}
                                                aria-pressed={selectedTags.includes(
                                                    domain
                                                )}
                                            >
                                                {domain}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogComponent;
