'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@/_contexts/authContext';
import {
  fetchProfileQuestions,
  updateProfileField,
} from '@/_services/profile/profileQuestions.service';

const ProfileQuestionsContext = createContext(null);

export function ProfileQuestionsProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [questionsState, setQuestionsState] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadQuestions = useCallback(async () => {
    if (!user) {
      setQuestionsState(null);
      setIsDismissed(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchProfileQuestions();
      setQuestionsState(data.questionsState ?? null);

      const missing = data.questionsState?.missingFields ?? [];
      if (missing.length > 0) {
        const firstMissingIndex = (data.questionsState?.questions ?? []).findIndex(
          (q) => q.field === missing[0]
        );
        if (firstMissingIndex >= 0) {
          setActiveQuestionIndex(firstMissingIndex);
        }
      }
    } catch (error) {
      console.error('Error cargando preguntas de perfil:', error);
      setQuestionsState(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    loadQuestions();
  }, [authLoading, loadQuestions]);

  const applyQuestionsState = useCallback((nextState) => {
    setQuestionsState(nextState ?? null);
    if (nextState?.phase1Complete) {
      setIsDismissed(true);
      return;
    }

    const missing = nextState?.missingFields ?? [];
    if (missing.length > 0) {
      const idx = (nextState?.questions ?? []).findIndex((q) => q.field === missing[0]);
      if (idx >= 0) setActiveQuestionIndex(idx);
      setIsDismissed(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (field, value) => {
      setIsSaving(true);
      try {
        const data = await updateProfileField(field, value);
        applyQuestionsState(data.questionsState);
        return data;
      } finally {
        setIsSaving(false);
      }
    },
    [applyQuestionsState]
  );

  const skipQuestion = useCallback(() => {
    const questions = questionsState?.questions ?? [];
    if (questions.length === 0) return;

    const nextIndex = activeQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setActiveQuestionIndex(nextIndex);
    } else {
      setIsDismissed(true);
    }
  }, [activeQuestionIndex, questionsState]);

  const goToPrevious = useCallback(() => {
    setActiveQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    const total = questionsState?.questions?.length ?? 0;
    setActiveQuestionIndex((prev) => Math.min(total - 1, prev + 1));
  }, [questionsState]);

  const dismissPanel = useCallback(() => {
    setIsDismissed(true);
  }, []);

  const showPanel = useCallback(() => {
    setIsDismissed(false);
  }, []);

  const activeQuestion = questionsState?.questions?.[activeQuestionIndex] ?? null;
  const shouldShowPanel = Boolean(
    user &&
    questionsState &&
    !questionsState.phase1Complete &&
    activeQuestion &&
    !isDismissed
  );

  const value = useMemo(
    () => ({
      questionsState,
      activeQuestion,
      activeQuestionIndex,
      shouldShowPanel,
      isLoading,
      isSaving,
      isDismissed,
      loadQuestions,
      applyQuestionsState,
      submitAnswer,
      skipQuestion,
      goToPrevious,
      goToNext,
      dismissPanel,
      showPanel,
    }),
    [
      questionsState,
      activeQuestion,
      activeQuestionIndex,
      shouldShowPanel,
      isLoading,
      isSaving,
      isDismissed,
      loadQuestions,
      applyQuestionsState,
      submitAnswer,
      skipQuestion,
      goToPrevious,
      goToNext,
      dismissPanel,
      showPanel,
    ]
  );

  return (
    <ProfileQuestionsContext.Provider value={value}>
      {children}
    </ProfileQuestionsContext.Provider>
  );
}

export function useProfileQuestions() {
  const context = useContext(ProfileQuestionsContext);
  if (!context) {
    throw new Error('useProfileQuestions debe usarse dentro de <ProfileQuestionsProvider>');
  }
  return context;
}
