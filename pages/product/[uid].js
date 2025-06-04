import { fetchPostsByTaggedProduct} from '../../reducers/user';
import AppLayout from '../../components/AppLayout';
import Head from 'next/head';
//import Link from 'next/link';
import { Card, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../../reducers/product';

const { Title, Paragraph } = Typography;

const ProductDetailPage = () => {
  const router = useRouter();
  const { uid } = router.query;
  const dispatch = useDispatch();
  const product = useSelector(state => state.product.product);
  const taggedPosts = useSelector(state => state.post.taggedPosts);
  const { getProductError } = useSelector(state => state.product);

  const [, setIsReady] = useState(false);

  // ✅ router.isReady 체크
  useEffect(() => {
    if (router.isReady && uid) {
      dispatch(getProductById(uid));
      dispatch(fetchPostsByTaggedProduct(uid));
      setIsReady(true);
    }
  }, [router.isReady, uid]);

if (!router.isReady || !uid) return <p>라우터 준비 중...</p>;
if (getProductError) return <p>상품 정보를 불러오는 데 실패했습니다.</p>;
if (!product) return <p>상품 정보를 불러오는 중입니다...</p>;
if (product?.uid && String(product.uid).split('_')[1] !== String(uid)) {
  return <p>상품 UID 불일치로 로딩 중...</p>;
}


  useEffect(() => {
  console.log('🧾 [ProductDetailPage] 현재 product:', product);
}, [product]);


// UID가 _로 구분되어 있다면 비교
  // const productIdSplit = String(product.uid).split('_')[1];
  // if (productIdSplit !== String(uid)) return <p>로딩 중...</p>;


  console.log('🧾 router uid:', uid);
console.log('🧾 product.uid:', product?.uid);
console.log('taggedPosts',taggedPosts)
  return (
    <>
      <Head>
        <title>{product.productName} - 상품 상세</title>
      </Head>
      <AppLayout>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
          <Card
            title={<Title level={3}>{product.productName}</Title>}
            cover={
              <img src={product.thumbnail} alt={product.productName} style={{ maxHeight: 400, objectFit: 'contain' }} />
            }
            variant={false}
          >
            <Paragraph>가격: ₩{product.price?.toLocaleString()}</Paragraph>
          </Card>

 {/* <div style={{ marginTop: 40 }}>
  <Title level={4}>이 상품이 태그된 게시글</Title>

  {taggedPosts?.length === 0 ? (
    <Paragraph>이 상품이 태그된 게시글이 아직 없습니다.</Paragraph>
  ) : (
     <List
       dataSource={taggedPosts}
       renderItem={(post) => (
         <List.Item>
           <Link href={`/post/${post.id}`}>{post.content}</Link>
           <Link href={`/post/${post.id}`} legacyBehavior>
             <a>
               <img
                 src={post.thumbnail}
                 alt="게시글 썸네일"
                 style={{
                   maxWidth: '100%',
                   maxHeight: '200px',
                   objectFit: 'contain',
                   display: 'block',
                   marginTop: '8px',
                   borderRadius: '8px',
                   background: '#f5f5f5',
                 }}
               />
             </a>
           </Link>
         </List.Item>
       )}
     />
  
  )}
</div>  */}
</div>
      </AppLayout>
    </>
  );
};



export default ProductDetailPage;  