import { useState, useEffect   } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import TaggableImageUploader from './TaggableImageUploader';
import { addPost } from '../reducers/post'; 
import { fetchUserProfile , addPostToMe} from '../reducers/user'; 
import { useRouter } from 'next/router';
import { message } from 'antd';
import {fetchClosetData } from "../reducers/product";


const PostUploadForm = () => {
  const router = useRouter(); 
  const dispatch = useDispatch();
  const clothes = useSelector((state) => state.product.initialClothes);
//console.log('초기 옷장 데이터:', clothes);


  const [selected, setSelected] = useState([]);
  const [hashtags, setHashtags] = useState([]); 
  const [taggedProductsByImage, setTaggedProductsByImage] = useState({}); // 기존 tagsByImage  
  const [content, setContent] = useState('');
  const [waitingTagItem, setWaitingTagItem] = useState(null);
  const { me } = useSelector((state) => state.user);
  //const uploadImage = useSelector((state) => state.post.uploadedImages);
 // const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]); // 서버에서 받은 URL들
 const [images, setImages] = useState([]);               // ✅ 태깅용
 const [selectedIndex, setSelectedIndex] = useState(0);
const resetImageState = () => {
  setImages([]);
  setUploadedImages([]);
  setTaggedProductsByImage({});
  setSelectedIndex(0);
  setWaitingTagItem(null);
};

  // const user = useMemo(() => {
  //     if (!me) return null;
  //     return me.id === profileUser?.id ? me : profileUser;
  //   }, [me, profileUser]);

  // ✅ 게시 시 호출되는 함수 내부에 dispatch 코드 포함
const handleSubmit = async () => {
 
const taggedProducts = Object.entries(taggedProductsByImage).map(([imageId, tags]) => ({
  imageId,

  tags: tags.map(tag => {
    const rawUid = typeof tag.uid === 'string' && tag.uid.includes('_')
      ? tag.uid.split('_')[1]
      : tag.uid;

    const cleanUid = Number(rawUid); 
    return {
      uid: cleanUid, // ✅ 여기에서 정제된 uid 사용
      name: tag.name,
      price: tag.price,
     // url: tag.url,
      x: tag.x,
      y: tag.y,
    };
  }),
}));



  const extractedTags = content.match(/#[^\s#]+/g)?.map(tag => tag.slice(1)) || [];
const imageUrls = uploadedImages.map((img) => img.src);
  // const imageUrls = uploadedImages.map((img) =>
  //     img.src?.startsWith('http') ? new URL(img.src).pathname : img.url || img.src
  //   );
//const imageUrls = uploadedImages; 
  const postData = {
    content: content.trim() || '설명이 없습니다.',
    imageUrls,
    hashtags: extractedTags,
    taggedProducts
  };
  console.log("📤 최종 postData:", postData);
console.log('🖼️ 업로드된 이미지:', uploadedImages);
console.log('📤 서버에 보낼 imageUrls:', imageUrls);
  try {
    const result = await dispatch(addPost(postData)); 
    console.log("🟢 서버 응답 post:", result.payload);// ✅ 이거 하나만 쓰기
console.log("📌 images:", images);
console.log("📌 taggedProductsByImage:", taggedProductsByImage);
console.log("📌 최종 postData.taggedProducts:", taggedProducts)
    const newPost = {
      ...result.payload,
      User: { id: me.id, nickname: me.nickname },
      Comments: [],
    };


    if (result.meta.requestStatus === 'fulfilled') {
  dispatch(addPostToMe(newPost));
    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms 기다림
  await dispatch(fetchUserProfile(me.id)); // ✅ 완료 보장
  message.success('게시글이 업로드되었습니다!');

 resetImageState();

  router.push('/mypage');
}

  } catch (err) {
    message.error('알 수 없는 오류로 업로드에 실패했습니다.');
    console.error(err);
  }
};


  // useEffect(() => {
  //   dispatch(fetchProduct());
  // }, [dispatch]);


  useEffect(() => {
    if (me?.id) dispatch(fetchClosetData());
  }, [me]);
  
//   useEffect(() => {
//   console.log('옷장 데이터:', clothes); // 이게 빈 배열인지 확인
// }, [clothes]);

  const handleSelect = (item) => {
    setSelected(prev =>
      prev.find(i => i.uid === item.uid)
        ? prev.filter(i => i.uid !== item.uid)
        : [...prev, item]
    );
  };
// const handleImageChange = async (e) => {
//   const files = e.target.files;
//   if (!files || files.length === 0) return;

//   const formData = new FormData();
//   Array.from(files).forEach((file) => formData.append('images', file));

//   try {
//     const resultAction = await dispatch(uploadImage(formData));
//     if (resultAction.type === uploadImage.fulfilled.type) {
//       setUploadedImages(resultAction.payload); // ✅ 이걸로 상태 저장
//     } else {
//       message.error('이미지 업로드에 실패했습니다.');
//     }
//   } catch (err) {
//     console.error(err);
//     message.error('예상치 못한 오류가 발생했습니다.');
//   }
// };
useEffect(() => {
  console.log('🧪 [DEBUG] PostUploadForm에서 uploadedImages:', uploadedImages);
}, [uploadedImages]);

  return (
    <>
      <div style={{ padding: 20 }}>
        {/* 이미지 업로드 + 태깅 */}
        <TaggableImageUploader
          clothes={clothes}
         images={images}
  setImages={setImages}
  uploadedImages={uploadedImages}
  setUploadedImages={setUploadedImages}
          //setImages={setImageList}
          //setImages={setUploadedImages}
       //  setUploadedImages={setUploadedImages}
          taggedProductsByImage={taggedProductsByImage}     // ✅
          setTaggedProductsByImage={setTaggedProductsByImage}
          hashtags={hashtags}                               // ✅
          setHashtags={setHashtags}
          waitingTagItem={waitingTagItem}
          setWaitingTagItem={setWaitingTagItem}
           selectedIndex={selectedIndex}
  setSelectedIndex={setSelectedIndex}
        />


        {/* 선택된 아이템 미리보기 */}
      {selected.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
            {selected.map(item => (
              <div key={item.uid} style={{ position: 'relative' }}>
                <Image src={item.thumbnail} width={80} height={80} alt="선택된 옷" />
                <button
                  onClick={() => handleSelect(item)}
                  style={{
                    position: 'absolute', top: 0, right: 0,
                    background: 'red', color: 'white', border: 'none', borderRadius: '50%'
                  }}
                >×</button>
              </div>
            ))}
          </div>
        )}




  {/* 게시글 내용 입력 */}
  <textarea
    value={content}
    onChange={(e) => setContent(e.target.value)}
    placeholder="오늘의 코디를 소개해주세요!"
    style={{ width: '100%', height: 100 }}
  />

</div>


        {/* 게시 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            style={{
              backgroundColor: content.trim() ? '#0070f3' : '#ccc',
              color: 'white',
              padding: '12px 32px',
              border: 'none',
              borderRadius: '24px',
              fontWeight: 'bold',
              cursor: content.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
            }}
          >
            게시하기
          </button>
        </div>
  
    </>
  );
};

export default PostUploadForm;
