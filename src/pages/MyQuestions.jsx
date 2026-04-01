import React, { useEffect, useState } from "react";
import ConversationThread from "../components/chat/ConversationThread";
import QuestionForm from "../components/chat/QuestionForm";
import ThreadList from "../components/chat/ThreadList";
import api from "../services/api";
import {appendQuestion,buildQuestionThreads,getPendingQuestion,getSelectedThread,getVehicleTitle,
} from "../utils/questions";
import styles from "../styles/chat.module.css";
import "../styles/vehicle.css";

export default function MyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await api.get("/questions/my-questions");
        setQuestions(res.data.questions || []);
      } catch (error) {
        setQuestions([]);
        setErrorMessage("Could not load your questions.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const questionThreads = buildQuestionThreads(questions);
  const selectedThread = getSelectedThread(questionThreads, selectedThreadId);
  const pendingQuestion = selectedThread ? getPendingQuestion(selectedThread.questions) : null;

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
  };

  const handleQuestionCreated = (question) => {
    setQuestions((previousQuestions) => appendQuestion(previousQuestions, question));
  };

  return (
    <div className="page-wrapper">
      <div className={styles.pageShell}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Questions</h1>
        </div>

        {loading ? <p className={styles.muted}>Loading...</p> : null}
        {!loading && errorMessage ? <p className={styles.muted}>{errorMessage}</p> : null}
        {!loading && !errorMessage && !questionThreads.length ? (
          <p className={styles.muted}>You have not asked any questions yet.</p>
        ) : null}

        {!loading && !errorMessage && questionThreads.length ? (
          <section className={styles.pageCard}>
            <div className={styles.pageCardBody}>
              <ThreadList
                title="Conversations"
                threads={questionThreads}
                selectedThreadId={selectedThread ? selectedThread.threadId : null}
                onSelectThread={handleSelectThread}
                renderThreadTitle={(thread) => getVehicleTitle(thread.vehicle)}
                renderThreadMeta={(thread) => {
                  const threadPendingQuestion = getPendingQuestion(thread.questions);
                  return [
                    threadPendingQuestion ? "Waiting for reply" : "Replied",
                    `${thread.questions.length} message(s)`,
                  ];
                }}
              />

              <div className={styles.stackLayout}>
                {selectedThread ? (
                  <>
                    <div className={styles.pageCardHeader}>
                      <h2 className={styles.pageCardTitle}>{getVehicleTitle(selectedThread.vehicle)}</h2>
                      <p className={styles.pageCardSubtitle}>
                        {pendingQuestion ? "Waiting for reply" : "Conversation replied"}
                      </p>
                    </div>

                    <ConversationThread questions={selectedThread.questions} />

                    <QuestionForm
                      vehicleId={selectedThread.vehicle?._id}
                      disabledBecausePending={Boolean(pendingQuestion)}
                      onQuestionCreated={handleQuestionCreated}
                    />
                  </>
                ) : (
                  <div className={styles.emptyPanel}>
                    <p className={styles.muted}>There are no conversations to display.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}