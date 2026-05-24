"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/_components/icon/icon";
import { useProfileQuestions } from "@/_contexts/profileQuestionsContext";
import style from "./questionPanel.module.css";

function formatCurrencyInput(value) {
  const digits = String(value).replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("es-CO");
}

function parseCurrencyInput(value) {
  const digits = String(value).replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

export default function QuestionPanel({ onAnswer, disabled = false }) {
  const {
    activeQuestion,
    activeQuestionIndex,
    questionsState,
    shouldShowPanel,
    isSaving,
    submitAnswer,
    skipQuestion,
    goToPrevious,
    goToNext,
    dismissPanel,
  } = useProfileQuestions();

  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    setCustomValue("");
  }, [activeQuestion?.field]);

  if (!shouldShowPanel || !activeQuestion) return null;

  const totalSteps = questionsState?.totalSteps ?? activeQuestion.totalSteps;
  const stepLabel = `${activeQuestionIndex + 1} de ${totalSteps}`;
  const canGoBack = activeQuestionIndex > 0;
  const canGoForward = activeQuestionIndex < totalSteps - 1;

  const handleSelectOption = async (value) => {
    if (disabled || isSaving) return;
    const data = await submitAnswer(activeQuestion.field, value);
    onAnswer?.(activeQuestion.field, value, data);
  };

  const handleCustomSubmit = async () => {
    if (disabled || isSaving || !customValue.trim()) return;

    let value = customValue.trim();
    if (activeQuestion.type === "currency" || activeQuestion.type === "number") {
      const parsed =
        activeQuestion.type === "currency"
          ? parseCurrencyInput(customValue)
          : Number(customValue.replace(/[^\d]/g, ""));
      if (parsed === null || Number.isNaN(parsed)) return;
      value = parsed;
    }

    const data = await submitAnswer(activeQuestion.field, value);
    onAnswer?.(activeQuestion.field, value, data);
  };

  const handleCustomInputChange = (e) => {
    const raw = e.target.value;
    if (activeQuestion.type === "currency") {
      setCustomValue(formatCurrencyInput(raw));
      return;
    }
    setCustomValue(raw);
  };

  return (
    <div className={style.panel} role="dialog" aria-label={activeQuestion.title}>
      <div className={style.header}>
        <h3 className={style.title}>{activeQuestion.title}</h3>
        <div className={style.headerActions}>
          <div className={style.pagination}>
            <button
              type="button"
              className={style.navButton}
              onClick={goToPrevious}
              disabled={!canGoBack || isSaving}
              aria-label="Pregunta anterior"
            >
              <Icon name="chevron_left" size="sm" />
            </button>
            <span className={style.stepLabel}>{stepLabel}</span>
            <button
              type="button"
              className={style.navButton}
              onClick={goToNext}
              disabled={!canGoForward || isSaving}
              aria-label="Siguiente pregunta"
            >
              <Icon name="chevron_right" size="sm" />
            </button>
          </div>
          <button
            type="button"
            className={style.closeButton}
            onClick={dismissPanel}
            aria-label="Cerrar panel"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>
      </div>

      {activeQuestion.subtitle && (
        <p className={style.subtitle}>{activeQuestion.subtitle}</p>
      )}

      {activeQuestion.type === "select" && activeQuestion.options && (
        <ul className={style.optionsList}>
          {activeQuestion.options.map((option, index) => (
            <li key={option.value}>
              <button
                type="button"
                className={style.optionButton}
                onClick={() => handleSelectOption(option.value)}
                disabled={disabled || isSaving}
              >
                <span className={style.optionIndex}>{index + 1}</span>
                <span className={style.optionLabel}>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {(activeQuestion.type === "currency" ||
        activeQuestion.type === "number" ||
        activeQuestion.type === "text") && (
        <div className={style.customInputRow}>
          <Icon name="edit" size="sm" />
          <input
            type="text"
            inputMode={
              activeQuestion.type === "currency" || activeQuestion.type === "number"
                ? "numeric"
                : "text"
            }
            className={style.customInput}
            placeholder={activeQuestion.placeholder || "Escribe tu respuesta"}
            value={customValue}
            onChange={handleCustomInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCustomSubmit();
              }
            }}
            disabled={disabled || isSaving}
            autoFocus
          />
          {customValue.trim() && (
            <button
              type="button"
              className={style.confirmButton}
              onClick={handleCustomSubmit}
              disabled={disabled || isSaving}
            >
              <Icon name="arrow_forward" size="sm" />
            </button>
          )}
        </div>
      )}

      {activeQuestion.type === "select" && (
        <div className={style.customInputRow}>
          <Icon name="edit" size="sm" />
          <input
            type="text"
            className={style.customInput}
            placeholder="Otra cosa"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customValue.trim()) {
                e.preventDefault();
                handleCustomSubmit();
              }
            }}
            disabled={disabled || isSaving}
          />
          {customValue.trim() && (
            <button
              type="button"
              className={style.confirmButton}
              onClick={handleCustomSubmit}
              disabled={disabled || isSaving}
            >
              <Icon name="arrow_forward" size="sm" />
            </button>
          )}
        </div>
      )}

      <div className={style.footer}>
        <button
          type="button"
          className={style.skipButton}
          onClick={skipQuestion}
          disabled={disabled || isSaving}
        >
          Omitir
        </button>
      </div>
    </div>
  );
}
