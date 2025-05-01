import { useTranslation } from "react-i18next";
import { Menu, Button, Box } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useState } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        sx={{
          color: "inherit",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {i18n.language.toUpperCase()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Button
          onClick={() => changeLanguage("ru")}
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          RU
        </Button>
        <Button
          onClick={() => changeLanguage("en")}
          sx={{ width: "100%", justifyContent: "flex-start" }}
        >
          EN
        </Button>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
