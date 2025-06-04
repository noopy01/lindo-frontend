import AppLayout from "../components/AppLayout";
import {  useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Card,
  Typography,
  Divider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";

//import useInput from "../hooks/useInput";
import { logIn } from "../reducers/user";
import { fetchClosetData } from "../reducers/product";
import Link from "next/link";

const { Title, Text } = Typography;

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { me, logInLoading, logInError } = useSelector((state) => state.user);
  // const [email, onChangeEmail] = useInput("");
  // const [password, onChangePassword] = useInput("");

useEffect(() => {
  if (logInError) {
    message.error(logInError.message || "로그인에 실패했습니다."); // ✅ 이렇게 수정
  }
}, [logInError]);


  useEffect(() => {
    if (me) {
      message.success("로그인 성공!");
      dispatch(fetchClosetData());
      router.push("/");
    }
  }, [me, router, dispatch]);

  // const onSubmitForm = useCallback(() => {
  //   dispatch(logIn({ email, password }))
  //     .unwrap()
  //     .then((user) => {
  //       localStorage.setItem("me", JSON.stringify(user)); // ✅ 저장
  //     })
  //     .catch((err) => {
  //       message.error("로그인 실패: " + err);
  //     });
  // }, [email, password, dispatch]);
  

  return (
    <AppLayout>
      <Head>
        <title>로그인</title>
      </Head>

      <Row justify="center" style={{ marginTop: "60px" }}>
        <Col xs={24} sm={20} md={14} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "30px 20px",
            }}
          >
            <Title level={2} style={{ textAlign: "center", marginBottom: 10 }}>
              로그인
            </Title>
            <Divider />

<Form
  onFinish={(values) => {
    dispatch(logIn(values)) // ✅ values: { email: "...", password: "..." }
      .unwrap()
      .then((user) => {
        localStorage.setItem("me", JSON.stringify(user));
      })
      
  }}
  layout="vertical"
  style={{ marginTop: 20 }}
>
  <Form.Item
    label={<Text strong>이메일</Text>}
    name="email"
    rules={[{ required: true, message: "이메일을 입력하세요!" }]}
  >
    <Input
      type="email"
      placeholder="example@example.com"
      size="large"
    />
  </Form.Item>

  <Form.Item
    label={<Text strong>비밀번호</Text>}
    name="password"
    rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}
  >
    <Input.Password
      placeholder="비밀번호 입력"
      size="large"
    />
  </Form.Item>

  <Form.Item>
    <Row gutter={16} justify="center">
      <Col span={12}>
        <Button
          type="primary"
          htmlType="submit"
          loading={logInLoading}
          block
          size="large"
        >
          로그인
        </Button>
      </Col>
      <Col span={12}>
        <Link href="/signup" passHref legacyBehavior>
          <Button
            type="default"
            block
            size="large"
            style={{ borderColor: "#1890ff", color: "#1890ff" }}
          >
            회원가입
          </Button>
        </Link>
      </Col>
    </Row>
  </Form.Item>
</Form>

          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}

export default Login;
