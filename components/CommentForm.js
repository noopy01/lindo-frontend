import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button } from 'antd';

import { addComment } from '../reducers/post';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);

  const { control, handleSubmit, reset } = useForm();

useEffect(() => {
  console.log("✅ addCommentDone:", addCommentDone);
  if (addCommentDone) {
    reset();
  }
}, [addCommentDone, reset]);


  const onSubmit = (data) => {
    console.log('📨 댓글 전송 데이터:', data);
    dispatch(
      addComment({
        content: data.commentText,
        postId: post.id,
        userId: id,
      })
    );
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} style={{ position: 'relative', margin: 0 }}>
      <Form.Item style={{ marginBottom: '8px' }}>
        <Controller
          name="commentText"
          control={control}
          rules={{ required: '댓글을 입력해주세요.' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input.TextArea
                {...field}
                rows={4}
                placeholder="댓글을 입력하세요"
              />
              {error && (
                <div style={{ color: 'red', marginTop: '4px' }}>{error.message}</div>
              )}
            </>
          )}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={addCommentLoading}
          style={{ position: 'absolute', right: 0, bottom: -40 }}
        >
          추가하기
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
