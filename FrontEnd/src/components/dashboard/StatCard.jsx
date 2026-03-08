function StatCard({ title, value, icon, color }) {
  return (
    <article className={`stat-card ${color}`}>
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <h3>{value}</h3>
    </article>
  );
}

export default StatCard;
