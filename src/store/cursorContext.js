import { createContext, useState } from "react";

import CustomCursor from "@/components/CustomCursor";

const CursorContext = createContext({
    setCursor: () => {}
});

export const CursorProvider = ({ children }) => {
    const [cursor, setCursor] = useState('default');

    const value = {
        setCursor
    }

    return (
        <CursorContext.Provider value={ value }>
            {children}
            <CustomCursor cursor={cursor} />
        </CursorContext.Provider>
    );
}

export default CursorContext;