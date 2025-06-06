import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance'; 


export const searchItems = createAsyncThunk(
  'search/searchItems',
  async (keyword, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/search?keyword=${encodeURIComponent(keyword)}`);
   console.log("🔍 응답 데이터:", response.data);

      return response.data; // { hashtags, products}
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔧 슬라이스 정의
const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearch(draft) {
      draft.results = [];
      draft.loading = false;
      draft.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItems.pending, (draft) => {
        draft.loading = true;
        draft.error = null;
      })
      .addCase(searchItems.fulfilled, (draft, action) => {
        draft.loading = false;
        draft.results = action.payload;
      })
      .addCase(searchItems.rejected, (draft, action) => {
        draft.loading = false;
        draft.error = action.payload;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;

