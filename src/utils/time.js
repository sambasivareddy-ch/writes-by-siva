const formatRelativeTime = (inputDate) => {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    const date =
        typeof inputDate === "number"
            ? new Date(inputDate)
            : new Date(inputDate);
    const seconds = Math.round((date.getTime() - Date.now()) / 1000); // positive = future

    const abs = Math.abs(seconds);
    if (abs < 10) return "just now";

    const units = [
        { name: "year", secs: 60 * 60 * 24 * 365 },
        { name: "month", secs: 60 * 60 * 24 * 30 },
        { name: "week", secs: 60 * 60 * 24 * 7 },
        { name: "day", secs: 60 * 60 * 24 },
        { name: "hour", secs: 60 * 60 },
        { name: "minute", secs: 60 },
        { name: "second", secs: 1 },
    ];

    for (let u of units) {
        if (abs >= u.secs || u.name === "second") {
            const value = Math.round(seconds / u.secs); // can be negative for past (Intl expects that)
            return rtf.format(value, u.name);
        }
    }
}

export default formatRelativeTime;