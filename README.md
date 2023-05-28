# url-changed

Url change detection for when [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) is not supported.

## Install

`npm install url-changed`

## Usage

```js
import { urlChanged } from 'url-changed';

const options = {
  // see below
};

const stopWatching = urlChanged(
  (newUrl, oldUrl) => console.log(`${oldUrl} -> ${newUrl}`),
  options
);
```

### Options

The [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) is used if available. Otherwise one or more fallbacks can be used to achieve a similar effect.

The optional 2nd parameter to `urlChanged` specifies which fallbacks to enable. All fallbacks are disabled by default so you should enable at least one.

#### Body mutation

Any time the `<body>`'s subtree changes, check if the url has changed.

```js
urlChanged(fn, {
  bodyMutation: true
});
```

#### `hashchange` event

When [hashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) event fires on `window`, check if the url has changed.

```js
urlChanged(fn, {
  hashchange: true
});
```

#### `popstate` event

When [popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) event fires on `window`, check if the url has changed.

```js
urlChanged(fn, {
  popstate: true
});
```

#### `click` event

When `click` event fires on `document`, check if the url has changed.

```js
urlChanged(fn, {
  click: true
});
```

#### Polling

Every x milliseconds, check if the url has changed.

```js
urlChanged(fn, {
  // milliseconds
  poll: 100
});
```

## License

MIT
