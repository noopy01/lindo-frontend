import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { loadHashtagPosts } from '../../reducers/post';
import Image from 'next/image';
import Link from 'next/link';

const HashtagPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { hashtag } = router.query;
  const { posts, loading } = useSelector((state) => state.post);
  console.log('🔥 현재 해시태그:', hashtag);
  console.log('📦 현재 posts:', posts);
  
  useEffect(() => {
    if (hashtag) {
      dispatch(loadHashtagPosts({ hashtag }));
    }
  }, [hashtag]);

  return (
    <div style={{ padding: 20 }}>
      <h2>#{decodeURIComponent(hashtag)} 관련 게시글</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : !posts || posts.length === 0 ? (
        <p>게시글이 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <div style={{ width: 200, height: 200, overflow: 'hidden', borderRadius: 8 }}>
                <Image
                  src={post.Images?.[0]?.src || '/default-image.png'}
                  alt="게시물 썸네일"
                  width={200}
                  height={200}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HashtagPage;
