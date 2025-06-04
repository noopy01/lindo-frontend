import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Row, Col, Layout, Card } from "antd";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import {
  loadMyInfo,
  loadFollowings,
  fetchUserProfile,
} from "../reducers/user";
import { loadPosts } from "../reducers/post";

const { Content } = Layout;

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const isLoggedIn = !!me?.id;

  const [visiblePosts, setVisiblePosts] = useState([]);
  const [clientLoaded, setClientLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  // 클라이언트 렌더링 여부
  useEffect(() => {
    setClientLoaded(true);
  }, []);

  // 마지막 게시글 ID 구하기
  const getLastPostId = () => {
    if (visiblePosts.length === 0) return null;
    return visiblePosts[visiblePosts.length - 1].id;
  };

  // 게시글 불러오기
const fetchMorePosts = async () => {
  if (isFetching || !hasNext) return;
  setIsFetching(true);

  try {
    let userPosts = [];
    let myPosts = [];
    let followingsPosts = [];

    if (isLoggedIn && visiblePosts.length === 0) {
      await dispatch(loadMyInfo()).unwrap();
      const result = await dispatch(loadFollowings()).unwrap();
      const followingIds = result.users.map((user) => user.id);

      const postsArray = await Promise.all(
        followingIds.map((id) =>
          dispatch(fetchUserProfile(id))
            .unwrap()
            .catch((err) => {
              console.error(`❌ fetchUserProfile 실패 (id=${id}):`, err);
              return { posts: [] };
            })
        )
      );

      followingsPosts = postsArray.flatMap((res) => res.posts);
      myPosts = me?.Posts || [];

      userPosts = [...myPosts, ...followingsPosts].map((post) => {
        const user = post.user || post.User;
        return {
          ...post,
          User: user || { id: 0, nickname: "팔로잉 유저" },
        };
      });
    }


const lastId = getLastPostId();

const resultAll = await dispatch(loadPosts(lastId)).unwrap();
const newPosts = Array.isArray(resultAll)
  ? resultAll
  : resultAll?.posts || [];
console.log("📩 요청한 lastId:", lastId);
const lastPostInResponse = newPosts.at(-1);
const reachedEnd = !lastPostInResponse || lastPostInResponse.id >= lastId;

setHasNext(
  reachedEnd
    ? false
    : resultAll && typeof resultAll.hasNext === "boolean"
    ? resultAll.hasNext
    : false
);


    const allCombined = [...userPosts, ...newPosts];
   
   const uniquePostMap = new Map();
[...visiblePosts, ...allCombined].forEach((post) => {
  uniquePostMap.set(post.id, post);
});
console.log("📦 응답된 posts 길이:", newPosts.length);
console.log("🧭 마지막 응답 postId:", newPosts.at(-1)?.id);

setVisiblePosts(Array.from(uniquePostMap.values()));
console.log("🔍 resultAll.hasNext 값:", resultAll?.hasNext);
//setHasNext(resultAll?.hasNext === undefined ? false : resultAll.hasNext);
  } catch (error) {
    console.error("🔥 게시글 불러오기 실패:", error);
  } finally {
    setIsFetching(false);
  }
};


  // 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = document.documentElement.clientHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollY + viewportHeight >= fullHeight - 300) {
        fetchMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visiblePosts, isFetching, hasNext]);

  // 초기 로딩
  useEffect(() => {
    if (clientLoaded && visiblePosts.length === 0) {
      fetchMorePosts();
    }
  }, [clientLoaded]);
useEffect(() => {
  console.log("✅ hasNext 상태:", hasNext);
}, [hasNext]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <AppLayout>
        <Content style={{ padding: "20px" }}>
          <Row gutter={[16, 16]} justify="center">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <Col span={6} key={`${post.id}`}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "12px",
                      textAlign: "center",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <PostCard post={post} />
                  </Card>
                </Col>
              ))
            ) : (
              <p>게시글이 없습니다.</p>
            )}
          </Row>
          {isFetching && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              불러오는 중...
            </p>
          )}
{!hasNext && visiblePosts.length > 0 && (
  <p style={{ textAlign: "center", marginTop: "20px" }}>
    모든 게시글을 불러왔습니다.
  </p>
)}


        </Content>
      </AppLayout>
    </>
  );
};

export default Home;
