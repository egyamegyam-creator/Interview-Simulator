interface Capability {
  phase: string;
  title: string;
  description: string;
}

const items: Capability[] = [
  {
    phase: 'Module 01',
    title: 'Question Generation',
    description:
      'Behavioral (STAR), open-ended case, and situational judgment formats across Easy, Medium, and Hard difficulty tiers.',
  },
  {
    phase: 'Module 02',
    title: 'Role Tailoring',
    description:
      'Paste a job description URL or text, and questions are generated with direct reference to the responsibilities and seniority of the role.',
  },
  {
    phase: 'Module 03',
    title: 'Feedback Engine',
    description:
      'Streamed critique scoring strengths, gaps against the rubric, and a model answer. Behavioral answers receive an explicit STAR breakdown.',
  },
];

export function CapabilityList() {
  return (
    <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {items.map((item) => (
        <li
          key={item.phase}
          className="grid gap-3 py-5 sm:grid-cols-[120px_1fr] sm:gap-10"
        >
          <div className="label-eyebrow">{item.phase}</div>
          <div>
            <h3 className="text-base font-bold uppercase tracking-wide text-[var(--color-text)]">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
