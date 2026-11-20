import React from 'react';
import { CheckCircle2, Clock, Sparkles, Shield, Gift, Droplets, Flame } from 'lucide-react';

export default function SevaSelector({ sevas, selectedSeva, onSelectSeva }) {
  const sevaIcons = {
    milk: '🥛',
    taila: '🪔',
    panchamrutha: '🍯'
  };

  const sevaBadges = {
    milk: { text: 'Shanti Seva', color: 'bg-blue-950/80 text-blue-300 border-blue-700/50' },
    taila: { text: '★ Most Auspicious for Shani Dev', color: 'bg-amber-900/80 text-amber-300 border-amber-600/70 font-semibold' },
    panchamrutha: { text: 'Maha Pooja (5 Nectars)', color: 'bg-purple-950/80 text-purple-300 border-purple-700/50' }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-900/30 pb-3">
        <div>
          <h2 className="text-xl font-bold font-sacred text-amber-200 flex items-center gap-2">
            <span>Step 1: Choose Abhisheka Seva</span>
            <span className="text-xs font-normal text-amber-400/80 font-sans px-2 py-0.5 bg-amber-950/70 rounded-full border border-amber-800/40">
              3 Sacred Offerings
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select one of the 3 traditional abhishekas performed for Lord Shaneeshwara
          </p>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Performed daily at 06:00 AM (Brahma Muhurtha)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sevas.map((seva) => {
          const isSelected = selectedSeva?.id === seva.id;
          const badge = sevaBadges[seva.id];

          return (
            <div
              key={seva.id}
              onClick={() => onSelectSeva(seva)}
              className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-900/90 border-2 border-amber-500 shadow-xl shadow-amber-950/50 scale-[1.01]'
                  : 'bg-slate-900/70 border border-slate-800 hover:border-amber-700/60 hover:bg-slate-850 hover:shadow-lg'
              }`}
            >
              {/* Highlight / Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.text}
                </span>

                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-500/20" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700" />
                )}
              </div>

              {/* Title & Price */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-900/40 to-slate-950 flex items-center justify-center text-2xl border border-amber-700/30">
                    {sevaIcons[seva.id] || '🛕'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-300">
                      {seva.name}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-medium">
                      {seva.duration} duration
                    </p>
                  </div>
                </div>

                <div className="my-3 py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Fixed Seva Dakshina</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-amber-400 font-serif">₹</span>
                    <span className="text-2xl font-extrabold text-amber-300 font-serif">
                      {seva.amount}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {seva.description}
                </p>

                {/* Significance */}
                <div className="text-[11px] text-amber-200/90 bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/40 mb-3">
                  <span className="font-semibold text-amber-400 block mb-0.5 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-amber-400" /> Significance:
                  </span>
                  {seva.significance}
                </div>
              </div>

              {/* Prasadam items */}
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-300">Prasadam:</strong> {seva.prasadam}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
