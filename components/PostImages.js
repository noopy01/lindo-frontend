import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Popover, Carousel} from 'antd';

const PostImages = ({ images = [], taggedProductsByImage = {} }) => {
  const containerRefs = useRef([]);

  useEffect(() => {
    console.log('📌 PostImages 렌더링됨');
    console.log('📸 images:', images);
    console.log('🏷️ taggedProductsByImage:', taggedProductsByImage);
  }, [images, taggedProductsByImage]);

  if (!images || images.length === 0) return null;

  return (
<Carousel dots>
  {images.map((image, idx) => {
    const tags = taggedProductsByImage?.[image.id] || [];

    return (
      <div key={image.id}>
        <div
          ref={(el) => (containerRefs.current[idx] = el)}
          style={{
            position: 'relative',
            width: '600px',
            height: '600px',
            borderRadius: '12px',
            overflow: 'hidden',
            margin: '0 auto',
           marginBottom :'12px',
          }}
        >
          <img
            src={image.src}
            alt="게시 이미지"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // 또는 'contain' 도 가능
              display: 'block',
            }}
          />

          {tags.map((tag, tIdx) => (
            <Link key={tIdx} href={`/product/${tag.uid}`} legacyBehavior>
              <Popover
  trigger="hover"
  content={
    <div>
      <p style={{ margin: 0 }}>상품명: {tag.name}</p>
      <p>₩{tag.price?.toLocaleString()}</p>
    </div>
  }
>
  <a
    style={{
      position: 'absolute',
      top: `${tag.y}%`,
      left: `${tag.x}%`,
      backgroundColor: 'white',
      color: 'red',
      padding: '4px 6px',
      fontSize: '12px',
      borderRadius: '8px',
      textDecoration: 'none',
      zIndex: 999,
    }}
  >
    🔗
  </a>
</Popover>

            </Link>
          ))}
        </div>
      </div>
    );
  })}
</Carousel>


  );
};

export default PostImages;
