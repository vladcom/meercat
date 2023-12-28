import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { ChatState } from './reducer';

export const selectChat = (state: RootState): ChatState => state.chat;

export const selectScrollToVirtualState = createSelector(
  selectChat,
  (state) => state.scrollToVirtualId
);

export const selectCommentsPage = createSelector(selectChat, (state) => state.commentsPage);
