export interface MailData<T = never> {
  to: string | null;
  data: T;
}
