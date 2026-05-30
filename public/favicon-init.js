// Set the initial favicon to match the system color scheme
// before React loads, to avoid flashing the wrong variant.
(function () {
  var favicon = document.querySelector('link[rel="icon"]');
  if (favicon && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    favicon.href = "/favicon-dark.svg";
  }
})();
