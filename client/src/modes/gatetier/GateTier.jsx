import "./gate.css";

export default function GateTier() {
  return (
    <div className="view">
      <main className="gt-wrap">
        <h1>Gate-tier concept</h1>

        <section className="card">
          <h2>Design notes</h2>
          <ul>
            <li>Tiers: T1 (små), T2 (mellom), T3 (store) – visuelt markert.</li>
            <li>
              Lås opp neste tier ved å samle shards eller nå power-terskel.
            </li>
            <li>Spis kun fiender i åpne tiers. Låste gir knockback/straff.</li>
            <li>Bølger garanterer alltid minst én spiselig fiende.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
