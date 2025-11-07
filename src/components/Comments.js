import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/comments.module.css";

import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LogoutIcon from "@mui/icons-material/Logout";
import ReplyIcon from "@mui/icons-material/Reply";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import formatRelativeTime from "@/utils/time";

import { useAuth } from "@/store/authContext";

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
        username: "User 1",
        likes: 0,
        created_at: '2025/11/05',
        thread: [
            {
                comment_id: 2,
                message: "Comment 2",
                username: "User 2",
                likes: 0,
                created_at: '2025/11/02',
                thread: [
                    {
                        comment_id: 3,
                        message: "Comment 3",
                        username: "User 3",
                        likes: 0,
                        created_at: '2025/11/04',
                    },
                ],
            },
            {
                comment_id: 4,
                message: "Comment 4",
                username: "User 4",
                likes: 0,
                created_at: '2025/11/01',
            },
        ],
    },
    {
        comment_id: 5,
        message: "Comment 5",
        username: "User 5",
        likes: 0,
        created_at: '2025/11/03',
    },
];

// Recursive comment renderer
const Comment = ({ username, message, likes, thread, created_at, post_slug_id, comment_id }) => {
    const avtharBg = getUserColor(username);
    const [replyClicked, setReplyClicked] = useState(false);
    const [commentLikes, setCommentLikes] = useState(likes);
    const [showReplies, setShowReplies] = useState(false);
    const replyComment = useRef();

    const { authUser } = useAuth();

    const replyCommentHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${comment_id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: authUser.displayName,
                    comment: replyComment.current.value, 
                    blog_slug_id: post_slug_id,
                    uuid: authUser.uuid,
                })
            })

            if (!response.ok) {
                console.log('Unable to post the reply to the comment');
            }

            console.log('Successfully added reply to the Comment');
        } catch(err) {
            console.log(err);
        }
    }

    const commentLikeHandler = async () => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${comment_id}/like`, {
                method: 'POST'
            })

            if (!response.ok) {
                console.log('Unable to like the comment');
            }

            setCommentLikes((prev) => prev + 1)
            console.log('Successfully liked reply to the Comment');
        } catch(err) {
            console.log(err);
        }
    }

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
                <span>
                    {formatRelativeTime(created_at)}
                </span>
                <button
                    className={styles["like-btn"]}
                    onClick={commentLikeHandler}
                >
                    <FontAwesomeIcon icon={faHeart}/>
                    <span>{commentLikes}</span>
                </button>
                <button onClick={() => setReplyClicked(!replyClicked)} disabled={!authUser}>
                    {replyClicked ? "Cancel" : "Reply"}
                </button>
                <button className={styles['show-replies']} onClick={() => setShowReplies(!showReplies)}>
                    {!showReplies ? <ArrowDropDownIcon/>: <ArrowDropUpIcon/>} 
                    <span>{!showReplies ? "Show": "Hide"} Replies</span>
                </button>
            </div>
            {replyClicked && (
                <form className={styles["reply-form"]} onSubmit={replyCommentHandler}>
                    <input type="text" placeholder="Reply to the comment..." ref={replyComment}/>
                    <button type="submit">Reply</button>
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Comments = ({post_slug_id}) => {
    const { authUser, signIn, signOutLocal } = useAuth();
    const [comments, setComments] = useState([]);
    const userComment = useRef('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/comment/${post_slug_id}`);

                if (!response.ok) {
                    console.error('Error Occurred while fetching the comments');
                }

                const json = await response.json();

                setComments(json);
            } catch(err) {
                console.log(err);
            }
        }

        fetchComments();
    }, [post_slug_id]);

    const postCommentHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: authUser.displayName,
                    comment: userComment.current.value, 
                    parent_comment_id: -1,
                    blog_slug_id: post_slug_id,
                    uuid: authUser.uuid,
                })
            })

            if (!response.ok) {
                console.log('Unable to post the comment');
            }

            console.log('Successfully added Comment');
        } catch(err) {
            console.log(err);
        }
    }


    return (
        <div className={styles["comments-section_wrapper"]}>
            <h1>Comments</h1>

            {!authUser && (
                <div className={styles["login-user"]}>
                    <p>Login With</p>
                    <button onClick={() => signIn("google")}>
                        <GoogleIcon />
                    </button>
                    /
                    <button onClick={() => signIn("github")}>
                        <GitHubIcon />
                    </button>
                    to Comment or Reply
                </div>
            )}

            {authUser && (
                <div className={styles["login-user"]}>
                    <p>
                        Commenting as{" "}
                        <strong>{authUser.displayName ?? authUser.email}</strong>
                    </p>
                    <button onClick={signOutLocal}>
                        <LogoutIcon />
                    </button>
                </div>
            )}

            <form className={styles["comment-form"]} onSubmit={postCommentHandler}>
                <textarea
                    placeholder="Please! Add your comment here.."
                    rows={5}
                    readOnly={!authUser}
                    ref={userComment}
                />
                <button type="submit" disabled={!authUser}>
                    {authUser ? "Comment" : "SignIn above to Comment"}
                </button>
            </form>

            <div className={styles["comments-list"]}>
                {comments.length !== 0 && comments.map((comment) => (
                    <Comment
                        key={comment.comment_id}
                        username={comment.username}
                        message={comment.message}
                        thread={comment.thread}
                        likes={comment.likes}
                        created_at={comment.created_at}
                        comment_id={comment.comment_id}
                        post_slug_id={post_slug_id}
                    />
                ))}
                {comments.length === 0 && <p>
                    <i>👀 No comments yet? Guess you’ll make history!</i>
                </p>}
            </div>
        </div>
    );
};

export default Comments;
