import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Menu, Button, Portal, Box } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<string>(
    i18n.language || "ru"
  );

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
  };

  useEffect(() => {
    setSelectedLang(i18n.language);
  }, [i18n.language]);

  const getLanguageName = (code: string) => {
    switch (code) {
      case "ru":
        return "Русский";
      case "kk":
        return "Қазақша";
      default:
        return "Русский";
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button size="sm" variant="ghost">
          <Box display="flex" alignItems="center" gap={2}>
            {getLanguageName(selectedLang)}
            <ChevronDownIcon />
          </Box>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="ru" onClick={() => changeLanguage("ru")}>
              Русский
            </Menu.Item>
            <Menu.Item value="kk" onClick={() => changeLanguage("kk")}>
              Қазақша
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default LanguageSwitcher;
