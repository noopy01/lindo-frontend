import Head from 'next/head';
import { Row,Col, Input, Tabs, Spin, message } from 'antd';
import Link from "next/link";
import { SearchOutlined,LeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchItems } from '../reducers/search';

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const { results, loading } = useSelector((state) => state.search);
console.log("🔍 검색 결과:", results);
console.log("✅ 전체 search state:", useSelector((state) => state.search));

  const handleSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return message.warning("검색어를 입력해주세요.");
    dispatch(searchItems(trimmed));
  };
  
  return (
    <>
    <Head>
      <title>검색</title>
    </Head>
  
    <div style={{ padding: '20px' }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <LeftOutlined style={{ fontSize: "20px" }} />
      </Link>
  
      <Input.Search
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="검색어를 입력해보세요"
        enterButton="검색"
        onSearch={handleSearch}
        style={{ width: "100%", marginBottom: "24px" }}
      />
  
      {loading ? (
        <Spin tip="로딩 중입니다." spinning={true}>
  <div style={{ height: 100 }} />
</Spin>
) : !searchValue ? (
  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
    <SearchOutlined style={{ fontSize: 48, marginBottom: 16 }} />
    <p>찾고 싶은 스타일, 아이템 키워드를 입력해보세요.</p>
  </div>
      ) : results ? (
   <Tabs defaultActiveKey="hashtags">
  <Tabs.TabPane tab="게시글" key="hashtags">
    <Row gutter={[16, 16]}>
      {results?.hashtags?.map((post) => (
        <Col key={post.id} xs={12} sm={8} md={6}>
          <Link href={`/post/${post.id}`} legacyBehavior>
            <a>
              <img
                src={post.thumbnail}
                alt="게시글 썸네일"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  background: '#f5f5f5',
                }}
              />
            </a>
          </Link>
        </Col>
      ))}
    </Row>
  </Tabs.TabPane>

  <Tabs.TabPane tab="상품" key="products">
    <Row gutter={[16, 16]}>
      {results?.products?.map((product) => (
        <Col key={product.uid} xs={12} sm={8} md={6}>
          <Link href={`/product/${product.uid}`} legacyBehavior>
            <a>
              <img
                src={product.thumbnail}
                alt="상품 썸네일"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  background: '#f5f5f5',
                }}
              />
            </a>
          </Link>
        </Col>
      ))}
    </Row>
  </Tabs.TabPane>
</Tabs>

      ) : null}
    </div>
  </>
  
  );
};

export default SearchPage;
