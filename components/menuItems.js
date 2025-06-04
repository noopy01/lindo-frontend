import Link from 'next/link';
import { Menu, Dropdown } from "antd";

// 메뉴 스타일을 경로 기반으로 처리하도록 수정
export const getMenuItems = (isLoggedIn, nickname, pathname,onLogout) => {
  const isActive = (path) => pathname === path;
  const activeStyle = {
    fontWeight: 'bold',
    color: '#1890ff',
  };

  return [
    {
      key: "help",
      label: (
        <Link href="/help" style={isActive('/help') ? activeStyle : {}}>
          고객센터
        </Link>
      ),
    },
    {
      key: "settings",
      label: (
        <Link href="/settings" style={isActive('/settings') ? activeStyle : {}}>
          설정
        </Link>
      ),
    },
   isLoggedIn
      ? {
          key: "userMenu",
          label: (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="mypage">
                    <Link href={`/mypage`}>마이페이지</Link>
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={onLogout}>
                    로그아웃
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              trigger={['click']}
            >
              <span style={{ fontWeight: "bold", cursor: "pointer" }}>
                {nickname} 님
              </span>
            </Dropdown>
          ),
        }
      : {
          key: "login",
          label: (
            <Link href="/login" style={isActive('/login') ? activeStyle : {}}>
              로그인
            </Link>
          ),
        },
  ];
};

export const getCombinedMenuItems = (pathname) => {
  const isActive = (path) => pathname === path;
  const activeStyle = {
    fontWeight: 'bold',
    color: '#1890ff',
  };

  return [
    {
      key: "LINDO",
      label: (
        <Link href="/" style={{ fontWeight: "bold", fontSize: "20px" }}>
          LINDO
        </Link>
      ),
    },
    {
      key: "home",
      label: <Link href="/" style={isActive('/') ? activeStyle : {}}>홈</Link>,
    },
    {
      key: "search",
      label: <Link href="/search" style={isActive('/search') ? activeStyle : {}}>검색</Link>,
    },
    {
      key: "closet",
      label: <Link href="/closet" style={isActive('/closet') ? activeStyle : {}}>옷장</Link>,
    },

    {
      key: "bookmark",
      label: <Link href="/bookmark" style={isActive('/bookmark') ? activeStyle : {}}>북마크</Link>,
    },
    {
      key: "profile",
      label: <Link href="/mypage" style={isActive('/mypage') ? activeStyle : {}}>마이</Link>,
    },
    //     {
    //   key: "recommend",
    //   label: <Link href="/recommend" style={isActive('/recommend') ? activeStyle : {}}>팔로우 추천</Link>,
    // },
  ];
};





/*import Link from "next/link";

export const getMenuItems = (isLoggedIn, nickname) => [
  
  {
    key: "help",
    label: <Link href="/help">고객센터</Link>,
  },
  {
    key: "settings",
    label: <Link href="/settings">설정</Link>,
  },
  isLoggedIn
    ? {
        key: "user",
        label: ` ${nickname} 님`,
      }
    : {
        key: "login",
        label: <Link href="/login">로그인</Link>,
        
      },
];

export const combinedMenuItems = [
  {
    key: "logo",
    label: (
      <Link href="/" style={{ fontWeight: "bold", fontSize: "20px" }}>
        로고
      </Link>
    ),
  },
  {
    key: "home",
    label: <Link href="/">홈</Link>,
  },
  {
    key: "search",
    label: <Link href="/search">검색</Link>,
  },
  {
    key: "closet",
    label: <Link href="/closet">옷장</Link>,
  },
  {
    key: "following",
    label: <Link href="/following">팔로잉</Link>,
  },
  {
    key: "profile",
    label: <Link href="/profile">마이</Link>,
  },
  {
    key: "signup",
    label: <Link href="/signup">회원가입</Link>,
  },
];
*/
