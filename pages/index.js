import Head from "next/head";
import { useDispatch, useSelector} from "react-redux";
import { useEffect, useState,useCallback  } from "react";
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
  const [lastFetchedPostId, setLastFetchedPostId] = useState(null);


  // 클라이언트 렌더링 여부
  useEffect(() => {
    setClientLoaded(true);
  }, []);



// 게시글 불러오기
const fetchMorePosts = useCallback(async () => {
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

    // 🔄 더 이상 getLastPostId() 사용 X
    const resultAll = await dispatch(loadPosts(lastFetchedPostId)).unwrap();

    const newPosts = Array.isArray(resultAll)
      ? resultAll
      : resultAll?.posts || [];

    const lastPostInResponse = newPosts.at(-1);

    // 중복된 응답 방지
    if (lastFetchedPostId !== null && lastPostInResponse?.id === lastFetchedPostId) {
      console.warn("🛑 중복된 lastId 응답: 서버 정렬 또는 조건 확인 필요");
      setHasNext(false);
      return;
    }

    // 📌 다음 요청을 위한 lastPostId 업데이트
    setLastFetchedPostId(lastPostInResponse?.id ?? null);
    console.log("🆕 새로운 마지막 postId 저장:", lastPostInResponse?.id);

    // hasNext 갱신
    setHasNext(
      newPosts.length === 0
        ? false
        : resultAll && typeof resultAll.hasNext === "boolean"
        ? resultAll.hasNext
        : true
    );

    // visiblePosts에 누적 추가 (중복 제거)
    const allCombined = [...userPosts, ...newPosts];
    const uniquePostMap = new Map();
    [...visiblePosts, ...allCombined].forEach((post) => {
      uniquePostMap.set(post.id, post);
    });

    setVisiblePosts(Array.from(uniquePostMap.values()));
    console.log("📋 누적된 visiblePosts 수:", visiblePosts.length);
    

    console.log("📦 응답된 posts 길이:", newPosts.length);
    console.log("🧭 마지막 응답 postId:", newPosts.at(-1)?.id);
console.log("🧩 최종 visiblePosts:", visiblePosts.map((p) => p.id));
console.log("🆕 새로운 마지막 postId 저장:", lastPostInResponse?.id);
  } catch (error) {
    console.error("🔥 게시글 불러오기 실패:", error);
  } finally {
    setIsFetching(false);
  }
}, [dispatch, visiblePosts, isLoggedIn, hasNext, isFetching, lastFetchedPostId, me]);

  // 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = document.documentElement.clientHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollY + viewportHeight >= fullHeight - 300) {
        fetchMorePosts(); // 여기서 최신 상태의 fetchMorePosts가 필요
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMorePosts]);


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
