/**
 * Visitor Counter
 * Uses CountAPI for server-side persistent storage
 * Data survives rehosting and is never deleted
 * Only increments once per unique visitor session
 */

(function initVisitorCounter() {
  const visitorCountEl = document.getElementById("visitor-count");
  if (!visitorCountEl) return;

  const COUNTER_KEY = "cursedmcdonalds/visits";
  const VISITED_FLAG = "cursed_visited_session";

  // Only count unique visits (once per session via localStorage)
  // If user clears cache/cookies, they count as a new visitor
  if (!localStorage.getItem(VISITED_FLAG)) {
    // Increment count on first visit this session
    fetch(`https://api.countapi.xyz/hit/${COUNTER_KEY}`)
      .catch(() => console.error("Failed to increment counter"));
    
    // Mark session as visited
    localStorage.setItem(VISITED_FLAG, "true");
  }

  // Fetch and display current count
  fetch(`https://api.countapi.xyz/get/${COUNTER_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.value) {
        visitorCountEl.textContent = data.value.toLocaleString();
      }
    })
    .catch(() => {
      visitorCountEl.textContent = "Error";
      console.error("Failed to fetch visitor count");
    });
})();
