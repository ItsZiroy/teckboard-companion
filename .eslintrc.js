module.exports = {
  extends: ["erb/typescript", "plugin:react/recommended"],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    "import/no-extraneous-dependencies": "off",
    "promise/always-return": "off",
    "promise/catch-or-return": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-wrap-multilines": "off",
    "react/jsx-curly-newline": "off",
    "no-shadow": "off",
  },
  plugins: ["react"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    "import/resolver": {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve("./configs/webpack.config.eslint.js"),
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
};
