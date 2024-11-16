module.exports = {
  testEnvironment: 'jsdom',  // Useful for testing front-end code (like React)
  transform: {
    '^.+\\.jsx?$': 'babel-jest',  // Use babel-jest to transform JavaScript files
    '^.+\\.tsx?$': 'babel-jest',  // Optional if you're using TypeScript
  },
  transformIgnorePatterns: [
    "/node_modules/(?!firebase)/",  // Include Firebase if you're using it, as it's ESM
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
};