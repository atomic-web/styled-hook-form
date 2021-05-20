module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$':  "ts-jest"
  },
  moduleNameMapper: {
    "^components$": "<rootDir>/src/components"
  },
  roots: ["./src"]   
};

 