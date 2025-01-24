import React, { useState, useEffect } from "react";
import {
  useFetchNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@redux/services/notificationsApi";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  CircularProgress,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "./Alert"; // Импорт Alert компонента
import socket from "../../socket";
import styles from "@styles/notifications.module.scss";

const NotificationsMenu: React.FC = () => {
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useFetchNotificationsQuery({});
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null); // Состояние для Alert
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    setUnreadCount(notifications?.filter((n: any) => !n.read).length || 0);

    // Обработка уведомлений через WebSocket
    socket.on("notification", (message: string) => {
      console.log("Получено уведомление:", message);
      setAlert({ message, type: "success" }); // Установить сообщение Alert
      refetch();
    });

    return () => {
      socket.off("notification");
    };
  }, [notifications]);

  useEffect(() => {
    setUnreadCount(notifications?.filter((n: any) => !n.read).length || 0);
  }, [notifications]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    handleMarkAllAsRead();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead({});
  };

  const handleAlertClose = () => {
    setAlert(null); // Закрыть Alert
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="notifications"
        sx={{ padding: 0 }}
      >
        <NotificationsNoneIcon
          sx={{ width: "25px", height: "25px", fill: "black" }}
        />
        {unreadCount > 0 && (
          <span className={styles.itemCount}>{unreadCount}</span>
        )}
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: isMobile ? "bottom" : "top",
          horizontal: "center",
        }}
        disableScrollLock
        sx={{
          top: isMobile ? "-12px" : "16px",
        }}
      >
        <Box
          sx={{
            p: 2,
            minWidth: "300px",
            maxWidth: "400px",
            maxHeight: "400px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#aaa",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isError ? (
            <Typography color="error">Ошибка загрузки уведомлений</Typography>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <Box
                key={notification.id}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: "8px",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="body2">{notification.message}</Typography>
              </Box>
            ))
          ) : (
            <Typography>Нет уведомлений</Typography>
          )}
        </Box>
      </Popover>

      {/* Рендер Alert при наличии уведомления */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
        />
      )}
    </>
  );
};

export default NotificationsMenu;
