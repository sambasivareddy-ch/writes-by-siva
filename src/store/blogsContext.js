import { createContext, useEffect, useState } from "react";

import styles from "../styles/blog.module.css";
import MailIcon from '@mui/icons-material/Mail';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const BlogsContext = createContext({
    blogs: [],
    setBlogs: (blogs) => {},
    clearBlogs: () => {},
});

export const BlogsProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [highlightFooter, setHightLightFooter] = useState(false);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const theme = localStorage.getItem('blog-theme');
        if (theme)
            setTheme(theme);
        else
            localStorage.setItem('blog-theme', 'dark');

        document.documentElement.setAttribute("data-theme", theme);
    }, []);

    const toggleThemeHandler = () => {
        const newTheme = theme === 'dark'? 'light': 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('blog-theme', newTheme);
    }

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
            <div className={styles['tool-btn']}>
                <a href="#footer" className={styles['subscribe-btn']} onClick={() => setHightLightFooter(true)}>
                    <MailIcon/>
                </a>
                <button onClick={toggleThemeHandler}>
                    {theme == 'dark' ? <LightModeIcon/>: <DarkModeIcon/>}
                </button>
            </div>
        </BlogsContext.Provider>
    );
}

export default BlogsContext;