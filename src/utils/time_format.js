export function FormatTime(isoString) {
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
        return "Just now";
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(date);
    }
}