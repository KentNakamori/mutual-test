//src/libs/validation.ts

import type { ValidationRule } from '../types/utils';

export const validators = {
  required: (value: any): boolean => {
    return value !== undefined && value !== null && value !== '';
  },

  email: (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  minLength: (min: number): ValidationRule<string> => {
    return (value) => value.length >= min || `最低${min}文字必要です`;
  },

  maxLength: (max: number): ValidationRule<string> => {
    return (value) => value.length <= max || `最大${max}文字までです`;
  },

  pattern: (regex: RegExp, message: string): ValidationRule<string> => {
    return (value) => regex.test(value) || message;
  },

  numberRange: (min: number, max: number): ValidationRule<number> => {
    return (value) => 
      (value >= min && value <= max) || `${min}から${max}の間で入力してください`;
  },

  date: (value: any): boolean => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  },

  futureDate: (value: any): boolean => {
    const date = new Date(value);
    return date > new Date();
  },

  password: (value: string): boolean => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
  },

  phone: (value: string): boolean => {
    return /^\d{10,11}$/.test(value.replace(/[-\s]/g, ''));
  }
};