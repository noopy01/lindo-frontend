

/*import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Row, Col, Layout, Card, Modal } from "antd";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import FilterPanel from "../components/FilterPanel";
import { loadMyInfo, loadFollowings, fetchUserProfile } from "../reducers/user";

const { Content } = Layout;

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [clientLoaded, setClientLoaded] = useState(false);
  const loading = useSelector((state) => state.post.getPostsLoading);

  const [filters, setFilters] = useState({
    gender: [],
    season: [],
    style: [],
  });

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const current = prev[type];
      const exists = current.includes(value);
      const updated = exists ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  useEffect(() => {
    if (!me?.id) return;

    const fetchFollowingsPosts = async () => {
      try {
        await dispatch(loadMyInfo()).unwrap();
        const result = await dispatch(loadFollowings()).unwrap();
        const followingIds = result.users.map((user) => user.id);

        const postsArray = await Promise.all(
          followingIds.map((id) =>
            dispatch(fetchUserProfile(id))
              .unwrap()
              .catch(() => ({ posts: [] }))
          )
        );

        const followingsPosts = postsArray.flatMap((res) => res.posts);
        const myPosts = me?.Posts || [];

        const combinedPosts = [...myPosts, ...followingsPosts].map((post) => {
          const user = post.user || post.User;
          return {
            ...post,
            User: user || { id: 0, nickname: "팔로잉 유저" },
          };
        });

        setVisiblePosts(combinedPosts);
      } catch (error) {
        console.error("🔥 팔로잉 게시글 불러오기 실패:", error);
      }
    };

    fetchFollowingsPosts();
  }, [dispatch, me?.id]);

  const filteredPosts = visiblePosts.filter((post) => {
    const genderMatch = filters.gender.length === 0 || filters.gender.includes(post.gender);
    const seasonMatch = filters.season.length === 0 || filters.season.includes(post.season);
    const styleMatch = filters.style.length === 0 || filters.style.includes(post.style);
    return genderMatch && seasonMatch && styleMatch;
  });

  return (
    <>
      <Head><title>Home</title></Head>
      <AppLayout>
        <Content style={{ padding: "20px" }}>
          <FilterPanel
            filters={filters}
            toggleFilter={toggleFilter}
            setFilterModalVisible={setFilterModalVisible}
          />

          <Modal
            title="더 많은 필터"
            open={filterModalVisible}
            onCancel={() => setFilterModalVisible(false)}
            onOk={() => setFilterModalVisible(false)}
          >
            <p>여기에 색상, 브랜드, 가격 필터를 확장 가능</p>
          </Modal>

          <Row gutter={[16, 16]} justify="center">
            {clientLoaded ? (
              loading ? (
                <p>불러오는 중...</p>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Col span={6} key={post.id}>
                    <Card hoverable style={{ borderRadius: 12 }}>
                      <PostCard post={post} />
                    </Card>
                  </Col>
                ))
              ) : (
                <p>필터에 해당하는 게시글이 없습니다.</p>
              )
            ) : null}
          </Row>
        </Content>
      </AppLayout>
    </>
  );
};

export default Home;*/


import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Row, Col, Layout, Card } from "antd";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import { loadMyInfo , loadFollowings, fetchUserProfile } from "../reducers/user"; 
const { Content } = Layout;


const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const isLoggedIn = !!me?.id;
const posts = useSelector((state) => state.post.posts);
const [clientLoaded, setClientLoaded] = useState(false);
const loading = useSelector((state) => state.post.getPostsLoading);

useEffect(() => {
  setClientLoaded(true);
}, []);
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchFollowingsPosts = async () => {
      try {
        // 1. 내 정보 먼저 요청
        await dispatch(loadMyInfo()).unwrap();

        // 2. 팔로잉 목록 가져오기
        const result = await dispatch(loadFollowings()).unwrap();
        const followingIds = result.users.map((user) => user.id);
 console.log("🔥 followings IDs:", followingIds);
        // 3. 각 팔로잉 유저의 게시글 병렬 요청
    const postsArray = await Promise.all(
      followingIds.map((id) =>
        dispatch(fetchUserProfile(id))
          .unwrap()
          .catch((err) => {
            console.error(`❌ fetchUserProfile실패 (id=${id}):`, err);
            return { posts: [] }; // 실패 시 빈 posts 반환
          })
      )
    );

    console.log("📦 postsArray:", postsArray);

        // 4. 게시글 하나로 합치기
        const followingsPosts = postsArray.flatMap((res) => res.posts);

        // 5. 내 게시글도 함께 포함
        const myPosts = me?.Posts || [];

const combinedPosts = [...myPosts, ...followingsPosts].map((post) => {
  const user = post.user || post.User; // 기존 사용자 정보 우선
  return {
    ...post,
    User: user || { id: 0, nickname: "팔로잉 유저" },
  };
});


        setVisiblePosts(combinedPosts);
      } catch (error) {
        console.error("🔥 팔로잉 게시글 불러오기 실패:", error);
      }
    };

    fetchFollowingsPosts();
  }, [dispatch, isLoggedIn]);
console.log('🖼️ 썸네일:', posts.map(p => p.thumbnail));
if (me) {
  console.log("✅ me.Posts:", me.Posts);
  console.log("✅ me.Followings:", me.Followings);
} else {
  console.log("⚠️ me is null or undefined");
}


  console.log("📄 visiblePosts:", visiblePosts);

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


