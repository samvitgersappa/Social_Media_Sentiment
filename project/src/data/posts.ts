import { Post } from '../types/post';

export const userInterests = [
  'Nature Lover 🌿',
  'Racing Enthusiast 🏎️',
  'Cooking Expert 👨‍🍳',
  'Photography 📸',
  'Travel Seeker ✈️'
];

export const posts: Post[] = [
  {
    id: '1',
    username: 'wilderness_explorer',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1000',
    caption: 'Discovered this hidden waterfall during my morning hike. Nature never ceases to amaze! 🌿',
    hashtags: ['nature', 'waterfall', 'hiking', 'wilderness', 'adventure'],
    likes: 543,
    comments: [
      {
        id: 'c1',
        username: 'nature_lover',
        text: 'This is absolutely breathtaking! The water looks so pristine.',
        timestamp: '2h ago'
      },
      {
        id: 'c2',
        username: 'hiking_enthusiast',
        text: 'Perfect spot for meditation. Love the peaceful vibes!',
        timestamp: '1h ago'
      }
    ],
    timestamp: '3h ago',
    sentimentScore: 4.5
  },
  {
    id: '2',
    username: 'speed_demon',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    imageUrl: 'https://images.unsplash.com/photo-1532906619279-a4b7267faa66?w=1000',
    caption: 'Terrible race day. Engine failure on lap 3. Months of preparation wasted. 😤',
    hashtags: ['racing', 'badluck', 'motorsport', 'disappointment'],
    likes: 234,
    comments: [
      {
        id: 'c3',
        username: 'race_fan',
        text: 'That\'s awful! Such bad luck with the reliability issues lately.',
        timestamp: '1h ago'
      },
      {
        id: 'c4',
        username: 'mechanic_pro',
        text: 'These new regulations are causing so many problems. Horrible decision by the committee.',
        timestamp: '30m ago'
      }
    ],
    timestamp: '2h ago',
    sentimentScore: -4.2
  },
  {
    id: '3',
    username: 'chef_master',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000',
    caption: 'First attempt at this new recipe was a complete disaster. Everything burned and tastes horrible. Back to basics I guess... 😫',
    hashtags: ['cooking', 'fail', 'disaster', 'learning'],
    likes: 156,
    comments: [
      {
        id: 'c5',
        username: 'food_lover',
        text: 'Don\'t give up! We all have those days in the kitchen.',
        timestamp: '45m ago'
      },
      {
        id: 'c6',
        username: 'kitchen_pro',
        text: 'This recipe is notoriously difficult. Took me 5 attempts to get it right.',
        timestamp: '15m ago'
      }
    ],
    timestamp: '1h ago',
    sentimentScore: -3.8
  },
  {
    id: '4',
    username: 'forest_wanderer',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1000',
    caption: 'Lost in the ancient forest. The sunlight through the trees creates pure magic ✨',
    hashtags: ['nature', 'forest', 'sunlight', 'wilderness', 'photography'],
    likes: 721,
    comments: [
      {
        id: 'c7',
        username: 'tree_hugger',
        text: 'The light rays are stunning! Which forest is this?',
        timestamp: '1h ago'
      },
      {
        id: 'c8',
        username: 'photo_enthusiast',
        text: 'Perfect composition! What camera did you use?',
        timestamp: '30m ago'
      }
    ],
    timestamp: '2h ago',
    sentimentScore: 4.2
  },
  {
    id: '5',
    username: 'travel_photographer',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    imageUrl: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1000',
    caption: 'Just another day at the airport. Regular transit, nothing special but heading to my next destination.',
    hashtags: ['travel', 'airport', 'transit', 'wanderlust'],
    likes: 328,
    comments: [
      {
        id: 'c9',
        username: 'wanderer_soul',
        text: 'Safe travels! Where are you headed next?',
        timestamp: '30m ago'
      },
      {
        id: 'c10',
        username: 'globe_trotter',
        text: 'The journey is part of the adventure.',
        timestamp: '15m ago'
      }
    ],
    timestamp: '1h ago',
    sentimentScore: 0.2
  }
];