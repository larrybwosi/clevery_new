import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/types';
interface Conversation {
    conversationId: string;
    messages: Message[];
  }
  
  interface Conversations {
    [id: string]: Conversation;
  }
  
  interface MessagesState {
    conversations: Conversations;
  }
  
  const initialState: MessagesState = {
    conversations: {},
  };
  
  const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
      setConversation: (state, action: PayloadAction<Conversation>) => {
        const { conversationId } = action.payload;
        state.conversations[conversationId] = action.payload;
      },
      addMessage: (state, action: PayloadAction<{ conversationId: string, message: Message }>) => {
        const { conversationId, message } = action.payload;
        if (state.conversations[conversationId]) {
          state.conversations[conversationId].push(message);
        } else {
          state.conversations[conversationId] = {
            conversationId,
            messages: [message],
          };
        }
      },
      clearMessages: (state) => {
        state.conversations = {};
      }
    }
  });
  

export const { setConversation, addMessage, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
