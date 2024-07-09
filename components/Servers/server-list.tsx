import { FlatList } from 'react-native'
import { router } from 'expo-router'

import LoadingServers from '@/components/skeletons/loading-servers'
import ServerCard from '@/components/Servers/ServerCard'
import { Text, View } from '@/components/Themed'
import { useGetServers } from '@/lib'

export default function ServerList() {
  
 const {data:serversDocuments ,isLoading:loading} = useGetServers()

 const onPress=(serverId:string)=>{
 router.push(`/server/${serverId}`)
 }
 const servers= serversDocuments?.pages[0]
 
 if(loading) return <LoadingServers />
 
 return (
    <View style={{flex:1}} >
      <FlatList
        data={servers}
        renderItem={({ item }) => (
          <ServerCard {...item}
          id={item._id}
          name={item?.name} 
          icon={item?.icon}
          onPress={() => onPress(item._id)} 
          />
        )}
        keyExtractor={(item) => item?._id}
      />
    </View>
  )
} 