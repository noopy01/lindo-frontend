import { useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Avatar } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../reducers/user";
import AppLayout from "../components/AppLayout";


const OtherUserProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
 // const closetItems = useSelector((state) => state.product.product);
  const profileUser = useSelector((state) => state.user.profileUser);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfile(id));
    }
  }, [id, dispatch]);

  if (!profileUser?.id) {
    return <p style={{ padding: "20px" }}>유저 정보를 불러오는 중입니다...</p>;
  }

  return (
    <AppLayout>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Card
          actions={[
            <div
              key="post"
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => router.push(`/user/${profileUser.id}`)}
            >
              게시물<br />{profileUser.postCount ?? 0}
            </div>,
            // <div key="closet">
            //   <Link href={`/closet/${profileUser.id}`}>
            //     <span style={{ cursor: "pointer", color: "blue" }}>
            //       옷장<br />보기
            //     </span>
            //   </Link>
            // </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{profileUser.nickname?.[0] || "U"}</Avatar>}
            title={profileUser.nickname || "익명"}
            description="유저 프로필"
          />
        </Card>

        {profileUser.Posts?.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {profileUser.Posts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    overflow: "hidden",
                    borderRadius: "8px",
                  }}
                >
                  <Image
                    src={post.Images?.[0]?.src || "/default-image.png"}
                    alt="post thumbnail"
                    width={200}
                    height={200}
                    style={{ objectFit: "cover" }}
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

export default OtherUserProfile;
