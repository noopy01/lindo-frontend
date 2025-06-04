
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPosts } from "../reducers/post";

export default function ScrollListener() {
  const dispatch = useDispatch();
  const { mainPosts, hasNext, loadPostsLoading } = useSelector((state) => state.post);

  const lastId = mainPosts?.length > 0 ? mainPosts[mainPosts.length - 1]?.id : null;

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 300) {
        if (hasNext && !loadPostsLoading) {
          dispatch(loadPosts(lastId));
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [lastId,hasNext, loadPostsLoading, dispatch]);

  return null; // 화면에 보이지 않도록 null 반환
}
