import PropTypes from "prop-types";
import { useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadFollowings, follow, unfollow, loadMyInfo } from "../reducers/user";
import { Button, Card, List, Avatar } from "antd";
import Link from "next/link";

const FollowingList = ({ header, data = [], totalCount = 0 }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(data.length);

  // 🔁 팔로우 상태를 userId별로 저장 (true = 팔로우 중)
  const [followStatus, setFollowStatus] = useState(
    () =>
      data.reduce((acc, user) => {
        if (user?.id) acc[user.id] = true;
        return acc;
      }, {})
  );

  useEffect(() => {
    setFollowStatus(
      data.reduce((acc, user) => {
        if (user?.id) acc[user.id] = true;
        return acc;
      }, {})
    );
  }, [data]);

  // ✅ 팔로우/언팔로우 토글
const onFollowToggle = async (id) => {
  const userId = id; // ⬅ 지역 변수로 보존
  console.log("📌 onFollowToggle 호출됨, userId:", userId);
  if (!userId) {
    console.error("❌ 유효하지 않은 userId:", userId);
    return;
  }

  const isCurrentlyFollowing = followStatus[userId];

  try {
    if (isCurrentlyFollowing) {
      await dispatch(unfollow(userId)).unwrap();
    } else {
      await dispatch(follow(userId)).unwrap();
      await dispatch(loadMyInfo()).unwrap();
    }

    setFollowStatus((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  } catch (error) {
    console.error("❌ 팔로우 토글 실패:", error, "🔁 대상 userId:", userId); // 이젠 OK
  }
};

  // 🔄 더 보기 버튼 클릭
  const handleLoadMore = async () => {
    if (loading || data.length >= totalCount) return;
    setLoading(true);
    try {
      const res = await dispatch(loadFollowings({ offset })).unwrap();
      const newUsers = res.users || [];
      setOffset((prev) => prev + newUsers.length);
    } catch (e) {
      console.error("🚨 loadFollowings 실패:", e);
    }
    setLoading(false);
  };

  const styles = useMemo(
    () => ({
      list: { marginBottom: 20 },
      loadMore: { textAlign: "center", margin: "10px 0" },
      listItem: { marginTop: 20 },
    }),
    []
  );

  const loadMoreButton = useMemo(
    () =>
      data.length < totalCount ? (
        <div style={styles.loadMore}>
          <Button loading={loading} onClick={handleLoadMore}>
            더 보기
          </Button>
        </div>
      ) : null,
    [loading, data.length, totalCount]
  );

  return (
    <List
      style={styles.list}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>{header}</div>}
      bordered
      dataSource={data}
      loadMore={loadMoreButton}
      renderItem={(item) => {
        const userId = item.id;
        const isFollowing = followStatus[userId];

        if (!userId) {
          console.warn("❗ 유효하지 않은 item:", item);
          return null;
        }

        return (
          <List.Item style={styles.listItem} key={userId}>
            <Link href={`/user/${userId}`}>
              <Card
                hoverable
                onClick={(e) => e.stopPropagation()}
                actions={[
                  <Button
                    key="follow-button"
                    type={isFollowing ? "primary" : "default"}
                    danger={isFollowing}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onFollowToggle(userId);
                    }}
                  >
                    {isFollowing ? "언팔로우" : "팔로우"}
                  </Button>,
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: '#87d068' }}>
                      {item.nickname?.[0] || '?'}
                    </Avatar>
                  }
                  title={item.nickname}
                />

              </Card>
            </Link>
          </List.Item>
        );
      }}
    />
  );
};

FollowingList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default FollowingList;


/*
import PropTypes from "prop-types";
import { StopOutlined } from "@ant-design/icons";
import { useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadFollowings, follow, unfollow,loadMyInfo } from "../reducers/user";
import { Button, Card, List, Avatar, Skeleton, Divider } from "antd";

import Link from 'next/link';
const FollowingList = ({ header, data = [], totalCount = 0 }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(data.length);

  // followStatus를 유저 ID별로 true/false로 저장
  const [followStatus, setFollowStatus] = useState(
    data.reduce((acc, user) => {
      acc[user.id] = true; // 기본은 "팔로우 중" 상태
      return acc;
    }, {})
  );

  useEffect(() => {
    // data가 바뀌면 followStatus도 동기화
    setFollowStatus(
      data.reduce((acc, user) => {
        acc[user.id] = true;
        return acc;
      }, {})
    );
  }, [data]);

  // 팔로우/언팔로우 토글
const onFollowToggle = async (id) => {
  const isCurrentlyFollowing = followStatus[id];
  console.log("🧩 현재 팔로우 상태:", isCurrentlyFollowing); // ✅ 현재 상태

  try {
    if (isCurrentlyFollowing) {
      console.log("🔁 언팔로우 요청:", id);
      await dispatch(unfollow(id)).unwrap();
    } else {
      console.log("🔁 팔로우 요청:", id);
      await dispatch(follow(id)).unwrap();

      console.log("🔄 loadMyInfo()로 me 갱신 중...");
      await dispatch(loadMyInfo()).unwrap();
    }

    setFollowStatus((prev) => {
      const updated = {
        ...prev,
        [id]: !prev[id],
      };
      console.log("✅ 토글된 followStatus 상태:", updated); // ✅ 변경된 followStatus 출력
      return updated;
    });
  } catch (error) {
    console.error("❌ 팔로우 토글 실패:", error);
  }
};


  // 더 보기 버튼
const handleLoadMore = async () => {
  if (loading || data.length >= totalCount) return;
  setLoading(true);
  try {
    const res = await dispatch(loadFollowings({ offset })).unwrap();
    const newUsers = res.users || [];
    setOffset((prev) => prev + newUsers.length);
  } catch (e) {
    console.error("🚨 loadFollowings 실패:", e);
  }
  setLoading(false);
};


  const styles = useMemo(
    () => ({
      list: { marginBottom: 20 },
      loadMore: { textAlign: "center", margin: "10px 0" },
      listItem: { marginTop: 20 },
    }),
    []
  );

  const loadMoreButton = useMemo(
    () =>
      data.length < totalCount ? (
        <div style={styles.loadMore}>
          <Button loading={loading} onClick={handleLoadMore}>
            더 보기
          </Button>
        </div>
      ) : null,
    [loading, data.length, totalCount]
  );

  return (
       <List
             style={styles.list}
             grid={{ gutter: 4, xs: 2, md: 3 }}
             size="small"
             header={<div>{header}</div>}
             bordered
            // dataSource={loadedData}
            dataSource={data} 
            renderItem={(item) => (
               <List.Item style={styles.listItem} key={item.id}>
                 <Link href={`/user/${item.id}`}>
                   <Card
                     hoverable
                     onClick={(e) => e.stopPropagation()}
                     actions={[
                       <Button
                         key="follow-button"
                         type={followStatus[item.id] ? "primary" : "default"}
                         danger={followStatus[item.id]}
                         onClick={(e) => {
                           e.preventDefault(); // 링크 이동 방지
                           e.stopPropagation(); // 카드 클릭도 막기
                           onFollowToggle(item.id);
                         }}
                       >
                         {followStatus[item.id] ? "언팔로우" : "팔로우"}
                       </Button>,
                     ]}
                   >
                     <Card.Meta
                       avatar={<Avatar src={`https://i.pravatar.cc/150?u=${item.id}`} />}
                       title={item.nickname}
                     />
                   </Card>
                 </Link>
               </List.Item>
             )}
           />
  );
};


FollowingList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default FollowingList;
*/