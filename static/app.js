// Register a service worker
if (
  typeof navigator.serviceWorker !== "undefined" &&
  location.hostname !== "localhost"
) {
  self.addEventListener("load", async () => {
    const registration = await navigator.serviceWorker.register("/sw.js");
    if (registration.waiting) registration.waiting.postMessage("SKIP_WAITING");
  });
}
