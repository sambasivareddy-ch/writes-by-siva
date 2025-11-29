import { createContext, useState } from "react";

const PageContext = createContext({
    currentPage: 1,
    setPage: (page) => {}
});

export const PageProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const setPage = (page) => {
        setCurrentPage(page)
    };

    const value = {
        currentPage,
        setPage
    }

    return (
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    );
}

export default PageContext;