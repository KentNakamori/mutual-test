"use client";

import React from "react";

export default function SimpleFooter() {
  return (
    <footer className="w-full border-t border-gray-200 p-4 mt-8">
      <div className="max-w-6xl mx-auto text-sm text-gray-500 flex justify-between">
        <p>&copy; 2025 MyCompany Inc. All Rights Reserved.</p>
        <a href="/terms" className="underline hover:text-gray-600">
          利用規約
        </a>
      </div>
    </footer>
  );
}
