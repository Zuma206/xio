import { FormEvent } from "react";

export function onSubmitResetForm(event: FormEvent<HTMLFormElement>) {
  const form = event.currentTarget;
  requestAnimationFrame(() => form.reset());
}
