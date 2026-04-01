import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ConversationThread from "./ConversationThread";
import QuestionForm from "./QuestionForm";
import AnswerForm from "./AnswerForm";
import ThreadList from "./ThreadList";
import {appendAnswerToQuestion,appendQuestion,buildBuyerThreads,getBuyerLabel,getPendingQuestion,getSelectedThread,getVehicleTitle,
} from "../../utils/questions";
import styles from "../../styles/chat.module.css";

export default function QuestionModal({ vehicle, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loadingQA, setLoadingQA] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    if (!vehicle?._id) {
      return;
    }

    const loadQuestions = async () => {
      setLoadingQA(true);

      try {
        const res = await api.get(`/questions/vehicle/${vehicle._id}`);
        const loadedQuestions = res.data.questions || [];
        const firstQuestion = loadedQuestions.find((question) => question.user?._id);

        setIsOwner(Boolean(res.data.isOwner));
        setQuestions(loadedQuestions);
        setSelectedThreadId(firstQuestion?.user?._id || null);
      } catch {
        setIsOwner(false);
        setQuestions([]);
      } finally {
        setLoadingQA(false);
      }
    };

    loadQuestions();
  }, [vehicle]);

  const buyerThreads = buildBuyerThreads(questions);
  const selectedThread = isOwner
    ? getSelectedThread(buyerThreads, selectedThreadId) || { buyer: null, questions: [] }
    : { buyer: null, questions };
  const pendingQuestion = getPendingQuestion(selectedThread.questions);
  const hasPendingQuestion = Boolean(getPendingQuestion(questions));

  const handleQuestionCreated = (question) => {
    setQuestions((prevQuestions) => appendQuestion(prevQuestions, question));
  };

  const handleAnswerCreated = (answer) => {
    if (!pendingQuestion) {
      return;
    }

    setQuestions((prevQuestions) => appendAnswerToQuestion(prevQuestions, pendingQuestion._id, answer));
  };

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button onClick={onClose} className={styles.closeBtn}>
            Close
          </button>
        </div>

        {loadingQA ? (
          <p className={styles.muted}>Loading...</p>
        ) : (
          <div className={styles.modalContent}>
            {!isOwner ? (
              <div className={styles.stackLayout}>
                <ConversationThread questions={questions} />

                <QuestionForm
                  vehicleId={vehicle._id}
                  disabledBecausePending={hasPendingQuestion}
                  onQuestionCreated={handleQuestionCreated}
                />
              </div>
            ) : (
              <div className={styles.twoColLayout}>
                {buyerThreads.length ? (
                  <ThreadList
                    title="Chats"
                    threads={buyerThreads}
                    selectedThreadId={selectedThread ? selectedThread.threadId : null}
                    onSelectThread={handleSelectThread}
                    renderThreadTitle={(thread) => getBuyerLabel(thread.buyer)}
                    renderThreadMeta={(thread) => {
                      const threadPendingQuestion = getPendingQuestion(thread.questions);
                      return [threadPendingQuestion ? "Waiting for reply" : "No pending messages"];
                    }}
                  />
                ) : (
                  <div className={styles.sidebar}>
                    <h3 className={styles.sidebarTitle}>Chats</h3>
                    <p className={styles.muted}>There are no chats yet.</p>
                  </div>
                )}

                <div className={styles.stackLayout}>
                  <ConversationThread questions={selectedThread.questions} />
                  {pendingQuestion ? (
                    <AnswerForm
                      questionId={pendingQuestion._id}
                      onAnswerCreated={handleAnswerCreated}
                    />
                  ) : (
                    <p className={styles.muted}>There are no pending questions in this chat.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}