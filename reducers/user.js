import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { bookmark, unbookmark,loadPost,likePost,unlikePost,posts } from "./post";
import axiosInstance from '../api/axiosInstance'; 
import {initialClothes}from "./product";
// 이미지 하나에 태깅된 옷 1개 생성
const generateTaggedProduct = () => {
  const outerItems = initialClothes["outer"];
  const selected = outerItems[Math.floor(Math.random() * outerItems.length)];

  return {
    uid: selected.uid,
    url: selected.url,
    name: selected.name,
    price: selected.price,
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  };
};
export const dummyPosts = [
  {
    id: 1,
    content: "여름엔 이거지",
    Images: [{ id: 1, src: "/images/test.jpg" }],
    taggedProductsByImage: {
      1: [
        {
          uid: 'a1',
          name: '봄 코트',
          price: 89000,
     
          url: '/images/coat1.jpg',
          x: 50,
          y: 30,
        },
      ],
    },
  },
  {
    id: 2,
    content: "겨울엔 따뜻하게",
    Images: [{ id: 2, src: "/images/test2.jpg" }],
    taggedProductsByImage: {
      2: [
        {
          uid: 'a2',
          name: '코트',
          price: 97000,
    
          url: '/images/coat2.jpg',
          x: 20,
          y: 60,
        },
      ],
    },
  },
  {
    id: 3,
    content: "자켓으으로 멋내기",
    Images: [{ id: 3, src: "/images/test3.jpg" }],
    taggedProductsByImage: {
      3: [
        {
          uid: 'a1',
          name: '자켓',
          price: 189000,
        
          url: '/images/jacket1.jpg',
          x: 80,
          y: 20,
        },
      ],
    },
  },
  {
    id: 4,
    content: "롱 코트로 멋내기",
    Images: [{ id: 3, src: "/images/test1.jpg" }],
    taggedProductsByImage: {
      3: [
        {
          uid: 'a4',
          name: '여름 자켓',
          price: 89000,
      
          url: '/images/jacket2.jpg',
          x: 80,
          y: 20,
        },
      ],
    },
  },
];

//Images 배열에서 taggedProductsByImage 자동 생성
export const getTaggedProductsByImage = (images) => {
  const result = {};
  for (const image of images) {
    result[image.id] = [
      generateTaggedProduct(), // 이미지당 1개만 태그 (원하면 여러 개도 가능)
    ];
  }
  return result;
};
export const fetchPostsByTaggedProduct = createAsyncThunk(
  'post/fetchPostsByTaggedProduct',
  async (uid, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/products/${uid}/posts`);
      return response.data; // 게시글 배열
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const images = [{ id: 1, src: "/images/test.jpg" }];


export const fakeApi = {
  me: async () => ({
    data: {
      id: 1,
      nickname: "test",
      email: "test@example.com",
      profileImageUrl: "/images/profile.jpg",
  
      // 내 팔로잉/팔로워
      Followings: [
        { id: 2, nickname: "test2" },
        { id: 3, nickname: "test3" },
        { id: 5, nickname: "test1" },
      ],
      Followers: [
        { id: 2, nickname: "test2" },
        { id: 3, nickname: "test3" },
        { id: 4, nickname: "test4" },
        { id: 5, nickname: "test1" },
      ],
  
      // 내 게시글
      Posts: [
        {
          id: 1,
          content: "test의 게시물 #여름 #반팔",
          Images: images,
          thumbnail: images[0].src,
          hashtags: ["여름", "반팔"],
          taggedProductsByImage: getTaggedProductsByImage(images),
        },
      ],
  
      savedItems: [
        { id: 1, name: '청바지', imageUrl: '/images/jeans1.jpg' },
        { id: 2, name: '셔츠', imageUrl: '/images/knit1.jpg' },
      ],
      likedPosts: [],
      bookmarkedPosts: [],
     },
  }),
  getProductById: async (uid) => {
    const found = initialClothes["아우터"].find((p) => p.uid === uid); // ✅ 여기가 핵심
    return {
      data: found ?? {
        uid,
        name: '알 수 없음',
        price: 0,
        size: 'N/A',
        url: '/default-image.png',
      },
    };
  },
  getPostsByTaggedProduct: async (uid) => {
    const matchedPosts = dummyPosts.filter((post) =>
      Object.values(post.taggedProductsByImage || {}).some((tags) =>
        tags.some((tag) => tag.uid === uid)
      )
    );

    return { data: matchedPosts };
  },
  test1: async () => ({
    data: {
      id: 5,
      nickname: "test1",
      email: "test1@example.com",
      Posts: [
        {
          id: 5,
          content: "test1의 게시물 #봄 #가을" ,
          Images: [{ id: 11, src: "/images/test1.jpg" }],
          thumbnail: "/images/test1.jpg",
        },
      ],
      Followings: [
        {
          id: 1,
          nickname: "test",
          content:  "test의 게시물 #여름 #반팔" ,
        },
      ],
      Followers: [{ id: 1, nickname: "test" }],
    },
  }),

  getUserById: async (id) => {
    const users = {
      1: await fakeApi.me(), // 로그인 유저
      2: {
        data: {
          id: 2,
          nickname: "test2",
          profileImageUrl: "/images/user2.jpg",
          Posts: [
            {
              id: 2,
              content: "test2의 게시물",
              Images: [{ id: 2, src: "/images/test2.jpg" }],
              thumbnail: "/images/test2.jpg",
            },
          ],
          closetItems: [
            { id: 1, name: "아우터", imageUrl: "/images/coat1.jpg" },
          ],
        },
      },
      3: {
        data: {
          id: 3,
          nickname: "test3",
          profileImageUrl: "/images/user3.jpg",
          Posts: [
            {
              id: 3,
              content: "test3의 게시물",
              Images: [{ id: 3, src: "/images/test3.jpg" }],
              thumbnail: "/images/test3.jpg",
            },
          ],
          closetItems: [],
        },
      },
      5: await fakeApi.test1(),
    };
  
    return users[String(id)] || null;
  },
  

  login: async () => await fakeApi.me(),

  logout: async () => null,

  follow: async (id) => {
    const target = await fakeApi.getUserById(id);
    return {
      data: {
        id: 1, // 내 ID
        followedUser: {
          id: target.data.id,
          nickname: target.data.nickname,
        },
        followingsCount: 4, // ex. 현재 followings 수
        followersCount: 5,  // ex. 현재 followers 수
      },
    };
  },
  
  unfollow: async (id) => {
    return {
      data: {
        id: 1,
        unfollowedUserId: id,
        followingsCount: 2,
        followersCount: 4,
      },
    };
  },
  

  signup: async () => ({ data: { id: 1, name: "New User" } }),

  search: async ({ type, query }) => {
      const lowerQuery = query.toLowerCase();
  
      const allData = {
        hashtag: [
          { id: 1, name: "#여름", type: "hashtag" },
          { id: 2, name: "#가을", type: "hashtag" },
        ],
        category: [
          { id: 3, name: "아우터", type: "category" },
          { id: 4, name: "셔츠", type: "category" },
        ],
        brand: [
          { id: 5, name: "무신사", type: "brand" },
          { id: 6, name: "지오다노", type: "brand" },
        ],
      };
  
      // 실제 검색 결과 생성
      const results = allData[type]
        .filter((item) => item.name.toLowerCase().includes(lowerQuery))
        .map((item) => ({
          ...item,
          relatedPosts: [
            {
              id: 100,
              content: `${item.name} 관련 게시물 예시`,
              Images: [{ id: 1, src: '/images/sample.jpg' }],
            },
          ],
        }));
  
      return { data: results };
    },
  };
  
export const initialUserProfile = {
    id: null,
    nickname: null,
    email: null,
postsCount: 0,
closetItems: [],
 posts: [],     // 해당 유저의 옷장 아이템들
  };

const initialState = {
  isLoggedIn: false,
  me: null,
  accessToken: null,
  followingsCount: 0,
  followersCount: 0,
  followingsList: [],
  followersList: [],
  likeCount:0,
  //userProfile: initialUserProfile,
  profileUser: initialUserProfile,
  posts: [],
  bookmarkedPosts: [],
  likedPosts: [], // 좋아요한 게시글
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  savedItems: [], // 옷장 아이템
  logInLoading: false,//로그인 시도중
  logInDone: false,
  logInError: null,
  logOutLoading: false,//로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false,//회원가입 시도중
  signUpDone: false,
  signUpError: null,
  followLoading: false,//팔로우 시도중
  followDone: false,
  followError: null,
  unfollowLoading: false,//언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
  changeNicknameLoading: false,
  changeNicknameDone: false,
  changeNicknameError: null,
  getPostsLoading: false,
  getPostsError: null,
  fetchLikedPostsLoading: false,
  fetchBookmarkedPostsLoading: false,
};
// https://api.lindohub.com/api/v1/app/users/login
export const logIn = createAsyncThunk('user/logIn', async (data, { rejectWithValue }) => {
  try {
    console.log("로그인 요청 데이터:", data);
    const response = await axiosInstance.post('/users/login', data); 
    
    // ✅ 여기에서 accessToken 저장
    localStorage.setItem('accessToken', response.data.accessToken);
    console.log('✅ 저장된 accessToken:', localStorage.getItem('accessToken'));

    return response.data; // 이게 fulfilled로 넘어감
  } catch (error) {
    console.error("로그인 에러 발생:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});



export const logOut = createAsyncThunk(
  "user/logOut",
  async (_, { rejectWithValue }) => { 
    try {
      const response = await axiosInstance.post('/users/logout', {}, { withCredentials: true });
      return response.data; // 👈 여기서 response.data가 { message: "Logged out successfully" } 형태여야 함
    } catch (error) {
      return rejectWithValue(error.response?.data || "로그아웃 실패");
    }
  }
);

export const follow = createAsyncThunk(
  'user/follow',
  async (userId, { rejectWithValue }) => {
    try {
      console.log("🔥 팔로우 요청", userId);
      const response = await axiosInstance.patch(`/follow/${userId}`);
      console.log("✅ 서버 응답:", response.data);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      // ✅ 409 Conflict이면 이미 팔로우 상태라 간주하고, 강제로 성공처럼 처리
      if (status === 500 && data?.followedUser) {
        console.warn("⚠️ 이미 팔로우된 사용자, 강제 fulfilled 처리");
        return data;
      }

      return rejectWithValue(data || error.message);
    }
  }
);


export const unfollow = createAsyncThunk('user/unfollow', async (userId,  { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/follow/${userId}`);
    return response.data; // ✅ { id: number } 형태로 반환
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const signup = createAsyncThunk('user/signup', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/users/signup', data); // ✅ 경로 수정
    return response.data; // { id, nickname } 형태여야 함
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


//현재 로그인된 유저의 팔로잉 목록을 불러오는 함수
export const loadFollowings = createAsyncThunk(
  'user/loadFollowings',
  async ({ limit = 100, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/me/followings', {
       params: { limit, offset },
      });
        console.log("✅ [loadFollowings] 서버 응답 데이터:", response.data);
      return response.data; // 응답이 FollowingDTO[] 형태라고 가정
    } catch (error) {
  console.error("❌ [loadFollowings] 요청 실패:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
        }
  }
);

// 현재 로그인된 유저의 팔로워 목록을 불러오는 함수
export const loadFollowers = createAsyncThunk(
  'user/loadFollowers',
  async ({ limit = 20, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/me/followers', {
        params: { limit, offset },
      });
      return response.data; // ✅ FollowerDTO[]  // 응답 구조: { users: [...], totalCount: 53 }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//dispatch(loadFollowers({ limit: 10, offset: 0 }));

// 현재 로그인한 사용자(me)의 정보를 가져옴
export const loadMyInfo = createAsyncThunk('/user/loadMyInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/users/me'); // ✅ 명세대로 수정
   console.log('🛡️ accessToken:', localStorage.getItem('accessToken'));
    console.log(" loadMyInfo 응답:", response.data);

    return response.data; // ✅ UserDTO 형식
  } catch (error) {
    return rejectWithValue(error.response?.data || "유저 정보 가져오기 실패");
  }
});


//특정 유저의 정보를 가져옴.data는 해당 유저의 userId.예: 프로필 페이지에 들어갈 때 GET /user/5 호출해서 해당 유저 정보 받아옴
// export const loadUser = createAsyncThunk(
//   'user/loadUser',
//   async (userId, thunkAPI) => {
//     try {
//       const user = await fakeApi.getUserById(userId);
//       if (!user) throw new Error('User not found');
//       return user.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// )
// export const fetchUserProfile = createAsyncThunk(
//   'user/fetchUserProfile',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await fakeApi.getUserById(id);
//       if (!response || !response.data) throw new Error("User not found");
//       return response.data;
//     } catch (error) {
//       console.error("프로필 불러오기 실패:", error.message);
//       return rejectWithValue(error.message); // ✅ 이렇게 수정
//     }
//   }
// );

export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/users/profile/${id}`); 
    console.log("프로필 응답:", response.data);
    return response.data; // 여기에는 Posts, Followings, Followers 다 포함됨
  } catch (error) {
    console.error("프로필 불러오기 실패:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const getPosts = createAsyncThunk(
  'user/getPosts',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/posts', {
      //  params: { page, limit },
      });
      return response.data; // MinimalPostDTO[]
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLikedPosts = createAsyncThunk(
  'user/fetchLikedPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/likedposts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ||error.message);
    }
  }
);

export const fetchBookmarkedPosts = createAsyncThunk(
  'user/fetchBookmarkedPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/bookmarked-posts ');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ||error.message);
    }
  }
);
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMe: (draft ,action) => {
      draft.me = action.payload;
      draft.isLoggedIn = !!action.payload;
    },
    setLogOutLoading(draft, action) {
      draft.logOutLoading = action.payload;
    },
    addPostToMe(draft, action) {
  if (!draft.me) {
    draft.me = { Posts: [], Followers: [], Followings: [] };
  }
  if (!draft.me.Posts) {
    draft.me.Posts = [];
  }

  const exists = draft.me.Posts.find((post) => post.id === action.payload.id);
  if (!exists) {
    // 🧩 최소한의 정보만 저장: post.id만 저장하거나 필요한 필드만 따로 분리
    draft.me.Posts.unshift({
      id: action.payload.id,
      content: action.payload.content, // ← 필요하다면 이 정도만
    });
  }

  console.log('After Update (me.Posts):', [...draft.me.Posts]);
},

    // addPostToMe(draft, action) {
    //   if (!draft.me) {
    //     draft.me = { Posts: [], Followers: [], Followings: [] }; // me가 없으면 초기화
    //   }
    //   if (!draft.me.Posts) {
    //     draft.me.Posts = []; // Posts가 없으면 초기화
    //   }
    //   console.log('Before Update:', [...draft.me.Posts]); // 상태 변경 전 디버깅
    //   draft.me.Posts.unshift(action.payload);
    //  // draft.me.Posts = [...draft.me.Posts, { id: action.payload }];
    
    // // draft.me.Posts.unshift({ id: action.payload, content: action.payload.content  });
    //  console.log('After Update:', [...draft.me.Posts]); // 상태 변경 후 디버깅
    // },
    //자기 게시물 삭제
    // removePostOfMe(draft, action) {
    //   draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.payload);
    // },
    
    // 전체 게시물 업데이트 -> 외부에서 받아온 게시글 배열을 state.posts에 저장하는 함수
    setPosts(draft, action) {
      draft.posts = action.payload; 
    }
  },
  extraReducers: (builder) => {
    builder
      // .addCase(HYDRATE, (draft, action) => {
      //   return {
      //     ...draft,
      //     ...action.payload.user,
      //   };
      // })
      .addCase(HYDRATE, (state, action) => {
        // ✅ HYDRATE 시에도 클라이언트 상태 유지
        if (action.payload.user.me !== null) {
          state.me = action.payload.user.me;
          state.isLoggedIn = !!action.payload.user.me;
        }
      })
      .addCase(logIn.pending, (draft) => {
        draft.logInLoading = true;
        draft.logInError = null;
        draft.logInDone = false;
      })
      .addCase(logIn.fulfilled, (draft, action) => {
       // console.log("Payload from API:", action.payload); 
        draft.logInLoading = false;
        draft.me = action.payload.user;             // ✅ 유저 정보만 저장
        draft.isLoggedIn = true;
        draft.logInDone = true;
        draft.accessToken = action.payload.accessToken;

      })
      .addCase(logIn.rejected, (draft, action) => {
        draft.logInLoading = false;
        draft.logInError = action.payload;
      })
      .addCase(logOut.pending, (draft) => {
        draft.logOutLoading = true;
        draft.logOutError = null;
        draft.logOutDone = false;
      })
      .addCase(logOut.fulfilled, (draft) => {
        draft.logOutLoading = false;
        draft.isLoggedIn = false;
        draft.me = null;
        //draft.me = { nickname: "", email: "", Posts: [], Followers: [], Followings: [] };
        draft.logOutDone = true;
      })
      .addCase(logOut.rejected, (draft, action) => {
        draft.logOutLoading = false;
        draft.logOutError = action.payload;
      })
.addCase(follow.pending, (draft) => {
  draft.followLoading = true;
  draft.followError = null;
  draft.followDone = false;
})

.addCase(follow.fulfilled, (state, action) => {
  console.log("✅ follow.fulfilled 실행됨:", action.payload);
  const data = action.payload;

  const followedUser = data.followedUser;
  if (!followedUser) {
    console.warn("⚠️ follow 응답에 followedUser 없음");
    return;
  }

  // Followings 초기화 확인
  if (!Array.isArray(state.me.Followings)) {
    state.me.Followings = [];
  }

  const alreadyFollowing = state.me.Followings.find(
    (user) => Number(user.id) === Number(followedUser.id)
  );

  if (!alreadyFollowing) {
    state.me.Followings.push(followedUser);
    console.log("✅ Followings에 추가됨:", followedUser);
  }

  state.me.followingsCount = data.followingsCount ?? state.me.followingsCount;
  state.me.followersCount = data.followersCount ?? state.me.followersCount;
  state.followLoading = false;
  state.followDone = true;
})

// .addCase(follow.fulfilled, (draft, action) => {
//   console.log("💬 FOLLOW 응답 유저 데이터:", action.payload);

//   draft.followLoading = false;
//   draft.followDone = true;

//   const data = action.payload;
//   const followedUser = data.followedUser;

//   if (draft.me) {
//     if (!Array.isArray(draft.me.Followings)) {
//       draft.me.Followings = [];
//     }

//     console.log("✅ 현재 me.Followings 목록:", draft.me.Followings.map((v) => v.id));
//     console.log("✅ 추가 대상 followedUser.id:", followedUser?.id);

//     const alreadyFollowing = draft.me.Followings.find(
//       (u) => Number(u.id) === Number(followedUser?.id)
//     );

//     if (!alreadyFollowing && followedUser) {
//       draft.me.Followings.push(followedUser);
//       console.log("✅ Followings에 추가 완료:", followedUser);
//     }

//     if (typeof data.followingsCount === "number") {
//       draft.me.followingsCount = data.followingsCount;
//     }

//     if (typeof data.followersCount === "number") {
//       draft.me.followersCount = data.followersCount;
//     }
//   }
// })

.addCase(follow.rejected, (draft, action) => {
  draft.followLoading = false;
  draft.followError = action.payload || action.error?.message;
  draft.followDone = false;
})
.addCase(unfollow.pending, (draft) => {
        draft.unfollowLoading = true;
        draft.unfollowError = null;
        draft.unfollowDone = false;
      })
.addCase(unfollow.fulfilled, (draft, action) => {
  const data = action.payload;
  console.log("✅ unfollow.fulfilled 실행됨:", data);

  draft.unfollowLoading = false;

  if (draft.me) {
    if (!Array.isArray(draft.me.Followings)) {
      draft.me.Followings = [];
    }

    // ✅ 올바른 필드 사용
    draft.me.Followings = draft.me.Followings.filter(
      (v) => Number(v.id) !== Number(data.unfollowedUserId)
    );

    draft.me.followingsCount =
      typeof data.followingsCount === "number"
        ? data.followingsCount
        : draft.me.followingsCount;

    draft.me.followersCount =
      typeof data.followersCount === "number"
        ? data.followersCount
        : draft.me.followersCount;
  }

  draft.unfollowDone = true;
})
      
      .addCase(unfollow.rejected, (draft, action) => {
        draft.unfollowLoading = false;
        draft.unfollowError = action.payload;
      })
      .addCase(signup.pending, (draft) => {
        draft.signUpLoading = true;
        draft.signUpError = null;
        draft.signUpDone = false;
      })
      .addCase(signup.fulfilled, (draft) => {
        draft.signUpLoading = false;
        draft.signUpDone = true;
      })
      .addCase(signup.rejected, (draft, action) => {
        draft.signUpLoading = false;
        draft.signUpError = action.payload;
      })
      .addCase(likePost.pending, (draft, action) => {
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
      })

      // .addCase(likePost.fulfilled, (draft, action) => {
      //    console.log('✅ 북마크 fulfilled payload:', action.payload); 
      //   if (!draft.me) {
      //     draft.me = { likedPosts: [] }; // ✅ me 자체가 없을 경우 대비
      //   }
      
      //   if (!draft.me.likedPosts) {
      //     draft.me.likedPosts = []; // ✅ bookmarkedPosts가 없을 경우 대비
      //   }
      
      //   const exists = draft.me.likedPosts.find((p) => p.id === action.payload.id);
      //   if (!exists) {
      //     draft.me.likedPosts.unshift(action.payload); // ✅ 안전하게 추가
      //   }
      // })
      .addCase(likePost.fulfilled, (draft, action) => {
  if (!draft.likedPosts) {
    draft.likedPosts = [];
  }
  const exists = draft.likedPosts.some(p => p.id === action.payload.id);
  if (!exists) {
    draft.likedPosts.unshift(action.payload);
  }
})
      .addCase(likePost.rejected, (draft, action) => {
        draft.likePostLoading = false;
        draft.likePostError = action.error;
      })
      .addCase(unlikePost.pending, (draft, action) => {
        draft.unlikePostLoading = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
      })
      .addCase(unlikePost.fulfilled, (draft, action) => {
        // const { postId } = action.payload;
        // if (!draft.me?.likedPosts) return;
        // draft.me.likedPosts = draft.me.likedPosts.filter((p) => String(p.id) !== String(postId));
      console.log('🗑️ [reducer] unlikePost.fulfilled postId:', action.payload);
  draft.likedPosts = draft.likedPosts.filter(p => p.id !== action.payload);
  console.log('🧼 [reducer] 제거 후 likedPosts:', draft.likedPosts);
    
      })
      
      .addCase(unlikePost.rejected, (draft, action) => {
        draft.unlikePostLoading = false;
        draft.unlikePostError = action.error;
      })
      // .addCase(bookmark.fulfilled, (draft, action) => {
      //    console.log('✅ 북마크 fulfilled payload:', action.payload); 
      //   if (!draft.me) {
      //     draft.me = { bookmarkedPosts: [] }; // ✅ me 자체가 없을 경우 대비
      //   }
      
      //   if (!draft.me.bookmarkedPosts) {
      //     draft.me.bookmarkedPosts = []; // ✅ bookmarkedPosts가 없을 경우 대비
      //   }
      
      //   const exists = draft.me.bookmarkedPosts.find((p) => p.id === action.payload.id);
      //   if (!exists) {
      //     draft.me.bookmarkedPosts.unshift(action.payload); // ✅ 안전하게 추가
      //   }
      // })
      .addCase(bookmark.fulfilled, (draft, action) => {
  if (!draft.bookmarkedPosts) {
    draft.bookmarkedPosts = [];
  }
  const exists = draft.bookmarkedPosts.some(p => p.id === action.payload.id);
  if (!exists) {
    draft.bookmarkedPosts.unshift(action.payload);
  }
})
// .addCase(bookmark.rejected, (draft, action) => {
//   if (action.payload?.errorCode === 'E101') {
//     const postId = action.meta.arg; // thunk에 넘긴 postId
//     if (!draft.bookmarkedPosts.some((p) => p.id === postId)) {
//     //  draft.bookmarkedPosts.push({ id: postId }); // 최소한 id만 넣어줌
//     }
//   }
// })
      .addCase(unbookmark.fulfilled, (draft, action) => {
        const { postId } = action.payload;
      
        draft.bookmarkedPosts = draft.bookmarkedPosts.filter(
          (p) => String(p.id) !== String(postId)
        )
      })
      
      .addCase(loadPost.fulfilled, (draft, action) => {
        const post = action.payload;
    
        // me가 없으면 중단
        if (!draft.me || !Array.isArray(draft.me.Followings)) return;
    
        // Followings 중 post 작성자를 찾음
        const writer = draft.me.Followings.find((f) => f.id === post.User.id);
        if (!writer) return;
    
        if (!Array.isArray(writer.Posts)) {
          writer.Posts = [];
        }
    
        const already = writer.Posts.find((p) => String(p.id) === String(post.id));
        if (!already) {
          writer.Posts.push(post);
        }
      })
      .addCase(fetchUserProfile.pending, (draft) => {
       
      })
      .addCase(fetchUserProfile.fulfilled, (draft, action) => {
        // draft.profileUser = {
        //   id: action.payload.id,
        //   nickname: action.payload.nickname,
        //   postsCount: action.payload.postCount,
        //   posts: action.payload.posts || [], 
        // };
        draft.profileUser = action.payload;

        })
      
      .addCase(fetchUserProfile.rejected, (draft, action) => {
        console.error('userProfile 로드 실패', action.payload);
      })
      .addCase(loadMyInfo.fulfilled, (draft, action) => {
          console.log("💬 loadMyInfo 응답 데이터:", action.payload);

        draft.me = {
          id: action.payload.id,
          nickname: action.payload.nickname,
          email: action.payload.email,
          postsCount: action.payload.postsCount ?? 0,
          followingsCount: action.payload.followingsCount ?? 0,
          followersCount: action.payload.followersCount ?? 0,
          Posts: action.payload.posts ?? [], // ✅ 소문자 대응
          Followings: action.payload.followings ?? [], // ✅ 소문자 대응
       Followers: action.payload.followers ?? [], 
          bookmarkedPosts:action.payload.bookmarkedPosts ||[],
        likedPosts: action.payload.likedPosts || [], 
        },
        draft.isLoggedIn = true;
      })
      
      .addCase(loadMyInfo.rejected, (draft, action) => {
        console.error('로그인 사용자 정보 불러오기 실패:', action.payload);
        draft.me = null;
        draft.error = action.payload;
      })
      .addCase(loadFollowers.fulfilled, (draft, action) => {
  //       //draft.Followers = action.payload;
  //       const { users, totalCount } = action.payload;

  // draft.followersList.push(...users);
  // draft.followersCount = totalCount; // ✅ totalCount 저장
  //      console.log("✅ [loadFollowings] 응답 payload:", action.payload);

  const { users, totalCount } = action.payload;
draft.followersList = [
  ...new Map([...draft.followersList, ...users].map(u => [u.id, u])).values()
];

  draft.followersList = users || [];
  draft.followersCount = totalCount ?? 0;
  draft.loadFollowersDone = true;
  draft.loadFollowersLoading = false
   })
      .addCase(loadFollowers.rejected, (draft, action) => {
        console.error('팔로워 목록  불러오기 실패:', action.payload);
        draft.me = null;
      })
.addCase(loadFollowings.fulfilled, (draft, action) => {
  console.log("✅ [loadFollowings] 응답 payload:", action.payload);

  const { users, totalCount } = action.payload;
draft.followingsList = [
  ...new Map([...draft.followingsList, ...users].map(u => [u.id, u])).values()
];

  draft.followingsList = users || [];
  draft.followingsCount = totalCount ?? 0;
  draft.loadFollowingsDone = true;
  draft.loadFollowingsLoading = false;
})

      .addCase(loadFollowings.rejected, (draft, action) => {
        console.error('팔로잉 목록  불러오기 실패:', action.payload);
        draft.me = null;
      })
      .addCase(getPosts.pending, (draft) => {
        draft.getPostsLoading = true;
        draft.getPostsError = null;
      })
      .addCase(getPosts.fulfilled, (draft, action) => {
        draft.getPostsLoading = false;
        draft.posts = action.payload;
      })
      .addCase(getPosts.rejected, (draft, action) => {
        draft.getPostsLoading = false;
        draft.getPostsError = action.payload || '에러 발생';
        console.error('posts를 가져오기 실패:', action.payload);
      })  
      .addCase(fetchLikedPosts.pending, (draft) => {
  draft.fetchLikedPostsLoading = true;
})
.addCase(fetchLikedPosts.fulfilled, (draft, action) => {
  draft.likedPosts = action.payload;
  draft.fetchLikedPostsLoading = false;
})
.addCase(fetchLikedPosts.rejected, (draft) => {
  draft.fetchLikedPostsLoading = false;
})
.addCase(fetchBookmarkedPosts.pending, (draft) => {
  draft.fetchBookmarkedPostsLoading = true;
})
.addCase(fetchBookmarkedPosts.fulfilled, (draft, action) => {
  draft.bookmarkedPosts = action.payload;
  draft.fetchBookmarkedPostsLoading = false;
})
.addCase(fetchBookmarkedPosts.rejected, (draft) => {
  draft.fetchBookmarkedPostsLoading = false;
});

      
  },
});
export const { setMe,setLogOutLoading,addPostToMe,removePostOfMe, setPosts  } = userSlice.actions;

export default userSlice.reducer;

