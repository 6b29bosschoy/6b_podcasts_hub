export const TOPIC_SLUG_PATTERN = /^[a-z]+(?:-[a-z]+){2,5}$/;

export function assertTopicSlug(slug) {
  if (!TOPIC_SLUG_PATTERN.test(slug)) {
    throw new Error("slug 必須由 3–6 個小寫英文單詞以連字號組成，例如 monthly-income-dating-standard");
  }
}
