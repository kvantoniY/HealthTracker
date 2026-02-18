import { Post } from "@/entities/post/model/types";
import { getPosts } from "@/shared/api/json-placeholder";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { title } from "process";

interface InitialStateType {
    posts: Post[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: InitialStateType = {
    posts: [],
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }> (
  'users/fetchByIdStatus',
  async (_, {rejectWithValue}) => {
    try {
    const posts = await getPosts()
    return posts
    } catch (err: any) {
        return rejectWithValue(err.message || 'Не удалось загрузить посты');
    }

  },
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state,action: PayloadAction<Post[]>) => {
                state.status = 'succeeded';
                state.posts = action.payload
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Error get posts'
            })
    }

})
export const postsReducer = postsSlice.reducer;