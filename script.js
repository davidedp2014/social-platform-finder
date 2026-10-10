const interests = [
  "Gaming",
  "Music",
  "Photography",
  "Tech",
  "Business",
  "Fitness",
  "Art",
  "Travel",
  "Learning",
  "Community",
  "Fashion",
  "Cooking"
];

const interestMap = {
  Gaming: ["Discord", "Twitch", "YouTube"],
  Music: ["TikTok", "YouTube", "Instagram"],
  Photography: ["Instagram", "Pinterest", "YouTube"],
  Tech: ["Reddit", "X", "GitHub", "YouTube"],
  Business: ["LinkedIn", "X", "YouTube"],
  Fitness: ["Instagram", "Strava", "YouTube"],
  Art: ["Instagram", "Pinterest", "Behance"],
  Travel: ["Instagram", "YouTube", "Pinterest"],
  Learning: ["YouTube", "Reddit", "LinkedIn"],
  Community: ["Discord", "Reddit", "WhatsApp"],
  Fashion: ["Instagram", "Pinterest", "TikTok"],
  Cooking: ["Instagram", "YouTube", "Pinterest"]
};

const selected = new Set();

const interestPillsEl = document.getElementById("interest-pills");
const resultsEl = document.getElementById("results");

function renderInterestPills() {
  interestPillsEl.innerHTML = "";
  interests.forEach((interest) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.textContent = interest;
    button.type = "button";

    if (selected.has(interest)) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      if (selected.has(interest)) {
        selected.delete(interest);
      } else {
        selected.add(interest);
      }
      renderInterestPills();
    });

    interestPillsEl.appendChild(button);
  });
}

function getRecommendations() {
  const scores = {};
  const reasons = {};

  selected.forEach((interest) => {
    const platforms = interestMap[interest] || [];

    platforms.forEach((platform) => {
      scores[platform] = (scores[platform] || 0) + 1;
      reasons[platform] = reasons[platform]
        ? `${reasons[platform]}, ${interest}`
        : interest;
    });
  });

  const recommendations = Object.entries(scores)
    .map(([platform, score]) => ({
      platform,
      score,
      reason: reasons[platform]
    }))
    .sort((a, b) => b.score - a.score);

  return recommendations;
}

document.getElementById("find-btn").addEventListener("click", () => {
  if (selected.size === 0) {
    resultsEl.innerHTML = `
      <div class="empty-message">
        Please choose at least one interest to see your best platform match.
      </div>
    `;
    return;
  }

  const recommendations = getRecommendations();

  resultsEl.innerHTML = `
    <div class="result-grid">
      ${recommendations
        .map(
          (item, index) => `
            <div class="platform-card ${index === 0 ? "top" : ""}">
              <div class="platform-name">${item.platform}</div>
              <div class="platform-score">Match score: ${item.score}</div>
              <p class="platform-reason">
                Best for people who like ${item.reason}.
              </p>
            </div>
          `
        )
        .join("")}
    </div>
  `;
});

renderInterestPills();
