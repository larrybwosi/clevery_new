import { TouchableOpacity} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { View, Text  } from '@/components/Themed';
import * as Clipboard from 'expo-clipboard';
import Share from 'react-native-share';
import { SocialIcon } from 'react-native-elements';
import { showToastMessage } from '@/lib';

const ButtonsContainer: React.FC = () => {
  const handlePress = (name: string) => {
    console.log(`Button with name ${name} pressed`);
  };

  const link = 'https://example.com/my-link';

  
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

  return (
    <View className='flex-row items-center justify-between p-4 border-gray-300'>
      <View className='flex-1 flex-row items-center justify-around w-1/2 gap-12 '>
        <TouchableOpacity  onPress={() => handlePress('upload')} >
          <View className='ml-4 border border-gray-400  rounded-xl p-1'>
            <Feather name="upload" size={24} color="gray" />
          </View>
          <Text className='mt-1 text-sm font-pregular text-gray-400 ml-4'>Share Invite</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => copyToClipboard()}>
          <View className='ml-4 border border-gray-400  rounded-xl p-1'>
            <Feather name="link" size={24} color="gray"/>
          </View>
          <Text className='mt-1 text-sm font-pregular text-gray-400 ml-4'>Copy Link</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => handlePress('message-circle')}>
          <View className='ml-4 border border-gray-400  rounded-xl p-1'>
          <Feather name="message-circle" size={24} color="gray" />
          </View>
          <Text className='mt-1 text-sm font-pregular text-gray-400 ml-4'>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => handlePress('none')}>
          <View className='ml-4 border border-gray-400  rounded-xl p-1'>
          <Feather name="user-plus" size={24} color="gray" />
          </View>
          <Text className='mt-1 text-sm font-pregular text-gray-400 ml-4'>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => shareToWhatsApp()}>
          <SocialIcon type='whatsapp' iconSize={25} small='10' style={{width:40 ,height:40,marginBottom:30}} />
          {/* <Text className='mt-1 text-sm font-pregular text-gray-400 '>whatsapp</Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default ButtonsContainer;