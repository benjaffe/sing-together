require.config({
  baseUrl: 'bower_components',
  paths: {
    "react": "react/react-with-addons",
    "react-contenteditable": "../lib/react-contenteditable",
    "firebase": "firebase/firebase",
    "lodash": "lodash/lodash",
    "JSXTransformer": "../lib/JSXTransformer",
    "jsx": "../lib/jsx",
    "text": "../lib/text",
    "app": "../app/app"
  },
  shim: {
    'firebase': {
        exports: 'Firebase'
    }
  }
});

require(['jsx!app'], function(app) {
  console.log(app);
});