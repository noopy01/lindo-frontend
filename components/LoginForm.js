import { useCallback, useEffect } from 'react';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Button, Typography, Row, Col,message } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
//import useInput from '../hooks/useInput';
import { logIn } from "../reducers/user";
import { useMemo } from 'react';

const { Title, Text } = Typography;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector((state) => state.user);
  // const [email, onChangeEmail] = useInput('');
  // const [password, onChangePassword] = useInput('');

useEffect(() => {
  if (logInError) {
    message.error(logInError.message || "로그인에 실패했습니다."); // ✅ 이렇게 수정
  }
}, [logInError]);


  // Yup 스키마를 useMemo로 메모이제이션
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string().email("유효한 이메일을 입력하세요.").required("이메일은 필수입니다."),
        password: Yup.string()
          .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
          .required("비밀번호는 필수입니다."),
      }),
    []
  );

  // 폼의 초기값을 useMemo로 메모이제이션
  const initialValues = useMemo(() => ({ email: "", password: "" }), []);

  // 폼 제출 핸들러를 useCallback으로 정의
  const onSubmitForm = useCallback((values, { setSubmitting }) => {
    console.log("Form Values: ", values);
    dispatch(logIn({ email: values.email, password: values.password }));
    setSubmitting(false); // 제출 완료 후 로딩 상태 비활성화
  }, [dispatch]);

  return (
    <Row justify="center" style={{ marginTop: "50px" }}>
      <Col xs={22} sm={18} md={12} lg={8}>
        <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>로그인</Title>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitForm} // onSubmit 핸들러 설정
        >
          {({ errors, touched }) => (
            <Form style={{ background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ marginBottom: "16px" }}>
                <label htmlFor="email">이메일</label>
                <Field name="email" type = "email" as={Input} placeholder="이메일을 입력하세요" />
                {errors.email && touched.email && (
                  <Text type="danger" style={{ display: "block", marginTop: "8px" }}>{errors.email}</Text>
                )}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label htmlFor="password">패스워드</label>
                <Field
                  name="password"
                  as={Input.Password}
                  placeholder="비밀번호를 입력하세요"
                />
                {errors.password && touched.password && (
                  <Text type="danger" style={{ display: "block", marginTop: "8px" }}>{errors.password}</Text>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                <Button type="primary" htmlType="submit" loading={ logInLoading} block>
                  로그인
                </Button>
                <Link href="/signup">
                <Button>회원가입</Button>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default LoginForm;


