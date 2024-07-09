import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

const CertificateIcon = () => {
  return (
    <View className='flex-row items-center' >
      <FontAwesome name="certificate" color="#007aff" size={15} className='mr-1.5'/>
      <View className='w-4 h-4 rounded-full items-center justify-center z-10 left-[50%] top-[50%] ml-[-8px] mt-[-6px]' >
        <Icon name="check" size={12} color="white" />
      </View>
    </View>
  );
};


export default CertificateIcon;