import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    {type: 'category', label: 'Basics', collapsible: false, items: ['getting-started', 'first-event', 'floating-button']},
    {type: 'category', label: 'Moments and clips', collapsible: false, items: ['reviewing-moments', 'clip-length', 'tags-and-favorites']},
    {type: 'category', label: 'Going further', collapsible: false, items: ['other-cameras', 'saving-and-sharing', 'moving-and-backup']},
    {type: 'category', label: 'Help', collapsible: false, items: ['troubleshooting', 'iphone']},
  ],
};

export default sidebars;
