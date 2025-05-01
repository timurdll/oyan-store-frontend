import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useFetchTypesQuery,
  useAddTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} from "../../redux/services/typeApi";
import { useGetSupportedLanguagesQuery } from "../../redux/services/translationsApi";
import {
  Button,
  TextField,
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
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface Type {
  id: string;
  name: string;
  translations?: Record<string, string>;
}

interface TypeResponse {
  data: Type[];
  isLoading: boolean;
}

const TypeManagement = () => {
  const { t } = useTranslation();
  const { data: types = [], isLoading } = useFetchTypesQuery(
    {}
  ) as TypeResponse;
  const { data: languages = [] } = useGetSupportedLanguagesQuery({});
  const [addType] = useAddTypeMutation();
  const [updateType] = useUpdateTypeMutation();
  const [deleteType] = useDeleteTypeMutation();

  const [open, setOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);
  const [typeName, setTypeName] = useState("");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (editingType) {
      setTypeName(editingType.name);
      setTranslations(editingType.translations || {});
    } else {
      setTypeName("");
      setTranslations({});
    }
  }, [editingType]);

  const handleOpen = () => {
    setEditingType(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingType(null);
  };

  const handleSubmit = async () => {
    try {
      const typeData = {
        name: typeName,
        translations,
      };

      if (editingType) {
        await updateType({ id: editingType.id, ...typeData }).unwrap();
        setSnackbar({
          open: true,
          message: t("typeUpdated"),
          severity: "success",
        });
      } else {
        await addType(typeData).unwrap();
        setSnackbar({
          open: true,
          message: t("typeCreated"),
          severity: "success",
        });
      }
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("errorOccurred"),
        severity: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteType(id).unwrap();
      setSnackbar({
        open: true,
        message: t("typeDeleted"),
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("errorOccurred"),
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">{t("typeManagement")}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          {t("addType")}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("translations")}</TableCell>
              <TableCell>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type: Type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>
                  {Object.entries(type.translations || {}).map(
                    ([lang, text]) => (
                      <Typography key={lang} variant="body2">
                        {lang}: {text as string}
                      </Typography>
                    )
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => setEditingType(type)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(type.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingType ? t("editType") : t("addType")}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t("name")}
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            margin="normal"
          />
          {languages.map((lang: string) => (
            <TextField
              key={lang}
              fullWidth
              label={`${t("translation")} (${lang})`}
              value={translations[lang] || ""}
              onChange={(e) =>
                setTranslations({ ...translations, [lang]: e.target.value })
              }
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingType ? t("save") : t("add")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TypeManagement;
