import { useRef, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { CountryData } from '../types';
import { Globe, Scan, ArrowRight, ShieldWarning, ShieldCheck } from '@phosphor-icons/react';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
    data: CountryData[];
    selectedCountryName: string | null;
    onSelectCountry: (name: string | null) => void;
    onOpenPolicy: () => void;
}

export default function GlobalMapWidget({ data, selectedCountryName, onSelectCountry, onOpenPolicy }: Props) {
    const timerRef = useRef<number | null>(null);
    const selectedCountry = data.find(c => c.name === selectedCountryName);

    // Precise Lat/Long for markers [Longitude, Latitude]
    const MARKER_COORDS: Record<string, [number, number]> = {
        "us": [-97, 38],   
        "gb": [-2, 54],    
        "ph": [122, 13],   
        "br": [-53, -10],  
        "de": [10, 51],    
        "au": [135, -25],  
        "in": [79, 22],    
        "ca": [-105, 56],  
        "fr": [2, 46],     
        "jp": [139, 36],   
        "cn": [103, 36],   
        "sg": [103.8, 1.3],
        "nl": [5.2, 52.1]
    };

    const markers = useMemo(() => {
        return data.map(d => {
            const code = d.isoCode ? d.isoCode.toLowerCase() : 'un';
            const coords = MARKER_COORDS[code] || [0, 0];
            return { ...d, coordinates: coords };
        }).filter(d => d.coordinates[0] !== 0); 
    }, [data]);

    // --- Handlers ---
    
    const handleContainerClick = () => {
        if (selectedCountryName) {
            onSelectCountry(null);
        }
    };

    const handleMouseLeave = () => {
        if (selectedCountryName) {
            timerRef.current = window.setTimeout(() => {
                onSelectCountry(null);
            }, 1500);
        }
    };

    const handleMouseEnter = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    return (
        <div 
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={handleContainerClick}
            className="group relative w-full aspect-[2.2/1] bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-lg cursor-default"
        >
            <ComposableMap projection="geoMercator" viewBox="0 0 980 420" style={{ width: "100%", height: "100%" }}>
                
                <Geographies geography={GEO_URL}>
                    {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => {
                            const hasData = data.some(d => d.name === geo.properties.NAME || d.isoCode === geo.properties.ISO_A2);
                            
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    style={{
                                        default: { fill: hasData ? "var(--color-primary)" : "var(--color-bg)", stroke: "var(--color-surface)", strokeWidth: 0.75, outline: "none", opacity: hasData ? 0.8 : 0.5 },
                                        hover: { fill: "var(--color-primary-hover)", stroke: "var(--color-border)", strokeWidth: 0.75, outline: "none", cursor: hasData ? "pointer" : "default" },
                                        pressed: { fill: "var(--color-primary)", outline: "none" },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>

                {markers.map(({ name, coordinates, riskLevel }) => {
                    const isSelected = name === selectedCountryName;
                    const isHigh = riskLevel === 'High';
                    const isMedium = riskLevel === 'Medium';
                    const fill = isHigh ? 'var(--color-danger)' : isMedium ? 'var(--color-warning)' : 'var(--color-success)';
                    
                    return (
                        <Marker key={name} coordinates={coordinates as [number, number]} onClick={(e) => {
                            e.stopPropagation();
                            onSelectCountry(name);
                        }}>
                            <circle r={isSelected ? 12 : 8} fill={fill} opacity={0.3} className="animate-ping" style={{ animationDuration: '2s' }} />
                            <circle r={4} fill={fill} stroke="var(--color-surface)" strokeWidth={1.5} style={{ cursor: 'pointer', transition: 'all 0.3s ease' }} 
                                className="hover:scale-125"
                            />
                            {isSelected && (
                                <circle r={14} fill="none" stroke="var(--color-surface)" strokeWidth={1} strokeDasharray="3,3" className="animate-spin-slow" />
                            )}
                        </Marker>
                    );
                })}
            </ComposableMap>

            {/* --- OVERLAYS --- */}
            
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                 <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest bg-[var(--color-surface)]/80 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 backdrop-blur-sm">
                    <Globe size={14} weight="duotone" className="animate-spin-slow" /> 
                    Live Monitoring
                 </div>
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-4 bg-[var(--color-surface)]/80 px-4 py-2 rounded-full border border-[var(--color-border)] backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)]">
                <div className="flex items-center gap-1.5 opacity-80"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shadow-[var(--color-success)]/50 shadow-[0_0_8px]"></div><span>Secure</span></div>
                <div className="flex items-center gap-1.5 opacity-80"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] shadow-[var(--color-warning)]/50 shadow-[0_0_8px]"></div><span>Alert</span></div>
                <div className="flex items-center gap-1.5 opacity-80"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)] shadow-[var(--color-danger)]/50 shadow-[0_0_8px]"></div><span>Critical</span></div>
            </div>

            {/* HUD Card */}
            {selectedCountry && (
                <div 
                    className="absolute bottom-4 left-4 z-30 animate-fade-in-up"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div className="bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-xl p-4 shadow-2xl w-64 hover:border-[var(--color-primary)]/50 transition-colors text-[var(--color-text)]">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Selected Region</div>
                                <div className="text-lg font-bold font-['Montserrat'] leading-none mt-1">{selectedCountry.name}</div>
                            </div>
                            {selectedCountry.riskLevel === 'High' ? <ShieldWarning size={20} weight="duotone" className="text-[var(--color-danger)]" /> :
                             selectedCountry.riskLevel === 'Medium' ? <ShieldWarning size={20} weight="duotone" className="text-[var(--color-warning)]" /> :
                             <ShieldCheck size={20} weight="duotone" className="text-[var(--color-success)]" />}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-[var(--color-bg)]/50 rounded-lg p-2">
                                <div className="text-[9px] uppercase text-[var(--color-text-muted)] font-bold">Personnel</div>
                                <div className="text-xl font-mono leading-none mt-1">{selectedCountry.count}</div>
                            </div>
                            <div className="bg-[var(--color-bg)]/50 rounded-lg p-2">
                                <div className="text-[9px] uppercase text-[var(--color-text-muted)] font-bold">Status</div>
                                <div className={`text-sm font-bold leading-none mt-2 ${
                                    selectedCountry.riskLevel === 'High' ? 'text-[var(--color-danger)]' : 
                                    selectedCountry.riskLevel === 'Medium' ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'
                                }`}>
                                    {selectedCountry.riskLevel.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenPolicy();
                            }}
                            className="w-full py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 group"
                        >
                            View Policy Details <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-primary)]/5 to-transparent h-[10%] w-full animate-scan-vertical pointer-events-none opacity-50"></div>
        </div>
    );
}