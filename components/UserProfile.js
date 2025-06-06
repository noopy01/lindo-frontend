import { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Card, Avatar, Button, Modal,Affix ,Row, Col } from "antd";
import FollowList from "./FollowList";
import FollowingList from "./FollowingList";
import  LoginForm from "../components/LoginForm";
import {logOut,setLogOutLoading,fetchUserProfile,loadMyInfo,loadFollowers,loadFollowings} from "../reducers/user";
import Link from "next/link";
//import Image from "next/image";
import { UploadOutlined } from "@ant-design/icons";
import Router from "next/router";
//import { loadUserPosts } from "../reducers/post";

const UserProfile = ({ userId: propUserId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { me, profileUser  } = useSelector((state) => state.user);
  const [userId, setUserId] = useState(null);
  //const posts = useSelector((state) => state.post.posts);
 // const user = me.id === userId ? me : profileUser;
// const posts = profileUser?.posts || [];


  const followingsList = useSelector((state) => state.user.followingsList);
  const followersList = useSelector((state) => state.user.followersList);
//   const followersCount = followersList.length;
//  const followingsCount = followingsList.length;

//const isMyProfile = me?.id === userId;
 const isMyProfile = useMemo(() => {
    if (!me || !userId) return false;
    return me.id === userId;
  }, [me, userId]);
const user = isMyProfile ? me : profileUser;
//const posts = isMyProfile ? [] : (profileUser?.posts || []); // 수정
//const [posts, setPosts] = useState([]);

//  const followingsCount = useMemo(() => {
//   return user?.followingsCount ?? user?.Followings?.length ?? followingsList?.length ?? 0;
// }, [user, followingsList]);

// useEffect(() => {
//   console.log("🧾 followerList 확인:", followersList);
// }, [followingsList]);
 
// const followersCount = useMemo(() => {
//   return user?.followersCount ?? user?.Followers?.length ??followersList?.length ?? 0 ;
// }, [user, followersList]);

// useEffect(() => {
//   console.log("🧾 followingsList 확인:", followingsList);
// }, [followingsList]);

const filteredFollowings = useMemo(() => {
  return followingsList.filter(user => user.id !== me?.id);
}, [followingsList, me?.id]);

const filteredFollowers = useMemo(() => {
  return followersList.filter(user => user.id !== me?.id);
}, [followersList, me?.id]);



//  const [viewedUser, setViewedUser] = useState(null);
  const [postsVisible, setPostsVisible] = useState(true);
  const [followerModalVisible, setFollowerModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);
  const logOutLoading = useSelector((state) => state.user.logOutLoading);

  useEffect(() => {
    if (!me) {
      dispatch(loadMyInfo());
    }
  }, [me, dispatch]);

  // userId 설정 (router or props)
useEffect(() => {
  if (profileUser) {
    // console.log('🐛 profileUser:', profileUser);
    // console.log('🖼️ posts:', profileUser.posts);
  }
}, [profileUser]);
//const posts = isMyProfile ? me?.posts || [] : profileUser?.posts || [];
const posts = profileUser?.posts || [];
 
// console.log('📌 postsVisible:', postsVisible);
// console.log('📌 posts.length:', posts.length);
// console.log("🔥 최종 렌더링할 posts:", posts);
//console.log("🖼️ 썸네일:", posts.map(p => p.thumbnail));

  //console.log("🖼️ posts:", posts);
  if (me && Array.isArray(me.Followings)) {
    console.log(me.Followings.length); // 안전하게 접근
  }
  useEffect(() => {
  if (!userId) {
    if (propUserId) {
      setUserId(propUserId);
    } else if (router.isReady && router.query.id) {
      const id = parseInt(router.query.id, 10);
      if (!isNaN(id)) setUserId(id);
    } else if (me?.id) {
      setUserId(me.id);
    }
  }
}, [userId, propUserId, router.isReady, router.query.id, me]);

  
  
//fetchUserProfile
useEffect(() => {
  if (userId && router.isReady) {
    //console.log("✅ fetchUserProfile 실행:", userId);
    dispatch(fetchUserProfile(userId));
   console.log('🧪 useEffect 내부:', { userId, isReady: router.isReady });

  }
}, [userId, router.isReady]);

// useEffect(() => {
//   console.log("🎯 profileUser 업데이트됨:", profileUser);
//   console.log("🧮 게시글 수:", profileUser?.posts?.length);
// }, [profileUser]);

// useEffect(() => {
//   console.log("🧪 현재 userId:", userId);
// }, [userId]);

  
  // const handleTogglePosts = () => {
  //   const toggled = !postsVisible;
  //   setPostsVisible(toggled);
  
  //   if (toggled && posts.length === 0) {
  //     dispatch(loadUserPosts({ id: user.id }));
  //   }
  // };
  const handleTogglePosts = () => {
    setPostsVisible((prev) => !prev);
  };
  
  const onLogOut = useCallback(async () => {
    dispatch(setLogOutLoading(true)); // ✅ 로그아웃 로딩 시작
    await dispatch(logOut()); // ✅ Redux에서 로그아웃 요청
    router.push("/"); // ✅ 로그아웃 후 홈 화면으로 이동
  }, [dispatch, router]);
  
  const styles = useMemo(
    () => ({
      cardContainer: { marginTop: "16px" },
      button: { marginTop: "16px" },
      avatar: { backgroundColor: "#87d068" },
      clickableText: { cursor: "pointer", color: "blue" },
    }),
    []
  );

  useEffect(() => {
    if (followerModalVisible) {
      dispatch(loadFollowers());
    }
  }, [followerModalVisible, dispatch]);

  useEffect(() => {
    if (followingModalVisible) {
      dispatch(loadFollowings());
    }
  }, [followingModalVisible, dispatch]);

  // const isMyProfile = useMemo(() => {
  //   if (!me || !userId) return false;
  //   return me.id === userId;
  // }, [me, userId]);
    
  if (!me) return <LoginForm />;
  if (!user) return null;
  //console.log("🔥 현재 게시글 목록:", posts);
console.log("🔥 user 객체 확인:", user);

  // posts.forEach((post, i) => {
  //  console.log(`[${i}] post.id:`, post.id, "| typeof:", typeof post.id);
  // });
  return (
    <>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 16px" }}>
      <Card
        style={styles.cardContainer}
        actions={
          isMyProfile
            ? [
              <div
              key="post"
              style={styles.clickableText}
              onClick={handleTogglePosts}
            >
          게시물<br />{posts.length}
          </div>,
                          <div
            key="follower"
            style={styles.clickableText}
            onClick={() => setFollowerModalVisible(true)}
          >
            팔로워<br />
              {followerModalVisible ? filteredFollowers.length : user.followersCount}
          </div>,
<div
  key="following"
  style={styles.clickableText}
  onClick={() => setFollowingModalVisible(true)}
>
  팔로잉<br />
  {/* {
    user?.followingsCount ??
    user?.Followings?.length ??
    followingsList?.length ?? 0
  } */}
    {followingModalVisible ? filteredFollowings.length : user.followingsCount}
</div>


              ]
            : [
              <div
                key="post"
                style={styles.clickableText}
                onClick={handleTogglePosts}
              >
                게시물<br />{posts.length}
              </div>,
                <div key="closet">
                  <Link href={`/closet/${user.id}`}>
                    <span style={styles.clickableText}>옷장<br />보기</span>
                  </Link>
                </div>,
              ]
        }
      >
        <Card.Meta
          avatar={
            <Link href={`/user/${user.id}`} passHref>
              <Avatar style={styles.avatar} as="a">
                {user?.nickname?.[0] || "U"}
              </Avatar>
            </Link>
          }
          title={
            <Link href={`/user/${user.id}`}>
              <span style={{ color: "inherit" }}>{user?.nickname || "Unknown"}</span>
            </Link>
          }
          description={isMyProfile ? "방가방가" : "유저 프로필"}
        />

        {isMyProfile && (
          <>
          <Button
            onClick={onLogOut}
            type="primary"
            loading={logOutLoading}
            style={styles.button}
          >
            로그아웃
          </Button>
          <div style={{ textAlign: "center", marginLeft: "10px" }}>
<Affix offsetTop={0}>
  <div style={{ background: '#fff', padding: '8px 16px', display: 'flex', justifyContent: 'flex-end' }}>
    <Button icon={<UploadOutlined />} onClick={() => Router.push('/postupload')}> 게시글 업로드</Button>
  </div>
</Affix>

          </div>
          </>
        )}
      </Card>

{(postsVisible || isMyProfile) && (
  <div style={{ marginTop: "16px" }}>
    {posts.length === 0 ? (
      <p style={{ padding: "16px", color: "#888" }}>게시글이 없습니다.</p>
    ) : (
<Row gutter={[16, 16]}>
  {posts.map((post) => (
    <Col key={post.id} xs={12} sm={8} md={6}>
      <Link href={`/post/${post.id}`} legacyBehavior>
        <a
          style={{
            display: "block",
            position: "relative",
            width: "100%",
            paddingTop: "100%", // ✅ 정사각형 비율 유지
            background: "#f5f5f5",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <img
            src={post.thumbnail || "/default-image.png"}
            alt="post thumbnail"
              onError={(e) => {
    e.target.src = "/default-image.png";
  }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain", // ✅ 이미지 전체 보이기
            }}
          />
        </a>
      </Link>
    </Col>
  ))}
</Row>


    )}
  </div>
)}

<Modal
  title="팔로잉 목록"
  open={followingModalVisible}
  footer={null}
  onCancel={() => setFollowingModalVisible(false)}
>
<FollowingList
  header="팔로잉"
  data={filteredFollowings}
  totalCount={filteredFollowings.length}
/></Modal>

<Modal
  title="팔로워 목록"
  open={followerModalVisible}
  footer={null}
  onCancel={() => setFollowerModalVisible(false)}
>
<FollowList
  header="팔로워"
    data={filteredFollowers}
    totalCount={filteredFollowers.length}
/></Modal>
</div>
    </>
  );
};

export default UserProfile;
