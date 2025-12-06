// utils/getRandomGradient.js

export const getRandomGradient = (theme) => {
    const gradients = [
        "linear-gradient(45deg, #E0FFDA, #A0E6B4, #50B882)"
    ];
    
    return gradients[0];
    // return gradients[Math.floor(Math.random() * gradients.length)];
};

export default getRandomGradient;
