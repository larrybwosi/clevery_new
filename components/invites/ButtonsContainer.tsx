import { TouchableOpacity} from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Share from 'react-native-share';

import { View, Text  } from '@/components/Themed';
import { showToastMessage } from '@/lib';

const ButtonsContainer: React.FC = () => {
  const handlePress = (name: string) => {
    console.log(`Button with name ${name} pressed`);
  };

  const link = `https://clevery.vercel.app/`;

  
  const copyToClipboard = async () => {
    try {
      const copied = await alreadyCopied()
      if(copied) showToastMessage('link copied')
      await Clipboard.setStringAsync(link);
      showToastMessage('link copied')
    } catch (error) {
      console.log(error);
    }
  };
  
  const alreadyCopied = async () => {
      const clipboardContent = await Clipboard.getStringAsync();
      return clipboardContent===link
  };

const shareToWhatsApp = async () => {
  const isWhatsAppInstalled = await Share.isPackageInstalled('com.whatsup');

  if (isWhatsAppInstalled) {
    const content = {
      title: 'Check out this link!',
      message: 'Lets connect through this app:',
      url: link,
      social: Share.Social.WHATSAPP,   
    };

    try {
      // await Share.shareAsync('Check out this link!')
    } catch (error:any) {
      console.log(error.message);
    }
  } else {
    showToastMessage('WhatsApp is not installed.');
  }
};
const icons = [
  { name: 'upload', component: <Feather name="upload" size={24} color="gray" />, label: 'Share' },
  { name: 'link', component: <Feather name="link" size={24} color="gray"/>, label: 'Copy Link', onPress: copyToClipboard },
  { name: 'message-circle', component: <Feather name="message-circle" size={24} color="gray" />, label: 'Messages' },
  { name: 'user-plus', component: <Feather name="user-plus" size={24} color="gray" />, label: 'Email' },
  { name: 'whatsapp', component: <FontAwesome6 name="whatsapp" size={24} color="gray" />, label: 'Whatsapp' },
];

  return (
    <View className=' bg-[rgba(255,255,255,0.2)] flex-row items-center justify-between p-1 border-gray-300'>
      {icons.map((icon, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(icon.name)}>
          <View className='ml-4 border border-gray-400 rounded-xl p-1'>
            {icon.component}
          </View>
          <Text className='mt-1 text-xs font-pregular text-gray-400 ml-4'>{icon.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


export default ButtonsContainer;