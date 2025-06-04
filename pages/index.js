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
 // const posts = useSelector((state) => state.post.posts);
  const loading = useSelector((state) => state.post.getPostsLoading);
  const isLoggedIn = !!me?.id;

  const [visiblePosts, setVisiblePosts] = useState([]);
  const [clientLoaded, setClientLoaded] = useState(false);

  // 클라이언트 사이드 렌더링 여부 설정
  useEffect(() => {
    setClientLoaded(true);
  }, []);

  // 게시글 불러오기
  useEffect(() => {
    const fetchData = async () => {
      let userPosts = [];
      let myPosts = [];
      let followingsPosts = [];
      let allPosts = [];
      let combined = [];
      let resultAll = null;

      try {
        if (isLoggedIn) {
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

        // 전체 게시글 불러오기
        resultAll = await dispatch(loadPosts()).unwrap();
        allPosts = Array.isArray(resultAll)
          ? resultAll
          : resultAll?.posts || [];

        const existingIds = new Set(userPosts.map((p) => p.id));
        const newPosts = allPosts.filter((p) => !existingIds.has(p.id));
        combined = [...userPosts, ...newPosts];

        setVisiblePosts(combined);
      } catch (error) {
        console.error("🔥 게시글 불러오기 실패:", error);
      } finally {
        console.log("✅ myPosts:", myPosts);
        console.log("✅ followingsPosts:", followingsPosts);
        console.log("🔍 resultAll:", resultAll);
        console.log("✅ allPosts:", allPosts);
        console.log("✅ combined:", combined);
      }
    };

    fetchData();
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <AppLayout>
        <Content style={{ padding: "20px" }}>
          <Row gutter={[16, 16]} justify="center">
            {clientLoaded ? (
              loading ? (
                <p>불러오는 중...</p>
              ) : visiblePosts.length > 0 ? (
                visiblePosts.map((post) => (
                  <Col span={6} key={post.id}>
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
              )
            ) : null}
          </Row>
        </Content>
      </AppLayout>
    </>
  );
};

export default Home;
