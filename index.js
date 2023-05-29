/**
 * @typedef Settings
 * @property bodyMutation {boolean?}
 * @property popstate {boolean?}
 * @property hashchange {boolean?}
 * @property poll {number?}
 * @property forceFallbacks {boolean?}
 */

/**
 * @param cb {(newUrl: string, oldUrl: string) => void}
 * @param settings {Settings}
 * @return {() => void} Stops listening for url changes when called.
 */
export function urlChanged(cb, settings) {
  validate(settings);

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
  if (supportsNavigationApi && !settings.forceFallbacks) {
    navigation.addEventListener('navigate', checkForChange);

    cleanUps.push(() => navigation.removeEventListener('navigate', checkForChange));
  } else {
    // body mutations - idea from https://stackoverflow.com/a/46428962/1865262
    if (settings.bodyMutation) {
      const mutationObserver = new MutationObserver(checkForChange);
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      cleanUps.push(() => mutationObserver.disconnect());
    }

    // hashchange
    if (settings.hashchange) {
      window.addEventListener('hashchange', checkForChange);

      cleanUps.push(() => window.removeEventListener('hashchange', checkForChange));
    }

    // popstate
    if (settings.popstate) {
      window.addEventListener('popstate', checkForChange);

      cleanUps.push(() => window.removeEventListener('popstate', checkForChange));
    }

    // polling
    if (settings.poll) {
      const intervalId = setInterval(checkForChange, settings.poll);

      cleanUps.push(() => clearInterval(intervalId));
    }
  }

  return () => cleanUps.forEach(fn => fn());
}

/**
 * @param {Settings} settings
 */
function validate(settings) {
  if (!settings) {
    throw new Error(`settings are required`);
  }

  if (settings.poll != null && settings.poll <= 0) {
    throw new Error(`poll must be > 0 when specified`);
  }

  if (!settings.bodyMutation && !settings.hashchange && !settings.popstate && settings.poll == null) {
    throw new Error(`At least one fallback must be specified`);
  }
}
