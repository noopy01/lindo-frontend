import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Row, Col, Modal, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { categories ,deleteProduct } from "../reducers/product";

const { Title, Paragraph } = Typography;

const ClosetForm = ({  clothesData,showUploadButton = true, isOwner }) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
 // const [isOpen, setIsOpen] = useState(false); // 닫힌 옷장 상태 제어
  useEffect(() => {
    console.log("🧺 clothesData in ClosetForm:", clothesData); // ✅ 카테고리별 옷들 확인
  }, [clothesData])
  
  const handlePreview = (product) => {
    setSelectedProduct(product);
    setPreviewOpen(true);
  };
useEffect(() => {
  console.log("✅ outer에 있는 이미지 URL:", clothesData?.outer?.[0]?.thumbnail);
}, [clothesData]);

  const handleDelete = async (productId) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await dispatch(deleteProduct(productId));
    }
  };

  const handleScrollToCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    const target = document.getElementById(categoryName);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredCategories =
  selectedCategory === "ALL" && clothesData
    ? Object.keys(clothesData)
    : [selectedCategory];

const isClosetEmpty = filteredCategories.every((category) =>
  Array.isArray(clothesData?.[category]) && clothesData[category].length === 0
);


  return (
    <div className="closet-wrapper">
      
        <div className="closet-container">
          <div className="category-bar">
            {categories.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                className={`category-button ${selectedCategory === name ? "active" : ""}`}
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
  const items = clothesData?.[category] || []; // ❗ 안전한 배열로 fallback

  return (
    <Col key={category} xs={24} sm={12}>
      <div className="category-section" id={category}>
        <div className="category-title">{category.toUpperCase()}</div>
        <div className="grid-wrapper">
          <Row gutter={[8, 8]}>
            {items.slice(0, 4).map((item) => (
              <Col key={item.uid} span={12}>
                <div className="image-box" onClick={() => handlePreview(item)}>
                  <Image
                    src={item.thumbnail || item.url} // fallback
                    alt={item.name || category}
          width={150}
  height={150}
                    
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </Col>
            ))}

            {Array.from({ length: 4 - items.slice(0, 4).length }).map((_, idx) => (
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

          <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)} centered>
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
                 <Paragraph > 상품명:{selectedProduct.productName}</Paragraph>
                <Paragraph>브랜드: {selectedProduct.brand}</Paragraph>
                <Paragraph>가격: ₩{selectedProduct.price?.toLocaleString()}</Paragraph>
                <Button
                  type="link"
                  onClick={() => {
                    setPreviewOpen(false);
                    Router.push(`/product/${selectedProduct.uid}`);
                  }}
                >
                  상세 페이지 보기
                </Button>
                {isOwner && (
                  <Button danger size="small" onClick={() => handleDelete(selectedProduct.uid)}>
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
        .closed-closet {
          display: inline-block;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .closed-closet:hover {
          transform: scale(1.02);
        }
        /* 아래 스타일은 기존 closet-container와 동일 */
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
