import React from "react";
import { Typography, Row, Col, Image, Card } from "antd";
import './Introduce.scss';
const { Title, Paragraph } = Typography;

function Introduce() {
  return (
    <div className="introduce-container ">
      <Title level={1} className="introduce-title animate__animated animate__fadeInDown" >
        Giới thiệu về Shop Giày của chúng tôi
      </Title>

      <Row gutter={[24, 24]} className="introduce-row">
        <Col xs={24} md={12}  className='animate__animated animate__bounceInLeft'>
          <Image
            src="https://ananas.vn/wp-content/uploads/kv_basas_mobileBanner_4_2019.jpg" // Đổi URL thành ảnh đại diện cho cửa hàng
            alt="Giới thiệu về cửa hàng" className="introduce-image"
            
          />
        </Col>

        <Col xs={24} md={12}>
          <Paragraph className="introduce-paragraph">
            Chào mừng bạn đến với cửa hàng giày của chúng tôi! Chúng tôi tự hào
            mang đến cho bạn những đôi giày chất lượng, phong cách và đa dạng,
            phù hợp cho mọi lứa tuổi và sở thích. Với sự tận tâm và lòng yêu
            nghề, chúng tôi cam kết cung cấp cho khách hàng những sản phẩm tốt
            nhất và dịch vụ chăm sóc khách hàng tận tình.
          </Paragraph>
          <Paragraph className="introduce-paragraph">
            Tại cửa hàng của chúng tôi, bạn có thể tìm thấy các mẫu giày mới
            nhất, từ giày thể thao, giày dạo phố đến giày công sở. Mỗi sản phẩm
            đều được chọn lọc kỹ càng nhằm mang lại trải nghiệm thoải mái và phong
            cách cho từng khách hàng. Hãy khám phá bộ sưu tập của chúng tôi và
            tìm cho mình đôi giày ưng ý nhất!
          </Paragraph>
        </Col>
      </Row>

      <Title level={2} className="introduce-subtitle">
        Tại sao chọn chúng tôi?
      </Title>

      <Row gutter={[24, 24]} className="introduce-features" >
        <Col xs={24} md={8}>
          <Card
            hoverable
            title="Chất lượng hàng đầu"
            className="introduce-card"
          >
            <Paragraph className="p">Giày của chúng tôi được sản xuất từ những chất liệu bền bỉ, đảm bảo chất lượng cao nhất cho từng sản phẩm.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            hoverable
            title="Đa dạng mẫu mã"
            className="introduce-card"
          >
            <Paragraph className="p">Chúng tôi cung cấp nhiều mẫu mã giày đa dạng, từ cổ điển đến hiện đại, phục vụ mọi phong cách.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            hoverable
            title="Dịch vụ khách hàng tận tâm"
            className="introduce-card"
          >
            <Paragraph className="p">Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn, đảm bảo trải nghiệm mua sắm tốt nhất.</Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Introduce;
