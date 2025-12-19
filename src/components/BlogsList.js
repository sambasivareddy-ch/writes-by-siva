"use client";

import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useRef,
} from "react";
import Link from "next/link";

import ClearIcon from "@mui/icons-material/Clear";
import BlogComponent from "@/components/BlogComponent";
import styles from "@/styles/bloglist.module.css";

import TagsContext from "@/store/tagsContext";
import BlogsContext from "@/store/blogsContext";
import PageContext from "@/store/pageContext";
import SortByContext from "@/store/sortByContext";
import CursorContext from "@/store/cursorContext";
import useDebounce from "@/hooks/useDebounce";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

/**
 * Updated BlogList component that talks to two server routes:
 *  - GET /tags -> returns available tags + count per tag
 *  - GET /blogs -> accepts query params: tags, page, limit, sort_by, order
 *
 * Notes / behavior decisions implemented here:
 *  - tags are fetched from /tags and used to render tag buttons and counts
 *  - blogs are fetched from /blogs with the server-side pagination
 *  - client-side search (>=3 chars) filters results returned from server
 *  - matchAllTags is enforced client-side because the server "tags" param
 *    is assumed to behave as an OR filter (server behavior may vary)
 */

const DEFAULT_LIMIT = 10;

const BlogList = () => {
    const {
        selectedTags,
        matchAllTags,
        setSelectedTags,
        removeSelectedTag,
        toggleMatchAllTags,
    } = useContext(TagsContext);

    const { blogs: globalBlogs, setBlogs } = useContext(BlogsContext);

    const { currentPage, setPage } = useContext(PageContext);
    const { sortby, setSortOptionHandler } = useContext(SortByContext);
    const { setCursor } = useContext(CursorContext);

    const primaryTags = ["all", "tech", "personal", "tech-events"];
    const [blogTags, setBlogTags] = useState([]);
    const [eachTagCount, setEachTagCount] = useState({});
    const [currentBlogs, setCurrentBlogs] = useState([]);
    const [showTags, setShowTags] = useState(true);
    const [blogWrapperClass, setBlogWrapperClass] = useState(
        styles["blog-tags"]
    );

    const [presentPageIndex, setPresentPageIndex] = useState(currentPage); // pages are 1-indexed for server
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedText = useDebounce(searchQuery, 500);
    const [selectedPrimaryTag, setSelectedPrimaryTag] = useState(
        primaryTags[0]
    );
    const [menuOpened, setMenuOpened] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [sortOption, setSortOption] = useState(sortby);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1 });
    const [loading, setLoading] = useState(false);

    const firstFiltersRun = useRef(true);

    // helper: safe timestamp extractor
    const getTime = (b) => {
        try {
            return b.date ? new Date(b.date).getTime() : 0;
        } catch {
            return 0;
        }
    };

    // helper: total reactions (adjust fields if needed)
    const getReactions = (b) =>
        (Number(b.likes) || 0) +
        (Number(b.fires) || 0) +
        (Number(b.laugh) || 0) +
        (Number(b.anger) || 0);

    // reusable sort function — sorts a copy and returns it
    const applySort = (listToSort, option = sortOption) => {
        const arr = [...listToSort];

        switch (option) {
            case "date-posted-asc":
                arr.sort((a, b) => getTime(a) - getTime(b));
                break;

            case "most-reacted":
                arr.sort((a, b) => {
                    const rA = getReactions(a);
                    const rB = getReactions(b);
                    if (rB !== rA) return rB - rA;
                    return getTime(b) - getTime(a);
                });
                break;

            case "most-viewed":
                arr.sort((a, b) => {
                    const vA = Number(a.views) || 0;
                    const vB = Number(b.views) || 0;
                    if (vB !== vA) return vB - vA;
                    return getTime(b) - getTime(a);
                });
                break;

            case "default":
            default:
                // default -> date desc (latest first)
                arr.sort((a, b) => getTime(b) - getTime(a));
                break;
        }

        return arr;
    };

    // Map our UI sortOption to server sort_by & order
    const mapSortToServer = (option) => {
        switch (option) {
            case "date-posted-asc":
                return { sort_by: "date", order: "ASC" };
            case "most-reacted":
                // server may not support this; we'll still ask for date desc and sort client-side
                return { sort_by: "reactions", order: "DESC" };
            case "most-viewed":
                return { sort_by: "views", order: "DESC" };
            case "default":
            default:
                return { sort_by: "date", order: "DESC" };
        }
    };

    // Build query string for /blogs
    const buildBlogsUrl = ({
        page = 1,
        limit = DEFAULT_LIMIT,
        tags = [],
        sort = "default",
    }) => {
        const serverSort = mapSortToServer(sort);
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        params.set("sort_by", serverSort.sort_by);
        params.set("order", serverSort.order);
        params.set("include", matchAllTags);
        params.set("primary", selectedPrimaryTag);
        if (tags && tags.length > 0) params.set("tags", tags.join(","));

        return `${
            process.env.NEXT_PUBLIC_SERVER_URL || ""
        }/blogs?${params.toString()}`;
    };

    const fetchTags = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            params.set("primary", selectedPrimaryTag);
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_SERVER_URL || ""
                }/tags?${params.toString()}`
            );
            if (!res.ok) return;
            const json = await res.json();
            console.log(json);
            if (json.success) {
                setBlogTags(json.tags || []);
                setEachTagCount(json.eachTagCount || {});
            }
        } catch (err) {
            console.error("Failed to fetch tags", err);
        }
    }, [selectedPrimaryTag]);

    // Fetch blogs from server using selectedTags + pagination + sort
    const fetchBlogs = useCallback(
        async (page = 1) => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setLoading(true);
            try {
                // We'll request server with currently selected tags (OR behavior expected)
                const url = buildBlogsUrl({
                    page,
                    limit: DEFAULT_LIMIT,
                    tags: selectedTags,
                    sort: sortOption,
                });
                const res = await fetch(url);
                if (!res.ok) {
                    setLoading(false);
                    return;
                }
                const json = await res.json();
                if (json.success) {
                    // server provides pagination meta and blogs
                    const serverBlogs = json.blogs || [];
                    const serverMeta = json.meta || {
                        total: 0,
                        totalPages: 1,
                        page: 1,
                    };

                    // If primary tag (topic) is selected, filter client-side
                    const filteredByPrimary =
                        selectedPrimaryTag === "all"
                            ? serverBlogs
                            : serverBlogs.filter(
                                  (b) =>
                                      b.primary_category === selectedPrimaryTag
                              );

                    // If matchAllTags is true, ensure every selected tag exist in domains
                    const finalList =
                        matchAllTags && selectedTags.length > 0
                            ? filteredByPrimary.filter((b) =>
                                  selectedTags.every((t) =>
                                      b.domains.split(",").includes(t)
                                  )
                              )
                            : filteredByPrimary;

                    // apply client-side sorts that server might not support (e.g. most-reacted)
                    const finalSorted = applySort(finalList, sortOption);

                    setCurrentBlogs(finalSorted);
                    setMeta({
                        total: serverMeta.total || finalSorted.length,
                        totalPages: serverMeta.totalPages || 1,
                        page: serverMeta.page || page,
                    });

                    // store global blogs cache if needed
                    if (
                        (!globalBlogs || globalBlogs.length === 0) &&
                        serverBlogs.length > 0
                    ) {
                        setBlogs(serverBlogs);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [
            selectedTags,
            sortOption,
            selectedPrimaryTag,
            matchAllTags,
            setBlogs,
            globalBlogs,
        ]
    );

    // Init: load theme, tags and first page of blogs
    useEffect(() => {
        const t = localStorage.getItem("blog-theme");
        if (t) setTheme(t);
        else localStorage.setItem("blog-theme", "dark");
        document.documentElement.setAttribute("data-theme", t || "dark");

        fetchTags();
    }, [fetchTags]);

    useEffect(() => {
        setSortOption(sortby);
    }, [sortby]);

    useEffect(() => {
        fetchBlogs(presentPageIndex);
    }, [presentPageIndex, fetchBlogs]);

    // When selectedTags / matchAllTags / sortOption / selectedPrimaryTag change -> fetch page 1
    useEffect(() => {
        if (firstFiltersRun.current) {
            firstFiltersRun.current = false;
            return; // skip on first render
        }

        setPresentPageIndex(1);
        setPage(1);
    }, [
        selectedTags,
        matchAllTags,
        sortOption,
        selectedPrimaryTag,
        fetchBlogs,
    ]);

    // When user navigates pages
    // useEffect(() => {
    //     fetchBlogs(presentPageIndex);
    // }, [presentPageIndex]);

    // Apply client-side search when debounced text changes
    useEffect(() => {
        const q = debouncedText.trim().toLowerCase();
        if (q.length < 3) {
            // If less than 3 chars, reload current page from server (to show unfiltered results)
            fetchBlogs(presentPageIndex);
            return;
        }

        const filtered = currentBlogs.filter((blog) => {
            return (
                blog.title.toLowerCase().includes(q) ||
                blog.description.toLowerCase().includes(q) ||
                blog.slug.toLowerCase().includes(q) ||
                blog.domains.split(",").some((d) => d.toLowerCase().includes(q))
            );
        });

        setCurrentBlogs(filtered);
        // when searching, reset pagination to 1 as client-side subset may be small
        setPresentPageIndex(1);
    }, [debouncedText]);

    useEffect(() => {
        if (!showTags) {
            setBlogWrapperClass(styles["blog-tags"]);
        } else {
            setBlogWrapperClass(styles["blog-tags_more"]);
        }
    }, [showTags]);

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            removeSelectedTag(tag);
        } else {
            setSelectedTags((prevTags) => [...prevTags, tag]);
        }
    };

    const filterChangeHandler = (e) => {
        const optionChoosed = e.target.value;
        setSortOptionHandler(optionChoosed);
        setSortOption(optionChoosed);
        // fetch will be triggered by effect that listens to sortOption
    };

    return (
        <div className={styles["blog-wrapper"]}>
            <div className={styles["blog-main"]}>
                <div className={styles["blog-profile"]}>
                    <div className={styles["social-links"]}>
                        <a
                            href="https://sambasiva.vercel.app"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Portfolio profile"
                            onMouseEnter={() => setCursor('visit')}
                            onMouseLeave={() => setCursor('default')}
                        >
                            <PersonOutlineIcon fontSize="medium" /> Portfolio
                        </a>
                        <a
                            href="https://www.linkedin.com/in/samba-siva-reddy-ch/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn profile"
                            onMouseEnter={() => setCursor('visit')}
                            onMouseLeave={() => setCursor('default')}
                        >
                            <LinkedInIcon fontSize="medium" />
                        </a>
                        <a
                            href="https://www.github.com/sambasivareddy-ch"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub profile"
                            onMouseEnter={() => setCursor('visit')}
                            onMouseLeave={() => setCursor('default')}
                        >
                            <GitHubIcon fontSize="medium" />
                        </a>
                    </div>
                </div>
                <div className={styles["blog-input_header"]}>
                    <div className={styles["controls-wrapper"]}>
                        <input
                            type="text"
                            placeholder="Search Blogs here..."
                            className={styles["search-input"]}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                        />
                    </div>

                    <button
                        className={styles["show-more_tag_btn"]}
                        onClick={() => {
                            setShowTags(!showTags);
                        }}
                        aria-label={`show more tags`}
                        aria-pressed={showTags}
                    >
                        {!showTags ? "Show Tags" : "Close Tags"}
                    </button>
                </div>

                {menuOpened && (
                    <nav
                        className={styles["menu"]}
                        aria-label="Page Navigation"
                        aria-expanded={menuOpened}
                    >
                        <button
                            onClick={() =>
                                setSelectedPrimaryTag(primaryTags[0])
                            }
                            aria-label="All"
                        >
                            All
                        </button>
                        <button
                            onClick={() =>
                                setSelectedPrimaryTag(primaryTags[1])
                            }
                            aria-label="Technology"
                        >
                            Technology
                        </button>
                        <button
                            onClick={() =>
                                setSelectedPrimaryTag(primaryTags[2])
                            }
                            aria-label="Personal"
                        >
                            Personal
                        </button>
                        <button
                            onClick={() =>
                                setSelectedPrimaryTag(primaryTags[3])
                            }
                            aria-label="Tech Events"
                        >
                            Tech-Events
                        </button>
                        <Link
                            href={`/profile`}
                            aria-label="Visit Author Profile"
                        >
                            Profile
                        </Link>
                    </nav>
                )}

                {showTags && blogTags.length !== 0 && (
                    <div className={styles["blog-header"]}>
                        <label className={styles["filtering-option"]}>
                            <input
                                type="checkbox"
                                aria-label="strict filter"
                                aria-checked={matchAllTags}
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
                                        setPresentPageIndex(1);
                                        setPage(1);
                                    }}
                                    aria-label={`Filter based on ${tag}`}
                                    aria-pressed={selectedTags.includes(tag)}
                                    onMouseEnter={() => {
                                        if (selectedTags.includes(tag)) {
                                            setCursor('unselect');
                                        } else {
                                            setCursor('select');
                                        }
                                    }}
                                    onMouseLeave={() => setCursor('default')}
                                >
                                    <span>{tag}</span>
                                    <span className={styles["blog-tag_count"]}>
                                        {eachTagCount[tag] || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {blogTags.length !== 0 && (
                    <div className={styles["blog-ops"]}>
                        <p className={styles["sort-icon"]}>
                            {/* <SwapVertIcon /> */}
                            Sort By:
                        </p>
                        <select
                            onChange={filterChangeHandler}
                            aria-label={`Select Sort option`}
                            value={sortOption}
                        >
                            <option value={"default"} aria-label="Default Sort">
                                Latest
                            </option>
                            <option
                                value={"date-posted-asc"}
                                aria-label="Sort by Date Posted (Asc)"
                            >
                                Date Posted (Asc)
                            </option>
                            <option
                                value={"most-reacted"}
                                aria-label="Sort by the Most Reacted"
                            >
                                Most Reacted
                            </option>
                            <option
                                value={"most-viewed"}
                                aria-label="Sort by the Most Viewed"
                            >
                                Most Viewed
                            </option>
                        </select>
                    </div>
                )}

                {blogTags.length !== 0 && (
                    <div className={styles["blogs-count"]}>
                        <p>
                            {meta.total === 0
                                ? 0
                                : (meta.page - 1) * DEFAULT_LIMIT + 1}{" "}
                            - {Math.min(meta.page * DEFAULT_LIMIT, meta.total)}{" "}
                            of {meta.total} blogs
                        </p>
                    </div>
                )}

                <div
                    className={`${styles["blogs"]} ${
                        blogTags.length === 0 && styles["zero-blogs"]
                    }`}
                >
                    {blogTags.length !== 0 &&
                        currentBlogs.length !== 0 &&
                        currentBlogs.map((blog) => {
                            return (
                                <BlogComponent
                                    key={blog.id}
                                    title={blog.title}
                                    description={blog.description}
                                    domains={blog.domains.split(",")}
                                    slug={blog.slug}
                                    date={blog.date}
                                    likes={blog.likes ? blog.likes : 0}
                                    views={blog.views ? blog.views : 0}
                                    fires={blog.fires ? blog.fires : 0}
                                    laugh={blog.laugh ? blog.laugh : 0}
                                    anger={blog.anger ? blog.anger : 0}
                                    readtime={blog.readtime ? blog.readtime : 0}
                                    author={blog.author}
                                    thumbnail={
                                        blog.thumbnail ? blog.thumbnail : null
                                    }
                                    searchQuery={
                                        searchQuery.trim().length >= 3
                                            ? searchQuery
                                            : ""
                                    }
                                />
                            );
                        })}

                    {!loading && blogTags.length === 0 && (
                        <div className={styles["no-blogs"]}>
                            Oops, 404: Blogs not Found
                        </div>
                    )}

                    {blogTags.length !== 0 &&
                        !loading &&
                        currentBlogs.length === 0 && (
                            <div className={styles["no-blogs"]}>
                                No blogs match your filters.
                            </div>
                        )}

                    {loading && (
                        <div className={styles["no-blogs"]}>Loading...</div>
                    )}
                </div>

                {blogTags.length !== 0 && (
                    <div className={styles["blog-controls"]}>
                        <p className={styles["blog-page-title"]}>Pages:</p>
                        <div className={styles["blog-pagination"]}>
                            {Array.from(
                                { length: meta.totalPages },
                                (_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            className={`${
                                                styles["blog-pagination-number"]
                                            } ${
                                                presentPageIndex === page
                                                    ? styles["active"]
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setPage(page);
                                                setPresentPageIndex(page);
                                            }}
                                            aria-label={`go to page ${page}`}
                                            aria-pressed={
                                                presentPageIndex === page
                                            }
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
