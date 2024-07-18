import { useGetConversation, useGetInfiniteMessages, useSendUserMessage } from "../react-query/queries";

export const userMessages =(userid:string)=> {
      
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
    conversation,loadingconversation,conversationError,
    // messagesdata,messagesError,hasNextPage, refetchMessages,loadingMessages
    sendMessage,sendingMessage,sendMessageError
}
  
}