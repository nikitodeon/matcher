import PusherServer from "pusher";
import PusherClient from "pusher-js";

const CLUSTER = process.env.PUSHER_CLUSTER || "eu"; // Используем кластер из переменной окружения

declare global {
  var pusherServerInstance: PusherServer | undefined;
  var pusherClientInstance: PusherClient | undefined;
}

// Создаём экземпляр серверного клиента Pusher
if (!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!, // ID приложения
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, // Публичный ключ
    secret: process.env.PUSHER_SECRET!, // Секретный ключ
    cluster: CLUSTER, // Кластер
    useTLS: true, // Использование HTTPS
  });
}

// Создаём экземпляр клиентского клиента Pusher
if (!global.pusherClientInstance) {
  global.pusherClientInstance = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, // Публичный ключ
    {
      cluster: CLUSTER, // Кластер
      channelAuthorization: {
        endpoint: "/api/pusher-auth", // Точка авторизации
        transport: "ajax",
      },
    }
  );
}

export const pusherServer = global.pusherServerInstance;
export const pusherClient = global.pusherClientInstance;
