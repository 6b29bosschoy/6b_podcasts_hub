export const TREEHOLE_MIN_CHARACTERS = 50;
export const TREEHOLE_MAX_CHARACTERS = 1000;

export const TREEHOLE_TOPIC_TAGS = [
  "放唔低", "復合", "爛桃花", "曖昧", "第三者", "出軌",
  "婚姻問題", "性關係", "安全感", "控制慾", "家庭壓力", "其他",
] as const;

export const TREEHOLE_PUBLIC_PERMISSIONS = [
  "可以，匿名處理就得",
  "可以，但請先聯絡我確認",
  "暫時唔想公開，只想畀你哋參考",
] as const;

export const TREEHOLE_DEEP_INTERPRETATIONS = [
  "想，可以聯絡我",
  "暫時唔需要",
  "只係想投稿分享",
] as const;

export function requiresTreeholeContact(publicPermission: string, deepInterpretation: string): boolean {
  return publicPermission === "可以，但請先聯絡我確認" || deepInterpretation === "想，可以聯絡我";
}

export function normaliseTreeholeStory(value: string): string {
  return value.slice(0, TREEHOLE_MAX_CHARACTERS);
}

export function isValidTreeholeStory(value: string): boolean {
  const length = value.trim().length;
  return length >= TREEHOLE_MIN_CHARACTERS && length <= TREEHOLE_MAX_CHARACTERS;
}
