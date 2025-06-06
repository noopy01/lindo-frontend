import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BiCloset } from "react-icons/bi";
import { GiLabCoat } from "react-icons/gi";
import {
  PiTShirtLight,
  PiPantsLight,
  PiDressLight,
  PiEyeglassesThin,
} from "react-icons/pi";
import { TbShoe, TbBrandRedhat } from "react-icons/tb";
import { BsHandbag } from "react-icons/bs";
import shortId from 'shortid';
import axiosInstance from '../api/axiosInstance'; 
import { fakeApi } from '../reducers/user';
export const categories = [
  { name: "ALL", label: "전체", icon: BiCloset },
  { name: "outer", label: "아우터", icon: GiLabCoat },
  { name: "top", label: "상의", icon: PiTShirtLight },
  { name: "bottom", label: "바지", icon: PiPantsLight },
  { name: "dress", label: "드레스", icon: PiDressLight },
  { name: "shoes", label: "신발", icon: TbShoe },
  { name: "bag", label: "가방", icon: BsHandbag },
  { name: "hat", label: "모자", icon: TbBrandRedhat },
  { name: "accessory", label: "액세서리", icon: PiEyeglassesThin },
];

// export const initialClothes = {
//   outer: [
//     { uid:"a1", url: "/images/coat1.jpg", name: "봄 코트",
//       price: 89000,
//    },
//     { uid: "a2", url: "/images/coat2.jpg", name: " 코트",
//       price: 97000,
//      },
//     { uid: "a3", url: "/images/jacket1.jpg",
//       name: "자켓",
//       price: 189000,
//      },
//     { uid:"a4", url: "/images/jacket2.jpg",  name: "여름 자켓",
//       price: 289000,
//    },
//   ],
//   top: [
//     { uid: shortId.generate(), url: "/images/sweater1.jpg" },
//     { uid: shortId.generate(), url: "/images/sweater2.jpg" },
//     { uid: shortId.generate(), url: "/images/knit1.jpg" },
//     { uid: shortId.generate(), url: "/images/knit2.jpg" },
//   ],
//   bottom: [
//     { uid: shortId.generate(), url: "/images/jeans1.jpg" },
//     { uid: shortId.generate(), url: "/images/jeans2.jpg" },
//   ],
//   dress: [{ uid: shortId.generate(), url: "/images/dress1.jpg" }],
//   shoes: [{ uid: shortId.generate(), url: "/images/shoes1.jpg" }],
//   bag: [{ uid: shortId.generate(), url: "/images/bag1.jpg" }],
//   hat: [{ uid: shortId.generate(), url: "/images/hat1.jpg" }],
//   accessory: [],
// };
// const uid = shortId.generate(); // 상품 uid

// // 기본 더미 제품 데이터
// const dummyProduct = {
//   uid,
//   id: shortId.generate(),
//   category: "outer",
//   brand: "Nike",
//   productName: "Winter Jacket",
//   price: 129000,
//   description: "A warm and stylish winter jacket.",
//   images: [
//     {
//       src: "https://via.placeholder.com/150",
//       fetchPriority: "auto",
//       productInfo: "Nike - Winter Jacket / 129000원 / L",
//       siteUrl: "https://nike.com"
//     }
//   ]
// };


// 초기 상태 정의
const initialState = {
  //product: dummyProduct,         // 현재 단일 제품
  product: null,
  products: [],                  // 복수 제품 저장용
  closetItems: [],            // ✅ 내 옷장 아이템
  tagsByImage: {},               // 이미지별 태그 정보 전역화
  loading: false,
  error: null,
 // initialClothes,
 initialClothes: {
    outer: [],
    top: [],
    bottom: [],
    dress: [],
    shoes: [],
    bag: [],
    hat: [],
    accessory: [],
  },
  closetItemsByCategory: {}, // category별 분류
  allClosetItems: [],        // 전체 배열
  fetchClosetLoading: false,
  fetchClosetError: null,
    addProductLoading: false,
  addProductDone: false,
  addProductError: null,
};


//	게시글 작성 시 태깅용 옷장 불러오기
// export const fetchProduct = createAsyncThunk(
//   'product/fetchProduct',
//   async (_, thunkAPI) => {
//     try {
//       const response = await axiosInstance.get('/closet/me'); // ✅ 내 옷장 API
//       return response.data; // [{ uid, name, price, url, ... }]
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );


/* addProduct 연동동
export const addProduct = createAsyncThunk('product/addProduct', async (product, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/product', product); // 서버 연동 시
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});*/

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (product, thunkAPI) => {
    try {
      console.log(" accessToken:", localStorage.getItem("accessToken"));

      console.log(" 서버로 보낼 상품 데이터:", product); // 전송 직전 로그
      const response = await axiosInstance.post('/closet/me/product', product);
      console.log(" 서버 응답:", response.data); // 응답 확인 로그
      return response.data;
    } catch (error) {
  console.error(" 요청 실패!", error);
  console.error(" 서버 응답:", error.response?.data); 
  console.error(" 응답 body:", error.response?.data);
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
}

  }
);


export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId, thunkAPI) => {
    try {
     const response = await axiosInstance.delete(`/closet/me/product/${productId}`);
     // return response.data.deletedId; // ✅ deletedId만 반환
     return `4_${response.data.deletedId}`;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const updateProduct = createAsyncThunk(
//   'product/updateProduct',
//   async ({ productId, updatedData }, thunkAPI) => {
//     try {
//       const response = await axiosInstance.patch(`/api/product/${productId}`, updatedData);
//       return response.data; // 수정된 상품 반환
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// 특정 상품(uid)의 정보를 서버에서 불러오기
//상품 상세 페이지 (/product/[uid])	해당 상품 하나만 상세히 보여줘야 할 때
//프리뷰 모달 또는 태깅 클릭	이미지에서 상품 태그 클릭 시, uid만 있고 다른 정보가 없을 때 서버에서 상세 조회
export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (uid, thunkAPI) => {
    try {
      console.log('🔍 [getProductById] 요청 uid:', uid); // ✅ uid 확인
      const response = await axiosInstance.get(`closet/me/product/${uid}`);
      console.log('✅ [getProductById] 응답 데이터:', response.data); // ✅ 서버 응답 확인
      return response.data;
    } catch (error) {
      console.error('❌ [getProductById] 에러:', error.response?.data || error.message); // ✅ 에러 확인
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getProductByInfo = createAsyncThunk(
  'product/getProductByInfo',
  async (uid, thunkAPI) => {
    try {
      console.log('🔍 [getProductByInfo] 요청 uid:', uid); // ✅ uid 확인
      const response = await axiosInstance.get(`/product/${uid}`);
      console.log('✅ [getProductByInfo] 응답 데이터:', response.data); // ✅ 서버 응답 확인
      return response.data;
    } catch (error) {
      console.error('❌ [getProductByInfo] 에러:', error.response?.data || error.message); // ✅ 에러 확인
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


//로그인한 유저의 옷장 아이템 리스트
// export const fetchMyCloset = createAsyncThunk(
//   'product/fetchMyCloset',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/closet/me'); // ✅ 내 옷장 API
//       return response.data.closetItems; // ✅ [{ uid, name, price, ... }]
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const fetchClosetData = createAsyncThunk(
  'product/fetchClosetData',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/closet/me');
      return response.data.closetItems; // 서버 응답
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setInitialClothes: (draft, action) => {
       console.log("🔥 setInitialClothes reducer 호출됨");
  draft.initialClothes = action.payload;
},

    updateProduct: (draft, action) => {
      const { productName, brand, price, images } = action.payload;
      const updatedImages = images?.map((img) => ({
        src: img.src || img,
        fetchPriority: "auto",
        productInfo: productName ? `${brand} - ${productName} / ${price}원 ` : "",
      
      })) || [];

      draft.product = {
        ...draft.product,
        ...action.payload,
        images: updatedImages.length > 0 ? updatedImages : draft.product.images
      };
    },

    setTagsByImage: (draft, action) => {
      draft.tagsByImage = action.payload;
    },

    resetProductState: (draft) => {
      draft.product = dummyProduct;
      draft.products = [];
      draft.tagsByImage = {};
      draft.loading = false;
      draft.error = null;
    },
  // setClosetItems(draft, action) {
  //     draft.closetItems = action.payload;
  // },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(fetchProduct.pending, (draft) => {
      //   draft.loading = true;
      // })
      // .addCase(fetchProduct.fulfilled, (draft, action) => {
      //   draft.loading = false;
      
      //   const categorized = Object.fromEntries(
      //     Object.keys(draft.initialClothes).map((key) => [key, []])
      //   );
      
      //   action.payload.forEach((item) => {
      //     if (categorized[item.category]) {
      //       categorized[item.category].push(item);
      //     }
      //   });
      
      //   draft.initialClothes = categorized;
      // })
      // .addCase(fetchProduct.rejected, (draft) => {
      //   draft.loading = false;
      //   draft.error = 'Failed to fetch product';
      // })
      .addCase(addProduct.pending, (draft, action) => {
        draft.addProductLoading = true;
        draft.addProductDone = false;
        draft.addProductError = null;
      })

.addCase(addProduct.fulfilled, (draft, action) => {
  draft.addProductLoading = false;
        draft.addProductDone = true;
  const product = action.payload;
  if (!product || !product.category) return;

  const category = product.category;

  if (!draft.closetItemsByCategory[category]) {
    draft.closetItemsByCategory[category] = [];
  }

  draft.closetItemsByCategory[category].push(product);
  draft.allClosetItems.push(product);
  console.log("payload:", action.payload)
   console.log("✅ 등록된 product:", product);
})

      .addCase(addProduct.rejected, (draft,action) => {
         draft.addProductLoading = false;
          console.error("❌ addProduct 실패!", action.payload);
 draft.addProductError = action.payload || action.error.message;
 
      })
.addCase(deleteProduct.fulfilled, (draft, action) => {
  const id = String(action.payload);
  console.log("🧩 삭제 대상 ID (payload):", id);

  // initialClothes에서 uid 일치하는 항목 제거
  for (const category in draft.initialClothes) {
    draft.initialClothes[category] = draft.initialClothes[category].filter((p) => {
      const uidSuffix = String(p.uid).split('_')[1];
      console.log("🧺 비교 대상 p.uid:", p.uid, "->", uidSuffix);
      return uidSuffix !== id;
    });
  }

  // closetItemsByCategory에서도 제거
  for (const category in draft.closetItemsByCategory) {
    draft.closetItemsByCategory[category] = draft.closetItemsByCategory[category].filter(
      (p) => String(p.uid).split('_')[1] !== id
    );
  }

  // 기타 전역 리스트에서도 제거
  draft.closetItems = draft.closetItems.filter(
    (p) => String(p.uid).split('_')[1] !== id
  );

  draft.allClosetItems = draft.allClosetItems.filter(
    (p) => String(p.uid).split('_')[1] !== id
  );
})


      // .addCase(updateProduct.fulfilled, (draft, action) => {
      //   const updated = action.payload;
      //   const category = updated.category;
      //   draft.initialClothes[category] = draft.initialClothes[category].map((p) =>
      //     p.id === updated.id ? updated : p
      //   )
.addCase(getProductById.fulfilled, (draft, action) => {
  console.log('📦 [Redux] getProductById.fulfilled:', action.payload); // ✅ payload 확인
  draft.product = action.payload;
})
.addCase(getProductByInfo.fulfilled, (draft, action) => {
  console.log('📦 [Redux] getProductByInfo.fulfilled:', action.payload); // ✅ payload 확인
  draft.product = action.payload;
})

        // .addCase(fetchMyCloset.pending, (draft) => {
        //   draft.fetchClosetLoading = true;
        //   draft.fetchClosetError = null;
        // })
        // .addCase(fetchMyCloset.fulfilled, (draft, action) => {
        //   draft.fetchClosetLoading = false;
        //   draft.closetItems = action.payload; // ✅ closetItems 저장
        // })
        // .addCase(fetchMyCloset.rejected, (draft, action) => {
        //   draft.fetchClosetLoading = false;
        //   draft.fetchClosetError = action.payload;
        // })
        .addCase(fetchClosetData.pending, (draft) => {
          draft.fetchClosetLoading = true;
          draft.fetchClosetError = null;
        })
   .addCase(fetchClosetData.fulfilled, (draft, action) => {
      console.log("✅ fetchClosetData.fulfilled 실행됨!");
        const items = action.payload;

        // ✅ 전체 저장
        draft.closetItems = items;

        // ✅ 카테고리 분류
        const categorized = Object.fromEntries(
          Object.keys(draft.initialClothes).map((key) => [key, []])
        );

        items.forEach((item) => {
          const categoryKey = item.category?.toLowerCase();
          if (categorized[categoryKey]) {
            categorized[categoryKey].push(item);
          } else {
            console.warn("⚠️ Unknown category:", item.category);
          }
        });
 console.log("🧥 categorized:", categorized); // 확인
        draft.initialClothes = categorized;
      })
        .addCase(fetchClosetData.rejected, (draft, action) => {
          draft.fetchClosetLoading = false;
          draft.fetchClosetError = action.payload;
        });
        
      
  },
  })

// 액션 및 리듀서 export
export const {
  setTagsByImage,
  resetProductState,
  setClosetItems,
  setInitialClothes 
} = productSlice.actions;

export default productSlice.reducer;