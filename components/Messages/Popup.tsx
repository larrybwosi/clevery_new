import { TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';

const PopupComponent = () => {
  const data = [
    { icon: 'corner-up-left', text: 'Reply' },
    { icon: 'copy', text: 'Copy Text' },
    { icon: 'map-pin', text: 'Pin Message' },
    { icon: 'link', text: 'Copy Link' },
  ] 

  const renderItem = ({ item }: any) => (
    <TouchableOpacity className="flex-row items-center mb-4 ml-4">
      <Feather name={item.icon} size={24} color="#007aff" />
      <Text className="ml-4 text-base font-rregular">{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="absolute bottom-[-5] z-20 left-0 right-0 rounded-xl shadow-xl p-2 border-gray-500">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.text}
        ItemSeparatorComponent={() => <View className="bg-gray-500 my-2 h-px" />}
      />
    </View>
    
  );
};

export default PopupComponent;
