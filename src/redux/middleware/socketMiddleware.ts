import { Middleware } from "@reduxjs/toolkit";
import { ordersApi } from "../services/ordersApi";
import { notificationsApi } from "../services/notificationsApi";
import { AppDispatch } from "../store"; // Import AppDispatch type
import socket from "../../socket";

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
  if (!socket.connected) {
    socket.connect();
  }

  socket.on(
    "orderStatusUpdate",
    (data: { orderId: number; status: string }) => {
      (store.dispatch as AppDispatch)(
        ordersApi.util.updateQueryData("getUserOrders", undefined, (draft) => {
          const order = draft.find(
            (o: { id: number }) => o.id === data.orderId
          );
          if (order) {
            order.status = data.status;
          }
        })
      );
    }
  );

  socket.on(
    "notification",
    (notification: { id: number; message: string; createdAt: string }) => {
      (store.dispatch as AppDispatch)(
        notificationsApi.util.updateQueryData(
          "fetchNotifications",
          undefined,
          (draft) => {
            draft.push(notification);
          }
        )
      );
    }
  );

  return next(action);
};
