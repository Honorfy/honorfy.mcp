export declare function jsonResult(data: unknown): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
export declare function errorResult(err: unknown): {
    isError: true;
    content: Array<{
        type: "text";
        text: string;
    }>;
};
//# sourceMappingURL=toolResult.d.ts.map