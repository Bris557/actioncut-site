export type Faq = {q: string; a: string; link?: {label: string; to: string}};

export const faqs: Faq[] = [
  {
    q: 'Who makes ActionCut?',
    a: 'Parents of young athletes. We built it to stop spending evenings scrubbing through hours of tournament video for our kids’ best moments — and made it for every parent on the sideline.',
  },
  {
    q: 'Does ActionCut record video?',
    a: 'No. You record with your usual camera app. ActionCut only remembers when you tapped, then finds the recording on your phone and cuts a short clip around each moment.',
  },
  {
    q: 'Which phones does it work on?',
    a: 'Android phones running Android 14 or newer. An iPhone version is on the way.',
  },
  {
    q: 'Does it work with any camera app?',
    a: 'Yes, as long as the app saves its videos to your phone’s gallery with the right date and time — ActionCut matches moments to recordings by when they were filmed.',
  },
  {
    q: 'I forgot to start an event. Can I still get clips?',
    a: 'Yes. Start and stop a new event, import the video in its Sources with Choose a file, then play it and add moments with + Instant and + Interval.',
    link: {label: 'Mark moments afterwards', to: '/guide/other-cameras#mark-moments-afterwards'},
  },
  {
    q: 'Can I use a second phone or camera?',
    a: 'Yes. Copy its videos to your phone, open the event’s Sources and tap Scan this phone. Moments covered by more than one video get a version from each.',
    link: {label: 'Videos from another camera', to: '/guide/other-cameras'},
  },
  {
    q: 'Can I share a clip before the game is over?',
    a: 'Yes. Stop recording at a break, open the moment in the event, and its clip is cut right away — ready to save or share while the event is still running.',
  },
  {
    q: 'Where do my clips go?',
    a: 'Saved clips land in your gallery, in the ActionCut album (Movies/ActionCut). Saving the same clip again replaces it instead of making a copy.',
  },
  {
    q: 'Can I change the clip length after the game?',
    a: 'Yes. Change the event’s Clip length and ActionCut re-cuts its clips, or use Edit clip to give one moment its own start and end.',
    link: {label: 'Clip length & custom clips', to: '/guide/clip-length'},
  },
  {
    q: 'Can I delete the long recordings to free up space?',
    a: 'Yes. In the event’s Sources, remove a video and tick Also delete the files from this phone. ActionCut first cuts any clips that are still missing, so your moments stay.',
    link: {label: 'Fix or remove a video', to: '/guide/other-cameras#fix-or-remove-a-video'},
  },
  {
    q: 'Do I need an internet connection?',
    a: 'Not for marking or cutting — both happen on your phone.',
  },
  {
    q: 'Is ActionCut free?',
    a: 'Yes — every feature is free. Optional paid extras, such as cloud storage for your clips, may come later.',
  },
  {
    q: 'How can I try it now?',
    a: 'ActionCut is in beta testing before it comes to Google Play and the App Store. Email us and we’ll send you a link to the Android test version.',
    link: {label: 'Join the beta', to: '/#beta'},
  },
];
