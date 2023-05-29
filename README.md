# url-changed

Url change detection for when [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) is not supported.

## Install

`npm install url-changed`

## Usage

```js
import { urlChanged } from 'url-changed';

const settings = {
  // see below
};

const stopWatching = urlChanged(
  (newUrl, oldUrl) => console.log(`${oldUrl} -> ${newUrl}`),
  settings
);
```

### Settings

The [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) is used if available. Otherwise one or more fallbacks are used to achieve a similar effect.

The 2nd parameter to `urlChanged` specifies which fallbacks to enable. All fallbacks are disabled by default so you must enable at least one.

#### Body mutation

Any time the `<body>`'s subtree changes, check if the url has changed.

```js
urlChanged(fn, {
  bodyMutation: true
});
```

#### `hashchange`

When [hashchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) event fires on `window`, check if the url has changed.

```js
urlChanged(fn, {
  hashchange: true
});
```

#### `popstate`

When [popstate](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) event fires on `window`, check if the url has changed.

```js
urlChanged(fn, {
  popstate: true
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

#### Override Navigation API

Use fallbacks regardless of Navigation API existence. Use this to test fallback behavior.

```js
urlChanged(fn, {
  forceFallbacks: true,

  // Must enable at least one fallback
  bodyMutation: true
});
```

## License

MIT
