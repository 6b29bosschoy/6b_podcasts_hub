export const TREEHOLE_MIN_CHARACTERS = 10;
export const TREEHOLE_MAX_CHARACTERS = 1000;

export function normaliseTreeholeStory(value: string): string {
  return value.slice(0, TREEHOLE_MAX_CHARACTERS);
}

export function isValidTreeholeStory(value: string): boolean {
  const length = value.trim().length;
  return length >= TREEHOLE_MIN_CHARACTERS && length <= TREEHOLE_MAX_CHARACTERS;
}
