/**
 * @typedef Options
 * @property native {boolean?}
 * @property bodyMutation {boolean?}
 * @property poll {number?}
 * @property click {boolean?}
 * @property popstate {boolean?}
 * @property hashchange {boolean?}
 */

/**
 * @param cb {(newUrl: string, oldUrl: string) => void}
 * @param options {Options}
 * @return {() => void} Stops listening for url changes when called.
 */
export function urlChanged(cb, options = {}) {
  let oldUrl = document.location.toString();

  /**
   * @type {() => void}
   */
  const checkForChange = () => {
    const newUrl = document.location.toString();

    if (newUrl !== oldUrl) {
      cb(newUrl, oldUrl);
      oldUrl = newUrl;
    }
  };

  /**
   * @type Array<() => void>
   */
  const cleanUps = [];

  // Navigation API
  const supportsNavigationApi = typeof navigation != 'undefined';
  if (supportsNavigationApi) {
    navigation.addEventListener('navigate', checkForChange);

    cleanUps.push(() => navigation.removeEventListener('navigate', checkForChange));
  } else {
    // body mutations - idea from https://stackoverflow.com/a/46428962/1865262
    if (options.bodyMutation) {
      const mutationObserver = new MutationObserver(checkForChange);
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      cleanUps.push(() => mutationObserver.disconnect());
    }

    // polling
    if (options.poll) {
      const intervalId = setInterval(checkForChange, options.poll);

      cleanUps.push(() => clearInterval(intervalId));
    }

    // click
    if (options.click) {
      document.addEventListener('click', checkForChange);

      cleanUps.push(() => document.removeEventListener('click', checkForChange));
    }

    // hashchange
    if (options.hashchange) {
      window.addEventListener('hashchange', checkForChange);

      cleanUps.push(() => window.removeEventListener('hashchange', checkForChange));
    }

    // popstate
    if (!supportsNavigationApi && options.popstate) {
      window.addEventListener('popstate', checkForChange);

      cleanUps.push(() => window.removeEventListener('popstate', checkForChange));
    }
  }

  return () => cleanUps.forEach(fn => fn());
}
