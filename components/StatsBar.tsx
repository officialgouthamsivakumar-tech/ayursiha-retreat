const stats = [
  { n: '4,800+', l: 'Patients healed' },
  { n: '22',     l: 'Years in practice' },
  { n: '18',     l: 'Specialist physicians' },
  { n: '97%',    l: 'Patient satisfaction' },
]

export default function StatsBar() {
  return (
    <div className="statsbar">
      <div className="wrap">
        <div className="statsbar-grid">
          {stats.map(({ n, l }) => (
            <div key={l} className="sb-item r">
              <div className="sb-n">{n}</div>
              <div className="sb-rule" />
              <div className="sb-l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
