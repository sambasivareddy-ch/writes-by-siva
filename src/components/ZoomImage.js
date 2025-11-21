import React, { useState } from "react";

const ZoomImage = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Inline image in the markdown */}
            <img
                {...props}
                onClick={() => setOpen(true)}
                style={{ maxWidth: "100%", cursor: "zoom-in" }}
            />

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.8)",
                        zIndex: 9999,
                        overflow: "auto", // 👈 scroll when content is bigger
                    }}
                >
                    <div
                        style={{
                            minHeight: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            padding: "2rem",
                        }}
                    >
                        <img
                            {...props}
                            style={{
                                cursor: "zoom-out",
                                display: "block",
                                // no maxHeight here – let it be full height
                                // optional: keep width under control to avoid sideways scroll:
                                maxWidth: "100%",
                                height: "auto",
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ZoomImage;
