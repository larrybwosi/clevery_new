import { FlatList, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

import LoadingServers from '@/components/skeletons/loading-servers'
import ServerCard from '@/components/Servers/ServerCard'
import { Text, View } from '@/components/Themed'
import { useServers } from '@/lib'
import { Ionicons } from '@expo/vector-icons'

export default function ServerList() {
  
 const {data:servers ,isLoading:loading,error} = useServers()

 
 if(loading) return <LoadingServers />
 if(error) return <LoadingServers />
 
 const navigateToCreateServer = () => {
  router.navigate(`/create-server`)
};

if (servers?.items?.length === 0) {
  return (
    <View className="flex-1 justify-center items-center p-5">
      <Ionicons name="server-outline" size={64} color="#4B5563" />
      <Text className="text-md font-semibold text-gray-600 mt-4 mb-2 font-rregular">
        You are not a member of any servers yet
      </Text>
      <Text className="text-sm text-gray-400 text-center mb-6 font-rregular">
        Create a server to connect and hang out with friends!
      </Text>
      <TouchableOpacity 
        onPress={navigateToCreateServer}
        className="bg-purple-600 py-3 px-6 rounded-full shadow-md"
      >
        <Text className="text-white font-semibold">Create a Server</Text>
      </TouchableOpacity>
    </View>
  );
}
 return (
    <View style={{flex:1}} >
      <FlatList
        data={servers!}
        renderItem={({ item }) => (
          <ServerCard {...item}
            id={item.id}
            name={item?.name} 
            icon={item?.icon}
          />
        )}
        keyExtractor={(item) => item?.id}
      />
    </View>
  )
} 