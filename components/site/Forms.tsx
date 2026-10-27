"use client";

import type { FormEvent } from "react";
import { UiIcon } from "../Icon";

/*
 * The site has no server of its own, so the forms hand the message to the visitor's email app,
 * addressed to the foundation (mailto:). To receive form posts directly instead, point the forms at a
 * form service or a Next.js Route Handler; see README.md ("Forms").
 */

type Field = { readonly name: string; readonly label: string; readonly placeholder: string; readonly type: string; readonly required?: boolean };

const plain = (label: string) => label.replace(/\s*\*\s*$/, "");

function Label({ text }: { text: string }) {
  const req = /\*\s*$/.test(text);
  return (
    <span className="pg-label">
      {plain(text)}
      {req && <span className="pg-req"> *</span>}
    </span>
  );
}

function openMail(to: string, subject: string, lines: string[]) {
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

const AUTO: Record<string, string> = { firstName: "given-name", lastName: "family-name", email: "email", name: "name" };

/** Contact Us: First Name, Last Name, Email Address, Subject, Comments / Questions. */
export function ContactForm({ title, fields, submit, to }: { title: string; fields: readonly Field[]; submit: string; to: string }) {
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const v = (k: string) => String(data.get(k) ?? "").trim();
    openMail(
      to,
      v("subject") || title,
      fields.map((f) => `${plain(f.label)}: ${v(f.name)}`),
    );
  };
  return (
    <form className="pg-form" onSubmit={send}>
      <h3 className="cn-h3 pg-form-t">{title}</h3>
      <div className="pg-fields">
        {fields.map((f) => (
          <label key={f.name} className={`pg-field pg-field-${f.name}`}>
            <Label text={f.label} />
            {f.type === "textarea" ? (
              <textarea name={f.name} placeholder={f.placeholder} rows={5} required />
            ) : (
              <input type={f.type} name={f.name} placeholder={f.placeholder} autoComplete={AUTO[f.name]} required />
            )}
          </label>
        ))}
      </div>
      <button className="cn-btn cn-btn-lg pg-submit" type="submit">
        <span>{submit}</span>
        <UiIcon name="arrow-r" />
      </button>
    </form>
  );
}

/** Join Our Newsletter: Full Name and Email. */
export function NewsletterForm({ title, fields, submit, to }: { title: string; fields: readonly Field[]; submit: string; to: string }) {
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    openMail(
      to,
      title,
      fields.map((f) => `${f.label}: ${String(data.get(f.name) ?? "").trim()}`),
    );
  };
  return (
    <form className="pg-news-form" onSubmit={send}>
      {fields.map((f) => (
        <label key={f.name} className="pg-field">
          <span className="pg-label">{f.label}</span>
          <input type={f.type} name={f.name} placeholder={f.placeholder} autoComplete={AUTO[f.name]} required={f.required} />
        </label>
      ))}
      <button className="cn-btn cn-btn-lg" type="submit">
        <span>{submit}</span>
        <UiIcon name="arrow-r" />
      </button>
    </form>
  );
}
