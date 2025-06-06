import { useState,useEffect } from "react";
import Image from "next/image";
import { Button, Row, Col, Modal, Typography ,message} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Router from "next/router";
import { useSelector,useDispatch } from "react-redux";
import { categories, deleteProduct } from "../reducers/product";

const { Title, Paragraph } = Typography;

const ClosetForm = ({ showUploadButton = true, isOwner }) => {
  const dispatch = useDispatch();
  const clothesData = useSelector((state) => state.product.initialClothes); 
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // useEffect(() => {
  //   console.log("🧺 clothesData in ClosetForm:", clothesData);
  // }, [clothesData]);

  // useEffect(() => {
  //   console.log("✅ outer 이미지 URL:", clothesData?.outer?.[0]?.thumbnail);
  // }, [clothesData]);

  const handlePreview = (product) => {
    setSelectedProduct(product);
    setPreviewOpen(true);
  };

const handleDelete = async (productUid) => {
  const uid = String(productUid);                // ✅ 여기서 uid 정의
  const productId = uid.split('_')[1];           // ✅ uid를 사용해 ID 추출

  if (confirm("정말 삭제하시겠습니까?")) {
    try {
      const result = await dispatch(deleteProduct(productId)).unwrap();  // ✅ productId 사용
      console.log("🗑️ 삭제 성공:", result);
      setPreviewOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      message.error("상품 삭제에 실패했습니다.");
    }
  }
};

useEffect(() => {
  console.log("🔄 clothesData 변경됨:", clothesData);
}, [clothesData]);


  const handleScrollToCategory = (categoryName) => {
    const target = document.getElementById(categoryName);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setSelectedCategory(categoryName);
  };

  const filteredCategories =
    selectedCategory === "ALL" && clothesData
      ? Object.keys(clothesData)
      : [selectedCategory];

  const isClosetEmpty = filteredCategories.every(
    (category) =>
      Array.isArray(clothesData?.[category]) &&
      clothesData[category].length === 0
  );

  return (
    <div className="closet-wrapper">
      <div className="closet-container">
        <div className="category-bar">
          {categories.map(({ name, icon: Icon }) => (
            <Button
              key={name}
              className={`category-button ${
                selectedCategory === name ? "active" : ""
              }`}
              onClick={() => handleScrollToCategory(name)}
            >
              <Icon size={24} />
              <span>{name}</span>
            </Button>
          ))}
        </div>

        {isOwner && showUploadButton && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              size="large"
              onClick={() => Router.push("/upload")}
              style={{ width: "200px" }}
            >
              상품 업로드하기
            </Button>
          </div>
        )}

        {isClosetEmpty ? (
          <div className="empty-message">현재 옷장에 등록된 옷이 없습니다.</div>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredCategories.map((category) => {
              const items = clothesData?.[category] || [];

              return (
                <Col key={category} xs={24} sm={12}>
                  <div className="category-section" id={category}>
                    <div className="category-title">
                      {category.toUpperCase()}
                    </div>
                    <div className="grid-wrapper">
                      <Row gutter={[8, 8]}>
                        {items.slice(0, 4).map((item) => (
                          <Col key={item.uid} span={12}>
                            <div
                              className="image-box"
                              onClick={() => handlePreview(item)}
                            >
                              <Image
                                src={item.thumbnail || item.url}
                                alt={item.name || category}
                                width={250}
                                height={250}
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          </Col>
                        ))}
                        {Array.from({
                          length: 4 - items.slice(0, 4).length,
                        }).map((_, idx) => (
                          <Col key={`empty-${idx}`} span={12}>
                            <div className="empty-box" />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
          centered
        >
          {selectedProduct && (
            <div style={{ textAlign: "center" }}>
              <Image
                src={selectedProduct.thumbnail}
                alt="Preview"
                width={300}
                height={300}
                style={{ objectFit: "cover", marginBottom: 20 }}
              />
              <Title level={4}>{selectedProduct.productName}</Title>
              <Paragraph>브랜드: {selectedProduct.brand}</Paragraph>
              <Paragraph>
                가격: ₩{selectedProduct.price?.toLocaleString()}
              </Paragraph>
              <Button
                type="link"
                onClick={() => {
                  setPreviewOpen(false);
                  const productId = String(selectedProduct.uid).split('_')[1]; // ✅ 숫자 ID만 추출
                  Router.push(`/product/${productId}`);
                }}
              >
                상세 페이지 보기
              </Button>
              {isOwner && (
                <Button
                  danger
                  size="small"
                  onClick={() => handleDelete(selectedProduct.uid)} // ✅ 그대로 넘기고 내부에서 split
                >
                  삭제
                </Button>
              )}
            </div>
          )}
        </Modal>
      </div>

      <style jsx>{`
        .closet-wrapper {
          text-align: center;
          padding: 40px;
        }
        .closet-container {
          padding: 20px;
          max-width: 1000px;
          margin: auto;
          background-size: cover;
          border-radius: 15px;
          box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
        }
        .category-bar {
          display: flex;
          overflow-x: auto;
          padding: 15px 0;
          border-bottom: 2px solid #8b5a2b;
          justify-content: center;
        }
        .category-bar > :not(:last-child) {
          margin-right: 15px;
        }
        .category-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          background: #fff8f0;
          color: #6b4226;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          font-size: 12px;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease-in-out;
        }
        .category-button:hover {
          background: #f5e1c5;
        }
        .category-button.active {
          background: #8b5a2b;
          color: white;
        }
        .category-section {
          margin-top: 40px;
        }
        .category-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .image-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border: 2px solid #8b5a2b;
          border-radius: 10px;
          overflow: hidden;
          background: white;
          cursor: pointer;
        }
        .image-box :global(img) {
          object-fit: cover;
        }
        .empty-box {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #f2f2f2;
          border: 2px dashed #ccc;
          border-radius: 10px;
        }
        .empty-message {
          text-align: center;
          color: #555;
          padding: 20px;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default ClosetForm;
