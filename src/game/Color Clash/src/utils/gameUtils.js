const BEST_SCORE_KEY = 'color_clash_best_score';
const BEST_STREAK_KEY = 'color_clash_best_streak';

/**
 * Calculate streak bonus points awarded for a given consecutive streak count
 * @param {number} streak - Consecutive correct answers before this question
 * @returns {number} Bonus points
 */
export function getStreakBonus(streak) {
  if (streak >= 10) return 20;
  if (streak >= 5) return 10;
  if (streak >= 3) return 5;
  return 0;
}

/**
 * Get streak multiplier label
 * @param {number} streak
 * @returns {string|null}
 */
export function getStreakTier(streak) {
  if (streak >= 10) return "🔥 GODLIKE (x3)";
  if (streak >= 5) return "⚡ ON FIRE (x2)";
  if (streak >= 3) return "✨ WARMING UP";
  return null;
}

/**
 * Retrieve high score from localStorage safely
 */
export function getStoredBestScore() {
  try {
    const val = localStorage.getItem(BEST_SCORE_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Save new high score to localStorage
 */
export function saveStoredBestScore(score) {
  try {
    const current = getStoredBestScore();
    if (score > current) {
      localStorage.setItem(BEST_SCORE_KEY, score.toString());
      return true; // Indicates new record!
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Retrieve best streak from localStorage safely
 */
export function getStoredBestStreak() {
  try {
    const val = localStorage.getItem(BEST_STREAK_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Save best streak
 */
export function saveStoredBestStreak(streak) {
  try {
    const current = getStoredBestStreak();
    if (streak > current) {
      localStorage.setItem(BEST_STREAK_KEY, streak.toString());
    }
  } catch {
    // Ignore storage issues
  }
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct, wrong) {
  const total = correct + wrong;
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Derive progressive difficulty from current score
 */
export function getProgressiveDifficulty(score) {
  if (score >= 150) return "HARD";
  if (score >= 60) return "MEDIUM";
  return "EASY";
}
