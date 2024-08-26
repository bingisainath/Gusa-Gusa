import OneToOneConversation from '../screens/OneToOneConversation';
import GroupChatScreen from '../screens/GroupConversation';

export const TabBarData = [
  {
    id: 1,
    route: OneToOneConversation,
    name: 'OneToOneConversation',
    iconName: 'chatbubbles', // Related icon name for chat
    type: 'Ionicons', // Icon library for the icon
  },
  {
    id: 2,
    route: GroupChatScreen,
    name: 'GroupChatScreen',
    iconName: 'people', // Related icon name for group chat
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
