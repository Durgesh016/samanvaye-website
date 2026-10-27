"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Star, UiIcon } from "../Icon";

type Step1 = { title: string; text: string; label: string; currency: string; amounts: readonly string[]; custom: string; next: string; secure: string };
type Step2 = {
  title: string;
  text: string;
  first: { label: string; placeholder: string };
  last: { label: string; placeholder: string };
  email: { label: string };
  next: string;
};
type Step3 = { title: string; text: string; gateway: string; submit: string };
export type DonationText = { step1: Step1; step2: Step2; step3: Step3; receipt: { heading: string; text: string } };
export type Bank = { title: string; rows: readonly { label: string; value: readonly string[] }[] };

const inr = (v: number) => "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** The bank account card (also used on the Contact page): it tilts in 3D like a card in the hand. */
export function BankCard({ bank }: { bank: Bank }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--tx", x.toFixed(3));
      el.style.setProperty("--ty", y.toFixed(3));
      el.style.transform = `perspective(1000px) rotateY(${((x - 0.5) * 12).toFixed(2)}deg) rotateX(${((0.5 - y) * 10).toFixed(2)}deg)`;
      el.classList.add("is-tilting");
    };
    const leave = () => {
      el.style.transform = "";
      el.classList.remove("is-tilting");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={ref} className="pg-bank">
      <span className="pg-bank-glare" aria-hidden="true"></span>
      <div className="pg-bank-top">
        <span className="pg-bank-chip" aria-hidden="true"></span>
        <h3 className="pg-bank-t">{bank.title}</h3>
        <span className="pg-bank-ico" aria-hidden="true">
          <UiIcon name="bank" />
        </span>
      </div>
      <dl className="pg-bank-rows">
        {bank.rows.map((r) => (
          <div key={r.label} className={r.label === "A/C NO" ? "pg-bank-ac" : r.value.length > 1 ? "pg-bank-wide" : undefined}>
            <dt>
              {r.label}
              <span className="pg-bank-colon"> :</span>
            </dt>{" "}
            <dd>
              {r.value.map((v) => (
                <span key={v}>{v}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * The donation form, in the three steps of the form on samanvaye.org: amount, donor, payment.
 * Payment is "Offline Donation": the last step shows the foundation's bank details and hands the pledge to
 * the visitor's email app. To take card/UPI payments online, connect a payment gateway (README.md).
 */
export function DonationForm({ text, bank, to, subject }: { text: DonationText; bank: Bank; to: string; subject: string }) {
  const { step1, step2, step3, receipt } = text;
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<string>(step1.amounts[0]);
  const [custom, setCustom] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  /* each step (and the thank-you) starts at the top of the form, in view */
  useEffect(() => {
    const el = top.current;
    if (!el || (step === 0 && !done)) return;
    if (el.getBoundingClientRect().top < 80) el.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    el.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }, [step, done]);

  const customValue = parseFloat(custom.replace(/[^\d.]/g, ""));
  const amount = custom && customValue > 0 ? inr(customValue) : level;

  const next = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    const lines = [
      `${step1.label}: ${amount}`,
      `${step2.first.label}: ${first}`,
      `${step2.last.label}: ${last}`,
      `${step2.email.label}: ${email}`,
      `${step3.title}: ${step3.gateway}`,
    ];
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setDone(true);
  };

  if (done) {
    const name = first.trim();
    return (
      <div ref={top} className="pg-give-form pg-give-done" role="status">
        <span className="pg-give-check" aria-hidden="true">
          <UiIcon name="check" />
        </span>
        <h2 className="cn-h3" tabIndex={-1}>
          {receipt.heading.replace("{first_name}", name)}
        </h2>
        <p>{receipt.text.replace("{first_name}", name)}</p>
        <BankCard bank={bank} />
      </div>
    );
  }

  return (
    <div ref={top} className="pg-give-top">
    <form className="pg-give-form" onSubmit={next}>
      <ol className="pg-give-steps" aria-hidden="true">
        {[0, 1, 2].map((k) => (
          <li key={k} className={k <= step ? "on" : undefined}>
            <Star className="pg-give-star" />
          </li>
        ))}
      </ol>

      {step > 0 && (
        <button type="button" className="pg-give-back" aria-label="Back" onClick={() => setStep(step - 1)}>
          <UiIcon name="arrow-l" />
        </button>
      )}

      {step === 0 && (
        <div className="pg-give-step" role="group" aria-labelledby="pg-give-t">
          <h2 className="cn-h3 pg-give-t" id="pg-give-t" tabIndex={-1}>{step1.title}</h2>
          <p className="pg-give-sub">{step1.text}</p>
          <p className="pg-label pg-give-label">
            {step1.label}
            <span className="pg-req"> *</span>
            <span className="pg-give-cur">{step1.currency}₹</span>
          </p>
          <div className="pg-amounts" role="radiogroup" aria-label={step1.label}>
            {step1.amounts.map((a) => (
              <label key={a} className={`pg-amount${!custom && level === a ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name="amount"
                  value={a}
                  checked={!custom && level === a}
                  onChange={() => {
                    setLevel(a);
                    setCustom("");
                  }}
                />
                <span>{a}</span>
              </label>
            ))}
          </div>
          <label className="pg-field pg-custom">
            <span className="vh">{step1.custom}</span>
            <span className="pg-custom-sym" aria-hidden="true">
              ₹
            </span>
            <input inputMode="decimal" name="custom" placeholder={step1.custom} value={custom} onChange={(e) => setCustom(e.target.value)} />
          </label>
          <button className="cn-btn cn-btn-lg pg-give-next" type="submit">
            <span>{step1.next}</span>
            <UiIcon name="arrow-r" />
          </button>
          <p className="pg-give-secure">
            <UiIcon name="lock" />
            <span>{step1.secure}</span>
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="pg-give-step" role="group" aria-labelledby="pg-give-t">
          <h2 className="cn-h3 pg-give-t" id="pg-give-t" tabIndex={-1}>{step2.title}</h2>
          <p className="pg-give-sub">{step2.text}</p>
          <div className="pg-fields pg-fields-2">
            <label className="pg-field">
              <span className="pg-label">
                {step2.first.label}
                <span className="pg-req"> *</span>
              </span>
              <input name="first" placeholder={step2.first.placeholder} autoComplete="given-name" required value={first} onChange={(e) => setFirst(e.target.value)} />
            </label>
            <label className="pg-field">
              <span className="pg-label">{step2.last.label}</span>
              <input name="last" placeholder={step2.last.placeholder} autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} />
            </label>
            <label className="pg-field pg-field-wide">
              <span className="pg-label">
                {step2.email.label}
                <span className="pg-req"> *</span>
              </span>
              <input type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>
          <button className="cn-btn cn-btn-lg pg-give-next" type="submit">
            <span>{step2.next}</span>
            <UiIcon name="arrow-r" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="pg-give-step" role="group" aria-labelledby="pg-give-t">
          <h2 className="cn-h3 pg-give-t" id="pg-give-t" tabIndex={-1}>{step3.title}</h2>
          <p className="pg-give-sub">{step3.text}</p>
          <dl className="pg-give-sum">
            <div>
              <dt>{step1.label}</dt>
              <dd>{amount}</dd>
            </div>
            <div>
              <dt>{step2.first.label}</dt>
              <dd>
                {first} {last}
              </dd>
            </div>
            <div>
              <dt>{step2.email.label}</dt>
              <dd>{email}</dd>
            </div>
          </dl>
          <label className="pg-gateway is-on">
            <input type="radio" name="gateway" value="offline" defaultChecked />
            <span>{step3.gateway}</span>
          </label>
          <BankCard bank={bank} />
          <button className="cn-btn cn-btn-lg pg-give-next" type="submit">
            <span>{step3.submit}</span>
            <UiIcon name="arrow-r" />
          </button>
        </div>
      )}
    </form>
    </div>
  );
}
