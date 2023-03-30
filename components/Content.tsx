import React, { useState } from "react";
import styles from "@/styles/Content.module.scss";
import axios from "axios";

type CommentInputProps = {
    onSubmit: (comment: string) => void;
    comment: string;
    setComment: (comment: string) => void;
};

const CommentInput = ({ onSubmit, comment, setComment }: CommentInputProps) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(comment);
    };

    const handleCommentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setComment(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className={styles["input-container"]}>
            <div>
                <label htmlFor="comment-input">Enter a comment:</label>
                <textarea
                    id="comment-input"
                    value={comment}
                    onChange={handleCommentChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

type CommentOutputProps = {
    comment: string;
};

const CommentOutput = ({ comment }: CommentOutputProps) => {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(comment);
        setCopied(true);
    };

    return (
        <div className={styles["output-container"]}>
            <div>{comment}</div>
            <button onClick={handleCopy}>Copy</button>
            {copied && <p className="feedback">Copied to clipboard!</p>}
        </div>
    );
};

const App = () => {
    const [comment, setComment] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (comment: string) => {
        setIsLoading(true)

        const { data } = await axios.post("/api/openai", {
            prompt: comment,
        });

        setResult(data);

        setIsLoading(false)
    };

    return (
        <div className={styles["content"]}>
            <CommentInput
                onSubmit={handleSubmit}
                comment={comment}
                setComment={(value) => setComment(value)}
            />
            {isLoading ? 'is loading...' : null}
            {result && <CommentOutput comment={result} />}
        </div>
    );
};

export default App;
