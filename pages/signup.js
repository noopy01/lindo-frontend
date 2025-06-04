import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { Checkbox, Form, Input, Button, Row, Col, Typography } from "antd";
import { useCallback, useState } from "react";
import useInput from "../hooks/useInput";
import dynamic from "next/dynamic";
import { signup } from '../reducers/user';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

const { Title, Text } = Typography;

const Signup = () => {
  const [email, onChangeEmail] = useInput('');
  //const [email, onChangeId] = useInput('');
  const [nickname, onChangeNickname] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const {signUpLoading} =useSelector((state)=>state.user);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  // const onSubmit = useCallback(() => {
  //   if (password !== passwordCheck) {
  //     setPasswordError(true);
  //     return;
  //   }
  //   if (!term) {
  //     setTermError(true);
  //     return;
  //   }
  //   console.log(email, nickname, password);
  //   return dispatch(signup({ email, password, nickname }));
  // }, [email, nickname, password, passwordCheck, term, dispatch]);
  // const onSubmit = useCallback(() => {
  // if (password !== passwordCheck) {
  //   setPasswordError(true);
  //   return;
  // }
  // if (!term) {
  //   setTermError(true);
  //   return;
  // }

//   dispatch(signup({ email, password, nickname }))
//     .unwrap()
//     .then(() => {
//       alert("회원가입이 완료되었습니다!");
//       router.push("/login");
//     })
//     .catch((err) => {
//       alert("회원가입 실패: " + (err?.message || "서버 오류"));
//     });
// }, [email, nickname, password, passwordCheck, term, dispatch, router]);
const onSubmit = useCallback(() => {
  if (password !== passwordCheck) {
    setPasswordError(true);
    return;
  }
  if (!term) {
    setTermError(true);
    return;
  }

  dispatch(signup({ email, password, nickname }))
    .unwrap()
    .then(() => {
      alert("회원가입이 완료되었습니다!");
      router.push("/login");
    })
.catch((err) => {
  console.error("❌ 회원가입 에러 전체:", err);

  const rawMessage =
    err?.errorMessage || err?.message || "서버 오류";

  let finalMessage = "서버 오류";

  if (rawMessage.toLowerCase().includes("아이디")) {
    finalMessage = "이미 가입된 이메일입니다.";
  }

  alert("회원가입 실패: " + finalMessage);
});

}, [email, nickname, password, passwordCheck, term, dispatch, router]); // ✅ 여기까지 닫아줘야 함!




  return (
    <AppLayout>
      <Head>
        <title>회원가입</title>
      </Head>
      <Row justify="center" style={{ marginTop: "50px" }}>
        <Col xs={22} sm={18} md={12} lg={10}>
          <Form
            onFinish={onSubmit}
            layout="vertical"
            style={{ background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
          >
            <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>회원가입</Title>

            <Form.Item
              label="이메일"
              name="user_email"
              rules={[
                { required: true, message: "이메일을 입력해주세요." },
                { type: "email", message: "유효한 이메일 주소를 입력해주세요." },
              ]}
            >
              <Input
                value={email}
                onChange={onChangeEmail}
                placeholder="example@example.com"
                type="email"
              />
            </Form.Item>

            <Form.Item
              label="닉네임"
              name="nickname"
              rules={[
                { required: true, message: "닉네임을 입력해주세요." },
                { min: 2, message: "닉네임은 최소 2자 이상이어야 합니다." },
              ]}
            >
              <Input
                value={nickname}
                onChange={onChangeNickname}
                placeholder="닉네임을 입력하세요"
              />
            </Form.Item>

            <Form.Item
              label="비밀번호"
              name="user_password"
              rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
            >
              <Input.Password value={password} onChange={onChangePassword} placeholder="비밀번호를 입력하세요" />
            </Form.Item>

            <Form.Item
              label="비밀번호 확인"
              name="user_password_check"
              validateStatus={passwordError ? "error" : ""}
              help={passwordError ? "비밀번호가 일치하지 않습니다." : ""}
              rules={[{ required: true, message: "비밀번호를 다시 입력해주세요." }]}
            >
              <Input.Password
                value={passwordCheck}
                onChange={onChangePasswordCheck}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </Form.Item>

            <Form.Item>
              <Checkbox
                checked={term}
                onChange={onChangeTerm}
                style={{ display: "block" }}
              >
                회원가입 약관에 동의합니다.
              </Checkbox>
              {termError && <Text type="danger">약관에 동의하셔야 합니다.</Text>}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={!term || passwordError}
                loading = {signUpLoading}
              >
                가입하기
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default dynamic(() => Promise.resolve(Signup), { ssr: false });
