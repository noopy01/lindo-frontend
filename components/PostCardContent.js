import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Input,Button, Space,message} from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
const { TextArea } = Input;
import { updatePost } from "../reducers/post";

const PostCardContent = ({ 
  postId,
  postData='', 
  editMode = false, 
  //onChangePost, 
  onCancelUpdate }) => {
  const { updatePostLoading, updatePostDone } = useSelector((state) => state.post);
  const [editText, setEditText] = useState(postData || '');
  const dispatch = useDispatch();

  // const handleUpdatePost = useCallback(() => {
  // // console.log("수정 버튼 클릭됨, editText:", editText,"postId",postId);
  //   if (!postId) {
  //     console.error("postId가 없습니다.");
  //     return;
  //   }
  //   dispatch(updatePost({ postId: postId, content: editText })); // createAsyncThunk 사용
  //   onChangePost(editText);
  // }, [dispatch, editText, postId, onChangePost])
  // ;
  const handleUpdatePost = useCallback(() => {
  if (!postId) {
    console.error("postId가 없습니다.");
    return;
  }

  dispatch(updatePost({ postId, content: editText }))
    .unwrap()
    .then(() => {
      message.success("수정 완료!");
     // setEditMode(false); // 수정 종료
    })
    .catch((err) => {
      message.error("수정 실패");
      console.error("수정 실패:", err);
    });
}, [dispatch, editText, postId]);

  useEffect(() => {
   console.log("PostCardContent 렌더링됨 - postId:", postId);
  }, [postId]);
  
  useEffect(() => {
    console.log("updatePostDone 변경됨:", updatePostDone);
    if (updatePostDone) {
     console.log("수정 완료, onCancelUpdate 호출됨");
      onCancelUpdate();
    }
  }, [updatePostDone, onCancelUpdate]);
  

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  }, []);

  const onClickCancel = useCallback(() => {
    setEditText(postData || '');
    onCancelUpdate();
  }, [postData, onCancelUpdate]);

  // postData가 문자열인지 확인하고 안전하게 처리

  // 문자열 중 #해시태그 자동 링크 변환
  const renderPostContent = useCallback(() => {
    if (typeof postData !== 'string') {
      console.error('postData는 문자열이어야 합니다.', postData);
      return null;
    }

    return postData.split(/(#[^\s#]+)/g).map((v, i) => {
      if (v.match(/(#[^\s#]+)/)) {
        return (
          <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}>
            <span style={{ color: 'blue' }}>{v}</span>
          </Link>
        );
      }
      return v;
    });
  }, [postData]);


  return (
    <div>
      {editMode ? (
        <>
          <TextArea 
            value={editText} 
            onChange={onChangeText} 
            autoSize={{ minRows: 3, maxRows: 6 }} 
          />
          <Space>
          <Button loading={updatePostLoading} onClick={handleUpdatePost}>수정</Button>
          <Button danger onClick={onClickCancel}>취소</Button>
          </Space>
        </>
      ) : (
        renderPostContent()
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string, 
  editMode: PropTypes.bool,
  onChangePost: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
};



export default PostCardContent;
