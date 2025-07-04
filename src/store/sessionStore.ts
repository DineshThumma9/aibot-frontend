import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "../entities/Message.ts";
import type { Session } from "../entities/Session.ts";

export type SessionState = {
  current_session: string | null;
  sessions: Session[];
  messages: Message[];
  title: string;
  isLoading: boolean;
  isStreaming: boolean;
  sending:boolean;
  shouldStream:boolean;

  setCurrentSessionId: (session: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTitle: (title: string) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  updateSession: (sessionId: string, updates: Partial<Session>) => void;
  removeSession: (sessionId: string) => void;
  setSending:(sending:boolean) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setShouldStream: (streaming: boolean) => void;
  clear: () => void;
  getSessions: () => Session[];
    clearAllSessions(): void;
};

const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      current_session: null,
      sessions: [],
      title: "",
      messages: [],
      isLoading: false,
      isStreaming: false,
        shouldStream:false,
        sending:false,

      setCurrentSessionId: (session) => set({ current_session: session }),
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setTitle: (title) => set({ title }),
        setSending:(sending:boolean) => set({sending:sending}),
      updateMessage: (messageId, updates) =>
        set((state) => ({
          messages: state.messages.map((message) =>
            message.message_id === messageId
              ? { ...message, ...updates }
              : message
          ),
        })),
      setSessions: (sessions) => {
        const sorted = [...sessions].sort((a, b) =>
          a.created_at && b.created_at
            ? new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            : 0
        );
        set({ sessions: sorted });
      },
        clearAllSessions:() =>set({
          messages:[],
            sessions:[],
            current_session:null
        }),
        addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
        })),
      updateSession: (sessionId, updates) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.session_id === sessionId
              ? { ...session, ...updates }
              : session
          ),
        })),
      removeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter(
            (s) => s.session_id !== sessionId
          ),
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
        setShouldStream:(shouldStream) => set({shouldStream:shouldStream}),
      clear: () => set({ messages: [] }),
      getSessions: () => get().sessions,
    }),
    {
      name: "session-persist", // key in localStorage
    }
  )
);

export default useSessionStore;
