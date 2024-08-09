import { FlatList } from 'react-native'
import { router } from 'expo-router'

import LoadingServers from '@/components/skeletons/loading-servers'
import ServerCard from '@/components/Servers/ServerCard'
import { Text, View } from '@/components/Themed'
import { useServers } from '@/lib'

export default function ServerList() {
  
 const {data:servers ,isLoading:loading,error} = useServers()

 console.log(servers)
 const onPress=(serverId:string)=>{
 router.push(`/server/${serverId}`)
 }
 
 if(loading) return <LoadingServers />
 if(error) return <LoadingServers />
 
 return (
    <View style={{flex:1}} >
      <FlatList
        data={servers!}
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