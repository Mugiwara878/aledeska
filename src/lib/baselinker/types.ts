import { z } from "zod";

/**
 * Koperta odpowiedzi BaseLinker API.
 *
 * Każda odpowiedź (nawet błędna, nawet z HTTP 200) zawiera pole `status`.
 * `.loose()` — dopuszczamy dodatkowe pola: dane metody (np. lista produktów)
 * leżą w kopercie obok `status`, a ich kształt waliduje się osobno per metoda.
 */
export const responseEnvelopeSchema = z.looseObject({
  status: z.enum(["SUCCESS", "ERROR"]),
  error_code: z.string().optional(),
  error_message: z.string().optional(),
});

export type ResponseEnvelope = z.infer<typeof responseEnvelopeSchema>;

/** Parametry metody API — dowolny obiekt serializowalny do JSON. */
export type BaseLinkerParameters = Record<string, unknown>;
