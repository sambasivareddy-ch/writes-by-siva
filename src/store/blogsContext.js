import { createContext, useEffect, useState } from "react";

import styles from "../styles/blog.module.css";
import MailIcon from '@mui/icons-material/Mail';

const BlogsContext = createContext({
    blogs: [],
    setBlogs: (blogs) => {},
    clearBlogs: () => {},
});

export const BlogsProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [highlightFooter, setHightLightFooter] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHightLightFooter(false);
        }, 1500);

        () => clearTimeout(timer);
    }, [highlightFooter]);

    const clearBlogs = () => {
        setBlogs([]);
    }

    const value = {
        blogs,
        highlightFooter,
        setBlogs,
        clearBlogs,
    }

    return (
        <BlogsContext.Provider value={value}>
            {children}
            <a href="#footer" className={styles['subscribe-btn']} onClick={() => setHightLightFooter(true)}>
                <MailIcon/> Subscribe
            </a>
        </BlogsContext.Provider>
    );
}

export default BlogsContext;