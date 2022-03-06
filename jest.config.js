const path = require("path");

module.exports = {
  testEnvironment:"jest-environment-jsdom",
  transform: {
    '^.+\\.(ts|tsx)$':  "ts-jest"
  },
  moduleNameMapper: {
    "^components$": "<rootDir>/src/components",
    'test/(.*)$' : '<rootDir>/src/test/$1'
  },
  moduleFileExtensions:[
     'tsx','ts','js','jsx'
  ],
  roots: ["./src"]   
};