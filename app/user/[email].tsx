import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'native-base';
import { Image } from 'expo-image';

import { multiFormatDateString, urlForImage, useGetUserById, useGetUsers } from '@/lib';
import { Text, View, Loader, UserInfo } from '@/components';
import MembersList from '@/components/members-list';

const UserBanner = ({ bannerImage }: { bannerImage: string }) => {
  return (
    <Image
      source={{ uri: urlForImage(bannerImage).width(300).url() }}
      className='w-full h-[150px]'
    />
  );
};

const UserSection = ({ title, content }: { title: string; content?: any }) => {
  return (
    <View className='m-2.5 mr-[10px] br-[10px] p-2.5 flex-1'>
      <Text className='text-[15px] font-pmedium my-2.5'>{title}</Text>
      {content ? <Text>{content}</Text> : <Text>No data yet</Text>}
    </View>
  );
}

const UserProfile = () => {
  const {email} = useLocalSearchParams()

  const {  data:user, isPending: loading, isError: netError } = useGetUserById(email as string);
  const {  data:commonFriends, error:userError} = useGetUsers();

  const userNavigate = (userId: string) => {
    router.push(`/conversation/${userId}`);
  };

  if (loading || netError) {
    return <Loader loadingText="Loading user..." />;
  }
  

  return (
    <ScrollView>
      <UserBanner bannerImage={user?.bannerImage!} />
      <UserInfo profile={user} />

      <Text className='font-rmedium mt-[15px]'>
        About Me:  
        
      </Text>
      <Text className='text-sm font-rregular mt-2.5'>
        {user?.bio}
      </Text>

      <Text className='font-rmedium mt-[15px]'>
        Member Since:
      </Text>  
      <Text className='text-sm font-rregular mt-2.5' >
        {multiFormatDateString(user?._createdAt)}
      </Text>
      <UserSection 
        title="Member Since" 
        content={multiFormatDateString(user?._createdAt)} 
      />
      
      {!!commonFriends?.length && !userError? 
          <MembersList label='Mutual Friends' images={commonFriends?.map((usr)=>urlForImage(usr?.image).width(100).url())} /> 
        : 
          <Text>You have no common friends yet. </Text>
      } 
       
      <UserSection title="Mutual Servers" />
      <UserSection title="Connections" />
    </ScrollView>
  );
};

export default UserProfile;