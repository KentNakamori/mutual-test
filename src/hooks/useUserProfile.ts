// src/hooks/useUserProfile.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyProfile,
  updateMyProfile,
} from "@/libs/api"; // libs/api.ts
import {
  UserProfileResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
} from "@/types/api/user"; // types/api
import { Nullable } from "@/types/utilities";

/**
 * プロフィール取得
 */
export function useMyProfile() {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
    // staleTimeやretry等、必要に応じて設定
  });
}

/**
 * プロフィール更新
 */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserProfileResponse,
    Error,
    UpdateUserProfileRequest
  >({
    mutationFn: (payload) => updateMyProfile(payload),
    onSuccess: (data) => {
      // 成功時にマイプロフィール再取得
      queryClient.invalidateQueries(["myProfile"]);
    },
  });
}
