export type UseCase = {
  id: string;
  label: string;
  title: string;
  intro: string;
  steps: string[];
  /** A screenshot under static/img/screens/; without one, a drawn moment with two versions. */
  screen: {name: string; src?: string};
};

export const useCases: UseCase[] = [
  {
    id: 'match',
    label: 'Match day',
    title: 'Your kid’s match, minus the scrubbing',
    intro: 'The everyday game: one phone, your usual camera app, ninety minutes.',
    steps: [
      'Start an event before kick-off — the crosshair button appears over your camera.',
      'Film from the stands the way you always do.',
      'Tap at the goal, the save, the celebration — and tag it Goal right there.',
      'After the game, open the event: ActionCut cuts every moment into a clip, ready for the family chat.',
    ],
    screen: {name: 'Event screen', src: '/img/screens/event.webp'},
  },
  {
    id: 'practice',
    label: 'Practice',
    title: 'Practice that actually gets reviewed',
    intro: 'For coaches and players who want to see the drill, not the whole session.',
    steps: [
      'Hold the button through a whole drill to capture it as one interval.',
      'Interval clips keep 3 seconds before and after, so nothing gets cut off.',
      'Tag reps with Skill to collect the technique to work on.',
      'Page through the moments one by one with the arrows on the moment screen.',
    ],
    screen: {name: 'Moment screen', src: '/img/screens/moment.webp'},
  },
  {
    id: 'tournament',
    label: 'Tournament day',
    title: 'Four games, one phone',
    intro: 'Back-to-back games, lunch in between, and no time to sort anything out.',
    steps: [
      'Start a new event for each game and give it a name, like “Game 2 vs Hawks”.',
      'Back from a break? Resume picks up the same event.',
      'Live in the wrong event? Open the right one and tap Switch here.',
      'Marked a moment in the wrong game? Move it to the right event later.',
    ],
    screen: {name: 'Home with an event in progress', src: '/img/screens/home-live.webp'},
  },
  {
    id: 'angles',
    label: 'Two phones',
    title: 'Second phone? Second angle.',
    intro: 'Your partner films from the other side of the field.',
    steps: [
      'Mark the moments on your phone as usual.',
      'Copy your partner’s videos to your phone.',
      'Open the event’s Sources and tap Scan this phone — ActionCut finds them by recording time.',
      'Every moment both videos cover gets two versions. Swipe between them.',
    ],
    screen: {name: 'Moment with two versions'},
  },
  {
    id: 'season',
    label: 'Season highlights',
    title: 'The season’s best, in a minute',
    intro: 'End-of-season party? You already have the material.',
    steps: [
      'Tap the heart on the moments you love.',
      'Favorites gathers them by month and event.',
      'Filter by Goal, tap Select all, then Save.',
      'Every clip lands in your gallery’s ActionCut album, ready for the season video.',
    ],
    screen: {name: 'Saving favorites to the gallery', src: '/img/screens/favorites-save.webp'},
  },
];
