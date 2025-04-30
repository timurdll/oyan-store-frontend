import React, { useState } from "react";
import {
  useFetchTypesQuery,
  useAddTypeMutation,
  useDeleteTypeMutation,
  useUpdateTypeMutation,
} from "@redux/services/typeApi";
import {
  useGetSupportedLanguagesQuery,
  useGetTypeTranslationQuery,
  useUpdateTypeTranslationMutation,
} from "@redux/services/translationsApi";
import { Button, Form, Input, Table, Space, Modal, message } from "antd";
import { DeleteOutlined, TranslationOutlined } from "@ant-design/icons";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface Type {
  id: number;
  name: string;
}

interface Language {
  id: number;
  code: string;
  name: string;
}

interface TypeTranslation {
  languageId: number;
  name: string;
}

const TypeManagement: React.FC = () => {
  const { data: types, refetch } = useFetchTypesQuery({});
  const { data: languages } = useGetSupportedLanguagesQuery({});
  const [addType] = useAddTypeMutation();
  const [deleteType] = useDeleteTypeMutation();
  const [updateType] = useUpdateTypeMutation();
  const [updateTypeTranslation] = useUpdateTypeTranslationMutation();

  const [isTranslationModalVisible, setIsTranslationModalVisible] =
    useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);
  const [selectedType, setSelectedType] = useState<Type | null>(null);
  const [translationForm] = Form.useForm();
  const [newTypeName, setNewTypeName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const { data: translation } = useGetTypeTranslationQuery(
    selectedType?.id
      ? {
          id: selectedType.id,
          language: "ru",
        }
      : { id: 0, language: "ru" },
    {
      skip: !selectedType,
    }
  );

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      try {
        await deleteType(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Error deleting type:", error);
      }
    }
  };

  const handleTranslationModalOpen = (type: Type) => {
    setSelectedType(type);
    setIsTranslationModalVisible(true);

    // Создаем массив переводов для каждого языка
    const initialValues = languages?.map((lang: Language) => {
      const existingTranslation = translation?.find(
        (t: TypeTranslation) => t.languageId === lang.id
      );
      return {
        languageId: lang.id,
        name: existingTranslation?.name || "",
      };
    });

    translationForm.setFieldsValue({
      translations: initialValues,
    });
  };

  const handleTranslationModalOk = async () => {
    if (!selectedType) return;

    try {
      const values = await translationForm.validateFields();
      const formattedTranslations = values.translations.map(
        (translation: any) => ({
          languageId: translation.languageId,
          name: translation.name,
        })
      );

      await Promise.all(
        formattedTranslations.map((t: { languageId: number; name: string }) =>
          updateTypeTranslation({
            id: selectedType.id,
            language:
              languages?.find((l: Language) => l.id === t.languageId)?.code ||
              "ru",
            name: t.name,
          }).unwrap()
        )
      );

      message.success("Переводы успешно обновлены");
      setIsTranslationModalVisible(false);
    } catch (error) {
      message.error("Ошибка при сохранении переводов");
    }
  };

  const handleOpenDialog = (type?: Type) => {
    if (type) {
      setEditingType(type);
      setNewTypeName(type.name);
    } else {
      setEditingType(null);
      setNewTypeName("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingType(null);
    setNewTypeName("");
  };

  const handleSave = async () => {
    try {
      if (editingType?.id) {
        await updateType({ id: editingType.id, name: newTypeName }).unwrap();
      } else {
        await addType({ name: newTypeName }).unwrap();
      }
      handleCloseDialog();
      refetch();
    } catch (error) {
      console.error("Error saving type:", error);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Управление типами</Typography>
        <Button onClick={() => handleOpenDialog()} type="primary">
          <AddIcon /> Добавить тип
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types?.map((type: Type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>
                  <Space>
                    <Button
                      onClick={() => handleOpenDialog(type)}
                      type="primary"
                    >
                      Редактировать
                    </Button>
                    <Button onClick={() => handleDelete(type.id)} danger>
                      <DeleteOutlined />
                    </Button>
                    <Button onClick={() => handleTranslationModalOpen(type)}>
                      <TranslationOutlined />
                    </Button>
                  </Space>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingType ? "Редактировать тип" : "Добавить тип"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название типа"
            fullWidth
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSave} type="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        title="Переводы"
        open={isTranslationModalVisible}
        onOk={handleTranslationModalOk}
        onCancel={() => setIsTranslationModalVisible(false)}
        width={800}
      >
        <Form form={translationForm} layout="vertical">
          {languages?.map((language: Language) => (
            <Form.Item
              key={language.id}
              label={language.name}
              name={["translations", language.id - 1, "name"]}
            >
              <Input />
              <Form.Item
                name={["translations", language.id - 1, "languageId"]}
                hidden
                initialValue={language.id}
              >
                <Input type="hidden" />
              </Form.Item>
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </Box>
  );
};

export default TypeManagement;
