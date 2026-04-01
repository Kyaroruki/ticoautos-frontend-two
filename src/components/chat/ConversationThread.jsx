import React, { useMemo } from "react";
import styles from "../../styles/chat.module.css";

export default function ConversationThread({ questions }) {
  const messages = useMemo(() => {
    if (!questions) return [];

    const getAuthorLabel = (user, defaultLabel) => {
      if (!user) {
        return defaultLabel;
      }

      if (user.username) {
        return user.username;
      }
      
      if (user.name) {
        return user.name;
      }

      return defaultLabel;
    };

    const out = [];
    for (const q of questions) {
      out.push({
        id: `q-${q._id}`, 
        type: "question",
        text: q.text,
        date: q.date,
        authorLabel: getAuthorLabel(q.user, "Buyer"),
      });

      for (const a of q.answers || []) {
        out.push({
          id: `a-${a._id}`,
          type: "answer",
          text: a.text,
          date: a.date,
          authorLabel: getAuthorLabel(a.user, "Seller"),
        });
      }
    }

    out.sort((a, b) => new Date(a.date) - new Date(b.date));
    return out;
  }, [questions]);

  if (!messages.length) {
    return <p className={styles.muted}>There are no messages yet.</p>;
  }

  const formatMessageDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div className={styles.thread}>
      {messages.map((m) => {
        const isBuyerBubble = m.type === "question";

        return (
          <div
            key={m.id}
            className={`${styles.bubble} ${isBuyerBubble ? styles.buyerBubble : styles.sellerBubble}`}
          >
            <div className={styles.bubbleAuthor}>{m.authorLabel}</div>
            <div className={styles.bubbleText}>{m.text}</div>
            <div className={styles.bubbleDate}>
              {formatMessageDate(m.date)}
            </div>
          </div>
        );
      })}
    </div>
  );
}