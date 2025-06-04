import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import shortId from 'shortid';
import { faker } from '@faker-js/faker';
import _ from 'lodash';
import axiosInstance from '../api/axiosInstance'; 
import { fakeApi,addPostToMe,fetchPostsByTaggedProduct ,getTaggedProductsByImage  } from './user';
/*export const generateDummyPost = (number) =>
  Array(number)
    .fill()
    .map(() => {
      const content = faker.lorem.paragraph();

      const products = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        productName: faker.commerce.productName(),
        category: faker.commerce.department(),
        brand: faker.company.name(),
        price: faker.number.int({ min: 10000, max: 500000 }),
        size: `${faker.number.int({ min: 220, max: 300 })}mm`,
        siteUrl: faker.internet.url(),
        imageTag: faker.image.url(),
      }));

      // 기존 이미지 + 제품 이미지 정보 포함
      const images = [
        {
          src: faker.image.url() || "/default-image.png",
          fetchPriority: "auto",
          productInfo: "", // 일반 이미지에는 제품 정보 없음
          siteUrl: "",
        },
        ...products.map((product) => ({
          src: product.imageTag,
          fetchPriority: "auto",
          productInfo: `${product.brand} - ${product.productName} / ${product.price}원 / ${product.size}`,
          //siteUrl: product.siteUrl,
        })),
      ];

      return {
        id: shortId.generate(),
        User: {
          id: shortId.generate(),
          nickname: faker.person.fullName() || "익명 사용자",
        },
        content: content || "내용 없음",
        Images: images, // 기존 이미지 + 제품 이미지 포함
        Comments: [
          {
            User: {
              id: shortId.generate(),
              nickname: faker.person.fullName() || "익명 사용자",
            },
            content: faker.lorem.sentence() || "내용 없음",
          },
        ],
      };
    });
console.log("Generated Dummy Posts Array:", generateDummyPost(10)); 
*/

export const generateMinimalPosts = (count = 10 , userId,) =>
  Array(count).fill().map(() => ({
    id: shortId.generate(),
    thumbnail: faker.image.url() || '/default-thumbnail.png',
    userId,
  }));


export const initialState = {
  //게시글 작성마다 mainPosts 앞에 추가됨
  //댓글은 게시글의 id를 찾고 Comments로 접근함함
  mainPosts:  [],
  //mainPosts: generateDummyPost(10),  
  posts: [],
  taggedPosts: [],
  uploadedImages: [],   // ✅ 이미지 파일 저장
  imagePaths: [],
  hasNext: true,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  updatePostLoading: false,
  updatePostDone: false,
  updatePostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  bookmarkLoading: false,
  bookmarkDone: false,
  bookmarkError: null,
  fetchTaggedPostsLoading: false,
  fetchTaggedPostsError: null,
};


export const loadHashtagPosts = createAsyncThunk(
  'post/loadHashtagPosts',
  async ({ lastId, hashtag }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/posts/hashtag', {
        params: { hashtag, lastId },
      });
      return response.data; // { posts: PostDTO[], hasNext: boolean }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const loadUserPosts = createAsyncThunk(
  'post/loadUserPosts',
  async ({ id, lastId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${id}/posts`, {
        params: { lastId },
      });
      return response.data; // ✅ { posts: PostDTO[], hasNext: boolean }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//dispatch(loadUserPosts({ id: 3, lastId: 15 }));

  
export const fetchPosts = createAsyncThunk(
   'post/fetchPosts',
async ({lastId}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/posts', {
      params: { lastId },
    });
    return response.data;
  } catch (error) {
    console.error("❌ fetchPosts error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    
  }
})

export const throttledFetchPosts = _.throttle(fetchPosts, 5000); // 5초 제한  
 
// export const loadPosts = createAsyncThunk(
//   'post/loadPosts',
//   async (lastId, thunkAPI) => {
//     try {
//       const result = await throttledFetchPosts(lastId);
//       return result; // { posts: [...], hasNext: true/false }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const loadPosts = createAsyncThunk(
  'post/loadPosts',
  async (lastId, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/posts', {
        params: { lastId },
      });

      // 응답이 배열이면 감싸주기
      if (Array.isArray(response.data)) {
        return { posts: response.data };
      }

      // 응답이 객체라면 posts 필드로 반환되도록
      return {
        posts: response.data?.posts || [],
        hasNext: response.data?.hasNext ?? false,
      };
    } catch (error) {
      console.error("❌ loadPosts error:", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const loadPost = createAsyncThunk(
  'post/loadPost',
  async ({ id:postId }, thunkAPI) => {
    try {
     // console.log('🛰️ 실제 요청할 id:', id);
      console.log('🛰️ 실제 요청할 id:',postId); 
      const response = await axiosInstance.get(`/post/${postId}`);
      console.log('📦 받은 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error("❌ 요청 실패:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || '해당 게시글을 찾을 수 없습니다.');
    }
  }
);
export const addPost = createAsyncThunk(
  'post/addPost',
  async (data, thunkAPI) => {
    try {
      // ✅ taggedProductsByImage → 서버에 맞게 변환
      const taggedProducts = Object.entries(data.taggedProductsByImage || {}).map(
        ([imageId, tags]) => {
          const enrichedTags = tags.map((tag) => ({
            uid: tag.uid,
            name: tag.name || '',
            price: tag.price || 0,
            url: tag.url || '',
            x: tag.x,
            y: tag.y,
          }));
          return {
            imageId,
            tags: enrichedTags,
          };
        }
      );

      const postData = {
        content: data.content?.trim() || '설명이 없습니다.',
        imageUrls: data.imageUrls || [],
        hashtags: data.hashtags || [],
        taggedProducts: data.taggedProducts || [],  // ✅ 모든 이미지 태그 포함
      };

      console.log("🔎 전달된 imageUrls:", data.imageUrls);
      console.log("📦 최종 서버로 보낼 postData:", postData);

      const response = await axiosInstance.post('/post', postData);

      const newPost = response.data; // 서버 응답 구조에 맞게 사용
      thunkAPI.dispatch(addPostToMe(newPost)); // ✅ 사용자 상태에도 반영

      return newPost;
    } catch (error) {
  console.error('❌ Error in addPost:', error); // 🐛 전체 에러 로그
  console.log('🔴 error.response:', error.response);
  console.log('🔴 error.response?.data:', error.response?.data);
  console.log('🔴 error.message:', error.message);
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
}

  }
);


// export const addPost = createAsyncThunk(
//   'post/addPost',
//   async (data, thunkAPI) => {
   
//     try {
//       const thumbnail = 0;
//       const taggedProducts = data.taggedProductsByImage?.[thumbnail] || [];
//       // ✅ content와 Images만 서버에 전송 (DTO에 맞게)
//      const postData = {
//         content: data.content?.trim() || '설명이 없습니다.',
//         imageUrls: data.imageUrls || [], // ✅ 여기 고침
//         hashtags: data.hashtags || [],  // ✅ 여기 고침
//         taggedProducts,
//       };
//       console.log("🔎 전달된 imageUrls:", data.imageUrls);

// console.log("📦 최종 서버로 보낼 postData:", postData);

//       console.log('✅ 태그된 상품 목록:', taggedProducts);
//       const response = await axiosInstance.post('/post', postData);

//       const newPost = response.data; // 서버 응답 구조에 맞음
//       thunkAPI.dispatch(addPostToMe(newPost)); // ✅ 사용자 상태에도 반영

//       return newPost; // { id, User, content, Images, Comments, createdAt, updatedAt }
//     } catch (error) {
//       console.error('❌ Error in addPost:', error.response?.data || error.message);
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const addPost = createAsyncThunk(
//   'post/addPost',
//   async (data, thunkAPI) => {
//     try {
//       const thumbnail = 0;
//       const taggedProducts = data.taggedProducts || [];

//       const postData = {
//         content: data.content?.trim() || '설명이 없습니다.',
//         imageUrls: data.imageUrls || [], // ✅ 여기 고침
//         hashtags: data.hashtags || [],  // ✅ 여기 고침
//         taggedProducts,
//       };

//       const response = await axiosInstance.post('/post', postData);
//       const newPost = response.data;

//       thunkAPI.dispatch(addPostToMe(newPost));
//       return newPost;
//     } catch (error) {
//       console.error('❌ Error in addPost:', error.response?.data || error.message);
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );


export const addComment = createAsyncThunk(
  'post/addComment',
  async ({ postId, content }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/post/${postId}/comment`, {
        content, // 본문만 body에 포함
      });

      // 서버가 { postId, comment } 형식으로 응답한다고 가정
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
//dispatch(addComment({ postId: 123, content: '멋진 코디네요!' }));
export const removePost = createAsyncThunk(
  'post/removePost',
  async (postId, { rejectWithValue }) => {
    try {
      console.log("🗑️ 삭제 시도 게시글 ID:", postId);

      const response = await axiosInstance.delete(`/post/${postId}`);
      console.log("✅ 게시글 삭제 성공:", response.data);

      return { postId }; // 삭제 성공 시 postId만 반환

    } catch (error) {
      console.error("❌ 게시글 삭제 실패:", {
        status: error.response?.status,
        errorCode: error.response?.data?.errorCode,
        errorMessage: error.response?.data?.errorMessage,
      });
      console.log("🧪 전체 에러 응답 객체:", error.response?.data);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/post/${postId}`, {
        content,
      });

      return response.data; // { postId, content, updatedAt }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const likePost = createAsyncThunk(
  'post/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/post/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('🔥 likePost error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


//dispatch(likePost(123));
export const unlikePost = createAsyncThunk(
  'post/unlikePost',
  async (postId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/post/${postId}/like`);
      return response.data; // { postId: string }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const uploadImage = createAsyncThunk(
  'post/uploadImage',
  async (images, thunkAPI) => {
    try {
      const formData = new FormData();

      // ✅ FileList까지 커버
      if (Array.isArray(images) || images instanceof FileList) {
        Array.from(images).forEach((file) => formData.append('images', file));
      } else {
        formData.append('images', images);
      }

      // ✅ 진짜 FormData 내부 확인
      for (let [key, value] of formData.entries()) {
        console.log('📦 FormData 확인:', key, value); // ← 이거!
      }

      const response = await axiosInstance.post('/post/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const uploadImage = createAsyncThunk(
//   'post/uploadImage',
//   async (images, thunkAPI) => {
//     try {
//       const formData = new FormData();
//       if (Array.isArray(images)) {
//         images.forEach((file) => formData.append('images', file));
//       } else {
//         formData.append('images', images);
//       }
//       const response = await axiosInstance.post('/post/upload/images', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// 파일 업로드 버튼 등에서
//dispatch(uploadImage(selectedFiles)); // File | File[]


export const bookmark = createAsyncThunk(
  'post/bookmark',
  async (postId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/post/${postId}/bookmark`);
     console.log('📌 bookmark 요청 postId:', postId);

      return response.data; // 서버가 북마크된 게시글 객체 반환
    } catch (error) {
      console.error('❌ bookmark thunk 오류:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const unbookmark = createAsyncThunk(
  'post/unbookmark',
  async (postId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/post/${postId}/bookmark`);
      return response.data; // { message: '...', postId }
    } catch (error) {
      console.error('Failed to unbookmark post:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
)
export const fetchPostsByTaggedProductThunk = createAsyncThunk(
  'post/fetchPostsByTaggedProduct',
  async (uid, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${uid}/posts`);
      return response.data; // [{ id, thumbnail }, ...]
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    removeImage(draft, action) {
      draft.imagePaths = draft.imagePaths.filter((_, i) => i !== action.payload);
    },
    resetAddPostDone(draft) {
      draft.addPostDone = false; // 상태 초기화
    },
    addPostToMainPosts: (draft, action) => {
      const exists = draft.mainPosts.find((v) => String(v.id) === String(action.payload.id));
      if (!exists) {
        draft.mainPosts.push(action.payload);
      }},
      clearUploadedImages(draft) {
        draft.uploadedImages = [];
    //  state.imageFiles = [];
      },
  },
  extraReducers: (builder) => {
    builder

          .addCase(HYDRATE, (draft, action) => {
           // console.log("HYDRATE Payload:", action.payload);
          
            if (!action.payload.post || !Array.isArray(action.payload.post.mainPosts)) {
              console.warn("HYDRATE action.payload.post is undefined or invalid. Keeping existing state.");
              return;
            }
          
            draft.mainPosts = [...action.payload.post.mainPosts];
          })
          
      .addCase(loadPost.pending, (draft, action) => {
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
      })
      // .addCase(loadPost.fulfilled, (draft, action) => {
      //   draft.loadPostLoading = false;
      //   draft.loadPostDone = true;
      //  // draft.singlePost = action.payload;
      //  const already = draft.mainPosts.find((p) => String(p.id) === String(action.payload.id));
      //  if (!already) {
      //    draft.mainPosts.unshift(action.payload); // 앞에 추가
      //  }
      // })
      .addCase(loadPost.fulfilled, (draft, action) => {
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
      
        const post = action.payload;
      
        // 이미지가 있고, taggedProductsByImage가 없다면 생성
        if (post?.Images && !post.taggedProductsByImage) {
          post.taggedProductsByImage = getTaggedProductsByImage(post.Images);
        }
        
      
        // singlePost에 저장
        draft.singlePost = post;
      
        // mainPosts에 이미 없으면 추가
        const already = draft.mainPosts.find((p) => String(p.id) === String(post.id));
        if (!already) {
          draft.mainPosts.unshift(post);
        }
      })
      .addCase(loadPost.rejected, (draft, action) => {
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
      })
      .addCase(loadPosts.pending, (draft, action) => {
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
      })
      .addCase(loadPosts.fulfilled, (draft, action) => {
       // console.log("loadPosts.fulfilled payload:", action.payload);
        if (!action.payload || !Array.isArray(action.payload.posts)) {
          console.error("Error: loadPosts returned invalid data", action.payload);
          return;
        }
       
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = [...draft.mainPosts, ...action.payload.posts]; // 기존 데이터 유지하며 새 데이터 추가
        draft.hasNext = action.payload.hasNext; // 무한 스크롤링 가능 여부 설정
      })
      
      .addCase(loadPosts.rejected, (draft, action) => {
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
      })
      .addCase(loadUserPosts.pending, (draft, action) => {
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
      })
      .addCase(loadUserPosts.fulfilled, (draft, action) => {
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
      
        draft.mainPosts = draft.mainPosts.concat(action.payload.posts); // ✅ 배열 concat
        draft.posts = action.payload.posts;
      
        draft.hasNext = action.payload.hasNext; // ✅ 명세와 일치
        console.log('✅ 게시글 응답:', action.payload);
      })
      .addCase(loadUserPosts.rejected, (draft, action) => {
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
      })
      .addCase(loadHashtagPosts.pending, (draft, action) => {
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
      })
      .addCase(loadHashtagPosts.fulfilled, (draft, action) => {
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.payload.posts);
        draft.hasNext = action.payload.hasNext;
        
      })
      .addCase(loadHashtagPosts.rejected, (draft, action) => {
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
      })
      .addCase(addPost.pending, (draft) => {
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
      })
.addCase(addPost.fulfilled, (draft, action) => {
  console.log("✅ Redux addPost fulfilled:", action.payload);

  draft.addPostLoading = false;
  draft.addPostDone = true;

  const content = typeof action.payload?.content === 'string'
    ? action.payload.content
    : '내용 없음';

  const products = Array.isArray(action.payload.taggedProducts || action.payload.products)
    ? (action.payload.taggedProducts || action.payload.products)
    : [];

  const exists = draft.mainPosts.find(p => p.id === action.payload.id);
  if (!exists && action.payload.id) {
    draft.mainPosts.unshift({
      ...action.payload,
      content,
      productInfo: products,
    });
  }

  console.log('✅ Updated Redux mainPosts:', draft.mainPosts);
})


  
      .addCase(addPost.rejected, (draft, action) => {
        draft.addPostLoading = false;
        draft.addPostError = action.error.message;
      })
      .addCase(addComment.pending, (draft) => {
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
      })
      .addCase(addComment.fulfilled, (draft, action) => {
        const post = draft.mainPosts.find((v) => String(v.id) === String(action.payload.postId)); // postId 사용
      
        if (!post) {
          console.error(`Post with ID ${action.payload.postId} not found.`);
          return;
        }
      
        if (!Array.isArray(post.comments)) {
          post.comments = []; // 댓글 배열이 없으면 초기화
        }
      
        post.comments.unshift(action.payload.comment);
      
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
       // ✅ 불필요한 필드 정리
  if (post.Comments) {
    delete post.Comments;
  }
        //console.log('Action Payload:', action.payload);
        //console.log('Main Posts:', draft.mainPosts);
        if (!post) {
          console.error('Post not found:', action.payload.postId);
        } else {
          //console.log('Found Post:', post);
        }
      })
      
      .addCase(addComment.rejected, (draft, action) => {
        draft.addCommentLoading = false;
        draft.addCommentError = action.error.message;
      })
      .addCase(removePost.pending, (draft, action) => {
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
      })
      .addCase(removePost.fulfilled, (draft, action) => {
  const postId = String(action.payload.postId);
  console.log("✅ 삭제 완료: ", postId);
  console.log("🧾 삭제 전 mainPosts:", draft.mainPosts.map(p => p.id));
  
  draft.mainPosts = draft.mainPosts.filter((v) => String(v.id) !== postId);

  console.log("🧾 삭제 후 mainPosts:", draft.mainPosts.map(p => p.id));
})

      // .addCase(removePost.fulfilled, (draft, action) => {
      //   //console.log('Before removing post:', draft.mainPosts);
      //    //console.log('After removing post:', draft.mainPosts);
      // //  me.Posts에서도 제거 (로그인 유저의 게시물 목록)
      // draft.removePostLoading = false;
      // draft.removePostDone = true;
    
      // const postId = String(action.payload.postId);
    
      // if (!Array.isArray(draft.mainPosts)) {
      //   draft.mainPosts = [];
      // }
    
      // draft.mainPosts = draft.mainPosts.filter((v) => String(v.id) !== postId);
    
      // if (draft.me?.Posts) {
      //   draft.me.Posts = draft.me.Posts.filter((v) => String(v.id) !== postId);
      // }
      //       })
  
      .addCase(removePost.rejected, (draft, action) => {
        console.error('게시글 삭제 실패:', action.payload);
        draft.removePostLoading = false;
        draft.removePostError = action.error;
      })
      .addCase(updatePost.pending, (draft, action) => {
        draft.updatePostLoading = true;
        draft.updatePostDone = false;
        draft.updatePostError = null;
      })
      .addCase(updatePost.fulfilled, (draft, action) => {
        draft.updatePostLoading = false;
        draft.updatePostDone = true;
        //draft.mainPosts.find((v) => v.id === action.payload.PostId).content = action.payload.content;
        const post = draft.mainPosts.find((v) => v.id === action.payload.postId);
        if (post) {
          post.content = action.payload.content;
        }
        
      })
      .addCase(updatePost.rejected, (draft, action) => {
        draft.updatePostLoading = false;
        draft.updatePostError = action.error;
      }) 

      .addCase(uploadImage.pending, (draft, action) => {
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
      })
.addCase(uploadImage.fulfilled, (draft, action) => {
console.log('📥 uploadImage 응답 payload:', action.payload);

const normalizedImages = (action.payload || []).map(img => ({
  ...img,
  src: img.url?.startsWith('http')
    ? img.url
    : `https://lindo-image-bucket.s3.ap-northeast-2.amazonaws.com${img.url}`,
})).filter(img => img.src);
  draft.uploadedImages.push(...normalizedImages);
  draft.uploadImagesLoading = false;
  draft.uploadImagesDone = true;
})
      // .addCase(uploadImage.fulfilled, (draft, action) => {
      //  // draft.imagePaths = draft.imagePaths.concat(action.payload);
      //  draft.uploadedImages.push(...action.payload);
 
      //  draft.uploadImagesLoading = false;
      //   draft.uploadImagesDone = true;
      // })
      .addCase(uploadImage.rejected, (draft, action) => {
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
      })
      .addCase(fetchPostsByTaggedProductThunk.pending, () => {
        draft.fetchTaggedPostsLoading = true;
        draft.fetchTaggedPostsError = null;
      })
      .addCase(fetchPostsByTaggedProductThunk.fulfilled, (draft, action) => {
        draft.fetchTaggedPostsLoading = false;
        draft.taggedPosts = action.payload;
      })
      .addCase(fetchPostsByTaggedProductThunk.rejected, (draft, action) => {
        draft.fetchTaggedPostsLoading = false;
        draft.fetchTaggedPostsError = action.payload;
      })

  },
})

export const { removeImage, resetAddPostDone,addPostToMainPosts } = postSlice.actions;
export default postSlice.reducer;
