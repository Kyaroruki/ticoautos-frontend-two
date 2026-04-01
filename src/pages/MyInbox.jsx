import React, { useEffect, useState } from "react";
import AnswerForm from "../components/chat/AnswerForm";
import ConversationThread from "../components/chat/ConversationThread";
import ThreadList from "../components/chat/ThreadList";
import api from "../services/api";
import {appendAnswerToQuestion,buildInboxThreads,getBuyerLabel,getPendingQuestion,getSelectedThread,getVehicleTitle,} from "../utils/questions";
import styles from "../styles/chat.module.css";
import "../styles/vehicle.css";

export default function MyInbox() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  useEffect(() => {
    const loadInbox = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await api.get("/questions/inbox");
        setQuestions(res.data.questions || []);
      } catch (error) {
        setQuestions([]);
        setErrorMessage("Could not load your inbox.");
      } finally {
        setLoading(false);
      }
    };

    loadInbox();
  }, []);

  const inboxThreads = buildInboxThreads(questions);
  const selectedThread = getSelectedThread(inboxThreads, selectedThreadId);
  const pendingQuestion = selectedThread ? getPendingQuestion(selectedThread.questions) : null;

  const handleAnswerCreated = (questionId, answer) => {
    setQuestions((previousQuestions) => appendAnswerToQuestion(previousQuestions, questionId, answer));
  };

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
  };

  return (
    <div className="page-wrapper">
      <div className={styles.pageShell}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Inbox</h1>
        </div>

        {loading ? <p className={styles.muted}>Loading...</p> : null}
        {!loading && errorMessage ? <p className={styles.muted}>{errorMessage}</p> : null}
        {!loading && !errorMessage && !inboxThreads.length ? (
          <p className={styles.muted}>You do not have questions on your vehicles.</p>
        ) : null}

        {!loading && !errorMessage && inboxThreads.length ? (
          <section className={styles.pageCard}>
            <div className={styles.pageCardBody}>
              <ThreadList
                title="Chats"
                threads={inboxThreads}
                selectedThreadId={selectedThread ? selectedThread.threadId : null}
                onSelectThread={handleSelectThread}
                renderThreadTitle={(thread) => `${getBuyerLabel(thread.buyer)} - ${getVehicleTitle(thread.vehicle)}`}
                renderThreadMeta={(thread) => {
                  const threadPendingQuestion = getPendingQuestion(thread.questions);
                  return [threadPendingQuestion ? "Waiting for reply" : "No pending messages"];
                }}
              />

              <div className={styles.stackLayout}>
                {selectedThread ? (
                  <>
                    <div className={styles.pageCardHeader}>
                      <h2 className={styles.pageCardTitle}>
                        {getBuyerLabel(selectedThread.buyer)} - {getVehicleTitle(selectedThread.vehicle)}
                      </h2>
                      <p className={styles.pageCardSubtitle}>
                        {pendingQuestion ? "Waiting for reply" : "No pending messages"}
                      </p>
                    </div>

                    <ConversationThread questions={selectedThread.questions} />

                    {pendingQuestion ? (
                      <AnswerForm
                        questionId={pendingQuestion._id}
                        onAnswerCreated={(answer) => handleAnswerCreated(pendingQuestion._id, answer)}
                      />
                    ) : (
                      <p className={styles.muted}>There are no pending questions in this chat.</p>
                    )}
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