import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Avatar, Button, List, Space, Popover,message } from 'antd';
import {
  BookOutlined,
  HeartOutlined,
  MessageOutlined,
  HeartTwoTone,
  EllipsisOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import PostImages from './PostImages';
import AppLayout from './AppLayout';
import Head from 'next/head';
import FollowButton from './FollowButton';
import {
  likePost,
  removePost,
  unlikePost,
  bookmark,
  unbookmark,
  updatePost,
 
  addPostToMainPosts 
} from '../reducers/post';
//import { removePostOfMe } from '../reducers/user';
import Link from "next/link";

moment.locale('ko');

function PostDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const mainPosts = useSelector((state) => state.post.mainPosts);
  const me = useSelector((state) => state.user.me);
  //const { removePostLoading } = useSelector((state) => state.post);
  const [editMode, setEditMode] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
const [clientReady, setClientReady] = useState(false);
const likedPosts = useSelector((state) => state.user.likedPosts);
 const bookmarkedPosts = useSelector((state) => state.user.bookmarkedPosts);

useEffect(() => {
  setClientReady(true);
}, []);
useEffect(() => {
  if (clientReady && router.isReady && !me) {
    router.push('/login');
  }
}, [clientReady, router.isReady, me, router]);

const post = useMemo(() => {
  if (!id || !me) return null;

  const fromMainPosts = mainPosts?.find((p) => String(p.id) === String(id));
  if (fromMainPosts) return fromMainPosts;

  for (const user of me.Followings || []) {
    const found = user.Posts?.find((p) => String(p.id) === String(id));
    if (found) {
      return {
        ...found,
        User: { id: user.id, nickname: user.nickname },
      };
    }
  }

  return null;
}, [id, mainPosts, me]);
//const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    if (!post) return;
    const alreadyInMain = mainPosts.find((p) => String(p.id) === String(post.id));
    if (!alreadyInMain) {
      dispatch(addPostToMainPosts(post));
    }
  }, [post, mainPosts, dispatch]);

const transformedPost = useMemo(() => {
  if (!post || !Array.isArray(post.images)) return null;

  return {
    ...post,
    images: post.images.map((src, index) => ({
      id: String(index),
      src,
    })),
    taggedProductsByImage: Object.fromEntries(
      (post.taggedProducts || []).map(tp => [String(tp.imageId), tp.tags])
    ),
  };
}, [post]);
//console.log('✅ transformedPost:', transformedPost);
//console.log('✅ transformedPost.images:', transformedPost?.images);



  const onClickUpdate = useCallback(() => setEditMode(true), []);
  const onCancelUpdate = useCallback(() => setEditMode(false), []);

  const onChangePost = useCallback(
    (editText) => {
        if (!post) return;
      dispatch(updatePost({ PostId: post.id, content: editText }));
    },
    [dispatch, post]
  );

  // const isLiked = me?.likedPosts?.some((post) => {
  //   // post가 PostId 필드를 가진 경우
  //   return (post.PostId ?? post.id) === postId;
  // });
  // const isLiked = me?.likedPosts?.some((liked) => {
  //   return (liked.PostId ?? liked.id) === post.id;
  // });
  // const isLiked = me?.likedPosts?.some((liked) => liked &&  liked.id === post.id);

// const isLiked = useMemo(() => {
//   if (!post || !Array.isArray(me?.likedPosts)) return false;
//   return me.likedPosts.some((p) => String(p.id) === String(post.id));
// }, [me, post]);

// const isLiked = useMemo(
//   () => likedPosts.some((p) => String(p.id) === String(post?.id)),
//   [likedPosts, post]
// );

  // const onUnlike = useCallback(() => {
  //   if (!me) return alert('로그인이 필요합니다.');
  //   dispatch(unlikePost(post.id));
  // }, [me, dispatch, post?.id]);

  // const onLike = useCallback(() => {
  //   if (!me) return alert('로그인이 필요합니다.');
  //   if (!post || !post.content) return alert('게시글 정보가 유효하지 않습니다.');
  
  //   if (isLiked) {
  //     dispatch(unlikePost(post.id)) // 해제는 id만 넘겨도 OK
  //       .unwrap()
  //       .then(() => message.success('좋아요에서 제거되었습니다!'))
  //       .catch((err) => {
  //         message.error('좋아요 해제 실패');
  //         console.error(err);
  //       });
  //   } else {
  //       dispatch(likePost(post.id))
  //       .unwrap()
  //       .then(() => message.success('좋아요에 추가되었습니다!'))
  //       .catch((err) => {
  //         message.error('좋아요 실패');
  //         console.error(err);
  //       });
  //   }
  //   console.log("🔥 likePost 요청 postId:", post?.id); 

  // }, [me, dispatch, post,isLiked]);

  //   const isLiked = useMemo(() => {
  //   return likedPosts?.some((p) => String(p.id) === String(post?.id));
  // }, [likedPosts, post?.id]);
const isLiked = useMemo(() => {
  if (!likedPosts || !post) return false;
  return likedPosts.some((p) => String(p.id) === String(post.id));
}, [likedPosts, post]);

  const isBookmarked = useMemo(() => {
    return bookmarkedPosts?.some((p) => String(p.id) === String(post?.id));
  }, [bookmarkedPosts, post?.id]);


useEffect(() => {
  if (post?.likeCount !== undefined) {
    console.log('🧡 useEffect로 likeCount 설정:', post.likeCount);
    setLikeCount(post.likeCount);
  }
}, [post?.likeCount]);

const onLike = useCallback(() => {
  if (!me) return alert('로그인이 필요합니다.');
  if (!post?.content) return alert('게시글 정보가 유효하지 않습니다.');

  const action = isLiked ? unlikePost : likePost;

  dispatch(action(post.id))
    .unwrap()
    .then((res) => {
       console.log('🎯 서버 응답:', res);
   setLikeCount(prev => prev + (isLiked ? -1 : 1)); // 임시 반영
dispatch(action(post.id))
  .unwrap()
  .then(res => setLikeCount(res.likeCount)); // 서버 최종값 동기화

    message.success(isLiked ? '좋아요에서 제거되었습니다!' : '좋아요에 추가되었습니다!');
    })
    .catch((err) => {
      console.error('좋아요 처리 실패:', err);
      message.error('좋아요 처리 실패');
    });
}, [me, post, isLiked, dispatch]);


  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

const onRemovePost = useCallback(
  async (postId) => {
    if (!me) return alert('로그인이 필요합니다.');
    try {
      await dispatch(removePost(postId)).unwrap(); // 💡 unwrap으로 에러 핸들링 확실히
      message.success('게시글이 성공적으로 삭제되었습니다!');
      router.push(`/mypage`); // ✅ 마이페이지로 이동
    } catch (err) {
      console.error('Failed to remove post:', err);
      message.error('게시글 삭제에 실패했습니다.');
    }
  },
  [me, dispatch, router]
);

  
  const onBookMark = useCallback(() => {
    if (!me) return alert('로그인이 필요합니다.');
    if (!post || !post.content) return alert('게시글 정보가 유효하지 않습니다.');
  
    if (isBookmarked) {
      dispatch(unbookmark(post.id)) // 해제는 id만 넘겨도 OK
        .unwrap()
        .then(() => message.success('북마크에서 제거되었습니다!'))
      .catch((err) => {
        console.error('북마크 처리 실패:', err);
        message.error('북마크 처리 실패');
      });
    } else {
      dispatch(bookmark(post.id)) // ✅ postId 넘겨tj thunk가 생성 가능
        .unwrap()
        .then(() => message.success('북마크에 추가되었습니다!'))
        .catch((err) => {
          message.error('북마크 실패');
          console.error(err);
        });
    }
  }, [me, dispatch, post, isBookmarked]);
  
  // if (!router.isReady) {
  //   return null; // or <LoadingSpinner />
  // }
  
  // if (!post) return <p>게시물을 찾을 수 없습니다.</p>;
 // console.log('likedPosts:', me?.likedPosts);
  console.log('isLiked:', isLiked);
  console.log('likedPosts:',likedPosts);
    console.log('isLiked:', isBookmarked);
  console.log('likedPosts:',bookmarkedPosts);
  console.log('post.id:', post?.id);

 if (!clientReady || !router.isReady) {
  return null; // ✅ 조건문은 훅 호출 이후에 위치해야 안전
}
console.log('📌 현재 post:', post);
//console.log('🔍 post.user:', post.user);
console.log('🧡 현재 post.likeCount:', post?.likeCount);
console.log('🟢 현재 likeCount state:', likeCount);
console.log('🧪 isLiked 상태:', isLiked);
if (!post || !likedPosts) return null;

//console.log("📌 taggedProducts:", post.taggedProducts);
if (!post) return <p>게시물을 찾을 수 없습니다.</p>;
  return (
    <>
      <Head>
        <title>상세 게시물</title>
      </Head>
      <AppLayout>
        <div style={{ margin: '20px auto', maxWidth: '600px' }}>
<Card
  actions={[
    isBookmarked ? (
      <BookOutlined key="bookmark" style={{ color: '#1890ff' }} onClick={onBookMark} />
    ) : (
      <BookOutlined key="bookmark" onClick={onBookMark} />
    ),
isLiked ? (
  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <HeartTwoTone twoToneColor="#eb2f96" onClick={onLike} />
    <span>{typeof likeCount === 'number' ? likeCount : 0}</span>
  </span>
) : (
  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <HeartOutlined onClick={onLike} />
    <span>{typeof likeCount === 'number' ? likeCount : 0}</span>

  </span>
),

    <MessageOutlined key="comment" onClick={onToggleComment} />,
    <Popover
      key="more"
      content={
        <Space>
          {String(post?.user?.id) === String(me?.id) ? (
            <>
              {!post.BookMarkId && <Button onClick={onClickUpdate}>수정</Button>}
              
              <Button danger onClick={() => onRemovePost(post.id)}>
                삭제
              </Button>
            </>
          ) : (
            <Button>신고</Button>
          )}
        </Space>
      }
    >
      <EllipsisOutlined />
    </Popover>,
  ]}
  title={post.BookMarkId ? `${post.user?.nickname}님이 북마크하셨습니다.` : null}
  extra={<FollowButton userId={post.user.id} />}
  
>
  
  {/* ✅ 이미지 렌더링은 카드 내부로 이동 */}
 {transformedPost?.images?.length > 0 ? (
    <PostImages
      // images={post.Images}
      // taggedProductsByImage={post.taggedProductsByImage}
       images={transformedPost.images}
  taggedProductsByImage={transformedPost.taggedProductsByImage}
   
  />
  ) : post?.images?.length > 0 ? (
    <img
      src={post.images[0]}
      alt="썸네일"
      style={{
        width: 'auto',
        height: 'auto',
        objectFit: 'cover',
        borderRadius: '12px',
        display: 'block',
        marginBottom: '16px',
      }}
    />
  ) : null}

  {/* ✅ 작성자 및 본문 */}
  {post.user && (
    <Card.Meta
      avatar={
        <Link href={`/user/${post.user.id}`}>
          <Avatar style={{ cursor: 'pointer' }}>
            {post.user?.nickname?.[0] || 'U'}
          </Avatar>
        </Link>
      }
      title={
        <Link href={`/user/${post.user.id}`}>
          <span style={{ cursor: 'pointer', color: 'inherit' }}>
            {post.user?.nickname || '알 수 없는 사용자'}
          </span>
        </Link>
      }
      description={
        <>
          <PostCardContent
            postId={post.id}
            postData={post.content}
            editMode={editMode}
            onChangePost={onChangePost}
            onCancelUpdate={onCancelUpdate}
          />
          <p style={{ marginTop: 10, color: '#888' }}>
            {post.createdAt ? moment(post.createdAt).format('YYYY.MM.DD') : ''}
          </p>
        </>
      }
    />
  )}
</Card>

   
          {commentFormOpened && (
  <div style={{ marginTop: '20px' }}>
    {/* 댓글 개수 or "댓글 없음" 메시지 */}
    <div style={{ marginBottom: '12px' }}>
    {post?.comments?.length === 0 ? (
      <p style={{ color: '#999' }}>댓글이 없습니다.</p>
    ) : (
      <p style={{ fontWeight: 'bold' }}>{post?.comments?.length || 0}개의 댓글</p>
    )}

    </div>

    {/* 댓글 입력창 */}
    <CommentForm post={post} />

    {/* 댓글 목록 */}
    {post.comments?.length > 0 && (
      <List
        itemLayout="horizontal"
        dataSource={post.comments}
        renderItem={(item) => (
          <li key={item.commentId}>
            <Space>
              <Avatar>{item.user?.nickname?.[0] || 'U'}</Avatar>
              <strong>{item.user?.nickname || '알 수 없는 사용자'}</strong>
              <p>{item.commentContent}</p>
            </Space>
          </li>
        )}
      />
    )}
  </div>
)}
        </div>
      </AppLayout>
    </>
  );
}

export default PostDetail;
