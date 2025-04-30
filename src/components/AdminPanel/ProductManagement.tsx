import React from "react";
import {
  useFetchProductsQuery,
  useDeleteProductMutation,
} from "@redux/services";
import { Button, Table, Space, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProductTranslationManager from "./ProductTranslationManager";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  productInfo?: {
    id: number;
    title: string;
    description: string;
  };
  productCharacteristics?: Array<{
    id: number;
    description: string;
    characteristic: {
      id: number;
      name: string;
    };
  }>;
}

const ProductManagement: React.FC = () => {
  const { i18n } = useTranslation();
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useFetchProductsQuery({ language: i18n.language.toUpperCase() });
  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/${i18n.language}/admin/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Подтверждение удаления",
      content: "Вы уверены, что хотите удалить этот товар?",
      okText: "Да",
      okType: "danger",
      cancelText: "Нет",
      onOk: async () => {
        try {
          await deleteProduct(id).unwrap();
          message.success("Товар успешно удален");
          refetch();
        } catch (error) {
          message.error("Ошибка при удалении товара");
          console.error("Error deleting product:", error);
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toFixed(2)} ₸`,
    },
    {
      title: "Количество",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          />
          <ProductTranslationManager
            productId={record.id}
            productName={record.name}
            productInfo={record.productInfo}
            productCharacteristics={record.productCharacteristics}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Загрузка продуктов...</div>;
  if (isError) return <div>Ошибка загрузки продуктов</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Управление товарами</h2>
        <Button
          type="primary"
          onClick={() => navigate(`/${i18n.language}/admin/add`)}
        >
          Добавить товар
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ProductManagement;
