import { z } from 'zod';

export const membershipRegistrationInputSchema = z.object({
  email: z
    .string({
      required_error: 'Parameter email harus di isi',
      invalid_type_error: 'Parameter email hanya boleh teks',
    })
    .email('Paramter email tidak sesuai format'),
  first_name: z
    .string({
      required_error: 'Parameter first_name harus di isi',
      invalid_type_error: 'Parameter first_name hanya boleh teks',
    })
    .min(1, 'Parameter first_name harus di isi'),
  last_name: z
    .string({
      required_error: 'Parameter last_name harus di isi',
      invalid_type_error: 'Parameter last_name hanya boleh teks',
    })
    .min(1, 'Parameter last_name harus di isi'),
  password: z
    .string({
      required_error: 'Parameter password harus di isi',
      invalid_type_error: 'Parameter password hanya boleh teks',
    })
    .min(8, 'Password length minimal 8 karakter'),
});

export const membershipLoginInputSchema = z.object({
  email: z
    .string({
      required_error: 'Parameter email harus di isi',
      invalid_type_error: 'Parameter email hanya boleh teks',
    })
    .email('Paramter email tidak sesuai format'),
  password: z
    .string({
      required_error: 'Parameter password harus di isi',
      invalid_type_error: 'Parameter password hanya boleh teks',
    })
    .min(8, 'Password length minimal 8 karakter'),
});

export const membershipUpdateProfileInputSchema = z.object({
  first_name: z
    .string({
      required_error: 'Parameter first_name harus di isi',
      invalid_type_error: 'Parameter first_name hanya boleh teks',
    })
    .min(1, 'Parameter first_name harus di isi'),
  last_name: z
    .string({
      required_error: 'Parameter last_name harus di isi',
      invalid_type_error: 'Parameter last_name hanya boleh teks',
    })
    .min(1, 'Parameter last_name harus di isi'),
});

export type MembershipRegistrationInput = z.infer<
  typeof membershipRegistrationInputSchema
>;

export type MembershipLoginInput = z.infer<typeof membershipLoginInputSchema>;

export type MembershipUpdateProfileInput = z.infer<
  typeof membershipUpdateProfileInputSchema
>;
