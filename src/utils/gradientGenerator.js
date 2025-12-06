// utils/getRandomGradient.js

export const getRandomGradient = () => {
    const gradients = [
        "linear-gradient(90deg, #ffffff 0%, #e6e6e6 15%, #bfbfbf 35%, #d9d9d9 55%, #f2f2f2 75%, #ffffff 100% )",
        "linear-gradient(90deg, #000000 0%, #1a1a1a 20%, #4d4d4d 45%, #2b2b2b 70%, #0d0d0d 100% )",
        "linear-gradient(90deg, #000000 0%, #4a4a4a 20%, #ffffff 50%, #bdbdbd 70%, #000000 100% )"
    ];

    return gradients[Math.floor(Math.random() * gradients.length)];
};

export default getRandomGradient;
