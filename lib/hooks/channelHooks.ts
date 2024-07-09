import { useGetChannelById, useGetChannelMessages, useSendChannelMessage } from "../react-query/queries"

export const channelHooks =({channelid}:{channelid:string})=> {
  const {
    data:channel,
    isPending:loading,
    isError:error,
    refetch
  } = useGetChannelById(channelid)
    
  // const {
  //   data:channelMessages,
  //   isPending:loadingMessages,
  //   isError:messagesError,
  // } = useGetChannelMessages(channelid)
    
  
return {
    channel,loading,error,
    // channelMessages,loadingMessages,messagesError
}
  
}