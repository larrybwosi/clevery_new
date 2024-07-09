import { selector, setMode } from '@/lib';
import { Feather } from '@expo/vector-icons';
import {TouchableOpacity, View, } from 'react-native';
import { Text } from '@/components/Themed';
import { useDispatch } from 'react-redux';
import { memo } from 'react';

const Appearance: React.FC = () => {
  const dispatch = useDispatch();
  const { mode } = selector((state) => state.theme);

  const handlePress = (mode:string) => {
    //@ts-ignore
    dispatch(setMode(mode));
  };

const MenuItem: React.FC<any> = ({ iconName, label, route }) => { 

  return (
    <>
      <Text
       className='font-rmedium text-[10px]' 
      >Light mode: Light backgrounds, dark text. Easy to read and reduces eye strain. Dark mode: Dark backgrounds, light text. Ideal when it's dark.</Text>
      <TouchableOpacity
       className='flex-row items-center justify-between my-[2.5px] '
      >
        <View className='flex-row justify-center gap-[5px]'>
          <Feather name={iconName} size={20} color={mode=="light"?"gray":"gray"} />
          <Text className='font-rmedium ml-2.5 text-[16px] ' >{label}</Text>
        </View>
      </TouchableOpacity>
      <View>
      {['default', 'light', 'dark'].map((theme) => (
        <TouchableOpacity
          key={theme}
          className='flex-row items-center mb-2.5 '
          onPress={() => handlePress(theme)}
        >
          <View className='bg-white mr-2.5 h-5 w-5 items-center justify-center rounded-[10px] mt-[10px] '
          >
            {mode === theme && (
              <View
              className='w-2.5 h-2.5 rounded-[5px] bg-[#007aff]'
              />
            )}
          </View>
          <Text className='font-rregular text-[12px] '>{theme}</Text>
        </TouchableOpacity>
      ))}
    </View>
    </>
  );
};

  return (
    <View className='flex-1 p-5 m-1 gap-[5px] '>
      <MenuItem iconName="sun" label="Light mode"  />
    </View>
  );
};

export default memo(Appearance);