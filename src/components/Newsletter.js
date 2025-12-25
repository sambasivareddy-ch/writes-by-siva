import React, { useEffect, useState, useContext } from "react";

import styles from "@/styles/newsletter.module.css";
import BlogsContext from "@/store/blogsContext";

const Newsletter = () => {
    const { highlightFooter } = useContext(BlogsContext);
    const classes = highlightFooter
        ? styles["news-letter_wrapper-highlight"]
        : styles["news-letter_wrapper"];
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [subscribedFor, setSubscribedFor] = useState("tech");

    useEffect(() => {
        if (window.location.hostname === 'personal.bysiva.blog') {
            setSubscribedFor("personal");
        }
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setMessage("");
        }, 3000);
    }, [message]);

    const formSubmitHandler = async (e) => {
        e.preventDefault();

        if (!email.trim().length) {
            setMessage("Please enter your Email Address");
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/subscribe`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        subscribedFor,
                    }),
                }
            );

            if (!response.ok) {
                setMessage("Unable to subscribe");
            }

            const data = await response.json();

            setMessage(data.message);
            setEmail("");
        } catch (err) {
            setMessage("Error occurred at server");
        }
    };

    return (
        <div className={classes}>
            <h3>Join our Newsletter</h3>
            <form onSubmit={formSubmitHandler}>
                <input
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p>{message.length !== 0 && message}</p>
                <button type="submit" aria-label="Subscribe submit Button">
                    Subscribe
                </button>
            </form>
        </div>
    );
};

export default Newsletter;
