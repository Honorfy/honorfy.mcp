export function logStructured(entry) {
    const line = JSON.stringify({
        ...entry,
        ts: new Date().toISOString(),
        service: "mcp",
    });
    if (entry.level === "error") {
        console.error(line);
    }
    else if (entry.level === "warn") {
        console.warn(line);
    }
    else {
        console.log(line);
    }
}
//# sourceMappingURL=logger.js.map