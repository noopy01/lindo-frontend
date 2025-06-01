import { useState, useRef } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { uploadImage } from '../reducers/post'; // uploadImage thunk 불러오기
const TaggableImageUploader = ({
 // postData,
   setUploadedImages,
  clothes,
  waitingTagItem,
  setWaitingTagItem,
  images,
  setImages,
  taggedProductsByImage,
  setTaggedProductsByImage,
  //hashtags,
 // setHashtags
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');
  const imageRef = useRef(null);
const dispatch = useDispatch();
// const handleFiles = async (fileList) => {
//   console.log('📂 업로드할 파일 목록:', fileList);

//   try {
//     const resultAction = await dispatch(uploadImage(fileList)); // ✅ FormData 아님
//     if (uploadImage.fulfilled.match(resultAction)) {
//       const uploaded = resultAction.payload;
//       console.log('📥 서버 응답 확인:', resultAction.payload);

//       setImages((prev) => [...prev, ...uploaded]);
//     } else {
//       console.error('업로드 실패:', resultAction.payload);
//     }
//   } catch (err) {
//     console.error('업로드 에러:', err);
//   }
// };
  // const handleFiles = (fileList) => {
  //   const newImages = Array.from(fileList).map(file => ({
  //     id: shortId.generate(),
  //     url: URL.createObjectURL(file),
  //   }));
  //   setImages(prev => [...prev, ...newImages]);
  // };
// const handleFiles = async (files) => {
//   const result = await dispatch(uploadImage(files));
//   if (uploadImage.fulfilled.match(result)) {
//     const uploaded = result.payload;
//     console.log('📥 업로드된 이미지들:', uploaded);
//     const urls = uploaded.map((file) => file.url);
//     setImages(urls); // ✅ imageUrls로 저장될 수 있게 상태에 저장
//   }
// };

// const handleFiles = async (fileList) => {
//   if (!fileList || fileList.length === 0) {
//     console.error('파일 없음!');
//     return;
//   }

//   const files = Array.from(fileList); // ✅ File 배열로 변환
//   console.log('📂 업로드할 파일 목록:', files);

//   try {
//     const resultAction = await dispatch(uploadImage(files)); // ✅ FormData ❌, File[] ✅
//    console.log('📤 resultAction:', resultAction); // 이걸 찍어주세요
//     if (uploadImage.fulfilled.match(resultAction)) {
//       const uploaded = resultAction.payload; // [{ id, src }]
//       console.log('✅ 서버 응답:', uploaded);
//       setImages((prev) => [...prev, ...uploaded]);
//     } else {
//       console.error('❌ 업로드 실패:', resultAction.payload);
//     }
//   } catch (err) {
//     console.error('❌ 예외 발생:', err);
//   }
// };

// const handleFiles = async (files) => {
//   const result = await dispatch(uploadImage(files));

//   console.log('📤 dispatch(uploadImage) 결과:', result); // ✅ 이거 반드시

//   if (uploadImage.fulfilled.match(result)) {
//     const uploaded = result.payload;
//     console.log('✅ 업로드 성공, 서버 응답:', uploaded); // ✅ 응답 구조 확인용

//     const enrichedImages = uploaded.map((file) => ({
//       id: shortId.generate(),
//       src: file.url.startsWith('http') ? file.url : `https://api.lindohub.com${file.url}`,
//     }));

//     console.log('✅ enrichedImages:', enrichedImages); // ✅ 여기까지 찍혀야 정상

//     setUploadedImages((prev) => [...prev, ...enrichedImages]); // ✅ 핵심
//     setImages((prev) => [...prev, ...enrichedImages]);   
//   } else {
//     console.error('❌ 이미지 업로드 실패:', result.payload);
//   }
// };
const handleFiles = async (files) => {
  const result = await dispatch(uploadImage(files));

  console.log('📤 dispatch(uploadImage) 결과:', result);

  if (uploadImage.fulfilled.match(result)) {
    const uploaded = result.payload; // [{ id, url }]
    console.log('✅ 업로드 성공, 서버 응답:', uploaded);

    const enrichedImages = uploaded.map((file) => ({
      id: file.id, // ✅ 서버에서 받은 이미지 ID
      src: file.url.startsWith('http') ? file.url : `https://api.lindohub.com${file.url}`,
    }));

    console.log('✅ enrichedImages:', enrichedImages);

    setUploadedImages((prev) => [...prev, ...enrichedImages]);
    setImages((prev) => [...prev, ...enrichedImages]);
  } else {
    console.error('❌ 이미지 업로드 실패:', result.payload);
  }
};


  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e) => e.preventDefault();

  const handleFileInputChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  };

  const handleImageClick = (e) => {
    if (!waitingTagItem || !imageRef.current || !images[selectedIndex]) return;
  
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
  
    const currentImageId = images[selectedIndex].id;
  
    // ✅ 여기에 제대로 된 newTag를 생성!
    // const newTag = {
    //   uid: waitingTagItem.uid,
    //   url: waitingTagItem.url,
    //   name: waitingTagItem.name,
    //   price: waitingTagItem.price,
    //   x,
    //   y,
    // };
    const newTag = {
      uid: waitingTagItem.uid,
      name: waitingTagItem.productName || waitingTagItem.name,  // 둘 중 하나 대응
      url: waitingTagItem.thumbnail || waitingTagItem.url,       // 둘 중 하나 대응
      price: waitingTagItem.price,
      x,
      y,
    };
    
  
    // ✅ 이 시점에서 정확하게 정보가 들어감!
    setTaggedProductsByImage((prev) => ({
      ...prev,
      [currentImageId]: [...(prev[currentImageId] || []), newTag],
    }));
  
    setWaitingTagItem(null);
  };
  
  const removeTag = (imageId, uid) => {
    setTaggedProductsByImage(prev => ({
      ...prev,
      [imageId]: prev[imageId].filter(tag => tag.uid !== uid),
    }));
  };

  const removeImage = (index) => {
    const imageId = images[index].id;
    const newImages = images.filter((_, i) => i !== index);
    const newTags = { ...taggedProductsByImage };
    delete newTags[imageId];
    setImages(newImages);
    setTaggedProductsByImage(newTags);
    if (selectedIndex >= newImages.length) {
      setSelectedIndex(Math.max(newImages.length - 1, 0));
    }
  };

  const currentImage = images[selectedIndex];
  const currentTags = taggedProductsByImage[currentImage?.id] || [];

return (
  <div style={{ padding: 20 }}>
    <h2 style={{ textAlign: 'center' }}>게시글 업로드</h2>

    {/* 드래그 앤 드롭 영역 */}
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        border: '2px dashed #ccc',
        padding: 20,
        textAlign: 'center',
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      <p>이미지를 여러 장 드래그해서 업로드하거나 클릭하여 선택하세요</p>
      <input type="file" accept="image/*" multiple onChange={handleFileInputChange} />
    </div>

    {/* 이미지 태깅 화면 */}

      {currentImage && (
        <div
          style={{ position: 'relative', width: 400, height: 400, margin: '0 auto' }}
          onClick={handleImageClick}
        >
       <img
            ref={imageRef}
            src={currentImage.src}
  alt="업로드 미리보기"
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>

        {currentTags.map((tag) => (
          <div
            key={tag.uid}
            style={{
              position: 'absolute',
              top: `${tag.y}%`,
              left: `${tag.x}%`,
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 12,
              cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {tag.uid}
            <button
              onClick={() => removeTag(currentImage.id, tag.uid)}
              style={{
                marginLeft: 6,
                background: 'red',
                border: 'none',
                borderRadius: '50%',
                width: 16,
                height: 16,
                color: 'white',
                fontSize: 10,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}

    {/* 이미지 리스트 썸네일 + 태그 표시 */}
    {images.length > 0 && (
      <div style={{ display: 'flex', gap: 10, marginTop: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {images.map((img, idx) => {
          const tags = taggedProductsByImage[img.id] || [];
          return (
            <div key={img.id} style={{ position: 'relative' }}>
              <Image
                src={img.src || '/default-image.png'}

                alt="썸네일"
                width={60}
                height={60}
                style={{
                  border: idx === selectedIndex ? '2px solid blue' : '1px solid #ccc',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedIndex(idx)}
              />
              {tags.length > 0 && (
                <div style={{ marginTop: 4, fontSize: 12 }}>
                  {tags.map((tag) => (
                    <div key={tag.uid}>
                      {tag.name} <br /> ₩{tag.price?.toLocaleString()}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => removeImage(idx)}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    )}

    {/* 태그된 상품 미리보기 */}
    {currentTags.length > 0 && (
      <div style={{ marginTop: 20 }}>
        <h4 style={{ textAlign: 'center' }}>태그된 상품</h4>
        
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {currentTags.map((tag) => (
            <div key={tag.uid} style={{ position: 'relative' }}>
              
               <Image src={tag.url}  width={80} height={80} alt="태그 상품" />
              <button
                onClick={() => removeTag(currentImage.id, tag.uid)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 카테고리 선택 버튼 */}
    <div style={{ display: 'flex', gap: 10, marginTop: 30, marginBottom: 10 }}>
      {Object.keys(clothes).map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          style={{
            padding: '8px 16px',
            background: category === activeCategory ? '#000' : '#ccc',
            color: category === activeCategory ? '#fff' : '#000',
            borderRadius: 20,
          }}
        >
          {category}
        </button>
      ))}
    </div>

    {/* 옷 선택 영역 */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {clothes[activeCategory]?.map((item) => (
        <div
          key={item.uid}
          onClick={() => setWaitingTagItem(item)}
          style={{
            border: waitingTagItem?.uid === item.uid ? '2px solid blue' : '1px solid #ddd',
            padding: 4,
            cursor: 'pointer',
          }}
        >
          <Image src={item.thumbnail} width={100} height={100} alt={activeCategory} />
        </div>
      ))}
    </div>
  </div>
);
}

export default TaggableImageUploader;
