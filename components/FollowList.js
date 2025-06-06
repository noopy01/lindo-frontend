import { Button, Card, List, Avatar } from "antd";
import PropTypes from "prop-types";
import { useMemo, useState, useEffect } from "react";
//import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { loadFollowers, follow, unfollow } from '../reducers/user';

const FollowList = ({ header, data = [], totalCount = 0 }) => {
  const dispatch = useDispatch();

  const [loadedData, setLoadedData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(data.length);

  // follow 상태 관리
  const [followStatus, setFollowStatus] = useState(
    () => data.reduce((acc, user) => {
      if (user?.id) acc[user.id] = true;
      return acc;
    }, {})
  );

useEffect(() => {
  setFollowStatus(
    loadedData.reduce((acc, user) => {
      if (user?.id) acc[user.id] = true;
      return acc;
    }, {})
  );
}, [loadedData]);



  const onFollowToggle = async (id) => {
    const isCurrentlyFollowing = followStatus[id];
    try {
      if (isCurrentlyFollowing) {
        await dispatch(unfollow(id)).unwrap();
      } else {
        await dispatch(follow(id)).unwrap();
      }
      setFollowStatus((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (err) {
      console.error("❌ 팔로우 토글 실패:", err);
    }
  };

  // const loadMoreData = () => {
  //   if (loading || loadedData.length >= totalCount) return;
  //   setLoading(true);

  //   dispatch(loadFollowers({ offset: loadedData.length }))
  //     .then((res) => {
  //       const users = res.payload?.users;
  //       if (Array.isArray(users)) {
  //         const newCombined = [...loadedData, ...users];
  //         const uniqueMap = new Map();
  //         newCombined.forEach(user => uniqueMap.set(user.id, user));
  //         const uniqueUsers = Array.from(uniqueMap.values());
  //         setLoadedData(uniqueUsers);
  //       } else {
  //         console.warn("응답에 users 배열이 없습니다:", res.payload);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("❌ 팔로워 불러오기 실패:", err);
  //       setLoading(false);
  //     });
  // };
const handleLoadMore = async () => {
  if (loading || loadedData.length >= totalCount) return;
  setLoading(true);
  try {
    const res = await dispatch(loadFollowers({ offset })).unwrap();
   // const newUsers = res.users || [];
const newUsers = Array.isArray(res?.users) ? res.users : [];

    // 중복 제거 후 업데이트
    const combined = [...loadedData, ...newUsers];
    const uniqueUsers = Array.from(new Map(combined.map(user => [user.id, user])).values());

    setLoadedData(uniqueUsers);
    setOffset((prev) => prev + newUsers.length);
  } catch (e) {
    console.error("🚨 loadFollowers 실패:", e);
  }
  setLoading(false);
};

const loadMoreButton = useMemo(
  () =>
    loadedData.length < totalCount ? (
      <div style={styles.loadMore}>
        <Button loading={loading} onClick={handleLoadMore}>
          더 보기
        </Button>
      </div>
    ) : null,
  [loading, loadedData.length, totalCount]
);


  const styles = useMemo(
    () => ({
      list: { marginBottom: 20 },
      listItem: { marginTop: 20 },
    }),
    []
  );

  return (

        <List
          style={styles.list}
          grid={{ gutter: 4, xs: 2, md: 3 }}
          size="small"
          header={<div>{header}</div>}
          bordered
          dataSource={loadedData}
          loadMore={loadMoreButton}
          renderItem={(item) => {
            const userId = item.id;
            const isFollowing = followStatus[userId];

            if (!userId) return null;

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

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default FollowList;
