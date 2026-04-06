'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { usePortfolio } from '../../hooks/usePortfolio';
import { formatINR } from '../../utils/calculations';

const GOALS = [
  { id: 'wealth', label: 'Wealth Creation', desc: 'Long-term compounding with discipline' },
  { id: 'retirement', label: 'Retirement', desc: 'Financial freedom and stable cash flow' },
  { id: 'house', label: 'Buy a House', desc: 'Down payment corpus in a planned horizon' },
  { id: 'education', label: "Child's Education", desc: 'Large future expenses with inflation in mind' },
  { id: 'car', label: 'Buy a Car', desc: 'Short-to-mid term accumulation strategy' },
  { id: 'business', label: 'Start a Business', desc: 'Capital runway and risk-aware growth' },
];

const RISK_LABEL = ['', 'Very Safe', 'Safe', 'Cautious', 'Moderate-', 'Moderate', 'Moderate+', 'Growth', 'Aggressive', 'High Risk', 'Max Risk'];
const RISK_NOTE = (riskScore) => {
  if (riskScore <= 3) {
    return 'Conservative profile with emphasis on capital preservation and low volatility.';
  }
  if (riskScore <= 6) {
    return 'Balanced profile with growth orientation and controlled drawdown behavior.';
  }
  return 'Growth profile with higher equity tilt and greater return variance potential.';
};
const STEPS = ['Goal','Capital','Risk','Horizon','Review'];

export default function Onboarding() {
  const router = useRouter();
  const { build, loading } = usePortfolio();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    goal: '',
    lumpSum: '',
    monthlySIP: '',
    riskScore: 5,
    horizonYears: 10,
    targetCorpus: '',
  });
  const [errors, setErrors] = useState({});

  const progress = (step / (STEPS.length - 1)) * 100;

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function validateStep() {
    const nextErrors = {};

    if (step === 0 && !form.goal) {
      nextErrors.goal = 'Please choose one financial goal.';
    }

    if (step === 1) {
      if (form.lumpSum === '' || Number.isNaN(Number(form.lumpSum)) || Number(form.lumpSum) < 0) {
        nextErrors.lumpSum = 'Enter a valid lump sum amount.';
      }
      if (!form.monthlySIP || Number(form.monthlySIP) < 500) {
        nextErrors.monthlySIP = 'Minimum monthly SIP is ₹500.';
      }
    }

    if (step === 3 && (!form.targetCorpus || Number(form.targetCorpus) < 10000)) {
      nextErrors.targetCorpus = 'Enter a realistic target corpus.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function next() {
    if (validateStep()) {
      setStep((current) => current + 1);
    }
  }

  function back() {
    setStep((current) => current - 1);
  }

  async function submit() {
    await build({
      goal: form.goal,
      lumpSum: Number(form.lumpSum) || 0,
      monthlySIP: Number(form.monthlySIP) || 0,
      riskScore: form.riskScore,
      horizonYears: form.horizonYears,
      targetCorpus: Number(form.targetCorpus) || 0,
    });
    router.push('/dashboard');
  }

  const StepHeading = ({ stepNumber, title, subtitle }) => (
    <div className="step-heading">
      <p>Step {stepNumber} of 5</p>
      <h1>{title}</h1>
      <span>{subtitle}</span>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="onboarding-wrap">
        <section className="onboarding-progress">
          <div className="progress-labels">
            {STEPS.map((label, index) => (
              <span key={label} className={index === step ? 'is-active' : ''}>
                {label}
              </span>
            ))}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="onboarding-card">
          {step === 0 && (
            <>
              <StepHeading
                stepNumber={1}
                title="What are you investing for?"
                subtitle="Your primary goal helps us optimize allocation and risk levels."
              />
              <div className="goal-grid">
                {GOALS.map((goal) => (
                  <button
                    type="button"
                    key={goal.id}
                    className={`goal-card ${form.goal === goal.id ? 'is-active' : ''}`}
                    onClick={() => updateField('goal', goal.id)}
                  >
                    <h3>{goal.label}</h3>
                    <p>{goal.desc}</p>
                  </button>
                ))}
              </div>
              {errors.goal ? <p className="field-error onboarding-error">{errors.goal}</p> : null}
            </>
          )}

          {step === 1 && (
            <>
              <StepHeading
                stepNumber={2}
                title="Define your investment capacity"
                subtitle="A realistic contribution plan drives portfolio quality more than timing."
              />
              <div className="form-stack">
                <Input
                  label="Lump Sum Capital"
                  type="number"
                  prefix="₹"
                  placeholder="500000"
                  value={form.lumpSum}
                  onChange={(event) => updateField('lumpSum', event.target.value)}
                  hint="One-time capital deployed immediately"
                  error={errors.lumpSum}
                />
                <Input
                  label="Monthly SIP"
                  type="number"
                  prefix="₹"
                  placeholder="10000"
                  value={form.monthlySIP}
                  onChange={(event) => updateField('monthlySIP', event.target.value)}
                  hint="Recurring monthly contribution"
                  error={errors.monthlySIP}
                />
                {form.lumpSum ? <p className="inline-note">Initial capital: {formatINR(Number(form.lumpSum) || 0)}</p> : null}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeading
                stepNumber={3}
                title="Calibrate your risk appetite"
                subtitle="We match drawdown tolerance with return potential and timeline constraints."
              />
              <div className="risk-panel">
                <div className="risk-meta">
                  <h3>{RISK_LABEL[form.riskScore]}</h3>
                  <p>{form.riskScore}/10</p>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.riskScore}
                  onChange={(event) => updateField('riskScore', Number(event.target.value))}
                />
                <p className="muted">{RISK_NOTE(form.riskScore)}</p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeading
                stepNumber={4}
                title="Set horizon and target corpus"
                subtitle="These numbers shape the expected return path and SIP recommendations."
              />
              <div className="form-stack">
                <div className="range-box">
                  <label htmlFor="horizonYears">Investment Horizon</label>
                  <div className="risk-meta">
                    <h3>{form.horizonYears} years</h3>
                  </div>
                  <input
                    id="horizonYears"
                    type="range"
                    min={1}
                    max={30}
                    value={form.horizonYears}
                    onChange={(event) => updateField('horizonYears', Number(event.target.value))}
                  />
                </div>
                <Input
                  label="Target Corpus"
                  type="number"
                  prefix="₹"
                  placeholder="10000000"
                  value={form.targetCorpus}
                  onChange={(event) => updateField('targetCorpus', event.target.value)}
                  hint="Total wealth target for this plan"
                  error={errors.targetCorpus}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <StepHeading
                stepNumber={5}
                title="Review and generate your plan"
                subtitle="This profile is used to create allocation, projection, and recommendations."
              />
              <div className="review-grid">
                <article>
                  <span>Goal</span>
                  <p>{GOALS.find((goal) => goal.id === form.goal)?.label || 'Not selected'}</p>
                </article>
                <article>
                  <span>Lump Sum</span>
                  <p>{formatINR(Number(form.lumpSum) || 0)}</p>
                </article>
                <article>
                  <span>Monthly SIP</span>
                  <p>{formatINR(Number(form.monthlySIP) || 0)}/mo</p>
                </article>
                <article>
                  <span>Risk Score</span>
                  <p>{form.riskScore}/10</p>
                </article>
                <article>
                  <span>Horizon</span>
                  <p>{form.horizonYears} years</p>
                </article>
                <article>
                  <span>Target Corpus</span>
                  <p>{formatINR(Number(form.targetCorpus) || 0)}</p>
                </article>
              </div>
            </>
          )}

          <footer className="onboarding-actions">
            <Button variant="ghost" onClick={back} disabled={step === 0}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button variant="primary" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={submit} disabled={loading}>
                {loading ? 'Building Portfolio...' : 'Build My Portfolio'}
              </Button>
            )}
          </footer>
        </section>
      </main>
    </>
  );
}