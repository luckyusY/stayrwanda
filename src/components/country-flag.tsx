type FlagCode = "RW" | "US" | "EU" | "GB" | "KE" | "UG" | "TZ" | "FR";

export function CountryFlag({ code, className = "" }: { code: FlagCode; className?: string }) {
  const common = { viewBox: "0 0 24 16", role: "img", "aria-label": `${code} flag`, className: `h-4 w-6 shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(20,34,58,.15)] ${className}` } as const;

  if (code === "RW") return <svg {...common}><path fill="#00a1de" d="M0 0h24v8H0z"/><path fill="#fad201" d="M0 8h24v4H0z"/><path fill="#20603d" d="M0 12h24v4H0z"/><circle cx="20" cy="3.5" r="1.7" fill="#fad201"/></svg>;
  if (code === "FR") return <svg {...common}><path fill="#0055a4" d="M0 0h8v16H0z"/><path fill="#fff" d="M8 0h8v16H8z"/><path fill="#ef4135" d="M16 0h8v16h-8z"/></svg>;
  if (code === "US") return <svg {...common}><path fill="#fff" d="M0 0h24v16H0z"/>{[0,4,8,12].map(y=><path key={y} fill="#b22234" d={`M0 ${y}h24v2H0z`}/>) }<path fill="#3c3b6e" d="M0 0h10v8H0z"/><g fill="#fff">{[2,5,8].flatMap(x=>[2,5].map(y=><circle key={`${x}-${y}`} cx={x} cy={y} r=".55"/>))}</g></svg>;
  if (code === "EU") return <svg {...common}><path fill="#003399" d="M0 0h24v16H0z"/><g fill="#ffcc00">{Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <circle key={i} cx={12+4*Math.sin(a)} cy={8-4*Math.cos(a)} r=".55"/>})}</g></svg>;
  if (code === "GB") return <svg {...common}><path fill="#012169" d="M0 0h24v16H0z"/><path stroke="#fff" strokeWidth="4" d="M0 0l24 16M24 0L0 16"/><path stroke="#c8102e" strokeWidth="1.6" d="M0 0l24 16M24 0L0 16"/><path fill="#fff" d="M10 0h4v16h-4zM0 6h24v4H0z"/><path fill="#c8102e" d="M11 0h2v16h-2zM0 7h24v2H0z"/></svg>;
  if (code === "KE") return <svg {...common}><path fill="#000" d="M0 0h24v5H0z"/><path fill="#fff" d="M0 5h24v1H0zM0 10h24v1H0z"/><path fill="#bb0000" d="M0 6h24v4H0z"/><path fill="#006600" d="M0 11h24v5H0z"/></svg>;
  if (code === "UG") return <svg {...common}>{["#000","#fcdc04","#d90000","#000","#fcdc04","#d90000"].map((fill,i)=><path key={i} fill={fill} d={`M0 ${i*8/3}h24v${8/3}H0z`}/>)}</svg>;
  return <svg {...common}><path fill="#1eb53a" d="M0 0h24v16H0z"/><path fill="#00a3dd" d="M24 0v16H0z"/><path stroke="#fcd116" strokeWidth="5" d="M-2 18L26-2"/><path stroke="#000" strokeWidth="3" d="M-2 18L26-2"/></svg>;
}
