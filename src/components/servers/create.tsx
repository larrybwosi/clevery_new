import { TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Animated, { 
  FadeInDown, 
  FadeInRight 
} from 'react-native-reanimated';

import { CreateServerData, CreateChannelData, User } from '@/types';
import { selectImage } from '@/lib';
import UploadImage from "../uploadimage";
import { VStack } from '@/components/ui/vstack';
import { Text, View } from '@/components/themed';
import FormField from '@/components/shared/form_field';
import { HStack } from '@/components/ui/hstack';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from '../ui/icon';
import { Switch } from '../ui/switch';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native-gesture-handler';

type Fields = CreateServerData | CreateChannelData;

interface CreateProps {
  handleSubmit: () => void;
  selectedUsers?: User[];
  fields: Fields;
  setFields: React.Dispatch<React.SetStateAction<Fields>>;
  setSelectedUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  setPopupVisible?: (visible: boolean) => void; 
  type: 'server' | 'channel';
  loading: boolean;
}

const AnimatedVStack = Animated.createAnimatedComponent(VStack);

const InfoCard = ({ title, description, icon }) => (
  <Animated.View 
    entering={FadeInRight.delay(300).duration(500)} 
    className="shadow-sm p-4 flex-1 rounded-lg mb-4"
  >
    <HStack className="items-center mb-2">
      <Feather name={icon} size={20} color="#60A5FA" />
      <Text className="text-lg font-rbold ml-2 text-white">{title}</Text>
    </HStack>
    <Text className="text-sm text-gray-300 font-pmedium">{description}</Text>
  </Animated.View>
);

const MembersList = ({ selectedUsers, setPopupVisible }) => (
  <VStack className="space-y-2 mb-4 mr-[50%]">
    <Text className="text-lg font-rmedium text-gray-300">Members:</Text>
    <HStack className="space-x-2  flex-wrap">
      {selectedUsers?.map((user) => (
        <View key={user.id} className="bg-gray-700 rounded-full p-1 mb-2">
          <Image
            source={{ uri: user.image }}
            style={{width:32, height:32, borderRadius:16}}
          />
        </View>
      ))}
      <TouchableOpacity
        className="w-10 h-10 rounded-full bg-blue-600 justify-center items-center mb-2"
        onPress={() => setPopupVisible?.(true)}
      >
        <Feather name='user-plus' size={20} color="gray" />
      </TouchableOpacity>
    </HStack>
  </VStack>
);

const ChannelTypeSelect = ({ fields, setFields }) => (
  <Select  onValueChange={(value) => setFields({ ...fields, type: value })} className='w-full my-8 bg-transparent'>
    <SelectTrigger variant="outline" size="md" className="w-full justify-between">
      <SelectInput placeholder="Select option" />
      <SelectIcon className="mr-3" as={ChevronDownIcon} />
    </SelectTrigger>
    <SelectPortal>
      <SelectBackdrop />
      <SelectContent>
        <SelectDragIndicatorWrapper>
          <SelectDragIndicator />
        </SelectDragIndicatorWrapper>

        <SelectItem label="Text" value="TEXT"  />
        <SelectItem label="Audio" value="AUDIO" />
        <SelectItem label="Video" value="VIDEO" />
      </SelectContent>
  </SelectPortal>
</Select>

);

const Create: React.FC<CreateProps> = ({
  fields,
  setFields,
  handleSubmit,
  selectedUsers,
  setPopupVisible,
  type,
  loading
}) => {
  const chooseImage = async () => {
    const image = await selectImage();
    if (image) {
      setFields({ ...fields, image: image[0] });
    }
  };

  const isServer = type === 'server';
  const title = isServer ? 'Server' : 'Channel';
  const {colors} = useTheme();

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-2">
        <AnimatedVStack className='space-y-6 items-center' entering={FadeInDown.duration(500)}>
          <Text className="text-3xl font-rbold text-white mb-2">Create Your {title}</Text>
          <Text className="text-base text-gray-400 text-center font-pmedium mb-6">
            This is where you'll connect with your community. Let's make it awesome!
          </Text>

          {isServer && (
            <InfoCard 
              title="Server Basics" 
              description="A server is your digital space. Name it, give it an icon, and invite your friends to start chatting!"
              icon="server"
            />
          )}

          {!isServer && (
            <InfoCard 
              title="Channel Types" 
              description="Choose between text, voice, or video channels to suit your community's needs."
              icon="layers"
            />
          )}

          {isServer && (
            <UploadImage
            //@ts-ignore
              image={fields.image!}
              chooseImage={chooseImage}
              removeImage={() => setFields({ ...fields, image: '' })}
            />
          )}

          <FormField
            title={`${title} Name`}
            value={fields.name}
            placeholder={isServer ? "e.g., Awesome Gaming Squad" : "e.g., general-chat"}
            onChangeText={(text) => setFields({ ...fields, name: text })}
            otherStyles=" border-gray-700 mb-6 ml-3"
          />

          <FormField
            title="Description"
            value={fields.description!}
            placeholder={isServer ? "Describe what your server is about" : "What's this channel for?"}
            onChangeText={(text) => setFields({ ...fields, description: text })}
            otherStyles=" border-gray-700 mb-6 ml-3"
          />

          {isServer && <MembersList selectedUsers={selectedUsers} setPopupVisible={setPopupVisible} />}

          {!isServer && <ChannelTypeSelect fields={fields} setFields={setFields} />}
          {!isServer && 
          <>
          <Text className="text-base font-pregular text-gray-300 mb-2 mr-auto ml-3">Private</Text>
            {/* @ts-ignore */}
            <Switch size="md" isDisabled={false} value={fields?.isPrivate}
             onValueChange={(value) => setFields({ ...fields, isPrivate: value })}
             className='bg-transparent mr-[70%] mb-6'
             trackColor={{ false: colors.primary, true: colors.primary }}
            />
          </>
          }

          <Button
            onPress={handleSubmit}
            isDisabled={loading}
            className="font-semibold w-full bg-blue-600 py-3 rounded-lg"
          >
            {loading ? (
              <Text className="font-pregular text-white">Creating {title}...</Text>
            ) : (
              <Text className="font-pregular text-white">Create {title}</Text>
            )}
          </Button>
        </AnimatedVStack>
      </View>
    </ScrollView>
  );
};

export default Create;