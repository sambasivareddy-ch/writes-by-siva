import { createContext, useState } from "react";

const TagsContext = createContext({
    selectedTags: [],
    matchAllTags: false,
    setSelectedTags: () => {},
    removeSelectedTag: () => {},
});

export const TagsProvider = ({ children }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [matchAllTags, setMatchAllTags] = useState(false);

    const removeSelectedTag = (tag) => {
        setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
    };

    const toggleMatchAllTags = () => {
        setMatchAllTags((prev) => !prev);
    };

    const value = {
        selectedTags,
        matchAllTags,
        setSelectedTags,
        removeSelectedTag,
        toggleMatchAllTags
    }

    return (
        <TagsContext.Provider value={value}>
            {children}
        </TagsContext.Provider>
    );
}

export default TagsContext;