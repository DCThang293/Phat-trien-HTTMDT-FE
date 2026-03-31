import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import './ManageProducts.scss';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [selectedSizeIndices, setSelectedSizeIndices] = useState({}); // Lưu chỉ số size của từng sản phẩm
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang chỉnh sửa
  const [form] = Form.useForm();
  const [currentStock, setCurrentStock] = useState(0); // Thêm state để lưu stock khi chọn size
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Hiển thị modal thêm sản phẩm
  const [addForm] = Form.useForm(); // Form cho modal thêm sản phẩm
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const getProducts = async () => {
    const response = await fetch(`/product/user/all`);
    const data = await response.json();
    setProducts(data.data.reverse());
    return data.data;
  };

  const getBrands = async () => {
    const response = await fetch(`/brand/get/all`);
    const data = await response.json();
    setBrands(data.data);
    return data.data;
  }

  const getCategories = async () => {
    const response = await fetch(`/category/get/all`);
    const data = await response.json();
    setCategories(data.data);
    return data.data;
  }

  useEffect(() => {
    getProducts();
    getBrands();
    getCategories();
  }, []);

  const handleChangeSize = (value, productId) => {
    // Cập nhật lại chỉ số size của sản phẩm theo productId
    setSelectedSizeIndices((prevState) => ({
      ...prevState,
      [productId]: value, // Lưu giá trị index size theo productId
    }));

    // Cập nhật stock khi chọn size
    const selectedSize = products.find((product) => product.id === productId)
      ?.size[value];
    if (selectedSize) {
      setCurrentStock(selectedSize.stock); // Cập nhật stock tương ứng
    }
  };
  // Hàm xử lý khi nhấn chỉnh sửa
  const onEdit = (record) => {
    setEditingProduct(record);
    setIsEditModalVisible(true);

    // Lấy size và stock đầu tiên làm mặc định
    const defaultSizeIndex = 0;
    const defaultStock = record.size[defaultSizeIndex]?.stock || 0;

    form.setFieldsValue({
      name: record.name,
      image: record.image,
      description: record.description,
      brand: record.brand,
      category: record.category,
      price: record.price,
      selectedSize: defaultSizeIndex, // Size mặc định
      stock: defaultStock, // Stock mặc định
    });
  };

  // Hàm xử lý khi lưu thông tin sản phẩm đã chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      const values = form.getFieldsValue();

      // Cập nhật stock cho size được chọn
      const updatedSizes = editingProduct.size.map((item, index) => ({
        ...item,
        stock: index === values.selectedSize ? values.stock : item.stock,
      }));

      const updatedProduct = {
        productId: editingProduct.id,
        name: values.name,
        urlImage: values.image,
        description: values.description,
        brandName: values.brand,
        categoryName: values.category,
        price: values.price,
        addSizeRequest: {
          size: editingProduct.size[values.selectedSize].size,
          quantity: values.stock
        }, // Cập nhật danh sách size
      };
      await fetch(`/product/admin/update`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
         },
        body: JSON.stringify(updatedProduct),
      });

      message.success("Cập nhật sản phẩm thành công!");
      await getProducts(); // Load lại danh sách sản phẩm
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật sản phẩm!");
    }
  };

  // Hàm xử lý xóa
  const onDelete = (record) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await fetch(`/product/admin/delete?id=${record.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
             },
          });
          message.success("Xóa sản phẩm thành công!");
          setProducts(products.filter((product) => product.id !== record.id));
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa sản phẩm!");
        }
      },
    });
  };

  const handleAddProduct = async () => {
    try {
      const values = addForm.getFieldsValue();
      const newProduct = {
        ...values,
        size: values.size.map((item, index) => ({
          size: item.size,
          quantity: item.stock,
        })),
      };
  
      const response = await fetch(`/product/admin/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
         },
        body: JSON.stringify(
          {
            name: newProduct.name,
            urlImage: newProduct.image,
            description: newProduct.description,
            brandName: newProduct.brand,
            categoryName: newProduct.category,
            price: newProduct.price,
            addSizeRequests: newProduct.size
          }
        ),
      });
      console.log(response);
  
      message.success("Thêm sản phẩm mới thành công!");
      setIsAddModalVisible(false);
      addForm.resetFields();
      getProducts(); // Load lại danh sách sản phẩm
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm sản phẩm!");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "productImage",
      render: (text) => <Image src={text} width={80} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "productName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "productDescription",
      width: 200,
      render: (text) => (
        <div className="description-cell" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "productBrand",
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "productCategory",
    },
    {
      title: "Size",
      key: "size",
      render: (text, record) => {
        const optionsSize = record.size.map((item, index) => ({
          value: index,
          label: item.size,
        }));

        const currentSizeIndex = selectedSizeIndices[record.id] || 0;

        return (
          <Select
            value={record.size[currentSizeIndex]?.size} // Hiển thị size hiện tại
            onChange={(value) => handleChangeSize(value, record.id)} // Cập nhật size khi người dùng thay đổi
            options={optionsSize}
          />
        );
      },
    },
    {
      title: "Số lượng",
      key: "stock",
      render: (text, record) => {
        const currentSizeIndex = selectedSizeIndices[record.id] || 0;
        return <>{record.size[currentSizeIndex]?.stock}</>;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "productPrice",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const currentSizeIndex = selectedSizeIndices[record.id] || 0;
        return record.size[currentSizeIndex]?.stock ? (
          <Tag color="#87d068">Còn hàng</Tag>
        ) : (
          <Tag color="#f50">Hết hàng</Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <EditOutlined
              onClick={() => onEdit(record)}
              style={{
                color: "#1890ff",
                fontSize: "18px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
            <DeleteOutlined
              onClick={() => onDelete(record)}
              style={{ color: "#ff4d4f", fontSize: "18px", cursor: "pointer" }}
            />
          </>
        );
      },
    },
  ];

  const handleSearchProducts = async (e) => {
    const data = await getProducts();

    const newProducts = data.filter((item) => {
      return item.name.toLowerCase().includes(e.nameProducts.toLowerCase());
    });
    setProducts(newProducts);
  };

  return (
    <>
      <div
        className="custom-table-container"
        style={{ marginTop: "0px", background: "none", padding: "0px" }}
      >
        <h1 className="animate__animated animate__fadeInDown">Quản lý sản phẩm</h1>
        <Row gutter={[0, 20]} style={{ width: "100%" }}>
          <Col xl={24}>
          <Button className="add-find-product" type="primary" onClick={() => setIsAddModalVisible(true)}>
            Thêm sản phẩm
          </Button>
          </Col>
          <Col xl={24}>
            <Form onFinish={handleSearchProducts}>
              <Row gutter={[20, 20]}>
                <Col xl={5}>
                  <Form.Item name="nameProducts">
                    <Input className = "area-focus" placeholder="Nhập tên sản phẩm" />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item>
                    <Button className="add-find-product" htmlType="submit" type="primary">
                      Tìm kiếm
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          className="custom-table"
          pagination={{ pageSize: 5 }}
          style={{ minWidth: "100%" }}
        />
        <Modal
          title={
            <h2 style={{textAlign: 'center'}}>Chỉnh sửa sản phẩm</h2>
          }
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onOk={handleSaveEdit}
          okText="Lưu"
          cancelText="Hủy"
          style={{ top: "70px", minWidth: "60%" }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="image"
              label="Hình ảnh (URL)"
              rules={[
                { required: true, message: "Vui lòng nhập URL hình ảnh!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="brand"
              label="Thương hiệu"
              rules={[
                { required: true, message: "Vui lòng nhập thương hiệu!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Loại sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập loại sản phẩm!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              name="selectedSize"
              label="Size"
              rules={[{ required: true, message: "Vui lòng chọn size!" }]}
            >
              <Select
                options={editingProduct?.size.map((item, index) => ({
                  label: item.size,
                  value: index,
                }))}
                onChange={(value) => {
                  const selectedStock = editingProduct.size[value]?.stock || 0;
                  form.setFieldsValue({ stock: selectedStock }); // Cập nhật số lượng tương ứng
                }}
              />
            </Form.Item>
            <Form.Item
              name="stock"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={<h2 style={{ textAlign: "center" }}>Thêm sản phẩm mới</h2>}
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          onOk={handleAddProduct}
          okText="Lưu"
          cancelText="Hủy"
          style={{ top: "70px", minWidth: "60%" }}
        >
          <Form form={addForm} layout="vertical">
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="image"
              label="Hình ảnh (URL)"
              rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="brand"
              label="Thương hiệu"
              rules={[{ required: true, message: "Vui lòng nhập thương hiệu!" }]}
            >
              <Select options={brands.map(item => ({value: item.name, label: item.name}))} />
            </Form.Item>
            <Form.Item
              name="category"
              label="Loại sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập loại sản phẩm!" }]}
            >
              <Select options={categories.map(item => ({value: item.name, label: item.name}))} />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.List name="size">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row key={key} gutter={10} align="middle">
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "size"]}
                          fieldKey={[fieldKey, "size"]}
                          rules={[{ required: true, message: "Nhập size!" }]}
                        >
                          <Input placeholder="Size (e.g., S, M, L)" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "stock"]}
                          fieldKey={[fieldKey, "stock"]}
                          rules={[{ required: true, message: "Nhập số lượng!" }]}
                        >
                          <InputNumber placeholder="Số lượng" min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Button
                          type="danger"
                          onClick={() => remove(name)}
                          style={{ width: "100%" }}
                        >
                          Xóa
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%" }}
                    >
                      + Thêm size
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>

      </div>
    </>
  );
}

export default ManageProducts;
