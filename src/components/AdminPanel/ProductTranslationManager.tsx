import React, { useState } from "react";
import {
  useGetSupportedLanguagesQuery,
  useGetProductTranslationQuery,
  useGetProductInfoTranslationQuery,
  useUpdateProductTranslationMutation,
  useUpdateProductInfoTranslationMutation,
  useUpdateCharacteristicTranslationMutation,
  useUpdateProductCharacteristicTranslationMutation,
} from "@redux/services/translationsApi";
import {
  Tab,
  Tabs,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  FormControl,
  FormLabel,
  FormGroup,
  Divider,
} from "@mui/material";
import { Save as SaveIcon, TranslateOutlined } from "@mui/icons-material";

interface ProductTranslationManagerProps {
  productId: number;
  productName: string;
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

const ProductTranslationManager: React.FC<ProductTranslationManagerProps> = ({
  productId,
  productName,
  productInfo,
  productCharacteristics,
}) => {
  const { data: languages } = useGetSupportedLanguagesQuery({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [productNameTranslation, setProductNameTranslation] = useState("");
  const [productInfoTitleTranslation, setProductInfoTitleTranslation] =
    useState("");
  const [productInfoDescTranslation, setProductInfoDescTranslation] =
    useState("");
  const [characteristicTranslations, setCharacteristicTranslations] = useState<{
    [key: number]: { nameTranslation: string; descriptionTranslation: string };
  }>({});

  const { data: productTranslation } = useGetProductTranslationQuery(
    { id: productId, language: selectedLanguage },
    { skip: !selectedLanguage || !isDialogOpen }
  );

  const { data: productInfoTranslation } = useGetProductInfoTranslationQuery(
    { id: productInfo?.id || 0, language: selectedLanguage },
    { skip: !selectedLanguage || !isDialogOpen || !productInfo?.id }
  );

  const [updateProductTranslation] = useUpdateProductTranslationMutation();
  const [updateProductInfoTranslation] =
    useUpdateProductInfoTranslationMutation();
  const [updateCharacteristicTranslation] =
    useUpdateCharacteristicTranslationMutation();
  const [updateProductCharacteristicTranslation] =
    useUpdateProductCharacteristicTranslationMutation();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    // Default to the first language in the list
    if (languages && languages.length > 0) {
      setSelectedLanguage(languages[0]);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLanguage("");
    setProductNameTranslation("");
    setProductInfoTitleTranslation("");
    setProductInfoDescTranslation("");
    setActiveTab(0);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    // Reset form values when language changes
    setProductNameTranslation("");
    setProductInfoTitleTranslation("");
    setProductInfoDescTranslation("");
  };

  // When product translation data is loaded
  React.useEffect(() => {
    if (productTranslation) {
      setProductNameTranslation(productTranslation.name || "");
    }
  }, [productTranslation]);

  // When product info translation data is loaded
  React.useEffect(() => {
    if (productInfoTranslation) {
      setProductInfoTitleTranslation(productInfoTranslation.title || "");
      setProductInfoDescTranslation(productInfoTranslation.description || "");
    }
  }, [productInfoTranslation]);

  // Load characteristic translations when language changes
  React.useEffect(() => {
    if (selectedLanguage && productCharacteristics) {
      const loadCharacteristicTranslations = async () => {
        const translations: {
          [key: number]: {
            nameTranslation: string;
            descriptionTranslation: string;
          };
        } = {};

        for (const char of productCharacteristics) {
          try {
            const nameResponse = await fetch(
              `/translations/characteristic/${char.characteristic.id}/${selectedLanguage}`
            );
            const descResponse = await fetch(
              `/translations/product-characteristic/${char.id}/${selectedLanguage}`
            );

            const nameData = await nameResponse.json();
            const descData = await descResponse.json();

            translations[char.characteristic.id] = {
              nameTranslation: nameData?.name || "",
              descriptionTranslation: descData?.description || "",
            };
          } catch (error) {
            console.error("Error loading characteristic translations:", error);
          }
        }

        setCharacteristicTranslations(translations);
      };

      loadCharacteristicTranslations();
    }
  }, [selectedLanguage, productCharacteristics]);

  const handleSaveProductTranslation = async () => {
    if (!selectedLanguage) return;

    try {
      await updateProductTranslation({
        id: productId,
        language: selectedLanguage,
        name: productNameTranslation,
      }).unwrap();

      console.log(
        `Перевод названия товара успешно обновлен для языка ${selectedLanguage}`
      );
    } catch (error) {
      console.error("Ошибка при сохранении перевода названия товара", error);
    }
  };

  const handleSaveProductInfoTranslation = async () => {
    if (!selectedLanguage || !productInfo?.id) return;

    try {
      await updateProductInfoTranslation({
        id: productInfo.id,
        language: selectedLanguage,
        title: productInfoTitleTranslation,
        description: productInfoDescTranslation,
      }).unwrap();

      console.log(
        `Перевод информации о товаре успешно обновлен для языка ${selectedLanguage}`
      );
    } catch (error) {
      console.error(
        "Ошибка при сохранении перевода информации о товаре",
        error
      );
    }
  };

  const handleSaveCharacteristicTranslations = async () => {
    if (!selectedLanguage || !productCharacteristics) return;

    try {
      for (const char of productCharacteristics) {
        const translation = characteristicTranslations[char.characteristic.id];
        if (!translation) continue;

        // Update characteristic name translation
        if (translation.nameTranslation) {
          await updateCharacteristicTranslation({
            id: char.characteristic.id,
            language: selectedLanguage,
            name: translation.nameTranslation,
          }).unwrap();
        }

        // Update characteristic description translation
        if (translation.descriptionTranslation) {
          await updateProductCharacteristicTranslation({
            id: char.id,
            language: selectedLanguage,
            description: translation.descriptionTranslation,
          }).unwrap();
        }
      }

      console.log(
        `Переводы характеристик успешно обновлены для языка ${selectedLanguage}`
      );
    } catch (error) {
      console.error("Ошибка при сохранении переводов характеристик", error);
    }
  };

  const handleCharacteristicTranslationChange = (
    characteristicId: number,
    field: "nameTranslation" | "descriptionTranslation",
    value: string
  ) => {
    setCharacteristicTranslations((prev) => ({
      ...prev,
      [characteristicId]: {
        ...prev[characteristicId],
        [field]: value,
      },
    }));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <IconButton
        color="primary"
        onClick={handleOpenDialog}
        title="Управление переводами товара"
      >
        <TranslateOutlined />
      </IconButton>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Управление переводами товара: {productName}</DialogTitle>
        <DialogContent>
          {languages && languages.length > 0 ? (
            <>
              <FormControl fullWidth margin="normal">
                <FormLabel>Выберите язык</FormLabel>
                <FormGroup row>
                  {languages.map((lang: string) => (
                    <Button
                      key={lang}
                      variant={
                        selectedLanguage === lang ? "contained" : "outlined"
                      }
                      onClick={() => handleLanguageChange(lang)}
                      style={{ marginRight: 8, marginBottom: 8 }}
                    >
                      {lang}
                    </Button>
                  ))}
                </FormGroup>
              </FormControl>

              {selectedLanguage && (
                <>
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Основная информация" />
                    {productInfo && <Tab label="Дополнительная информация" />}
                    {productCharacteristics &&
                      productCharacteristics.length > 0 && (
                        <Tab label="Характеристики" />
                      )}
                  </Tabs>

                  {activeTab === 0 && (
                    <Card
                      variant="outlined"
                      style={{ padding: 16, marginTop: 16 }}
                    >
                      <FormControl fullWidth margin="normal">
                        <FormLabel>Название товара</FormLabel>
                        <TextField
                          fullWidth
                          value={productNameTranslation}
                          onChange={(e) =>
                            setProductNameTranslation(e.target.value)
                          }
                          placeholder={productName}
                          margin="normal"
                        />
                        <Button
                          variant="contained"
                          onClick={handleSaveProductTranslation}
                          startIcon={<SaveIcon />}
                        >
                          Сохранить перевод названия
                        </Button>
                      </FormControl>
                    </Card>
                  )}

                  {activeTab === 1 && productInfo && (
                    <Card
                      variant="outlined"
                      style={{ padding: 16, marginTop: 16 }}
                    >
                      <FormControl fullWidth margin="normal">
                        <FormLabel>Заголовок описания</FormLabel>
                        <TextField
                          fullWidth
                          value={productInfoTitleTranslation}
                          onChange={(e) =>
                            setProductInfoTitleTranslation(e.target.value)
                          }
                          placeholder={productInfo.title}
                          margin="normal"
                        />
                        <FormLabel>Описание</FormLabel>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          value={productInfoDescTranslation}
                          onChange={(e) =>
                            setProductInfoDescTranslation(e.target.value)
                          }
                          placeholder={productInfo.description}
                          margin="normal"
                        />
                        <Button
                          variant="contained"
                          onClick={handleSaveProductInfoTranslation}
                          startIcon={<SaveIcon />}
                        >
                          Сохранить перевод информации
                        </Button>
                      </FormControl>
                    </Card>
                  )}

                  {activeTab === 2 && productCharacteristics && (
                    <Card
                      variant="outlined"
                      style={{ padding: 16, marginTop: 16 }}
                    >
                      <List>
                        {productCharacteristics.map((char) => (
                          <React.Fragment key={char.id}>
                            <ListItem>
                              <FormControl fullWidth>
                                <FormLabel>
                                  Характеристика: {char.characteristic.name}
                                </FormLabel>
                                <TextField
                                  fullWidth
                                  value={
                                    characteristicTranslations[
                                      char.characteristic.id
                                    ]?.nameTranslation || ""
                                  }
                                  onChange={(e) =>
                                    handleCharacteristicTranslationChange(
                                      char.characteristic.id,
                                      "nameTranslation",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Перевод названия характеристики"
                                  margin="normal"
                                />
                                <FormLabel>
                                  Значение: {char.description}
                                </FormLabel>
                                <TextField
                                  fullWidth
                                  value={
                                    characteristicTranslations[
                                      char.characteristic.id
                                    ]?.descriptionTranslation || ""
                                  }
                                  onChange={(e) =>
                                    handleCharacteristicTranslationChange(
                                      char.characteristic.id,
                                      "descriptionTranslation",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Перевод значения характеристики"
                                  margin="normal"
                                />
                              </FormControl>
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        ))}
                      </List>
                      <Button
                        variant="contained"
                        onClick={handleSaveCharacteristicTranslations}
                        startIcon={<SaveIcon />}
                        style={{ marginTop: 16 }}
                      >
                        Сохранить переводы характеристик
                      </Button>
                    </Card>
                  )}
                </>
              )}
            </>
          ) : (
            <Typography>Загрузка списка языков...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductTranslationManager;
