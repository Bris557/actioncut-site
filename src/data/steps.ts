export type StepScreen = 'home' | 'camera' | 'tags' | 'event';
export type Step = {title: string; body: string; screen: StepScreen};

export const steps: Step[] = [
  {
    title: 'Start an event',
    body: 'Tap New event before kick-off. A small crosshair button now floats on top of every app.',
    screen: 'home',
  },
  {
    title: 'Film as usual',
    body: 'Record with the camera app you already use. ActionCut doesn’t record anything — it only remembers when you tap.',
    screen: 'camera',
  },
  {
    title: 'Tap at great plays',
    body: 'One tap marks a moment. For a longer play, hold the button and let go when it ends. It buzzes, pulses and counts — and quick tags pop up beside it.',
    screen: 'tags',
  },
  {
    title: 'Review, save, share',
    body: 'Stop the event and ActionCut cuts a clip around every moment: 5 seconds before your tap, 2 after. Save the best ones to the ActionCut album or share them anywhere.',
    screen: 'event',
  },
];
