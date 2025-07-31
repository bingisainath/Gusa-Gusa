import OneToOneConversation from '../screens/OnetoOneConversation';
import GroupChatConversation from '../screens/GroupConversation';

import ProfileScreen from '../screens/Profile/profile';

export const TabBarData = [
  {
    id: 1,
    route: OneToOneConversation,
    name: 'Chats',
    iconName: 'chatbubbles', // Related icon name for chat
    type: 'Ionicons', // Icon library for the icon
  },
  {
    id: 2,
    route: GroupChatConversation,
    name: 'Groups',
    iconName: 'people', // Related icon name for chat
    type: 'Ionicons', // Icon library for the icon
  },
  {
    id: 3,
    route: ProfileScreen,
    name: 'ProfileScreen',
    iconName: 'person', // Related icon name for group chat
    type: 'Ionicons', // Icon library for the icon
  },
  // Uncomment and update the following code to add a call screen tab
  // {
  //   id: 3,
  //   route: CallListScreen,
  //   name: 'Calls',
  //   iconName: 'call-outline', // Related icon name for calls
  //   iconLibrary: 'Ionicons', // Icon library for the icon
  // },
];
