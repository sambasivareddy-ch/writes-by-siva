// utils/getRandomGradient.js

export const getRandomGradient = () => {
    const gradients = [
        // Soft neutral grays
        "linear-gradient(135deg, #fafafa, #e5e5e5)",
        "linear-gradient(135deg, #f5f5f5, #dcdcdc)",
        "linear-gradient(135deg, #f0f0f0, #dedede)",

        // Light to mid charcoal
        "linear-gradient(135deg, #2b2b2b, #1a1a1a)",
        "linear-gradient(135deg, #3a3a3a, #2a2a2a)",
        "linear-gradient(135deg, #444, #222)",

        // Monochrome blends
        "linear-gradient(135deg, #000, #555)",
        "linear-gradient(135deg, #111, #333)",
        "linear-gradient(135deg, #222, #111)",

        // Warm neutrals
        "linear-gradient(135deg, #fefefe, #f4f2ee)",
        "linear-gradient(135deg, #f8f6f3, #e7e4df)",
        "linear-gradient(135deg, #eceae6, #d7d4cf)",

        // Cool neutrals
        "linear-gradient(135deg, #f2f4f5, #d9dee0)",
        "linear-gradient(135deg, #e8eaec, #cfd4d8)",
        "linear-gradient(135deg, #dfe2e5, #c3c7cc)",

        // Very soft blue-grays (excellent for tech vibe)
        "linear-gradient(135deg, #e9ecf2, #cdd4df)",
        "linear-gradient(135deg, #dfe3ea, #c2c8d1)",
        "linear-gradient(135deg, #d4d9e1, #b9c0cc)",

        // Elegant deep neutrals
        "linear-gradient(135deg, #1c1c1c, #2e2e2e)",
        "linear-gradient(135deg, #1a1b1d, #2a2c30)",
        "linear-gradient(135deg, #161616, #242424)",

        // Colorful
        "linear-gradient(135deg, #5eead4, #38bdf8)",
        "linear-gradient(135deg, #6ee7b7, #3b82f6)",
        "linear-gradient(135deg, #a5f3fc, #c4b5fd)",
        "linear-gradient(135deg, #fbcfe8, #d8b4fe)",
        "linear-gradient(135deg, #ffd6a5, #ffb4a2)",
        "linear-gradient(135deg, #99f6e4, #34d399)",
        "linear-gradient(135deg, #818cf8, #60a5fa)",
        "linear-gradient(135deg, #ff9e9e, #ffb74d)",
        "linear-gradient(135deg, #fdba74, #f9a8d4)",
        "linear-gradient(135deg, #93c5fd, #6ee7b7)"
    ];

    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
};

export default getRandomGradient;