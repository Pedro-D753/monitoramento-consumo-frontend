module.exports = {
  root: true,
  env: {
    "react-native/react-native": true,
    es6: true,
  },
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:react-native/all",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react-native", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "react-native/no-inline-styles": "off",
    "react-native/no-color-literals": "off",
    "import/prefer-default-export": "off",
    indent: ["error", 2],
    "max-len": ["error", 100],
    semi: ["error", "always"],
    "@typescript-eslint/no-unused-vars": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {},
      node: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
};
