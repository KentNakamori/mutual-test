//src\hooks\useStore.ts

import { useState, useCallback } from 'react';
import type { Widget, WidgetLayout } from '../types/models';
import type { InvestorDTO, MeetingDTO, QADTO } from '../types/dto';

/**
 * ダッシュボード状態管理用カスタムフック
 */
export function useDashboardStore() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [layout, setLayout] = useState<WidgetLayout[]>([]);

  const updateLayout = useCallback((newLayout: WidgetLayout[]) => {
    setLayout(newLayout);
  }, []);

  const addWidget = useCallback((widget: Widget) => {
    setWidgets(prev => [...prev, widget]);
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    setWidgets(prev => prev.filter(w => w._id !== widgetId));
  }, []);

  return {
    widgets,
    layout,
    updateLayout,
    addWidget,
    removeWidget
  };
}

/**
 * 投資家データ管理用カスタムフック
 */
export function useInvestorStore() {
  const [investors, setInvestors] = useState<InvestorDTO[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDTO | null>(null);

  const updateInvestor = useCallback((investor: InvestorDTO) => {
    setInvestors(prev => prev.map(i => i.id === investor.id ? investor : i));
    if (selectedInvestor?.id === investor.id) {
      setSelectedInvestor(investor);
    }
  }, [selectedInvestor]);

  return {
    investors,
    setInvestors,
    selectedInvestor,
    setSelectedInvestor,
    updateInvestor
  };
}

/**
 * ミーティング管理用カスタムフック
 */
export function useMeetingStore() {
  const [meetings, setMeetings] = useState<MeetingDTO[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDTO | null>(null);

  const updateMeeting = useCallback((meeting: MeetingDTO) => {
    setMeetings(prev => prev.map(m => m.id === meeting.id ? meeting : m));
    if (selectedMeeting?.id === meeting.id) {
      setSelectedMeeting(meeting);
    }
  }, [selectedMeeting]);

  return {
    meetings,
    setMeetings,
    selectedMeeting,
    setSelectedMeeting,
    updateMeeting
  };
}

/**
 * Q&A管理用カスタムフック
 */
export function useQAStore() {
  const [qas, setQAs] = useState<QADTO[]>([]);
  const [selectedQA, setSelectedQA] = useState<QADTO | null>(null);

  const addResponse = useCallback((qaId: string, response: any) => {
    setQAs(prev => prev.map(qa => {
      if (qa.id === qaId) {
        return { ...qa, responses: [...qa.responses, response] };
      }
      return qa;
    }));
  }, []);

  return {
    qas,
    setQAs,
    selectedQA,
    setSelectedQA,
    addResponse
  };
}

/**
 * チャットボード管理用カスタムフック
 */
export function useChatBoardStore() {
  const [messages, setMessages] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const addMessage = useCallback((message: any) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addPost = useCallback((post: any) => {
    setPosts(prev => [...prev, post]);
  }, []);

  return {
    messages,
    setMessages,
    posts,
    setPosts,
    addMessage,
    addPost
  };
}