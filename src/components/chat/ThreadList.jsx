import React from "react";
import styles from "../../styles/chat.module.css";

export default function ThreadList({
  title,
  threads,
  selectedThreadId,
  onSelectThread,
  renderThreadTitle,
  renderThreadMeta,
}) {
  return (
    <div className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>{title}</h3>

      <div className={styles.threadList}>
        {threads.map((thread) => {
          const isSelected = selectedThreadId === thread.threadId;

          return (
            <button
              key={thread.threadId}
              onClick={() => onSelectThread(thread.threadId)}
              className={`${styles.threadBtn} ${isSelected ? styles.threadBtnSelected : ""}`}
            >
              <div className={styles.threadBuyerName}>{renderThreadTitle(thread)}</div>
              {renderThreadMeta(thread).map((line, index) => (
                <div key={`${thread.threadId}-${index}`} className={styles.threadMeta}>
                  {line}
                </div>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}