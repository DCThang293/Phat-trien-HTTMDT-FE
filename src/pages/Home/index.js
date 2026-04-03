import { Button, Carousel, Col, Form, Image, Input, Modal, notification, Row, Select, Space, Spin, Tag } from "antd";
import { useEffect, useState, useRef } from "react";
import './Home.scss';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import image1 from '../../images/image1.jpg';
import image2 from '../../images/image2.jpg';
import { SearchOutlined } from '@ant-design/icons';
import QuickOrderModal from '../../components/QuickOrderModal';

function Home() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{ margin: "0", padding: "0" }}>{message}</h3>,
      description: description,
      duration: 1,
    });
  };

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // Danh sách sản phẩm gốc
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sản phẩm đã lọc
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [stocks, setStocks] = useState(productDetail?.size[0].stock);
  const [indexSize, setIndexSize] = useState(0);
  const [user, setUser] = useState({});
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [form] = Form.useForm();
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);

  const isLogin = useSelector(state => state.loginReducer);
  const token = sessionStorage.getItem('token');
  const id = sessionStorage.getItem('id');

  const navigate = useNavigate();

  const showModal = (productDetail) => {
    setProductDetail(productDetail);
    setIsModalOpen(true);
    setStocks(productDetail?.size[0].stock);
    setIndexSize(0);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getBrands = async () => {
    const response = await fetch('/brand/get/all');
    const data = await response.json();
    setBrands(data.data);
    return data.data;
  };

  const getCategories = async () => {
    const response = await fetch('/category/get/all');
    const data = await response.json();
    setCategories(data.data);
    return data.data;
  };

  const getProducts = async () => {
    setLoading(true);
    const response = await fetch('/product/user/all');
    const data = await response.json();
    console.log('Products from API:', data.data);
    setProducts(data.data);
    setFilteredProducts(data.data);
    setLoading(false);
    return data.data;
  };

  const getUser = async () => {
    const response = await fetch(`/users/user/me?id=${id}`);
    const data = await response.json();
    setUser(data.data);
    return data.data;
  };

  const postCarts = async (productIsChoose) => {
    const response = await fetch(`/cart/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        productId: productIsChoose.id,
        size: productIsChoose.size,
      })
    });
    return await response.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      await getProducts();
      await getBrands();
      await getCategories();
      if (isLogin || token) {
        await getUser();
      }
    };
    fetchData();
  }, [isLogin]);

  let optionBrands = brands.map(item => ({
    value: item.name,
    label: item.name,
  }));
  optionBrands = [{ value: "Tất cả", name: "Tất cả" }, ...optionBrands];

  let optionCategories = categories.map(item => ({
    value: item.name,
    label: item.name,
  }));
  optionCategories = [{ value: "Tất cả", name: "Tất cả" }, ...optionCategories];

  let optionsPrices = [
    { value: 1, label: "Dưới 1 triệu" },
    { value: 2, label: "Từ 1 - 5 triệu" },
    { value: 3, label: "Từ 5 - 10 triệu" },
    { value: 4, label: "Trên 10 triệu" }
  ];
  optionsPrices = [{ value: "Tất cả", name: "Tất cả" }, ...optionsPrices];

  const handleChangeSize = (e) => {
    setIndexSize(e);
    setStocks(productDetail?.size[e].stock);
  };

  const handleAddToCart = async () => {
    const productIsChoose = { ...productDetail, size: productDetail.size[indexSize].size };
    if (!(isLogin || token)) {
      navigate('/login');
    } else {
      const responsePostCart = await postCarts(productIsChoose);
      if (responsePostCart) {
        openNotification('Thành công', 'Đã thêm vào giỏ hàng', 'success');
        setIsModalOpen(false);
      } else {
        openNotification('Thất bại', 'Thêm sản phẩm thất bại', 'error');
      }
    }
  };

  const handleFilter = async (values) => {
    const { brand, category, price } = values;
    let filtered = [...products];

    if (brand && brand !== "Tất cả") {
      filtered = filtered.filter((item) => item.brand === brand);
    }

    if (category && category !== "Tất cả") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (price && price !== "Tất cả") {
      filtered = filtered.filter((item) => {
        if (price === 1) return item.price < 1000000;
        if (price === 2) return item.price >= 1000000 && item.price <= 5000000;
        if (price === 3) return item.price > 5000000 && item.price <= 10000000;
        if (price === 4) return item.price > 10000000;
        return true;
      });
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = async (values) => {
    const searchName = values.name || '';
    setShowSuggestions(false);
    if (searchName.trim() === '') {
      setFilteredProducts(products);
    } else {
      const newProducts = products.filter((item) =>
        item.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setFilteredProducts(newProducts);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const matched = products
        .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 6);
      setSuggestions(matched);
      setShowSuggestions(true);
    }
  };

  const handleSelectSuggestion = (name) => {
    setSearchValue(name);
    form.setFieldsValue({ name });
    setShowSuggestions(false);
    const newProducts = products.filter(item =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredProducts(newProducts);
  };

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBuyNow = async () => {
    if (!(isLogin || token)) {
      navigate('/login');
      return;
    }
    const productIsChoose = {
      ...productDetail,
      size: productDetail.size[indexSize].size
    };
    setQuickOrderProduct(productIsChoose);
    setIsModalOpen(false);
    setIsQuickOrderOpen(true);
  };

  const contentStyle = {
    marginTop: "50",
    height: 'auto',
    width: '100%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  return (
    <>
      {contextHolder}
      <div className="home">
        <Carousel autoplay autoplaySpeed={3000}>
          <div>
            <Image preview={false} style={contentStyle} src={image1} />
          </div>
        </Carousel>
        <div className="container">
          <div className="home__wrap">
            <h2 className="home__title animate__animated animate__fadeInDown">Sản phẩm</h2>
            <p className="home__subtitle"></p>
            <div className="home__forms">
              <Form onFinish={handleSearch} className="search-form" form={form}>
                <div ref={searchRef} style={{ position: 'relative' }}>
                  <Form.Item name='name'>
                    <Input
                      className="area-focus"
                      placeholder="Tên sản phẩm"
                      prefix={<SearchOutlined />}
                      value={searchValue}
                      onChange={handleSearchInput}
                      autoComplete="off"
                    />
                  </Form.Item>
                  {showSuggestions && suggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: '#fff', border: '1px solid #d9d9d9',
                      borderRadius: 6, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      {suggestions.map(item => (
                        <div
                          key={item.id}
                          onMouseDown={() => handleSelectSuggestion(item.name)}
                          style={{
                            padding: '8px 12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 10,
                            borderBottom: '1px solid #f0f0f0'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                          <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="search-button">Tìm kiếm</Button>
                </Form.Item>
              </Form>
              <Form onFinish={handleFilter} className="filter-form">
                <Form.Item name='brand'>
                  <Select placeholder='Thương hiệu' options={optionBrands} />
                </Form.Item>
                <Form.Item name='category'>
                  <Select placeholder='Loại giày' options={optionCategories} />
                </Form.Item>
                <Form.Item name='price'>
                  <Select placeholder='Giá tiền' options={optionsPrices} />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" className="filter-button">Lọc</Button>
                </Form.Item>
              </Form>
            </div>
            <div className="product__list">
              {loading ? (
                <div className="loading-spinner">
                  <Spin size="large" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="no-products-message">
                  <SearchOutlined style={{ marginRight: 8 }} />
                  Không có sản phẩm phù hợp.
                </p>
              ) : (
                <Row gutter={[20, 20]}>
                  {filteredProducts.map((item) => (
                    <Col xl={6} onClick={() => showModal(item)} key={item.id}>
                      <div className="product__item">
                        <div className="product__image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="product__info">
                          <h3 className="product__name">{item.name}</h3>
                          <p className="product__description">{item.description}</p>
                          <p className="product__price">Giá: {item.price} VNĐ</p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </div>
        </div>
        <Modal title="Chi tiết sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} style={{ top: "5px" }} width={1000}>
          <Row gutter={[20, 20]} className="product__detail">
            <Col xl={12} className="product__detail-image">
              <img src={productDetail?.image} alt={productDetail?.name} />
            </Col>
            <Col xl={12} className="product__detail-info">
              <h3 className="product__detail-name">Tên sản phẩm: {productDetail?.name}</h3>
              <p className="product__detail-description"><strong>Mô tả:</strong> {productDetail?.description}</p>
              <p className="product__detail-brand"><strong>Thương hiệu:</strong> {productDetail?.brand}</p>
              <p className="product__detail-category"><strong>Loại giày:</strong> {productDetail?.category}</p>
              <Space direction="horizontal">
                <label htmlFor='chooseSize'><strong style={{ color: "#fff", fontSize: "16px" }}>Chọn size: </strong></label>
                <Select id="chooseSize" onChange={(e) => { handleChangeSize(e) }} value={productDetail?.size[indexSize].size} className="product__detail-size">
                  {productDetail?.size.map((item, index) => (
                    <Select.Option value={index} key={index}>{item.size}</Select.Option>
                  ))}
                </Select>
              </Space>
              <p className="product__detail-stock"><strong>Số lượng:</strong> {stocks}</p>
              <p className="product__detail-status"><strong>Trạng thái:</strong>
                {stocks === 0 ? <Tag style={{ marginLeft: "10px" }} color="red">Hết hàng</Tag> : <Tag style={{ marginLeft: "10px" }} color="green">Còn hàng</Tag>}
              </p>
              <p className="product__detail-price">Giá: {productDetail?.price} VNĐ</p>
            </Col>
            <Col xl={24} style={{ textAlign: "center", display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button onClick={handleAddToCart} disabled={stocks === 0} size="large">Thêm vào giỏ hàng</Button>
              <Button onClick={handleBuyNow} disabled={stocks === 0} size="large" type="primary" style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}>Mua ngay</Button>
            </Col>
          </Row>
        </Modal>
        <QuickOrderModal
          open={isQuickOrderOpen}
          onClose={() => setIsQuickOrderOpen(false)}
          product={quickOrderProduct}
          user={user}
          onSuccess={(msg) => openNotification('Thành công', msg, 'success')}
          onError={(msg) => openNotification('Thất bại', msg, 'error')}
        />
      </div>
    </>
  );
}

export default Home;