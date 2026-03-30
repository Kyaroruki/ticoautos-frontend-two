import React, { useState } from "react";
import api from "../../services/api";
import styles from "../../styles/chat.module.css";

const AnswerForm = ({ questionId, onAnswerCreated }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/questions/${questionId}/answer`, { content });
      if (onAnswerCreated) {
        onAnswerCreated(res.data);
      }
      setContent("");
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${styles.formMarginTop}`}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer..."
        required
        className={styles.textarea}
      />
      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  );
};

export default AnswerForm;