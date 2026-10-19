import React, { useState } from 'react';
import { Palette, X, RotateCcw, Sparkles, Check, ChevronUp, ChevronDown, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { THEME_PRESETS } from '../config/siteConfig';

export const ThemeCustomizer: React.FC = () => {
  const { currentTheme, setThemePreset, setCustomColors, brand, updateBrand, resetToDefaults } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'brand'>('presets');

  const [primaryHex, setPrimaryHex] = useState(currentTheme.primary);
  const [secondaryHex, setSecondaryHex] = useState(currentTheme.secondary);

  const [nameInput, setNameInput] = useState(brand.eventName);
  const [venueInput, setVenueInput] = useState(brand.venue);
  const [yearInput, setYearInput] = useState(brand.year);

  const handleApplyCustomColors = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomColors(primaryHex, secondaryHex);
  };

  const handleApplyBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrand({
      eventName: nameInput,
      venue: venueInput,
      year: yearInput,
    });
  };

  return (
    <div className="fixed bottom-6 left-6 z-[999]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#060306]/90 border border-white/20 text-white shadow-2xl backdrop-blur-xl hover:scale-105 transition-all group"
          style={{
            borderColor: currentTheme.secondary,
            boxShadow: `0 0 25px ${currentTheme.primaryGlow}`,
          }}
          title="Customize Theme & Festival Name"
        >
          <div
            className="w-4 h-4 rounded-full animate-pulse"
            style={{ backgroundColor: currentTheme.primary }}
          />
          <Palette className="w-4 h-4 text-white group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-bold tracking-wider uppercase">Theme & Name</span>
        </button>
      )}

      {/* Expanded Customizer Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] bg-[#0c060d]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl text-white animate-in slide-in-from-bottom-6 fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Palette className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-wide">Brand & Color Studio</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-2xl mb-4 border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('presets')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'presets'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'custom'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Custom Hex
            </button>
            <button
              onClick={() => setActiveTab('brand')}
              className={`py-1.5 rounded-xl transition-all ${
                activeTab === 'brand'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Name & Venue
            </button>
          </div>

          {/* TAB 1: PRESET PALETTES */}
          {activeTab === 'presets' && (
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {THEME_PRESETS.map((preset) => {
                const isSelected = currentTheme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setThemePreset(preset);
                      setPrimaryHex(preset.primary);
                      setSecondaryHex(preset.secondary);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left group ${
                      isSelected
                        ? 'bg-white/10 border-white/30 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1.5">
                        <div
                          className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white/90 group-hover:text-white">
                        {preset.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: CUSTOM HEX CODES */}
          {activeTab === 'custom' && (
            <form onSubmit={handleApplyCustomColors} className="space-y-4">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/60 font-bold uppercase tracking-wider mb-1.5">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryHex}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={primaryHex}
                      onChange={(e) => setPrimaryHex(e.target.value)}
                      placeholder="#ec1c62"
                      className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 font-bold uppercase tracking-wider mb-1.5">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryHex}
                      onChange={(e) => setSecondaryHex(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={secondaryHex}
                      onChange={(e) => setSecondaryHex(e.target.value)}
                      placeholder="#78e8d2"
                      className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: secondaryHex || currentTheme.secondary }}
              >
                Apply Custom Palette
              </button>
            </form>
          )}

          {/* TAB 3: FESTIVAL NAME & VENUE */}
          {activeTab === 'brand' && (
            <form onSubmit={handleApplyBrand} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 font-bold uppercase tracking-wider mb-1">
                  Event / Festival Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Arts & Cultural Fest"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/60 font-bold uppercase tracking-wider mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={venueInput}
                    onChange={(e) => setVenueInput(e.target.value)}
                    placeholder="e.g. Main Campus"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 font-bold uppercase tracking-wider mb-1">
                    Year / Edition
                  </label>
                  <input
                    type="text"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: currentTheme.primary }}
              >
                Update Festival Name
              </button>
            </form>
          )}

          {/* Bottom Reset Actions */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
            <span>Dynamic live reload</span>
            <button
              onClick={() => {
                resetToDefaults();
                setPrimaryHex('#ec1c62');
                setSecondaryHex('#78e8d2');
                setNameInput('Arts & Cultural Fest');
                setVenueInput('Main Campus');
                setYearInput('2026');
              }}
              className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
