// src/hooks/useChangePassword.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/libs/api"; // libs/api.ts
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/types/api/user";

/**
 * パスワード変更
 */
export function useChangePassword() {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
    mutationFn: (payload) => changePassword(payload),
  });
}
