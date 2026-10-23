'use strict';
function randomInt(max) {
  if (!globalThis.crypto?.getRandomValues) throw new Error('Web Crypto unavailable');
  const values = new Uint32Array(1);
  const limit = Math.floor(4294967296 / max) * max;
  do { crypto.getRandomValues(values); } while (values[0] >= limit);
  return values[0] % max;
}
function generateLine() {
  const pool = Array.from({length:45}, (_,i)=>i+1);
  for (let i=44;i>0;i--) { const j=randomInt(i+1); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  return pool.slice(0,6).sort((a,b)=>a-b);
}
function lineStats(line) {
  const odd=line.filter(n=>n%2).length;
  return {odd,even:6-odd,sum:line.reduce((a,b)=>a+b,0),pairs:line.slice(1).filter((n,i)=>n===line[i]+1).length};
}
if (typeof module !== 'undefined') module.exports={randomInt,generateLine,lineStats};
if (typeof document !== 'undefined') {
  const body=document.body, theme=document.getElementById('theme');
  try {const saved=localStorage.getItem('lucky-theme');body.classList.toggle('dark',saved==='dark'||(!saved&&window.matchMedia('(prefers-color-scheme: dark)').matches));}catch{}
  theme?.addEventListener('click',()=>{body.classList.toggle('dark');try{localStorage.setItem('lucky-theme',body.classList.contains('dark')?'dark':'light');}catch{}});
  const generate=document.getElementById('generate'),display=document.getElementById('results'),status=document.getElementById('status');
  let lines=[];
  function text(){return lines.map((l,i)=>`${i+1}줄: ${l.map(n=>String(n).padStart(2,'0')).join(', ')}`).join('\n');}
  generate?.addEventListener('click',()=>{
    try {
      const next=Array.from({length:5},()=>generateLine());
      display.replaceChildren();lines=next;
      lines.forEach((line,i)=>{
        const row=document.createElement('div');row.className='row';
        const label=document.createElement('strong');label.textContent=`${i+1}줄`;
        const balls=document.createElement('div');balls.className='balls';
        line.forEach(n=>{const ball=document.createElement('span');ball.className=`ball c${Math.floor((n-1)/10)}`;ball.textContent=n;balls.append(ball);});
        const s=lineStats(line),stats=document.createElement('span');stats.className='stats';stats.textContent=`홀 ${s.odd} · 짝 ${s.even} / 합 ${s.sum} / 연속 ${s.pairs}쌍`;
        row.append(label,balls,stats);display.append(row);
      });
      document.getElementById('copy').disabled=false;document.getElementById('download').disabled=false;
      status.textContent='새 번호 5줄을 생성했습니다. 당첨 예측 결과가 아닙니다.';
    } catch {status.textContent='이 브라우저에서는 난수 기능을 사용할 수 없습니다. 최신 브라우저의 HTTPS 페이지에서 다시 시도해 주세요.';}
  });
  document.getElementById('copy')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text());status.textContent='번호 5줄을 복사했습니다.';}catch{status.textContent='복사 권한을 사용할 수 없습니다. 텍스트 저장 버튼을 이용해 주세요.';}});
  document.getElementById('download')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([text()+'\n참고용 무작위 번호이며 당첨을 보장하지 않습니다.'],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='lucky-lotto.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='번호 텍스트 파일 저장을 요청했습니다.';});
  document.getElementById('comments-load')?.addEventListener('click',function(){this.disabled=true;this.textContent='댓글 연결 중…';window.disqus_config=function(){this.page.identifier='lucky-lotto-home';this.page.title='Lucky Lotto 번호 생성기 이용 후기';};const s=document.createElement('script');s.src='https://product-vn4rjqyqub.disqus.com/embed.js';s.async=true;s.onload=()=>{this.textContent='댓글 연결 요청 완료';};s.onerror=()=>{this.disabled=false;this.textContent='연결 실패 · 댓글 다시 불러오기';s.remove();};document.head.append(s);});
}
