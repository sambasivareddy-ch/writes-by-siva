import { createContext, useEffect, useState } from "react";

const BlogsContext = createContext({
    blogs: [],
    setBlogs: (blogs) => {},
    clearBlogs: () => {},
});

export const BlogsProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [highlightFooter, setHightLightFooter] = useState(false);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const theme = localStorage.getItem("blog-theme");
        if (theme) setTheme(theme);
        else localStorage.setItem("blog-theme", "dark");

        document.documentElement.setAttribute("data-theme", "dark");
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHightLightFooter(false);
        }, 1500);

        () => clearTimeout(timer);
    }, [highlightFooter]);

    const clearBlogs = () => {
        setBlogs([]);
    };

    const value = {
        blogs,
        highlightFooter,
        setBlogs,
        clearBlogs,
    };

    return (
        <BlogsContext.Provider value={value}>
            {children}
        </BlogsContext.Provider>
    );
};

export default BlogsContext;
