import { useState } from 'react';
import { PanResponder, GestureResponderEvent, PanResponderGestureState, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '../themed';

type Selected = 'recents' | 'people' | 'media-links' | 'files';

interface SearchTabBarProps {
  onTabPress: (tab: Selected) => void;
  selected: Selected;
}

const SearchTabBar = ({ onTabPress, selected }: SearchTabBarProps) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (gestureState.dx < -50) {
        setSwipeDirection('left');
      } else if (gestureState.dx > 50) {
        setSwipeDirection('right');
      } else {
        setSwipeDirection(null);
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (swipeDirection === 'left') {
        const nextTab = getNextTab('left');
        onTabPress(nextTab);
      } else if (swipeDirection === 'right') {
        const previousTab = getNextTab('right');
        onTabPress(previousTab);
      }
      setSwipeDirection(null);
    },
  });

  const tabs = [
    { icon: 'clock', text: 'Recents', tab: 'recents' },
    { icon: 'users', text: 'People', tab: 'people' },
    { icon: 'link', text: 'Media Links', tab: 'media-links' },
    { icon: 'file', text: 'Files', tab: 'files' },
  ];

  const getNextTab = (direction: 'left' | 'right'): Selected => {
    const currentIndex = tabs.findIndex((t) => t.tab === selected);
    const nextIndex = direction === 'left' ? (currentIndex + 1) % tabs.length : (currentIndex - 1 + tabs.length) % tabs.length;
    return tabs[nextIndex].tab;
  };

  return (
    <View className="py-1 px-2 border-b border-gray-500" {...panResponder.panHandlers}>
      <View className="flex-row justify-between">
        {tabs.map(({ icon, text, tab }) => (
          <Pressable
            key={tab}
            onPress={() => onTabPress(tab)}
            className={`items-center ${selected === tab && 'border-b-[3px] border-b-light'}`}
          >
            <Feather
              name={icon}
              size={24}
              color={selected === tab ? '#007AFF' : '#666'}
            />
            <Text className="text-sm mt-1 text-[#666]">{text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default SearchTabBar;