// src/hooks/useNotificationSetting.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSetting,
  updateNotificationSetting,
} from "@/libs/api"; // libs/api.ts
import {
  NotificationSettingRequest,
  NotificationSettingResponse,
} from "@/types/api/user";

/**
 * 通知設定取得
 */
export function useNotificationSetting() {
  return useQuery<NotificationSettingResponse, Error>({
    queryKey: ["notificationSetting"],
    queryFn: getNotificationSetting,
  });
}

/**
 * 通知設定更新
 */
export function useUpdateNotificationSetting() {
  const queryClient = useQueryClient();

  return useMutation<
    NotificationSettingResponse,
    Error,
    NotificationSettingRequest
  >({
    mutationFn: (payload) => updateNotificationSetting(payload),
    onSuccess: (data) => {
      // 最新の通知設定を再取得
      queryClient.invalidateQueries(["notificationSetting"]);
    },
  });
}
