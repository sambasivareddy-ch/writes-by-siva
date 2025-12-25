import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/comments.module.css";

import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "@/store/authContext";

const getUserColor = (user) => {
    const colors = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"];
    let sum = 0;
    for (let i = 0; i < user.length; i++) sum += user.charCodeAt(i);
    return colors[sum % colors.length];
};

// Recursive comment renderer
const Comment = ({
    username,
    message,
    likes,
    thread,
    created_at,
    post_slug_id,
    comment_id,
    uuid,
    refreshComments,
}) => {
    const avtharBg = getUserColor(username);
    const [replyClicked, setReplyClicked] = useState(false);
    const [commentLikes, setCommentLikes] = useState(likes);
    const [showReplies, setShowReplies] = useState(false);
    const replyComment = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const { authUser } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            setSuccess(false);
            setError(false);
        }, 3000);
    }, [success, error]);

    const replyCommentHandler = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${comment_id}/reply`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: authUser.displayName,
                        comment: replyComment.current.value,
                        blog_slug_id: post_slug_id,
                        uuid: authUser.uid,
                    }),
                }
            );

            if (!response.ok) {
                setError(true);
                console.error("Unable to post the reply to the comment");
                return;
            }

            setSuccess(true);
            replyComment.current.value = "";
            if (refreshComments) {
                setReplyClicked(false);
                setShowReplies(true);
                refreshComments();
            }
            console.log("Successfully added reply to the Comment");
        } catch (err) {
            setError(true);
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const commentLikeHandler = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${comment_id}/like`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                console.log("Unable to like the comment");
            }

            setCommentLikes((prev) => prev + 1);
            console.log("Successfully liked reply to the Comment");
        } catch (err) {
            console.log(err);
        }
    };

    const commentDeleteHandler = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${comment_id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                console.error("Unable to delete comment");
                return;
            }

            if (refreshComments) {
                refreshComments();
            }

            console.log("Successfully deleted the Comment");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={styles.comment}>
            <div className={styles["comment-content"]}>
                <span
                    className={styles["user-avthar"]}
                    style={{ backgroundColor: avtharBg }}
                >
                    {username[0].toUpperCase()}
                </span>
                <div className={styles["comment-meta"]}>
                    <span className={styles["user-name"]}>{username}</span>
                    <span>{message}</span>
                </div>
            </div>
            <div className={styles["comment-actions"]}>
                {authUser && authUser.uid === uuid && (
                    <button
                        className={styles["delete-btn"]}
                        onClick={commentDeleteHandler}
                        aria-label="Delete your comment"
                    >
                        <FontAwesomeIcon className={styles.reactionIcon} icon={faTrash} />
                    </button>
                )}
                <span aria-label="Comment Added Time">{created_at}</span>
                <button
                    className={styles["like-btn"]}
                    onClick={commentLikeHandler}
                    aria-label="Like Comment"
                >
                    <FontAwesomeIcon className={styles.reactionIcon} icon={faHeart} />
                    <span aria-label="Comment Like Count">{commentLikes}</span>
                </button>
                <button
                    onClick={() => setReplyClicked(!replyClicked)}
                    disabled={!authUser}
                    aria-label="Reply to the comment"
                    aria-disabled={!authUser}
                    className={styles["like-btn"]}
                >
                    {replyClicked ? "Cancel" : "Reply"}
                </button>
                <button
                    className={styles["show-replies"]}
                    onClick={() => setShowReplies(!showReplies)}
                >
                    {!showReplies ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    <span
                        aria-label={`${showReplies ? "Show" : "Hide"} Replies`}
                    >
                        {!showReplies ? "Show" : "Hide"} Replies
                    </span>
                </button>
            </div>
            {replyClicked && (
                <form
                    className={styles["reply-form"]}
                    onSubmit={replyCommentHandler}
                >
                    <input
                        type="text"
                        placeholder="Reply to the comment..."
                        aria-label="Reply to the comment..."
                        ref={replyComment}
                    />
                    <button type="submit" aria-label="Submit reply">
                        Reply
                    </button>
                    {error && (
                        <span className={styles["message"]}>
                            Error occurred while adding comment!!
                        </span>
                    )}
                    {success && (
                        <span className={styles["message"]}>
                            Successfully posted comment!
                        </span>
                    )}
                    {isLoading && (
                        <span className={styles["message"]}>
                            Posting the comment....
                        </span>
                    )}
                </form>
            )}

            {showReplies && thread && thread.length > 0 && (
                <div className={styles["comment-thread"]}>
                    {thread.map((child) => (
                        <Comment
                            key={child.comment_id}
                            username={child.username}
                            message={child.message}
                            thread={child.thread}
                            likes={child.likes}
                            created_at={child.created_at}
                            post_slug_id={post_slug_id}
                            comment_id={child.comment_id}
                            uuid={child.uuid}
                            refreshComments={refreshComments}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Comments = ({ post_slug_id }) => {
    const { authUser, signIn, signOutLocal } = useAuth();
    const [comments, setComments] = useState([]);
    const userComment = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const fetchComments = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/comment/${post_slug_id}`
            );

            if (!response.ok) {
                console.error("Error Occurred while fetching the comments");
            }

            const json = await response.json();

            setComments(json);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [post_slug_id]);

    useEffect(() => {
        if (success) {
            fetchComments();
        }
    }, [success]);

    useEffect(() => {
        setTimeout(() => {
            setError(false);
            setSuccess(false);
        }, 3000);
    }, [success, error]);

    const postCommentHandler = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/comment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: authUser.displayName,
                        comment: userComment.current.value,
                        parent_comment_id: -1,
                        blog_slug_id: post_slug_id,
                        uuid: authUser.uid,
                    }),
                }
            );

            if (!response.ok) {
                setError(true);
                console.error("Unable to post the comment");
                return;
            }

            setSuccess(true);
            userComment.current.value = "";
            console.log("Successfully added Comment");
        } catch (err) {
            setError(true);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles["comments-section_wrapper"]}>
            <h1>Comments</h1>

            {!authUser && (
                <div className={styles["login-user"]}>
                    {/* Login With */}
                    <button
                        onClick={() => signIn("google")}
                        aria-label="Signin with Google"
                    >
                        <GoogleIcon />
                    </button>
                    /
                    <button
                        onClick={() => signIn("github")}
                        aria-label="Signin with Github"
                    >
                        <GitHubIcon />
                    </button>
                </div>
            )}

            {authUser && (
                <div className={styles["login-user"]}>
                    Commenting as{" "}
                    "{authUser.displayName ?? authUser.email}"
                    <button
                        onClick={signOutLocal}
                        aria-label="Logout from Google/Github"
                    >
                        <LogoutIcon />
                    </button>
                </div>
            )}

            <form
                className={styles["comment-form"]}
                onSubmit={postCommentHandler}
            >
                <textarea
                    placeholder="Please! Add your comment here.."
                    rows={5}
                    readOnly={!authUser}
                    ref={userComment}
                />
                <button
                    type="submit"
                    disabled={!authUser}
                    aria-label="Submit Comment"
                    aria-checked={!authUser}
                >
                    {authUser ? "Comment" : "SignIn above to Comment"}
                </button>
                {error && (
                    <span className={styles["message"]}>
                        Error occurred while adding comment!!
                    </span>
                )}
                {success && (
                    <span className={styles["message"]}>
                        Successfully posted comment!
                    </span>
                )}
                {isLoading && (
                    <span className={styles["message"]}>
                        Posting the comment....
                    </span>
                )}
            </form>

            <div className={styles["comments-list"]}>
                {comments.length !== 0 &&
                    comments.map((comment) => (
                        <Comment
                            key={comment.comment_id}
                            username={comment.username}
                            message={comment.message}
                            thread={comment.thread}
                            likes={comment.likes}
                            created_at={comment.created_at}
                            comment_id={comment.comment_id}
                            post_slug_id={post_slug_id}
                            uuid={comment.uuid}
                            refreshComments={fetchComments}
                        />
                    ))}
                {comments.length === 0 && (
                    <p>
                        <i>👀 No comments yet? Guess you’ll make history!</i>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Comments;
