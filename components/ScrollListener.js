import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadPosts } from "../reducers/post";
import throttle from "lodash/throttle";

export default function ScrollListener() {
  const dispatch = useDispatch();
  const { mainPosts, hasNext, loadPostsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    const onScroll = throttle(() => {
      const scrollY = window.scrollY;
      const viewportHeight = document.documentElement.clientHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollY + viewportHeight >= fullHeight - 300) {
        const lastId = mainPosts?.length > 0 ? mainPosts[mainPosts.length - 1]?.id : null;
        if (hasNext && !loadPostsLoading) {
          dispatch(loadPosts(lastId));
        }
      }
    }, 500); // 0.5초에 한 번만 실행

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts, hasNext, loadPostsLoading, dispatch]);

  return null;
}
