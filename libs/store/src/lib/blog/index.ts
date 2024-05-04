import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IBlogState, Post } from './types';

const initialState: IBlogState = {
  posts: [],
  categories: [],
  tags: [],
};

export const blogSlice = createSlice({
  name: '@@blog',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setPosts, setCategories, setTags } = blogSlice.actions;

export const blogReducer = blogSlice.reducer;
