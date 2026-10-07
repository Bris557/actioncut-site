export type TagInfo = {name: string; color: string; ink: string};

const DARK_INK = '#1a0e08';

export const TAGS = {
  goal: {name: 'Goal', color: '#FF7A1A', ink: DARK_INK},
  save: {name: 'Save', color: '#0090FF', ink: DARK_INK},
  assist: {name: 'Assist', color: '#8E4EC6', ink: '#FFFFFF'},
  skill: {name: 'Skill', color: '#12A594', ink: DARK_INK},
  funny: {name: 'Funny', color: '#E5489A', ink: DARK_INK},
} satisfies Record<string, TagInfo>;

/** The three tags the app puts in quick access by default. */
export const QUICK_TAGS: TagInfo[] = [TAGS.goal, TAGS.save, TAGS.assist];

export function tagColor(name: string): string {
  const tag = Object.values(TAGS).find((t) => t.name === name);
  return tag ? tag.color : '#8C7264';
}
