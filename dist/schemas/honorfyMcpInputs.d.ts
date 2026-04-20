import { z } from "zod";
export declare const companyIdFieldSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    companyId?: string | undefined;
}, {
    companyId?: string | undefined;
}>;
export declare const listMyCompaniesInputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const listSalesInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    status: z.ZodOptional<z.ZodEnum<["PENDING", "APPROVED", "REJECTED", "CANCELED", "COMPLETED"]>>;
    orderNumber: z.ZodOptional<z.ZodString>;
    participantDocument: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "COMPLETED" | undefined;
    companyId?: string | undefined;
    orderNumber?: string | undefined;
    participantDocument?: string | undefined;
}, {
    status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | "COMPLETED" | undefined;
    companyId?: string | undefined;
    orderNumber?: string | undefined;
    participantDocument?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const getSaleInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    saleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    saleId: string;
    companyId?: string | undefined;
}, {
    saleId: string;
    companyId?: string | undefined;
}>;
export declare const listPaymentsInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    companyId?: string | undefined;
}, {
    companyId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const getPaymentInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    transactionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    transactionId: string;
    companyId?: string | undefined;
}, {
    transactionId: string;
    companyId?: string | undefined;
}>;
export declare const getWalletConsolidatedBalanceInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    companyId?: string | undefined;
}, {
    companyId?: string | undefined;
}>;
export declare const listIncentivesInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    sharedProgress: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "all"]>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "active" | "inactive" | "all" | undefined;
    companyId?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    sharedProgress?: boolean | undefined;
}, {
    status?: "active" | "inactive" | "all" | undefined;
    companyId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    name?: string | undefined;
    description?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    sharedProgress?: boolean | undefined;
}>;
export declare const getIncentiveInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    incentiveId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    incentiveId: string;
    companyId?: string | undefined;
}, {
    incentiveId: string;
    companyId?: string | undefined;
}>;
export declare const listIncentiveGroupsInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    companyId?: string | undefined;
}, {
    companyId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const getIncentiveGroupInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    groupId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    groupId: string;
    companyId?: string | undefined;
}, {
    groupId: string;
    companyId?: string | undefined;
}>;
export declare const listGroupParticipantsInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
} & {
    groupId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    sector: z.ZodOptional<z.ZodString>;
    cpf: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    groupId: string;
    companyId?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    sector?: string | undefined;
    cpf?: string | undefined;
}, {
    groupId: string;
    companyId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    name?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    sector?: string | undefined;
    cpf?: string | undefined;
}>;
export declare const whoamiInputSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    companyId?: string | undefined;
}, {
    companyId?: string | undefined;
}>;
export declare const emptyInputSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
//# sourceMappingURL=honorfyMcpInputs.d.ts.map