const { useState, useEffect } = require("react")

const useDebounce = (value, delay) => {
    const [debouncedText, setDebouncedText] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedText(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);

    return debouncedText;
}

export default useDebounce;