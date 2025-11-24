import { BlockMath } from "react-katex";

export default function AboutModel({ title, summary, bullets = [], notes, equation }) {
  return (
    <div className="card" style={{ 
        padding: 12, 
        marginTop: 12,
         }}>
      <h3 style={{ 
        marginTop: 0,
        fontSize: 18,
         }}>
        {title || "About this model"}</h3>
      {summary && <p style={{ 
        marginTop: 6, 
        lineHeight: 1.5,
        }}>
        {summary}</p>}

    {equation && (
        <div style={{
            marginTop: 12,
        }}>
            <BlockMath math={equation} />
        </div>
      )}
    
      {!!bullets.length && (
        <ul style={{ 
            marginTop: 6, 
            paddingLeft: 18, 
            lineHeight: 1.6,
            fontSize: 15,
            }}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {notes && (
        <div style={{ marginTop: 8, 
        fontSize: 12, 
        color: "var(--muted)" 
        }}>
          {notes}
        </div>
      )}
    </div>
  );
}
