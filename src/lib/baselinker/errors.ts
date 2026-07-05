/**
 * Hierarchia błędów integracji z BaseLinkerem.
 *
 * Własne klasy błędów zamiast gołego `throw new Error(string)` dają nam:
 * - rozróżnianie rodzaju awarii przez `instanceof` w blokach catch,
 * - ustrukturyzowane dane (kod błędu, metoda) zamiast sklejania stringów,
 * - jedno miejsce definiujące, co w ogóle może pójść źle w tej integracji.
 */

/** Klasa bazowa — pozwala złapać "dowolny błąd BaseLinkera" jednym instanceof. */
export class BaseLinkerError extends Error {
  constructor(
    message: string,
    /** Nazwa metody API, której dotyczyła awaria (np. "getInventories"). */
    public readonly method: string,
  ) {
    super(message);
    this.name = "BaseLinkerError";
  }
}

/** Awaria na poziomie HTTP — serwer BL nie odpowiedział poprawnie (5xx, timeout itp.). */
export class BaseLinkerHttpError extends BaseLinkerError {
  constructor(
    public readonly statusCode: number,
    method: string,
  ) {
    super(`BaseLinker HTTP ${statusCode} przy metodzie "${method}"`, method);
    this.name = "BaseLinkerHttpError";
  }
}

/** Błąd zwrócony przez API w kopercie (status: "ERROR") — np. zły token, złe parametry. */
export class BaseLinkerApiError extends BaseLinkerError {
  constructor(
    /** Kod błędu z API, np. "ERROR_BAD_TOKEN". */
    public readonly code: string,
    message: string,
    method: string,
  ) {
    super(`BaseLinker [${code}] przy metodzie "${method}": ${message}`, method);
    this.name = "BaseLinkerApiError";
  }
}

/** Odpowiedź nie pasuje do oczekiwanego kształtu — API się zmieniło albo zwróciło śmieci. */
export class BaseLinkerParseError extends BaseLinkerError {
  constructor(method: string, details: string) {
    super(`Niepoprawny kształt odpowiedzi BaseLinkera dla "${method}": ${details}`, method);
    this.name = "BaseLinkerParseError";
  }
}
