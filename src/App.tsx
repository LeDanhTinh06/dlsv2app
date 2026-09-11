import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, RotateCcw, Copy, Check, Zap, ChevronDown } from 'lucide-react';

const BUDGET = 100;
const CAP = 100;

const MULT = {
  spe: 1.55,
  acc: 1.266,
  sta: 0.55,
  str: 1.55,
  con: 2.1,
  pas: 0.98,
  sho: 0.97,
  tac: 0.97,
};

const LABELS = {
  spe: 'Speed',
  acc: 'Acceleration',
  sta: 'Stamina',
  str: 'Strength',
  con: 'Ball Control',
  pas: 'Passing',
  sho: 'Shooting',
  tac: 'Tackling',
};

const LABELS_VI = {
  spe: 'Tốc độ',
  acc: 'Bứt tốc',
  sta: 'Thể lực',
  str: 'Sức mạnh',
  con: 'Khống chế',
  pas: 'Chuyền bóng',
  sho: 'Dứt điểm',
  tac: 'Tắc bóng',
};

const FITNESS = ['spe', 'acc', 'sta', 'str'];
const TECHNICAL = ['con', 'pas', 'sho', 'tac'];

const WEIGHTS = {
  ST: { pac: 0.25, sho: 0.35, pas: 0.1, dri: 0.15, def: 0.02, phy: 0.13 },
  CF: { pac: 0.22, sho: 0.32, pas: 0.14, dri: 0.17, def: 0.02, phy: 0.13 },
  AM: { pac: 0.15, sho: 0.15, pas: 0.3, dri: 0.25, def: 0.05, phy: 0.1 },
  CM: { pac: 0.14, sho: 0.12, pas: 0.32, dri: 0.22, def: 0.1, phy: 0.1 },
  LW: { pac: 0.3, sho: 0.2, pas: 0.15, dri: 0.25, def: 0.02, phy: 0.08 },
  RW: { pac: 0.3, sho: 0.2, pas: 0.15, dri: 0.25, def: 0.02, phy: 0.08 },
  CB: { pac: 0.1, sho: 0.02, pas: 0.1, dri: 0.08, def: 0.45, phy: 0.25 },
};

const PLAYERS = [
  {
    id: 'bruno',
    name: 'Bruno Fernandes',
    nation: 'POR',
    position: 'AM',
    base: {
      spe: 76.9,
      acc: 79.9,
      sta: 93.0,
      str: 69.9,
      con: 85.9,
      pas: 95.4,
      sho: 82.9,
      tac: 72.9,
    },
  },
  {
    id: 'mbappe',
    name: 'Kylian Mbappé 86',
    nation: 'FRA',
    position: 'ST',
    base: {
      spe: 94.9,
      acc: 94.9,
      sta: 83.9,
      str: 74.0,
      con: 90.0,
      pas: 83.5,
      sho: 95.0,
      tac: 27.8,
    },
  },
  {
    id: 'Rashford',
    name: 'Marcus Rashford',
    nation: 'ENG',
    position: 'LW',
    base: {
      spe: 90.0,
      acc: 81.0,
      sta: 74.0,
      str: 73.0,
      con: 81.9,
      pas: 80.9,
      sho: 82.9,
      tac: 33.0,
    },
  },
   {
    id: 'Ronaldo',
    name: 'Ronaldo 82',
    nation: 'POR',
    position: 'CF',
    base: {
      spe: 77.9,
      acc: 73.9,
      sta: 79.9,
      str: 83.9,
      con: 87.9,
      pas: 74.9,
      sho: 93.9,
      tac: 37.9,
    },
  },
  {
    id: 'haaland',
    name: 'Erling Haaland 86',
    nation: 'NOR',
    position: 'ST',
    base: {
      spe: 92.9,
      acc: 80.9,
      sta: 81.9,
      str: 93.9,
      con: 82.9,
      pas: 78.9,
      sho: 95.2,
      tac: 40.9,
    },
  },
   {
    id: 'son',
    name: 'Heung-min son',
    nation: 'KOR',
    position: 'CF',
    base: {
      spe: 85.1,
      acc: 85.1,
      sta: 82.9,
      str: 66.9,
      con: 84.9,
      pas: 84.9,
      sho: 83.0,
      tac: 37.9,
    },
  },
  {
    id: 'kdb',
    name: 'Kevin De Bruyne',
    nation: 'BEL',
    position: 'CM',
    base: {
      spe: 72.0,
      acc: 75.0,
      sta: 88.0,
      str: 78.0,
      con: 88.0,
      pas: 94.0,
      sho: 86.0,
      tac: 66.0,
    },
  },
   {
    id: 'luka',
    name: 'Luka Modrić',
    nation: 'CRT',
    position: 'CM',
    base: {
      spe: 67.9,
      acc: 81.9,
      sta: 75.9,
      str: 62.9,
      con: 90.9,
      pas: 92.9,
      sho: 72.9,
      tac: 74.9,
    },
  },
   {
    id: 'gas',
    name: 'Paul Gascoigne',
    nation: 'ENG',
    position: 'AM',
    base: {
      spe: 84.0,
      acc: 84.0,
      sta: 83.0,
      str: 74.0,
      con: 92.0,
      pas: 85.0,
      sho: 85.0,
      tac: 53.0,
    },
  },
   {
    id: 'reij',
    name: 'Tijjani Reijnders',
    nation: 'NED',
    position: 'CM',
    base: {
      spe: 76.0,
      acc: 77.0,
      sta: 87.0,
      str: 70.0,
      con: 83.0,
      pas: 83.0,
      sho: 76.0,
      tac: 73.0,
    },
  },
  {
    id: 'vvd',
    name: 'Virgil van Dijk',
    nation: 'NED',
    position: 'CB',
    base: {
      spe: 78.0,
      acc: 76.0,
      sta: 85.0,
      str: 93.0,
      con: 72.0,
      pas: 71.0,
      sho: 60.0,
      tac: 91.0,
    },
  },
  {
    id: 'vini',
    name: 'Vinícius Júnior',
    nation: 'BRA',
    position: 'LW',
    base: {
      spe: 95.0,
      acc: 94.0,
      sta: 80.0,
      str: 65.0,
      con: 91.0,
      pas: 78.0,
      sho: 83.0,
      tac: 29.0,
    },
  },
  {
    id: 'salah',
    name: 'Mohamed Salah',
    nation: 'EGY',
    position: 'RW',
    base: {
      spe: 90.0,
      acc: 91.0,
      sta: 84.0,
      str: 75.0,
      con: 90.0,
      pas: 82.0,
      sho: 89.0,
      tac: 42.0,
    },
  },
  {
    id: 'saka',
    name: 'Bukayo Saka',
    nation: 'ENG',
    position: 'RW',
    base: {
      spe: 87.0,
      acc: 89.0,
      sta: 85.0,
      str: 70.0,
      con: 88.0,
      pas: 83.0,
      sho: 82.0,
      tac: 51.0,
    },
  },
  {
    id: 'odegaard',
    name: 'Martin Ødegaard',
    nation: 'NOR',
    position: 'AM',
    base: {
      spe: 74.0,
      acc: 78.0,
      sta: 84.0,
      str: 63.0,
      con: 89.0,
      pas: 91.0,
      sho: 80.0,
      tac: 58.0,
    },
  },
  {
    id: 'rice',
    name: 'Declan Rice',
    nation: 'ENG',
    position: 'CM',
    base: {
      spe: 75.0,
      acc: 77.0,
      sta: 89.0,
      str: 84.0,
      con: 81.0,
      pas: 82.0,
      sho: 68.0,
      tac: 87.0,
    },
  },
  {
    id: 'foden',
    name: 'Phil Foden',
    nation: 'ENG',
    position: 'LW',
    base: {
      spe: 84.0,
      acc: 87.0,
      sta: 82.0,
      str: 60.0,
      con: 90.0,
      pas: 85.0,
      sho: 82.0,
      tac: 48.0,
    },
  },
  {
    id: 'rodri',
    name: 'Rodri',
    nation: 'ESP',
    position: 'CM',
    base: {
      spe: 68.0,
      acc: 71.0,
      sta: 86.0,
      str: 82.0,
      con: 84.0,
      pas: 90.0,
      sho: 74.0,
      tac: 86.0,
    },
  },
  {
    id: 'saliba',
    name: 'William Saliba',
    nation: 'FRA',
    position: 'CB',
    base: {
      spe: 83.0,
      acc: 80.0,
      sta: 82.0,
      str: 85.0,
      con: 74.0,
      pas: 72.0,
      sho: 45.0,
      tac: 88.0,
    },
  },
  {
    id: 'palmer',
    name: 'Cole Palmer',
    nation: 'ENG',
    position: 'AM',
    base: {
      spe: 80.0,
      acc: 83.0,
      sta: 79.0,
      str: 64.0,
      con: 88.0,
      pas: 85.0,
      sho: 85.0,
      tac: 44.0,
    },
  },
  {
    id: 'isak',
    name: 'Alexander Isak',
    nation: 'SWE',
    position: 'ST',
    base: {
      spe: 88.0,
      acc: 86.0,
      sta: 78.0,
      str: 72.0,
      con: 87.0,
      pas: 71.0,
      sho: 87.0,
      tac: 32.0,
    },
  },
  {
    id: 'guimaraes',
    name: 'Bruno Guimarães',
    nation: 'BRA',
    position: 'CM',
    base: {
      spe: 76.0,
      acc: 78.0,
      sta: 87.0,
      str: 77.0,
      con: 85.0,
      pas: 84.0,
      sho: 71.0,
      tac: 82.0,
    },
  },
];

const r1 = (n) => Math.round(n * 10) / 10;

function computeOVR(position, s) {
  const w = WEIGHTS[position] || WEIGHTS.CM;
  const pac = (s.spe + s.acc) / 2;
  const phy = (s.str + s.sta) / 2;
  const dri = s.con;
  const def = s.tac;
  const val =
    w.pac * pac +
    w.sho * s.sho +
    w.pas * s.pas +
    w.dri * dri +
    w.def * def +
    w.phy * phy;
  return Math.max(1, Math.min(99, Math.round(val)));
}

function tierColor(v) {
  if (v >= 90) return '#3ddc84';
  if (v >= 80) return '#8be04e';
  if (v >= 70) return '#e8c547';
  if (v >= 60) return '#e89a47';
  return '#e85f5f';
}

function totalUsed(stats, base) {
  return Object.keys(MULT).reduce(
    (sum, k) => sum + (stats[k] - base[k]) * MULT[k],
    0
  );
}

function sectionUsed(stats, base, keys) {
  return keys.reduce((sum, k) => sum + (stats[k] - base[k]) * MULT[k], 0);
}

function MiniGauge({ pct, color }) {
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg viewBox="0 0 64 64" className="w-14 h-14 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke="#241d29"
          strokeWidth="7"
        />
        <circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 169.6} 169.6`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#f4eef7]">
        {pct.toFixed(0)}%
      </div>
    </div>
  );
}

function StepButton({
  k,
  delta,
  label,
  cls,
  disabled,
  hoverAction,
  setHoverAction,
  onStep,
}) {
  const isActive = hoverAction?.key === k && hoverAction?.delta === delta;
  return (
    <button
      onClick={() => onStep(k, delta)}
      onMouseEnter={() => setHoverAction({ key: k, delta })}
      onMouseLeave={() =>
        setHoverAction((prev) =>
          prev && prev.key === k && prev.delta === delta ? null : prev
        )
      }
      disabled={disabled}
      title={`${delta > 0 ? '+' : ''}${delta}`}
      className={`w-7 h-6 rounded-md border flex items-center justify-center disabled:opacity-25 transition-colors ${cls} ${
        isActive
          ? delta > 0
            ? 'ring-2 ring-[#3ddc84]'
            : 'ring-2 ring-[#e8425f]'
          : ''
      }`}
    >
      {label}
    </button>
  );
}

function StatTile({
  k,
  base,
  val,
  hoverAction,
  setHoverAction,
  onStep,
  onReset,
}) {
  const spent = r1((val - base) * MULT[k]);
  const toCap = r1(CAP - val);
  const atCap = val >= CAP - 0.001;
  const atBase = val <= base + 0.001;
  const isHovered = hoverAction?.key === k;

  return (
    <div
      className={`relative flex flex-col items-center rounded-xl bg-[#151119] border p-4 transition-colors ${
        isHovered ? 'border-[#e8425f]' : 'border-[#2a2230]'
      }`}
    >
      <button
        onClick={() => onReset(k)}
        disabled={atBase}
        title="Đặt lại chỉ số này"
        className="absolute top-3 right-3 text-[#5f5568] hover:text-[#c9bfd4] disabled:opacity-30 disabled:hover:text-[#5f5568] transition-colors"
      >
        <RotateCcw size={14} />
      </button>
      <div className="text-[13px] font-semibold text-[#e7e1ec] mb-0.5">
        {LABELS[k]} <span className="text-[#8a7f94]">({k.toUpperCase()})</span>
      </div>
      <div className="text-[10px] text-[#7a6f85] mb-2">×{MULT[k]}</div>
      <div className="text-[11px] text-[#7a6f85]">Base</div>
      <div className="text-sm text-[#a89bb4] mb-3 tabular-nums">
        {base.toFixed(1)}
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex flex-col gap-1">
          <StepButton
            k={k}
            delta={-10}
            label="−10"
            cls="bg-[#2c1520] border-[#4a2536] text-[10px] font-bold text-[#f28fa0]"
            disabled={atBase}
            hoverAction={hoverAction}
            setHoverAction={setHoverAction}
            onStep={onStep}
          />
          <StepButton
            k={k}
            delta={-1}
            label="−1"
            cls="bg-[#241d29] border-[#3a2f42] text-[11px] font-bold text-[#c9bfd4]"
            disabled={atBase}
            hoverAction={hoverAction}
            setHoverAction={setHoverAction}
            onStep={onStep}
          />
          <StepButton
            k={k}
            delta={-0.1}
            label="−.1"
            cls="bg-[#1b1620] border-[#3a2f42] text-[9px] font-semibold text-[#9a8fa4]"
            disabled={atBase}
            hoverAction={hoverAction}
            setHoverAction={setHoverAction}
            onStep={onStep}
          />
        </div>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center font-black text-lg tabular-nums border-4"
          style={{
            borderColor: tierColor(val),
            color: tierColor(val),
            background: '#0f0c12',
          }}
        >
          {val.toFixed(1)}
        </div>
        <div className="flex flex-col gap-1">
          <StepButton
            k={k}
            delta={0.1}
            label="+.1"
            cls="bg-[#1b1620] border-[#3a2f42] text-[9px] font-semibold text-[#9a8fa4]"
            disabled={atCap}
            hoverAction={hoverAction}
            setHoverAction={setHoverAction}
            onStep={onStep}
          />
          <StepButton
            k={k}
            delta={1}
            label="+1"
            cls="bg-[#241d29] border-[#3a2f42] text-[11px] font-bold text-[#c9bfd4]"
            disabled={atCap}
            hoverAction={hoverAction}
            setHoverAction={setHoverAction}
            onStep={onStep}
          />
          <StepButton
            k={k}
            delta={10}
            label="+10"
            cls="bg-[#0f2c1e] border-[#25473a] text-[10px] font-bold text-[#8be8b8]"
            disabled={atCap}
            hoverAction={hoverAction}
            setHoverAction={setHoverAction}
            onStep={onStep}
          />
        </div>
      </div>

      <div className="mt-3 text-center leading-tight">
        <div className="text-[11px] text-[#8a7f94]">
          Đã dùng{' '}
          <span className="text-[#c9bfd4] font-medium">{spent.toFixed(1)}</span>{' '}
          điểm
        </div>
        <div className="text-[11px] text-[#8a7f94]">
          Còn{' '}
          <span className="text-[#c9bfd4] font-medium">{toCap.toFixed(1)}</span>{' '}
          tới trần
        </div>
      </div>
    </div>
  );
}

export default function PlayerUpgradeSimulator() {
  const [selectedId, setSelectedId] = useState(PLAYERS[0].id);
  const player = useMemo(
    () => PLAYERS.find((p) => p.id === selectedId),
    [selectedId]
  );
  const [stats, setStats] = useState({ ...player.base });
  const [query, setQuery] = useState(player.name);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoverAction, setHoverAction] = useState(null);
  const boxRef = useRef(null);

  useEffect(() => {
    setStats({ ...player.base });
    setQuery(player.name);
  }, [selectedId]);

  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const used = r1(totalUsed(stats, player.base));
  const remaining = r1(BUDGET - used);
  const pct = Math.max(0, Math.min(100, (used / BUDGET) * 100));
  const usedFitness = r1(sectionUsed(stats, player.base, FITNESS));
  const usedTechnical = r1(sectionUsed(stats, player.base, TECHNICAL));
  const ovr = computeOVR(player.position, stats);
  const baseOvr = computeOVR(player.position, player.base);

  const filtered = PLAYERS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const step = useCallback(
    (key, delta) => {
      setStats((prev) => {
        const base = player.base[key];
        const mult = MULT[key];
        const cur = prev[key];
        let next = r1(cur + delta);
        if (delta > 0) {
          if (next > CAP) next = CAP;
          const nextTotal = r1(
            totalUsed({ ...prev, [key]: next }, player.base)
          );
          if (nextTotal > BUDGET + 0.001) {
            const remainingBudget = r1(BUDGET - totalUsed(prev, player.base));
            if (remainingBudget <= 0) return prev;
            const maxGain = remainingBudget / mult;
            next = r1(Math.min(CAP, cur + maxGain));
            if (next <= cur) return prev;
          }
        } else if (delta < 0) {
          if (next < base) next = base;
          if (next >= cur) return prev;
        }
        return { ...prev, [key]: next };
      });
    },
    [player]
  );

  const resetStat = useCallback(
    (key) => {
      setStats((prev) => ({ ...prev, [key]: player.base[key] }));
    },
    [player]
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.code !== 'Space' || !hoverAction) return;
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')
      )
        return;
      e.preventDefault();
      if (active && active.tagName === 'BUTTON') active.blur();
      step(hoverAction.key, hoverAction.delta);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hoverAction, step]);

  function resetAll() {
    setStats({ ...player.base });
  }

  function fillCategory(keys) {
    setStats((prev) => {
      const next = { ...prev };
      let remain = r1(BUDGET - totalUsed(next, player.base));
      const order = [...keys].sort((a, b) => MULT[a] - MULT[b]);
      for (const k of order) {
        const cur = next[k];
        const gap = r1(CAP - cur);
        if (gap <= 0) continue;
        const costFull = r1(gap * MULT[k]);
        if (costFull <= remain + 0.001) {
          next[k] = CAP;
          remain = r1(remain - costFull);
        } else if (remain > 0) {
          const gain = remain / MULT[k];
          next[k] = r1(Math.min(CAP, cur + gain));
          remain = 0;
        }
      }
      return next;
    });
  }

  function copySummary() {
    const lines = [
      `${player.name} — ${player.position}, ${player.nation}`,
      `OVR: ${ovr} (gốc ${baseOvr})`,
      ...Object.keys(MULT).map(
        (k) => `${LABELS_VI[k]} (${k.toUpperCase()}): ${stats[k].toFixed(1)}`
      ),
      `Fitness đã dùng: ${usedFitness.toFixed(1)} điểm`,
      `Technical đã dùng: ${usedTechnical.toFixed(1)} điểm`,
      `Tổng: ${used.toFixed(1)}/${BUDGET} điểm (${pct.toFixed(1)}%)`,
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="min-h-full w-full text-white"
      style={{
        background:
          'radial-gradient(1100px 500px at 90% -10%, rgba(232,66,95,0.18), transparent 60%), linear-gradient(180deg, #0a070c 0%, #0d0a10 100%)',
        fontFamily:
          "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Header / search */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#f4eef7]">
              Mô phỏng nâng cấp cầu thủ
            </h1>
            <p className="text-[12px] text-[#8a7f94] mt-0.5">
              Phân bổ 100 điểm phát triển vào 8 chỉ số
            </p>
          </div>
          <button
            onClick={resetAll}
            className="hidden sm:flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg bg-[#171219] border border-[#2a2230] text-[#c9bfd4] hover:border-[#e8425f] transition-colors"
          >
            <RotateCcw size={13} /> Làm mới toàn bộ
          </button>
        </div>

        <p className="text-[11px] text-[#5f5568] mb-4 px-1">
          CHÚ Ý: di chuột vào đúng nút{' '}
          <span className="text-[#c9bfd4] font-medium">−10/−1/−.1</span> hoặc{' '}
          <span className="text-[#c9bfd4] font-medium">+10/+1/+.1</span> rồi
          nhấn <span className="text-[#c9bfd4] font-medium">phím Cách</span> để
          thực hiện đúng thao tác đó — bấm chuột vẫn hoạt động bình thường.
        </p>

        <div ref={boxRef} className="relative mb-6">
          <div className="flex items-center gap-2 bg-[#171219] border border-[#2a2230] rounded-xl px-3 py-2.5 focus-within:border-[#e8425f] transition-colors">
            <Search size={16} className="text-[#7a6f85] shrink-0" />
            <input
              value={query}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              placeholder="Tìm cầu thủ..."
              className="bg-transparent outline-none flex-1 text-sm text-[#f4eef7] placeholder:text-[#5f5568]"
            />
            <ChevronDown size={15} className="text-[#7a6f85]" />
          </div>
          {open && filtered.length > 0 && (
            <div className="absolute z-20 mt-1.5 w-full rounded-xl bg-[#171219] border border-[#2a2230] overflow-hidden shadow-2xl">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedId(p.id);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-sm text-[#e7e1ec] hover:bg-[#241d29] flex items-center justify-between transition-colors"
                >
                  <span>{p.name}</span>
                  <span className="text-[11px] text-[#8a7f94]">
                    {p.position} · {p.nation}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Left: stat sections */}
          <div className="space-y-6">
            <section className="bg-[#100c13] border border-[#241d29] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#f4eef7]">
                  Fitness (Thể lực)
                </h2>
                <button
                  onClick={() => fillCategory(FITNESS)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-[#241220] border border-[#e8425f]/40 text-[#f28fa0] hover:bg-[#e8425f]/15 transition-colors"
                >
                  <Zap size={12} /> FULL FIT
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FITNESS.map((k) => (
                  <StatTile
                    key={k}
                    k={k}
                    base={player.base[k]}
                    val={stats[k]}
                    hoverAction={hoverAction}
                    setHoverAction={setHoverAction}
                    onStep={step}
                    onReset={resetStat}
                  />
                ))}
              </div>
            </section>

            <section className="bg-[#100c13] border border-[#241d29] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#f4eef7]">
                  Technical (Kỹ thuật)
                </h2>
                <button
                  onClick={() => fillCategory(TECHNICAL)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-[#241220] border border-[#e8425f]/40 text-[#f28fa0] hover:bg-[#e8425f]/15 transition-colors"
                >
                  <Zap size={12} /> FULL TECH
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TECHNICAL.map((k) => (
                  <StatTile
                    key={k}
                    k={k}
                    base={player.base[k]}
                    val={stats[k]}
                    hoverAction={hoverAction}
                    setHoverAction={setHoverAction}
                    onStep={step}
                    onReset={resetStat}
                  />
                ))}
              </div>
            </section>

            <button
              onClick={resetAll}
              className="sm:hidden w-full flex items-center justify-center gap-1.5 text-[12px] px-3 py-2.5 rounded-lg bg-[#171219] border border-[#2a2230] text-[#c9bfd4]"
            >
              <RotateCcw size={13} /> Làm mới toàn bộ
            </button>
          </div>

          {/* Right: card + development gauge */}
          <div className="space-y-4">
            <div className="rounded-2xl p-4 border border-[#4a3a1a] bg-gradient-to-b from-[#3a2e14] to-[#1c160a]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] font-black tracking-wide text-[#f5d98a] uppercase">
                  {player.name}
                </div>
                <button onClick={copySummary} title="Sao chép chỉ số">
                  {copied ? (
                    <Check size={15} className="text-[#3ddc84]" />
                  ) : (
                    <Copy
                      size={15}
                      className="text-[#c9a862] hover:text-[#f5d98a]"
                    />
                  )}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {Object.keys(MULT).map((k) => (
                  <div key={k} className="flex flex-col items-center">
                    <div className="text-[9px] text-[#c9a862] font-semibold">
                      {k.toUpperCase()}
                    </div>
                    <div
                      className="text-sm font-bold tabular-nums"
                      style={{ color: tierColor(stats[k]) }}
                    >
                      {stats[k].toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#4a3a1a]/60">
                <div>
                  <div className="text-[10px] text-[#c9a862]">
                    {player.position}
                  </div>
                  <div className="text-[10px] text-[#8a7550]">
                    {player.nation}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#c9a862]">OVR ước tính</div>
                  <div className="text-2xl font-black text-[#f5d98a] leading-none">
                    {ovr}
                  </div>
                  {ovr !== baseOvr && (
                    <div className="text-[10px] text-[#3ddc84] font-semibold">
                      +{ovr - baseOvr} so với gốc
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#100c13] border border-[#241d29] p-4 flex items-center gap-4">
              <MiniGauge pct={pct} color="#e8425f" />
              <div>
                <div className="text-[11px] text-[#8a7f94] uppercase tracking-wide font-semibold">
                  Development
                </div>
                <div className="text-sm text-[#e7e1ec]">
                  {used.toFixed(1)} / {BUDGET} điểm đã dùng
                </div>
                <div className="text-[12px] text-[#f28fa0] font-semibold mb-1.5">
                  Còn lại: {remaining.toFixed(1)} điểm
                </div>
                <div className="text-[11px] text-[#8a7f94]">
                  Fitness {usedFitness.toFixed(1)} · Technical{' '}
                  {usedTechnical.toFixed(1)}
                </div>
              </div>
            </div>

            <p className="text-[10.5px] text-[#5f5568] leading-relaxed px-1">
              Công cụ mô phỏng KHÔNG CHÍNH XÁC - TỰ ĐI MÀ LÀM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
