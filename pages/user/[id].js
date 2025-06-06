import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../reducers/user";
import { loadUserPosts } from "../../reducers/post";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";
import { Card, Avatar, Spin } from "antd";
import Image from "next/image";

const UserPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { me } = useSelector((state) => state.user);
  const posts = useSelector((state) => state.post.posts);
  const [user, setUser] = useState(null);
  const [postsVisible, setPostsVisible] = useState(true);
const postList = user?.posts || [];

  // ✅ 유저 정보 불러오기
  useEffect(() => {
    if (!router.isReady || !id) return;

    dispatch(fetchUserProfile(Number(id)))
      .unwrap()
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        console.error("유저 정보 가져오기 실패:", error);
        setUser(null);
      });
  }, [router.isReady, id]);

  // ✅ 게시글 불러오기
  useEffect(() => {
    if (user?.id) {
      dispatch(loadUserPosts({ id: user.id }))
        .unwrap()
        .then((data) => {
          console.log("✅ 게시글 응답:", data);
        })
        .catch((err) => {
          console.error("❌ 게시글 불러오기 실패:", err);
        });
    }
  }, [user?.id]);

  const handleTogglePosts = () => {
    const toggled = !postsVisible;
    setPostsVisible(toggled);

    if (toggled && posts.length === 0) {
      dispatch(loadUserPosts(user.id));
    }
  };

  const styles = useMemo(() => ({
    cardContainer: { marginTop: "16px" },
    avatar: { backgroundColor: "#87d068" },
    clickableText: { cursor: "pointer", color: "blue" },
    postCard: { marginTop: "16px" },
  }), []);

  if (!user) {
    return (
      <AppLayout>
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <Spin size="large" tip="로딩 중...">
            <div style={{ height: 100 }} />
          </Spin>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
        <Card
          style={styles.cardContainer}
          actions={[
            <div
              key="post"
              style={styles.clickableText}
              onClick={handleTogglePosts}
            >
              게시물<br />{postList.length}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={
              <Link href={`/user/${user.id}`} passHref>
                <Avatar style={styles.avatar} as="a">
                  {user.nickname[0]}
                </Avatar>
              </Link>
            }
            title={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href={`/user/${user.id}`}>
                  <span style={{ color: "inherit" }}>{user.nickname}</span>
                </Link>
              </div>
            }
            description={me?.id === user.id ? "방가방가" : "유저 프로필"}
          />
        </Card>

        {/* 게시물 썸네일 리스트 */}
        {postsVisible && postList.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '16px', justifyContent: "space-between"  }}>
            {postList.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div style={{ width: '200px', height: '200px', position: 'relative' }}>
                  <Image
                    src={post.thumbnail ||"/default-image.png"}
                    alt="썸네일"
                    fill
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default UserPage;
