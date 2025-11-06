import React, { useState } from "react";
import styles from "@/styles/comments.module.css";

const getUserColor = (user) => {
    const colors = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"];
    let sum = 0;
    for (let i = 0; i < user.length; i++) sum += user.charCodeAt(i);
    return colors[sum % colors.length];
};

const COMMENTS_SAMPLE = [
    {
        comment_id: 1,
        message: "Comment 1",
        user: "User 1",
        thread: [
            {
                comment_id: 2,
                message: "Comment 2",
                user: "User 2",
                thread: [
                    {
                        comment_id: 3,
                        message: "Comment 3",
                        user: "User 3",
                    },
                ],
            },
            {
                comment_id: 4,
                message: "Comment 4",
                user: "User 4",
            },
        ],
    },
    {
        comment_id: 5,
        message: "Comment 5",
        user: "User 5",
    },
];

// Recursive comment renderer
const Comment = ({ user, message, thread }) => {
    const avtharBg = getUserColor(user);
    const [replyClicked, setReplyClicked] = useState(false);

    return (
        <div className={styles.comment}>
            <div className={styles["comment-content"]}>
                <span
                    className={styles["user-avthar"]}
                    style={{ backgroundColor: avtharBg }}
                >
                    {user[0].toUpperCase()}
                </span>
                <div className={styles["comment-meta"]}>
                    <span className={styles["user-name"]}>{user}</span>
                    <span>{message}</span>
                </div>
            </div>
            <div className={styles["comment-actions"]}>
                <button>Like</button>
                <button onClick={() => setReplyClicked(!replyClicked)}>{replyClicked ? "Cancel": "Reply"}</button>
            </div>
            {replyClicked && <form className={styles['reply-form']}>
                <input type="text" placeholder="Reply to the comment..."/>
                <button>Reply</button>
            </form>}

            {thread && thread.length > 0 && (
                <div className={styles["comment-thread"]}>
                    {thread.map((child) => (
                        <Comment
                            key={child.comment_id}
                            user={child.user}
                            message={child.message}
                            thread={child.thread}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Comments = () => {
    return (
        <div className={styles["comments-section_wrapper"]}>
            <h1>Comments</h1>

            <form className={styles["comment-form"]}>
                <textarea
                    placeholder="Please! Add your comment here.."
                    rows={5}
                />
                <button type="submit">Comment</button>
            </form>

            <div className={styles["comments-list"]}>
                {COMMENTS_SAMPLE.map((comment) => (
                    <Comment
                        key={comment.comment_id}
                        user={comment.user}
                        message={comment.message}
                        thread={comment.thread}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comments;
