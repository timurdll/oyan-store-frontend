import React from "react";
import {
  useFetchProductsQuery,
  useDeleteProductMutation,
} from "@redux/services";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);

  const handleEdit = (id: number) => {
    navigate(`/${i18n.language}/admin/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProductId) return;

    try {
      await deleteProduct(selectedProductId).unwrap();
      refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  if (isLoading) return <div>Загрузка продуктов...</div>;
  if (isError) return <div>Ошибка загрузки продуктов</div>;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Управление товарами</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/${i18n.language}/admin/add`)}
        >
          Добавить товар
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price.toFixed(2)} ₸</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <ProductTranslationManager
                      productId={product.id}
                      productName={product.name}
                      productInfo={product.productInfo}
                      productCharacteristics={product.productCharacteristics}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить этот товар?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Нет</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
