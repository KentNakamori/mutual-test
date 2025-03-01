// src/hooks/useDeleteAccount.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteMyAccount } from "@/libs/api"; // libs/api.ts
import { DeleteAccountRequest, DeleteAccountResponse } from "@/types/api/user";

/**
 * アカウント退会
 */
export function useDeleteAccount() {
  return useMutation<DeleteAccountResponse, Error, DeleteAccountRequest>({
    mutationFn: (payload) => deleteMyAccount(payload),
  });
}
