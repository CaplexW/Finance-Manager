import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactAll from "eslint-plugin-react/configs/all.js";
import tseslint from 'typescript-eslint';
import { fixupConfigRules } from "@eslint/compat";

const plugins = {};
const mainConfig = {
  files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
  plugins,
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      parser: '@typescript-eslint/parser',
    },
  },
};
const settingsConfig = {
  settings: {
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: "React",  // Pragma to use, default to "React"
      fragment: "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
      flowVersion: "0.53" // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { property: "freeze", "object": "Object" },
      { property: "myFavoriteWrapper" },
      // for rules that check exact prop wrappers
      { property: "forbidExtraProps", exact: true }
    ],
    componentWrapperFunctions: [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      "observer", // `property`
      { "property": "styled" }, // `object` is optional
      { "property": "observer", "object": "Mobx" },
      { "property": "observer", "object": "<pragma>" } // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    formComponents: [
      // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
      "CustomForm",
      { name: "SimpleForm", "formAttribute": "endpoint" },
      { name: "Form", formAttribute: ["registerEndpoint", "loginEndpoint"] }, // allows specifying multiple properties if necessary
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      { name: "MyLink", linkAttribute: "to" },
      { name: "Link", linkAttribute: ["to", "href"] }, // allows specifying multiple properties if necessary
    ]
  },
};
const rulesConfig = {
  rules: {
    '@typescript-eslint/semi': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-param-reassign': 'warn',
    'react/jsx-uses-react': 'warn',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-uses-vars': 'warn',
    'react/jsx-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-max-depth': 'off',
    'react/prefer-exact-props': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/prop-types': 'warn',
    'react/require-default-props': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-props-no-spreading': 'warn',
    'react/jsx-no-literals': "off",
    'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    // 'jsx-a11y/click-events-have-key-events': 'warn',
    // 'jsx-a11y/no-static-element-interactions': 'warn',
    // 'jsx-a11y/anchor-is-valid': 'warn',
    // 'import/no-extraneous-dependencies': 'warn',
  },
};
// const overrides = {
//   files: ['**/*.ts', '**/*.tsx'],
//   rules: {
//     '@typescript-eslint/no-unused-vars': 'warn',
//     '@typescript-eslint/semi': 'warn',
//   },
// };

export default [
  mainConfig,
  settingsConfig,
  ...fixupConfigRules(pluginReactAll),
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  rulesConfig,
  // overrides,
];
