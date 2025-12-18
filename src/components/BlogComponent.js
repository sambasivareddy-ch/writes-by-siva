import React, { useContext, useState, useEffect } from "react";
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
import getRandomGradient from "@/utils/gradientGenerator";

import TagsContext from "@/store/tagsContext";
import CursorContext from "@/store/cursorContext";

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
    
    const { setCursor } = useContext(CursorContext);

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
        thumbnail
    } = props;

    const [hovered, setHovered] = useState(null);

    const [bannerGradient, setBannerGradient] = useState("");
    const [textColor, setTextColor] = useState("#fff");

    useEffect(() => {
        const theme = localStorage.getItem("blog-theme");
        const gradient = getRandomGradient(theme);
        const isDark = gradient.includes("#1") || gradient.includes("#2") || gradient.includes("#0");
        setBannerGradient(gradient);
        setTextColor(isDark? "#fff": "#000");
    }, []);

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
                    <div className={styles["blog-meta"]}>
                        <div className={styles["blog-date"]}>
                            {/* <p className={styles['author-icon']}>{author[0]}</p>  */}
                            {author} | {new Date(date).toLocaleDateString("en-In", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                    <Link
                        href={`/blog/${slug}`}
                        className={styles["blog-comp__link_banner"]}
                        aria-label="Open the Blog"
                        onMouseEnter={() => setCursor('open')}
                        onMouseLeave={() => setCursor('default')}
                        passHref
                    >
                        {!thumbnail && <div className={styles['blog-banner']}
                            style={{ background: bannerGradient, zIndex: 999}}
                        >
                            <h2 className={styles['blog-banner-title']} style={{ color: textColor }}>{title}</h2>
                        </div>}
                        {thumbnail &&
                            <img src={thumbnail} alt={title}/>
                        }
                    </Link>
                    <p className={styles["blog-description"]}>
                        {highlightText(description, searchQuery)}
                    </p>
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
                                                onMouseEnter={() => {
                                                    if (selectedTags.includes(domain)) {
                                                        setCursor('unselect');
                                                    } else {
                                                        setCursor('select');
                                                    }
                                                }}
                                                onMouseLeave={() => setCursor('default')}
                                                aria-label={`Filter based on tag ${domain}`}
                                                aria-pressed={selectedTags.includes(
                                                    domain
                                                )}
                                            >
                                                #{domain}
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
