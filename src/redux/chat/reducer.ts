import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type CommentsPage = number | null;
export type CommentsForIncidentListPage = Record<string, CommentsPage>;
export type SetCommentsPageArgs = { id: string; data: CommentsPage };
export interface ChatState {
  scrollToVirtualId: number | null;
  commentsPage: CommentsForIncidentListPage;
}

const initialState: ChatState = {
  scrollToVirtualId: null,
  commentsPage: {},
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setScrollToVirtualId(state, action: PayloadAction<ChatState['scrollToVirtualId']>) {
      state.scrollToVirtualId = action.payload;
    },
    setCommentsPage(state, action: PayloadAction<SetCommentsPageArgs>) {
      state.commentsPage[action.payload.id] = action.payload.data;
    },
  },
});
export const { setScrollToVirtualId, setCommentsPage } = chatSlice.actions;

export default chatSlice.reducer;
