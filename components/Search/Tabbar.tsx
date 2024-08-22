import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '../Themed';

type selected = 'recents' | 'people' | 'media-links' | 'files';

interface SearchTabBarProps {
  onTabPress: (tab: selected) => void;
  selected: selected;
}

const SearchTabBar = ({ onTabPress, selected }: SearchTabBarProps) => (
  <View className="py-1 px-2 border-b border-gray-500">
    <View className="flex-row justify-between">
      {[
        { icon: 'clock', text: 'Recents', tab: 'recents' },
        { icon: 'users', text: 'People', tab: 'people' },
        { icon: 'link', text: 'Media Links', tab: 'media-links' },
        { icon: 'file', text: 'Files', tab: 'files' },
      ].map(({ icon, text, tab }) => (
        <TouchableOpacity
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
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default SearchTabBar;
