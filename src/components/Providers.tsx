"use client";

import { getUnreadMessageCount } from "@/app/actions/messageActions";
import useMessageStore from "@/hooks/useMessageStore";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { NextUIProvider } from "@nextui-org/react";
// import { Session } from "inspector/promises";
import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
  userId,
  profileComplete,
}: {
  children: ReactNode;
  userId: string | null;
  profileComplete: boolean;
}) {
  const isUnreadCountSet = useRef(false);

  // Меморизируем селектор Zustand
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);

  const setUnreadCount = useCallback(
    (amount: number) => {
      if (typeof window !== "undefined") {
        updateUnreadCount(amount);
      }
    },
    [updateUnreadCount]
  );

  useEffect(() => {
    if (!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then((count) => {
        setUnreadCount(count);
        isUnreadCountSet.current = true; // Перемещено внутрь, чтобы не зависеть от выполнения API.
      });
    }
  }, [setUnreadCount, userId]);

  // Подключаем каналы только на клиенте
  usePresenceChannel(userId, profileComplete);
  useNotificationChannel(userId, profileComplete);

  return (
    <SessionProvider>
      <NextUIProvider>
        <ToastContainer position="bottom-right" hideProgressBar />
        {children}
      </NextUIProvider>
    </SessionProvider>
  );
}
