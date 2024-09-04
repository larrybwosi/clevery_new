import { CreateServerData, CreateChannelData, User } from '@/types';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { selectImage } from '@/lib';
import UploadImage from "../uploadimage";
import { VStack } from '@/components/ui/vstack';
import { Text, View } from '@/components/themed';
import FormField from '@/components/shared/form_field';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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

  return (
    <View className="flex-1 p-6">
      <VStack className='space-y-6 items-center' >
        <Text className="text-2xl font-rbold ">Create Your {title}</Text>
        <Text className="text-base text-gray-500 text-center font-pmedium">
          This is where you hang out with your friends. Create and start talking!
        </Text>

        {isServer && (
          <UploadImage
            image={fields.image!}
            chooseImage={chooseImage}
            removeImage={() => setFields({ ...fields, image: '' })}
          />
        )}

        <FormField
          title={`${title} Name`}
          value={fields.name}
          placeholder={isServer ? "Your server name" : "general"}
          handleChangeText={(text) => setFields({ ...fields, name: text })}
        />

        <FormField
          title="Description"
          value={fields.description!}
          placeholder={isServer ? "Describe your server " : "Describe your channel"}
          handleChangeText={(text) => setFields({ ...fields, description: text })}
        />

        {isServer && (
          <VStack className="space-y-2">
            <Text className="text-lg font-rregular ">Members:</Text>
            <HStack className="space-x-2 items-center">
              {selectedUsers?.map((user) => (
                <Avatar
                  key={user.id}
                  size="md"
                >
                  <AvatarImage
                    source={{ uri: user.image }}
                  />
                  {user.name.charAt(0)}
                </Avatar>
              ))}
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-gray-600 justify-center items-center"
                onPress={() => setPopupVisible?.(true)}
              >
                <Feather name='user-plus' size={24} color="white" />
              </TouchableOpacity>
            </HStack>
          </VStack>
        )}

        {!isServer && (
          <Select
            placeholder='Channel Type'
            accessibilityLabel='Channel Type'
            defaultValue='TEXT'
            onValueChange={(v) => setFields({ ...fields, type: v } as CreateChannelData)}
            selectedValue={(fields as CreateChannelData).type}
          >
            <SelectItem label='Text' value='TEXT'  >
              <Feather name='hash' size={16} color="white" />
            </SelectItem>
            <SelectItem label='Voice' value='AUDIO'>
              <Feather name='mic' size={16} color="white" />
            </SelectItem>
            <SelectItem label='Video' value='VIDEO' >
              <Feather name='video' size={16} color="white" />
            </SelectItem>
          </Select>
        )}

        <View className='w-full my-4 bg-gray-600' />

        <Button
          onPress={handleSubmit}
          isDisabled={loading}
          className="font-semibold w-full bg-primary"
        >
          <Text className="font-pregular text-white ">Create {title}</Text>
        </Button>
      </VStack>
    </View>
  );
};

export default Create;