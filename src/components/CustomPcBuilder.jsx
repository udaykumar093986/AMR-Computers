import React, { useState, useMemo } from 'react';
import { BUILDER_CATEGORIES, BUILDER_PARTS } from '../data/pcBuilderParts';
import { useCart } from '../context/useCart';
import { STORE_INFO } from '../data/storeInfo';
import {
  Cpu,
  Zap,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  ShoppingCart,
  MessageSquare,
  Layers,
  HardDrive,
  Box,
  Fan,
  CircuitBoard,
  Trash2
} from 'lucide-react';

export const CustomPcBuilder = () => {
  const { addCustomPcToCart, formatPrice } = useCart();

  // State of selected parts by category ID
  const [selectedParts, setSelectedParts] = useState({
    cpu: BUILDER_PARTS.cpu[0], // Default pre-selected Ryzen 7 7800X3D
    cooler: BUILDER_PARTS.cooler[0],
    motherboard: BUILDER_PARTS.motherboard[0],
    ram: BUILDER_PARTS.ram[0],
    gpu: BUILDER_PARTS.gpu[1], // RTX 4070 Ti Super
    storage: BUILDER_PARTS.storage[0],
    psu: BUILDER_PARTS.psu[0], // 850W
    case: BUILDER_PARTS.case[0],
  });

  const [activeCategoryTab, setActiveCategoryTab] = useState('cpu');

  const categoryIcons = {
    cpu: <Cpu className="w-4 h-4" />,
    cooler: <Fan className="w-4 h-4" />,
    motherboard: <CircuitBoard className="w-4 h-4" />,
    ram: <Layers className="w-4 h-4" />,
    gpu: <Layers className="w-4 h-4" />,
    storage: <HardDrive className="w-4 h-4" />,
    psu: <Zap className="w-4 h-4" />,
    case: <Box className="w-4 h-4" />
  };

  // Calculations
  const totalPrice = useMemo(() => {
    return Object.values(selectedParts).reduce((sum, part) => {
      return sum + (part ? part.price : 0);
    }, 0);
  }, [selectedParts]);

  const totalWattage = useMemo(() => {
    return Object.entries(selectedParts).reduce((sum, [cat, part]) => {
      if (!part || cat === 'psu') return sum;
      return sum + (part.wattage || 0);
    }, 0);
  }, [selectedParts]);

  const recommendedPsuWattage = useMemo(() => {
    // Add 35% safe headroom for transient spikes
    return Math.ceil((totalWattage * 1.35) / 50) * 50;
  }, [totalWattage]);

  // Compatibility Checks
  const compatibilityIssues = useMemo(() => {
    const issues = [];
    const cpu = selectedParts.cpu;
    const mb = selectedParts.motherboard;
    const psu = selectedParts.psu;

    if (cpu && mb && cpu.socket && mb.socket && cpu.socket !== mb.socket) {
      issues.push(
        `Socket Mismatch: Selected CPU requires ${cpu.socket} socket, but Motherboard has ${mb.socket} socket.`
      );
    }

    if (psu && psu.wattage && psu.wattage < totalWattage + 100) {
      issues.push(
        `Power Capacity Alert: Selected PSU (${psu.wattage}W) provides low headroom for this rig (Estimated Draw: ${totalWattage}W). Recommended: ${recommendedPsuWattage}W+.`
      );
    }

    return issues;
  }, [selectedParts, totalWattage, recommendedPsuWattage]);

  const handleSelectPart = (category, part) => {
    setSelectedParts((prev) => ({
      ...prev,
      [category]: part
    }));
  };

  const handleRemovePart = (category) => {
    setSelectedParts((prev) => ({
      ...prev,
      [category]: null
    }));
  };

  const handleReset = () => {
    setSelectedParts({
      cpu: null,
      cooler: null,
      motherboard: null,
      ram: null,
      gpu: null,
      storage: null,
      psu: null,
      case: null
    });
  };

  // Preset Loaders
  const loadPreset = (presetName) => {
    if (presetName === 'esports') {
      setSelectedParts({
        cpu: BUILDER_PARTS.cpu.find((p) => p.id === 'cpu-7600x') || BUILDER_PARTS.cpu[0],
        cooler: BUILDER_PARTS.cooler.find((p) => p.id === 'cooler-peerless-assassin') || BUILDER_PARTS.cooler[0],
        motherboard: BUILDER_PARTS.motherboard.find((p) => p.id === 'mb-b650-aorus-elite') || BUILDER_PARTS.motherboard[0],
        ram: BUILDER_PARTS.ram.find((p) => p.id === 'ram-corsair-32gb-6000') || BUILDER_PARTS.ram[0],
        gpu: BUILDER_PARTS.gpu.find((p) => p.id === 'gpu-rtx-4060-ti') || BUILDER_PARTS.gpu[0],
        storage: BUILDER_PARTS.storage.find((p) => p.id === 'ssd-crucial-p3-1tb') || BUILDER_PARTS.storage[0],
        psu: BUILDER_PARTS.psu.find((p) => p.id === 'psu-deepcool-pm750d') || BUILDER_PARTS.psu[0],
        case: BUILDER_PARTS.case.find((p) => p.id === 'case-corsair-4000d') || BUILDER_PARTS.case[0],
      });
    } else if (presetName === 'godtier') {
      setSelectedParts({
        cpu: BUILDER_PARTS.cpu.find((p) => p.id === 'cpu-14900ks') || BUILDER_PARTS.cpu[0],
        cooler: BUILDER_PARTS.cooler.find((p) => p.id === 'cooler-kraken-elite-360') || BUILDER_PARTS.cooler[0],
        motherboard: BUILDER_PARTS.motherboard.find((p) => p.id === 'mb-z790-aorus-master') || BUILDER_PARTS.motherboard[0],
        ram: BUILDER_PARTS.ram.find((p) => p.id === 'ram-gskill-trident-64gb') || BUILDER_PARTS.ram[0],
        gpu: BUILDER_PARTS.gpu.find((p) => p.id === 'gpu-rtx-4090-aero') || BUILDER_PARTS.gpu[0],
        storage: BUILDER_PARTS.storage.find((p) => p.id === 'ssd-wd-black-sn850x-4tb') || BUILDER_PARTS.storage[0],
        psu: BUILDER_PARTS.psu.find((p) => p.id === 'psu-seasonic-1000w') || BUILDER_PARTS.psu[0],
        case: BUILDER_PARTS.case.find((p) => p.id === 'case-lianli-o11-evo') || BUILDER_PARTS.case[0],
      });
    }
  };

  const handleAddRigToCart = () => {
    const partsSummary = Object.entries(selectedParts)
      .filter(([, part]) => part !== null)
      .map(([cat, part]) => `${cat.toUpperCase()}: ${part.name}`);

    addCustomPcToCart({
      name: 'AMR Custom Configured Battle Rig',
      totalPrice,
      totalWattage,
      partsSummary,
      image: selectedParts.case?.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80'
    });
  };

  const generateWhatsAppQuote = () => {
    const partsList = Object.entries(selectedParts)
      .filter(([, part]) => part !== null)
      .map(([cat, part]) => `• ${cat.toUpperCase()}: ${part.name} (${formatPrice(part.price)})`)
      .join('%0A');

    const msg = `Hello AMR Computers! I configured a custom PC build on your website:%0A%0A${partsList}%0A%0A*Total Estimated Price:* ${formatPrice(totalPrice)}%0A*Estimated Power:* ${totalWattage}W%0A%0APlease verify component compatibility, lead time, and final quote.`;
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${msg}`, '_blank');
  };

  const selectedCount = Object.values(selectedParts).filter(Boolean).length;

  return (
    <section id="pc-builder" className="py-20 bg-slate-900/60 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Interactive PC Configurator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Custom PC Builder Studio
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Handpick every component with live wattage monitoring, automatic socket compatibility checks, and instant WhatsApp quote sharing.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">Load Preset:</span>
            <button
              onClick={() => loadPreset('esports')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 transition-colors"
            >
              1080p Esports (~₹1.1L)
            </button>
            <button
              onClick={() => loadPreset('godtier')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 border border-slate-700 transition-colors"
            >
              4K God-Tier (~₹4.1L)
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
              title="Reset All Parts"
              aria-label="Reset parts selection"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Builder Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Category Tabs & Part Picker (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Horizontal Categories Nav */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
              {BUILDER_CATEGORIES.map((cat) => {
                const isSelected = !!selectedParts[cat.id];
                const isActiveTab = activeCategoryTab === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryTab(cat.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActiveTab
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                        : isSelected
                        ? 'bg-slate-900 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {categoryIcons[cat.id]}
                      <span className="truncate">{cat.name.split(' ')[0]}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isActiveTab ? 'text-slate-950' : 'text-emerald-400'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Part Selection Panel for Active Category */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {categoryIcons[activeCategoryTab]}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white capitalize">
                      Choose {BUILDER_CATEGORIES.find((c) => c.id === activeCategoryTab)?.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Select component to add to your custom PC specification
                    </p>
                  </div>
                </div>

                {selectedParts[activeCategoryTab] && (
                  <button
                    onClick={() => handleRemovePart(activeCategoryTab)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              {/* List of Available Parts in Current Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {(BUILDER_PARTS[activeCategoryTab] || []).map((part) => {
                  const isCurrentChosen = selectedParts[activeCategoryTab]?.id === part.id;

                  return (
                    <div
                      key={part.id}
                      onClick={() => handleSelectPart(activeCategoryTab, part)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrentChosen
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={part.image}
                          alt={part.name}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                            {part.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {part.specs}
                          </p>
                          {part.socket && (
                            <span className="inline-block mt-1 text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                              Socket: {part.socket}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-extrabold text-white font-mono">
                            {formatPrice(part.price)}
                          </span>
                          {part.wattage > 0 && activeCategoryTab !== 'psu' && (
                            <span className="text-[10px] text-slate-400 block">
                              ⚡ {part.wattage}W TDP
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            isCurrentChosen
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-slate-800 text-slate-200 hover:bg-cyan-500 hover:text-slate-950'
                          }`}
                        >
                          {isCurrentChosen ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compatibility Alerts Box */}
            {compatibilityIssues.length > 0 ? (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Hardware Compatibility Warnings Detected</span>
                </div>
                <ul className="text-xs text-amber-200 space-y-1 list-disc pl-5">
                  {compatibilityIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All selected components are fully compatible and ready for high-performance deployment!</span>
              </div>
            )}
          </div>

          {/* Right Column: Build Summary & Power Meter (4 cols / 5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-5">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-extrabold text-white text-base">Your Rig Configuration</h3>
                  <p className="text-xs text-slate-400">{selectedCount} of 8 components selected</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                  AMR CUSTOM
                </span>
              </div>

              {/* Power Draw Gauge */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Estimated Draw:
                  </span>
                  <span className="font-mono font-bold text-amber-400">{totalWattage} Watts</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalWattage / 1000) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Recommended PSU:</span>
                  <span className="text-cyan-400 font-semibold">{recommendedPsuWattage}W or higher</span>
                </div>
              </div>

              {/* Selected Items Mini List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {BUILDER_CATEGORIES.map((cat) => {
                  const part = selectedParts[cat.id];
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setActiveCategoryTab(cat.id)}
                      className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2 text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-slate-500">{categoryIcons[cat.id]}</span>
                        <div className="truncate">
                          <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                            {cat.name.split(' ')[0]}
                          </span>
                          <span className="text-white truncate block">
                            {part ? part.name : <em className="text-slate-500">Not selected</em>}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-cyan-400 shrink-0">
                        {part ? formatPrice(part.price) : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total & Action Buttons */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Total Estimated Cost:
                  </span>
                  <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <button
                  onClick={handleAddRigToCart}
                  disabled={selectedCount === 0}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add Entire Rig to Cart</span>
                </button>

                <button
                  onClick={generateWhatsAppQuote}
                  disabled={selectedCount === 0}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Export Specs & Quote to WhatsApp</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Includes Free Assembly, Cable Management & 48h Stress Testing!
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
