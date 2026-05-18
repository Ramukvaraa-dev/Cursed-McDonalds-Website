/**
 * Visitor Counter
 * Uses CountAPI for server-side persistent storage
 * Data survives rehosting and is never deleted
 * Only increments once per unique visitor session
 */

(function initVisitorCounter() {
  const visitorCountEl = document.getElementById("visitor-count");
  if (!visitorCountEl) return;

  const COUNTER_NAMESPACE = "cursedmcdonalds";
  const COUNTER_KEY = "visits";
  const VISITED_FLAG = "cursed_visited_session";
  const LOCAL_FALLBACK_KEY = "cursed_local_visit_count";

  const hitUrl = `https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;
  const getUrl = `https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;

  const bumpLocalFallback = () => {
    const current = Number.parseInt(localStorage.getItem(LOCAL_FALLBACK_KEY) || "0", 10);
    const next = Number.isFinite(current) ? current + 1 : 1;
    localStorage.setItem(LOCAL_FALLBACK_KEY, String(next));
    return next;
  };

  const getLocalFallback = () => {
    const current = Number.parseInt(localStorage.getItem(LOCAL_FALLBACK_KEY) || "0", 10);
    return Number.isFinite(current) ? current : 0;
  };

  // Only count unique visits (once per session via localStorage)
  // If user clears cache/cookies, they count as a new visitor
  if (!localStorage.getItem(VISITED_FLAG)) {
    // Increment count on first visit this session
    fetch(hitUrl).catch(() => bumpLocalFallback());
    
    // Mark session as visited
    localStorage.setItem(VISITED_FLAG, "true");
  }

  // Fetch and display current count
  fetch(getUrl)
    .then((response) => response.json())
    .then(data => {
      if (typeof data?.value === "number") visitorCountEl.textContent = data.value.toLocaleString();
    })
    .catch(() => {
      visitorCountEl.textContent = getLocalFallback().toLocaleString();
    });
})();
