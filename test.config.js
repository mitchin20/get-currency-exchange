module.exports = {
    transform: {
        "^.+\\.(ts|tsx)$": "babel-jest", // Tells Jest to use Babel for TypeScript files
        "^.+\\.(js|jsx)$": "babel-jest", // Tells Jest to use Babel for JavaScript files
    },
    // preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
};
