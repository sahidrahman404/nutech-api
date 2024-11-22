import { z } from 'zod';

export const topUpInputSchema = z.object({
  top_up_amount: z
    .number({
      required_error: 'Parameter amount harus di isi',
      invalid_type_error:
        'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
    })
    .min(
      1,
      'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
    ),
});

export const transactionInputSchema = z.object({
  service_code: z.string({
    required_error: 'Parameter service_code harus di isi',
    invalid_type_error: 'Paramter service_code hanya boleh teks',
  }),
});

export type TopUpInput = z.infer<typeof topUpInputSchema>;
export type TransactionInput = z.infer<typeof transactionInputSchema>;
