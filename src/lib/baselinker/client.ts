import "server-only";

import { env } from "@/env";
import { BaseLinkerApiError, BaseLinkerHttpError, BaseLinkerParseError } from "./errors";
import { responseEnvelopeSchema, type BaseLinkerParameters } from "./types";

const BASELINKER_API_URL = "https://api.baselinker.com/connector.php";

/**
 * Wykonuje pojedyncze wywołanie metody BaseLinker API.
 *
 * Jedyne miejsce w aplikacji, które zna adres API, format transportu
 * i token. Cała reszta kodu woła metody BL wyłącznie przez tę funkcję.
 *
 * @typeParam TResponse - kształt danych odpowiedzi dla danej metody
 * @param method - nazwa metody API, np. "getInventories"
 * @param parameters - parametry metody (serializowane do JSON)
 * @throws BaseLinkerHttpError  - gdy zawiodła warstwa HTTP (status inny niż 2xx)
 * @throws BaseLinkerApiError   - gdy API zwróciło status "ERROR" w kopercie
 * @throws BaseLinkerParseError - gdy odpowiedź nie jest poprawną kopertą
 */
export async function callBaseLinker<TResponse>(
  method: string,
  parameters: BaseLinkerParameters = {},
): Promise<TResponse> {
  const body = new URLSearchParams({
    method,
    parameters: JSON.stringify(parameters),
  });

  const response = await fetch(BASELINKER_API_URL, {
    method: "POST",
    headers: {
      "X-BLToken": env.BASELINKER_API_TOKEN,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    // Dane z BL nigdy nie mogą być cache'owane przez Next.js na poziomie
    // fetch — świeżością danych zarządza nasza warstwa synchronizacji.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new BaseLinkerHttpError(response.status, method);
  }

  const json: unknown = await response.json();
  const envelope = responseEnvelopeSchema.safeParse(json);

  if (!envelope.success) {
    throw new BaseLinkerParseError(method, envelope.error.message);
  }

  if (envelope.data.status === "ERROR") {
    throw new BaseLinkerApiError(
      envelope.data.error_code ?? "ERROR_UNKNOWN",
      envelope.data.error_message ?? "Brak komunikatu błędu",
      method,
    );
  }

  return envelope.data as TResponse;
}
