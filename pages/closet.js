import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import ClosetForm from "../components/ClosetForm";
import { fetchClosetData, categories ,setInitialClothes } from "../reducers/product"; // setClosetItems는 필요 없음

const Closet = () => {
  const { me } = useSelector((state) => state.user || {}); 
  const router = useRouter();
  const dispatch = useDispatch();
  const { initialClothes } = useSelector((state) => state.product);
  useEffect(() => {
  console.log("🧺 리덕스에서 초기 옷장 상태:", initialClothes);
}, [initialClothes]);

  useEffect(() => {
    if (!me?.id) {
      router.push('/login'); // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
    }
  }, [me, router]);

  

useEffect(() => {
  if (me?.id) {
    dispatch(fetchClosetData()).then((action) => {
      if (fetchClosetData.fulfilled.match(action)) {
        const items = action.payload;
        console.log("✅ payload 직접 확인:", items);

        const categorized = Object.fromEntries(
          categories
            .filter((c) => c.name !== "ALL")
            .map((c) => [c.name.toLowerCase(), []]) // ✅ 소문자 통일
        );

        console.log("🗂️ categorized 키 목록:", Object.keys(categorized));

        items.forEach((item) => {
          const categoryKey = item.category?.toLowerCase();
          console.log("📦 item.category:", item.category, "→ categoryKey:", categoryKey);

          if (categorized[categoryKey]) {
            categorized[categoryKey].push(item);
          } else {
            console.warn("⚠️ 잘못된 category:", item.category);
          }
        });

        console.log("🧥 categorized from component:", categorized);
        console.log("🧵 initialClothes 전체:", initialClothes);
console.log("📏 각 카테고리 길이:", Object.fromEntries(Object.entries(initialClothes).map(([k, v]) => [k, v.length])));
 dispatch(setInitialClothes(categorized));
 console.log("🚀 setInitialClothes dispatched");
      }
    });
  }
}, [me, dispatch]);

  if (!me) {
    return <div>Loading...</div>; // 로그인 확인 중
  }
 if (!me?.id) return null; 

  return (
    <>
      <Head>
        <title>closet</title>
      </Head>
      <AppLayout>
        {/* ✅ 수정된 부분 */}
        <ClosetForm clothesData={initialClothes} isOwner={true} />
      </AppLayout>
    </>
  );
};

export default Closet;
