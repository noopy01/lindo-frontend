import { useSelector,useDispatch } from 'react-redux';
import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import { Tabs, Empty, Row ,Col } from 'antd';
import {
  BookOutlined,

} from '@ant-design/icons';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchLikedPosts, fetchBookmarkedPosts } from '../reducers/user';


export default function BookmarkPage() {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.me);
    const router = useRouter();
  // const savedItems = me?.savedItems || [];
//const likedPosts = useSelector((state) => state.user.likedPosts);
const bookmarkedPosts = useSelector((state) => state.user.bookmarkedPosts);
 
useEffect(() => {
    if (!me?.id) {
      router.push('/login'); // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
    }
  }, [me, router]);

  

useEffect(() => {
    console.log('🧪 me 변화 감지:', me);
    console.log('🧪 bookmarkedPosts:', me?.bookmarkedPosts);
  //  console.log('🧪 likedPosts:', me?.likedPosts);
  }, [me]);

useEffect(() => {
  if (me) {
    dispatch(fetchLikedPosts());
    dispatch(fetchBookmarkedPosts());
  }
}, [dispatch, me]);
  if (!me) {
    return <AppLayout><p>로그인 정보를 불러오는 중입니다...</p></AppLayout>;
  }

   
   if (!me?.id) return null;
const items = [
  {
    key: 'style',
    label: (
      <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <BookOutlined /> 북마크
      </span>
    ),
    children: (
      bookmarkedPosts.length > 0 ? (
        <Row gutter={[16, 16]}>
          {bookmarkedPosts.map((post) => (
            <Col key={post.id} xs={24} sm={12} md={12} lg={6}>
              <PostCard post={post} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="북마크한 게시글이 없습니다." />
      )
    ),
  },
    // {
    //   key: 'item',
    //   label: (
    //     <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
    //       <ShoppingOutlined /> 아이템
    //     </span>
    //   ),
    //   children: (
    //     <div style={{ padding: '20px 0' }}>
    //       {savedItems.length > 0 ? (
    //         <div
    //           style={{
    //             display: 'flex',
    //             flexWrap: 'wrap',
    //             gap: '16px',
    //             justifyContent: 'center',
    //           }}
    //         >
    //           {savedItems.map((item) => (
    //             <div
    //               key={item.id}
    //               style={{
    //                 width: 140,
    //                 borderRadius: '12px',
    //                 boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    //                 overflow: 'hidden',
    //                 textAlign: 'center',
    //                 background: '#fff',
    //               }}
    //             >
    //               <Image
    //                 src={item.imageUrl}
    //                 alt={item.name}
    //                 width={200}
    //                 height={300}
    //                 style={{ width: '100%', height: 140, objectFit: 'cover' }}
    //               />
    //               <p style={{ margin: '10px 0', fontWeight: 500 }}>{item.name}</p>
    //             </div>
    //           ))}
    //         </div>
    //       ) : (
    //         <Empty description="저장한 아이템이 없습니다." />
    //       )}
    //     </div>
    //   ),
    // },
//     {
//       key: 'likes',
//       label: (
//         <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
//           <HeartOutlined /> 좋아요
//         </span>
//       ),
//       children: (
//         <div style={{ padding: '20px 0' }}>
// {likedPosts.length > 0 ? (
//   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
//     {likedPosts.map((post) => (
//       <div key={post.id}>
//         <Link href={`/post/${post.id}` } legacyBehavior>
//           <a>
//             <img
//               src={post.thumbnail || post.Images?.[0]?.src || '/default-thumb.jpg'}
//               alt="썸네일"
//               style={{ width: 200, height: 200, objectFit: 'cover' }}
//             />
//           </a>
//         </Link>
//       </div>
//     ))}
//   </div>
// ) : (
//   <Empty description="좋아요한 게시글이 없습니다." />
// )}


//         </div>
//       ),
//     },
  ];

  return (
    <AppLayout>
      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '30px' }}>
          나의 북마크
        </h2>
        <Tabs defaultActiveKey="style" centered size="large" tabBarGutter={50} items={items} />
      </div>
    </AppLayout>
  );
}
