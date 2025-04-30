import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  Card,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { TranslateOutlined } from "@mui/icons-material";
import { message } from "antd";
import {
  useGetSupportedLanguagesQuery,
  useGetCharacteristicTranslationQuery,
  useUpdateCharacteristicTranslationMutation,
} from "@redux/services/translationsApi";

interface CharacteristicTranslationManagerProps {
  characteristicId: number;
  characteristicName: string;
}

const CharacteristicTranslationManager: React.FC<
  CharacteristicTranslationManagerProps
> = ({ characteristicId, characteristicName }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [nameTranslation, setNameTranslation] = useState("");

  const { data: languages } = useGetSupportedLanguagesQuery({});
  const { data: translation, isFetching: isTranslationLoading } =
    useGetCharacteristicTranslationQuery(
      { id: characteristicId, language: selectedLanguage },
      { skip: !selectedLanguage || !isDialogOpen }
    );
  const [updateTranslation] = useUpdateCharacteristicTranslationMutation();

  useEffect(() => {
    if (translation) {
      setNameTranslation(translation.name || "");
    }
  }, [translation]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    if (languages && languages.length > 0) {
      setSelectedLanguage(languages[0]);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLanguage("");
    setNameTranslation("");
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    // Не очищаем nameTranslation здесь,
    // оно будет обновлено через useEffect когда придут новые данные
  };

  const handleSaveTranslation = async () => {
    if (!selectedLanguage) {
      message.error("Пожалуйста, выберите язык");
      return;
    }

    try {
      await updateTranslation({
        id: characteristicId,
        language: selectedLanguage,
        name: nameTranslation,
      }).unwrap();

      message.success(
        `Перевод характеристики успешно обновлен для языка ${selectedLanguage}`
      );
    } catch (error) {
      message.error("Ошибка при сохранении перевода характеристики");
      console.error(error);
    }
  };

  return (
    <>
      <IconButton
        color="primary"
        onClick={handleOpenDialog}
        title="Управление переводами характеристики"
      >
        <TranslateOutlined />
      </IconButton>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Управление переводами характеристики: {characteristicName}
        </DialogTitle>
        <DialogContent>
          {languages && languages.length > 0 ? (
            <>
              <FormControl fullWidth margin="normal">
                <FormLabel>Выберите язык</FormLabel>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {languages.map((lang: string) => (
                    <Button
                      key={lang}
                      variant={
                        selectedLanguage === lang ? "contained" : "outlined"
                      }
                      onClick={() => handleLanguageChange(lang)}
                      style={{ marginBottom: 8 }}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </FormControl>

              {selectedLanguage && (
                <Card variant="outlined" style={{ padding: 16, marginTop: 16 }}>
                  <FormControl fullWidth margin="normal">
                    <FormLabel>Название характеристики</FormLabel>
                    {isTranslationLoading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "20px",
                        }}
                      >
                        <CircularProgress size={24} />
                      </div>
                    ) : (
                      <TextField
                        fullWidth
                        value={nameTranslation}
                        onChange={(e) => setNameTranslation(e.target.value)}
                        placeholder={characteristicName}
                        margin="normal"
                      />
                    )}
                    <Button
                      variant="contained"
                      onClick={handleSaveTranslation}
                      style={{ marginTop: 16 }}
                      disabled={isTranslationLoading}
                    >
                      Сохранить перевод
                    </Button>
                  </FormControl>
                </Card>
              )}
            </>
          ) : (
            <div>Загрузка списка языков...</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CharacteristicTranslationManager;
