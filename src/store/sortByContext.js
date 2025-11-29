import { createContext, useState } from "react";

const SortByContext = createContext({
    sortby: "default",
    setSortOptionHandler: (sort) => {}
});

export const SortByProvider = ({ children }) => {
    const [sortBy, setSortBy] = useState("default");

    const setSortOptionHandler = (sort) => {
        setSortBy(sort);
    };

    const value = {
        sortBy,
        setSortOptionHandler
    }

    return (
        <SortByContext.Provider value={value}>
            {children}
        </SortByContext.Provider>
    );
}

export default SortByContext;