// utils/getRandomGradient.js

export const getRandomGradient = () => {
    const gradients = [
        // Ultra-soft whites → light grays (clean UI feel)
        "linear-gradient(135deg, #ffffff, #f5f5f5)",
        "linear-gradient(135deg, #fafafa, #eaeaea)",
        "linear-gradient(135deg, #f7f7f7, #e5e5e5)",
        "linear-gradient(135deg, #f4f4f4, #dcdcdc)",

        // Subtle neutral textures
        "linear-gradient(135deg, #f0f0f0, #d8d8d8)",
        "linear-gradient(135deg, #ededed, #d6d6d6)",
        "linear-gradient(135deg, #e8e8e8, #d1d1d1)",

        // Blue-gray neutrals (still monochrome-adjacent but not colorful)
        "linear-gradient(135deg, #f2f3f5, #d7d9dd)",
        "linear-gradient(135deg, #e7e9ec, #c8ccd2)",
        "linear-gradient(135deg, #dde0e4, #c0c4ca)",

        // Mid-gray to deep charcoal
        "linear-gradient(135deg, #444, #222)",
        "linear-gradient(135deg, #3a3a3a, #1f1f1f)",
        "linear-gradient(135deg, #2f2f2f, #1a1a1a)",
        "linear-gradient(135deg, #383838, #202020)",

        // Rich monochrome blacks with tonal depth
        "linear-gradient(135deg, #000000, #1a1a1a)",
        "linear-gradient(135deg, #0f0f0f, #2b2b2b)",
        "linear-gradient(135deg, #121212, #1e1e1e)",
        "linear-gradient(135deg, #111, #333)",

        // Elegant deep-neutral blends
        "linear-gradient(135deg, #161616, #242424)",
        "linear-gradient(135deg, #1a1b1d, #2a2c30)",
        "linear-gradient(135deg, #1c1c1c, #2e2e2e)",

        // High-contrast modern BW pairs
        "linear-gradient(135deg, #ffffff, #c8c8c8)",
        "linear-gradient(135deg, #e6e6e6, #b3b3b3)",
        "linear-gradient(135deg, #d9d9d9, #a6a6a6)",
        "linear-gradient(135deg, #cccccc, #999999)",

        // Reverse monochrome (white → black transitions)
        "linear-gradient(135deg, #f9f9f9, #111111)",
        "linear-gradient(135deg, #f0f0f0, #1e1e1e)",
        "linear-gradient(135deg, #e5e5e5, #2a2a2a)"
    ];

    return gradients[Math.floor(Math.random() * gradients.length)];
};

export default getRandomGradient;
