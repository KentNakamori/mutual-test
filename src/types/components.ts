// src/types/components.ts
import type { Widget, WidgetLayout } from './models';

export interface GridLayoutProps {
  layout: WidgetLayout[];
  onLayoutChange: (layout: WidgetLayout[]) => void;
}

export interface DashboardProps {
  widgets: Widget[];
  isEditing: boolean;
  onSave: () => Promise<void>;
}

export interface WebSocketHookOptions {
  url: string;
  onMessage: (data: unknown) => void;
  onError: (error: Error) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export interface WSMessage {
  type: string;
  payload: unknown;
  timestamp: number;
}

export type MessageHandler = (message: WSMessage) => void;