import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Container,
  InputLabel,
  Divider,
  Card,
  IconButton,
  Tooltip,
  Alert as MuiAlert,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  useGetSupportedLanguagesQuery,
  useGetCharacteristicTranslationQuery,
  useUpdateCharacteristicTranslationMutation,
  useGetProductCharacteristicTranslationQuery,
  useUpdateProductCharacteristicTranslationMutation,
} from "@redux/services/translationsApi";
import { useFetchTypesQuery } from "@redux/services/typeApi";
import { SelectChangeEvent } from "@mui/material/Select";

interface Type {
  id: number;
  name: string;
  characteristics: Characteristic[];
}

interface Characteristic {
  id: number;
  name: string;
  productCharacteristics?: ProductCharacteristic[];
}

interface ProductCharacteristic {
  id: number;
  description: string;
}

// Component for rendering a single product characteristic
const ProductCharacteristicRow: React.FC<{
  prodChar: ProductCharacteristic;
  language: string;
  isEditing: boolean;
  onTranslationChange: (value: string) => void;
}> = ({ prodChar, language, isEditing, onTranslationChange }) => {
  const { data: translation } = useGetProductCharacteristicTranslationQuery({
    id: prodChar.id,
    language,
  });

  if (isEditing) {
    return (
      <Box key={prodChar.id} mb={2}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          gutterBottom
        >
          Оригинал: {prodChar.description}
        </Typography>
        <TextField
          value={translation?.description || ""}
          onChange={(e) => onTranslationChange(e.target.value)}
          fullWidth
          size="small"
          placeholder={`Перевод для "${prodChar.description}"`}
        />
        <Divider sx={{ my: 1 }} />
      </Box>
    );
  }

  return (
    <Box key={prodChar.id} mb={1}>
      <Typography variant="caption" color="text.secondary" display="block">
        {prodChar.description}:
      </Typography>
      {translation?.description ? (
        <Chip
          label={translation.description}
          size="small"
          color="primary"
          variant="outlined"
        />
      ) : (
        <Typography color="text.secondary" variant="body2">
          Нет перевода
        </Typography>
      )}
    </Box>
  );
};

// Component for rendering a characteristic row
const CharacteristicRow: React.FC<{
  char: Characteristic;
  language: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onTranslationChange: (value: string, valueId?: number) => void;
}> = ({ char, language, isEditing, onEdit, onSave, onTranslationChange }) => {
  const { data: translation } = useGetCharacteristicTranslationQuery({
    id: char.id,
    language,
  });

  return (
    <TableRow>
      <TableCell>
        <Typography variant="body1">{char.name}</Typography>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            value={translation?.name || ""}
            onChange={(e) => onTranslationChange(e.target.value)}
            fullWidth
            size="small"
            placeholder={`Перевод для "${char.name}"`}
          />
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            {translation?.name ? (
              <Chip
                label={translation.name}
                color="primary"
                variant="outlined"
              />
            ) : (
              <Typography color="text.secondary" variant="body2">
                Нет перевода
              </Typography>
            )}
          </Box>
        )}
      </TableCell>
      <TableCell>
        <Box>
          {char.productCharacteristics?.map((prodChar) => (
            <ProductCharacteristicRow
              key={prodChar.id}
              prodChar={prodChar}
              language={language}
              isEditing={isEditing}
              onTranslationChange={(value) =>
                onTranslationChange(value, prodChar.id)
              }
            />
          ))}
        </Box>
      </TableCell>
      <TableCell>
        <Box>
          {isEditing ? (
            <>
              <Tooltip title="Сохранить">
                <IconButton onClick={onSave} color="primary" size="small">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Отменить">
                <IconButton onClick={onEdit} color="error" size="small">
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Редактировать">
              <IconButton onClick={onEdit} color="primary" size="small">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

const CharacteristicsTranslationsPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: languages, isLoading: isLanguagesLoading } =
    useGetSupportedLanguagesQuery(undefined);
  const { data: types, isLoading: isTypesLoading } =
    useFetchTypesQuery(undefined);

  const selectedTypeData = types?.find((t: Type) => t.id === selectedType);

  const [updateCharacteristicTranslation] =
    useUpdateCharacteristicTranslationMutation();
  const [updateProductCharacteristicTranslation] =
    useUpdateProductCharacteristicTranslationMutation();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent<number>) => {
    setSelectedType(event.target.value as number);
  };

  const handleEditClick = (characteristicId: number) => {
    setIsEditing((prev) => ({
      ...prev,
      [characteristicId]: !prev[characteristicId],
    }));
  };

  const handleTranslationChange = async (
    characteristicId: number,
    value: string,
    valueId?: number
  ) => {
    try {
      if (valueId !== undefined) {
        await updateProductCharacteristicTranslation({
          id: valueId,
          language: selectedLanguage,
          description: value,
        }).unwrap();
      } else {
        await updateCharacteristicTranslation({
          id: characteristicId,
          language: selectedLanguage,
          name: value,
        }).unwrap();
      }
    } catch (error) {
      console.error("Error updating translation:", error);
      setSnackbar({
        open: true,
        message: "Не удалось обновить перевод",
        severity: "error",
      });
    }
  };

  const handleSaveTranslation = async (characteristicId: number) => {
    if (!selectedLanguage) {
      setSnackbar({
        open: true,
        message: "Пожалуйста, выберите язык",
        severity: "error",
      });
      return;
    }

    try {
      setIsEditing((prev) => ({
        ...prev,
        [characteristicId]: false,
      }));
      setSnackbar({
        open: true,
        message: "Переводы успешно сохранены",
        severity: "success",
      });
    } catch (error: any) {
      console.error("Error saving translations:", error);
      let errorMessage = "Ошибка при сохранении переводов";

      if (error.status === 401) {
        errorMessage = "Необходима авторизация. Пожалуйста, войдите снова.";
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  if (isLanguagesLoading || isTypesLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!languages?.length || !types?.length) {
    return (
      <Container>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Переводы характеристик
          </Typography>
          <MuiAlert severity="warning">
            {!languages?.length
              ? "Нет доступных языков"
              : "Нет доступных типов"}
          </MuiAlert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Переводы характеристик
        </Typography>

        <Card sx={{ p: 3, mb: 4 }}>
          <Box display="flex" gap={2} mb={3}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Язык</InputLabel>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                label="Язык"
              >
                {languages.map((lang: string) => (
                  <MenuItem key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Тип</InputLabel>
              <Select
                value={selectedType || ""}
                onChange={handleTypeChange}
                label="Тип"
              >
                {types.map((type: Type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {selectedLanguage && selectedType ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Оригинальное название
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Перевод</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Значения</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedTypeData?.characteristics.map(
                    (char: Characteristic) => (
                      <CharacteristicRow
                        key={char.id}
                        char={char}
                        language={selectedLanguage}
                        isEditing={isEditing[char.id]}
                        onEdit={() => handleEditClick(char.id)}
                        onSave={() => handleSaveTranslation(char.id)}
                        onTranslationChange={(value, valueId) =>
                          handleTranslationChange(char.id, value, valueId)
                        }
                      />
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <MuiAlert severity="info">
              Пожалуйста, выберите язык и тип для управления переводами
            </MuiAlert>
          )}
        </Card>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CharacteristicsTranslationsPage;
