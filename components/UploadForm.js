import { useDispatch,useSelector } from "react-redux";
import { Form, Input, Button, Select, Typography, Row, Col, Tag, Tooltip, Card, message } from "antd";
//import ImgCrop from "antd-img-crop";
import PropTypes from "prop-types";
import { useState } from "react";
import { categories,addProduct } from "../reducers/product";
//import shortId from "shortid";
import { useRouter } from "next/router";
//import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
const { Title } = Typography;
//const { Option } = Select;

const UploadForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [fileList, setFileList] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [, setSelectedCategory] = useState(""); 
 const addProductError = useSelector((state) => state.product.addProductError);
const handleSubmit = async (values) => {
  console.log(" 1. handleSubmit 진입");

  const productRequest = {
    productName: values.productName,
    category: values.category,
    brand: values.brand,
  };

  console.log(" 요청 데이터 (AddProductRequestDTO):", productRequest);

  // 이미지 태그 처리 
  const imagesWithTags = fileList.map((file) => ({
    src: file.url || file.response?.url,
    fetchPriority: "auto",
    productInfo: `${productRequest.brand} - ${productRequest.productName}`,
  }));
  setProductTags(imagesWithTags);

  // 상품 등록 요청
  const result = await dispatch(addProduct(productRequest));

  console.log("서버 응답 (ProductDTO):", result);

  if (result.meta.requestStatus === "fulfilled") {
    const productResponse = result.payload;
    const cleanUid = productResponse.uid.includes('_')
      ? productResponse.uid.split('_')[1]
      : productResponse.uid;

    message.success(`상품이 등록되었습니다! 상품번호: ${cleanUid}`);
    router.push("/closet");
  } else {
    message.error("상품 등록 중 오류가 발생했습니다.");
  }
};

    useEffect(() => {
    if (addProductError) {
      message.error(
        typeof addProductError === "string"
          ? addProductError
          : addProductError.message || "상품 등록 중 오류 발생"
      );
    }
  }, [addProductError]);
  // const onChange = ({ fileList: newFileList }) => {
  //   setFileList(newFileList);
  // };

  // const onPreview = async (file) => {
  //   let src = file.url;
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj);
  //       reader.onload = () => resolve(reader.result);
  //     });
  //   }
  //   window.open(src);
  // };

  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card bordered={false} style={{ padding: "20px", marginTop: 20, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
          <Title level={2} style={{ textAlign: "center" }}>상품 업로드</Title>
          
          <Form layout="vertical" onFinish={handleSubmit}>
            {/* 이미지 업로드
            <Form.Item label="이미지 업로드">
              <ImgCrop rotationSlider>
                <Upload.Dragger
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  multiple
                  maxCount={5}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">이미지를 업로드하려면 클릭하거나 드래그하세요.</p>
                </Upload.Dragger>
              </ImgCrop>
            </Form.Item> */}

            {/* 등록된 제품 태그 */}
            {productTags.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                {productTags.map((tag, index) => (
                  <Tooltip key={index} title="제품 상세 정보 보기">
                    <Tag color="blue" style={{ cursor: "pointer" }} >
                      {tag.productInfo}
                    </Tag>
                  </Tooltip>
                ))}
              </div>
            )}

            {/* 카테고리 */}
<Form.Item label="카테고리" name="category" rules={[{ required: true }]}>
  <Select placeholder="카테고리를 선택하세요" onChange={setSelectedCategory}>
    {categories
      .filter((c) => c.name !== "ALL")
      .map((cat) => (
        <Select.Option key={cat.name} value={cat.name}>
          {cat.label}
        </Select.Option>
      ))}
  </Select>
</Form.Item>


            {/* 브랜드 */}
            <Form.Item label="브랜드" name="brand" rules={[{ required: true }]}>
              <Input placeholder="브랜드를 입력하세요" />
            </Form.Item>

            {/* 제품명 */}
            <Form.Item label="제품명" name="productName" rules={[{ required: true }]}>
              <Input placeholder="제품명을 입력하세요" />
            </Form.Item>

             
            {/* <Form.Item label="가격" name="price" rules={[{ required: true }]}>
              <Input type="number" placeholder="가격을 입력하세요" />
            </Form.Item> */}

            {/* 등록 버튼 */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                등록하기
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

UploadForm.propTypes = {
  me: PropTypes.object,
};

export default UploadForm;
