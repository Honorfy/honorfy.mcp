import { z } from 'zod';

/** Espelha enums usados em filtros de listagem (sem depender de @honorfy/shared no typecheck). */
const saleStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELED',
  'COMPLETED',
]);

const paginationFields = {
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
};

export const companyIdFieldSchema = z.object({
  companyId: z
    .string()
    .min(1)
    .optional()
    .describe('ID da empresa para o header x-company-id. Se omitido, usa HONORFY_DEFAULT_COMPANY_ID.'),
});

export const listMyCompaniesInputSchema = z.object({});

export const listSalesInputSchema = companyIdFieldSchema.extend({
  ...paginationFields,
  status: saleStatusEnum.optional(),
  orderNumber: z.string().min(1).optional(),
  participantDocument: z.string().min(1).optional(),
});

export const getSaleInputSchema = companyIdFieldSchema.extend({
  saleId: z.string().min(1),
});

export const listPaymentsInputSchema = companyIdFieldSchema.extend({
  ...paginationFields,
});

export const getPaymentInputSchema = companyIdFieldSchema.extend({
  transactionId: z.string().min(1),
});

export const getWalletConsolidatedBalanceInputSchema = companyIdFieldSchema.extend({});

const incentiveListStatusEnum = z.enum(['active', 'inactive', 'all']);

export const listIncentivesInputSchema = companyIdFieldSchema.extend({
  ...paginationFields,
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sharedProgress: z.boolean().optional(),
  status: incentiveListStatusEnum.optional(),
});

export const getIncentiveInputSchema = companyIdFieldSchema.extend({
  incentiveId: z.string().min(1),
});

export const listIncentiveGroupsInputSchema = companyIdFieldSchema.extend({
  ...paginationFields,
});

export const getIncentiveGroupInputSchema = companyIdFieldSchema.extend({
  groupId: z.string().min(1),
});

export const listGroupParticipantsInputSchema = companyIdFieldSchema.extend({
  ...paginationFields,
  groupId: z.string().min(1),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  sector: z.string().optional(),
  cpf: z.string().optional(),
});

export const whoamiInputSchema = companyIdFieldSchema.extend({});

export const emptyInputSchema = z.object({});
