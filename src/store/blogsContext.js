import { createContext, useState } from "react";

const BlogsContext = createContext({
    blogs: [],
    setBlogs: (blogs) => {},
    clearBlogs: () => {},
});

export const BlogsProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);

    const clearBlogs = () => {
        setBlogs([]);
    }

    const value = {
        blogs,
        setBlogs,
        clearBlogs,
    }

    return (
        <BlogsContext.Provider value={value}>
            {children}
        </BlogsContext.Provider>
    );
}

export default BlogsContext;