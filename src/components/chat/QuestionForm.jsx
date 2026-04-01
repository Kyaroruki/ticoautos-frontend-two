import React, { useMemo, useState } from "react";
import api from "../../services/api";
import styles from "../../styles/chat.module.css";

const QuestionForm = ({ vehicleId, onQuestionCreated, disabledBecausePending }) => {
  const [content, setContent] = useState("");
  const [pendingMsg, setPendingMsg] = useState("");

  const isDisabled = useMemo(() => {
    return !!disabledBecausePending || !!pendingMsg;
  }, [disabledBecausePending, pendingMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPendingMsg("");

    try {
      const res = await api.post(`/questions/vehicle/${vehicleId}`, { content });
      onQuestionCreated?.(res.data);
      setContent("");
    } catch (error) {
      const status = error?.response?.status;

      if (status === 409) {
        setPendingMsg("You already have a pending question. Please wait for the seller to respond.");
        return;
      }

      console.error("Error creating question:", error);
    }
  };

  return (
    <div className={styles.form}>
      {pendingMsg && <div className={styles.pending}>{pendingMsg}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your question..."
          required
          disabled={isDisabled}
          className={styles.textarea}
        />
        <button type="submit" disabled={isDisabled} className={styles.button}>
          Ask
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;