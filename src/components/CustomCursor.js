import { useEffect, useState } from "react";

import styles from '@/styles/cursor.module.css';

const CustomCursor = ({ cursor }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const move = (e) => setPos({ x: e.clientX, y: e.clientY });

        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <div
            className={`${styles['cursor']} ${styles[`cursor--${cursor}`]}`}
            style={{ left: pos.x, top: pos.y }}
        >
            {cursor !== "default" && <span>{cursor}</span>}
        </div>
    );
};

export default CustomCursor;
