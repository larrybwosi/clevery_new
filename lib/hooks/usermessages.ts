import { useGetConversation, useGetInfiniteMessages, useGetUserById, useSendUserMessage } from "../react-query/queries";

export const userMessages =(userid:string)=> {
      
  const {
    data: user,
    isPending:loadingUser,
    isError:userError,
    refetch:refetchUser
  } =useGetUserById(userid);
  const {
    data: conversation,
    isPending:loadingconversation,
    isError:conversationError,
  } =useGetConversation(userid);
  // const {
  //   data: messagesdata,
  //   isPending:loadingMessages,
  //   isError:messagesError,
  //   hasNextPage,
  //   refetch:refetchMessages
  // } =useGetInfiniteMessages({convId:conversation?._id!});
  const {
    mutateAsync:sendMessage,
    isPending:sendingMessage,
    isError:sendMessageError
  }= useSendUserMessage(userid)

return {
    user,loadingUser,userError,conversation,loadingconversation,conversationError,
    // messagesdata,messagesError,hasNextPage, refetchMessages,loadingMessages
    sendMessage,sendingMessage,sendMessageError,refetchUser
}
  
}