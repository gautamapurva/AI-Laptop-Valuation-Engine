import { useState, useEffect } from 'react';
import { ArrowLeft, Cpu, Activity, Zap, Monitor, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!value) return;
    const end = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(end)) return;
    
    const duration = 1200; // 1.2s
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeProgress * end);
      
      setDisplayValue(current);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <>₹ {displayValue.toLocaleString('en-IN')}</>;
}

const currentBuildDrivers = [
  { name: 'RAM Capacity', weight: 85 },
  { name: 'GPU Performance', weight: 70 },
  { name: 'Processor Tier', weight: 65 },
  { name: 'Brand Premium', weight: 55 },
  { name: 'Storage Type', weight: 45 },
  { name: 'Screen Quality', weight: 30 },
];

const globalMarketDrivers = [
  { name: 'GPU Performance', weight: 90 },
  { name: 'Processor Tier', weight: 80 },
  { name: 'RAM Capacity', weight: 75 },
  { name: 'Brand Premium', weight: 60 },
  { name: 'Storage Type', weight: 50 },
  { name: 'Screen Quality', weight: 40 },
];

const ShimmerSkeleton = () => (
  <div className="mt-10 pt-8 border-t border-white/10 w-full animate-fade-in-up">
    <div className="flex flex-col items-center mb-10">
      <div className="h-4 w-48 bg-white/5 rounded-full mb-4 animate-pulse"></div>
      <div className="h-16 w-64 bg-white/5 rounded-2xl relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </div>
    </div>
    
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-[350px] relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
      {/* Skeleton Chart Bars */}
      <div className="absolute inset-6 flex flex-col justify-between pt-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-4 w-20 bg-white/5 rounded animate-pulse"></div>
            <div className={`h-6 bg-white/5 rounded animate-pulse`} style={{ width: `${80 - i * 10}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function App() {
  const [phase, setPhase] = useState('welcome');
  const [formData, setFormData] = useState({
    brand: 'Apple',
    ram: 8,
    rom: 512,
    cpu: 'Intel',
    gpu: 'Nvidia',
    ppi: 200,
  });

  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [chartTab, setChartTab] = useState('current');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'ram' || name === 'rom' || name === 'ppi' ? Number(value) : value,
    });
    if (price) setPrice(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setPrice(null);
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPrice(data.price);
      }
    } catch (error) {
      console.error("Failed to predict price", error);
    } finally {
      setLoading(false);
    }
  };

  const brands = ['Apple', 'HP', 'Acer', 'Asus', 'Lenovo', 'Dell', 'MSI', 'Samsung', 'Microsoft'];
  const rams = [4, 8, 16, 32, 64];
  const roms = [128, 256, 512, 1024, 2048];
  const cpus = ['Intel', 'Mac', 'Other'];
  const gpus = ['Intel', 'Mac', 'Nvidia', 'Other'];

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 overflow-x-hidden overflow-y-auto bg-[#0d0d0d] text-white">
      <div className="fixed top-1/2 left-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,rgba(0,0,0,0)_70%)] transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"></div>

      {phase === 'welcome' && (
        <div className="w-full max-w-5xl z-10 flex flex-col lg:flex-row items-center justify-between gap-12 animate-fade-in-up my-auto">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
              <Activity className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium tracking-wide text-gray-300">System Ready</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Know Your Machine's <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-sm">
                True Worth.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Leveraging custom Random Forest Machine Learning ensembles to instantly calculate real-world laptop valuation based on actual market variables.
            </p>
            
            <div className="pt-4 flex justify-center lg:justify-start">
              <button
                onClick={() => setPhase('predictor')}
                className="group relative px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-white" />
                  <span className="text-white">Initialize Engine</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end relative">
             <div className="relative w-72 h-72 lg:w-96 lg:h-96 glass-panel rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-[spin_10s_linear_infinite]">
                 <div className="absolute inset-2 border border-purple-500/20 rounded-full"></div>
                 <div className="absolute inset-6 border border-pink-500/20 rounded-full border-dashed"></div>
             </div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Monitor className="w-32 h-32 text-purple-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.6)]" />
             </div>
          </div>
        </div>
      )}

      {phase === 'predictor' && (
        <div className="w-full max-w-3xl glass-panel rounded-3xl p-8 md:p-12 z-10 animate-fade-in-up my-4">
          <button 
            onClick={() => setPhase('welcome')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Back to Home</span>
          </button>

          <div className="mb-10 border-b border-white/10 pb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Configure Specs</h2>
              <p className="text-gray-400 text-sm">Input the hardware configuration for precise AI valuation.</p>
            </div>
            <Cpu className="w-10 h-10 text-purple-500 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Brand</label>
              <select name="brand" value={formData.brand} onChange={handleChange} className="sleek-input">
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">RAM (GB)</label>
              <select name="ram" value={formData.ram} onChange={handleChange} className="sleek-input">
                {rams.map(r => <option key={r} value={r}>{r} GB</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Storage / ROM (GB)</label>
              <select name="rom" value={formData.rom} onChange={handleChange} className="sleek-input">
                {roms.map(r => <option key={r} value={r}>{r >= 1024 ? `${r/1024} TB` : `${r} GB`}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Processor (CPU)</label>
              <select name="cpu" value={formData.cpu} onChange={handleChange} className="sleek-input">
                {cpus.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Graphics (GPU)</label>
              <select name="gpu" value={formData.gpu} onChange={handleChange} className="sleek-input">
                {gpus.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between items-end">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1">Screen Sharpness (PPI)</label>
                  <span className="text-xs text-gray-500 italic">140 = Standard | 220+ = Retina/Ultra-Sharp</span>
                </div>
                <span className="text-purple-400 font-bold text-xl">{formData.ppi} PPI</span>
              </div>
              <input 
                type="range" 
                name="ppi" 
                min="100" 
                max="350" 
                value={formData.ppi} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handlePredict}
              disabled={loading}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 flex items-center justify-center space-x-3
                ${loading 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transform hover:-translate-y-1'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  <span>Scan Value</span>
                </>
              )}
            </button>
          </div>

          {loading ? (
            <ShimmerSkeleton />
          ) : price ? (
            <div className="mt-10 pt-8 border-t border-white/10 animate-fade-in-up">
              <p className="text-pink-400 text-sm font-semibold mb-2 uppercase tracking-widest text-center">Calculated Market Value</p>
              <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 drop-shadow-xl text-center mb-12">
                <AnimatedNumber value={price} />
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <BarChart2 className="w-5 h-5 mr-2 text-purple-400"/> Explainable AI Insights
                  </h3>
                  <div className="flex bg-black/40 rounded-lg p-1 w-full sm:w-auto">
                    <button 
                      onClick={() => setChartTab('current')}
                      className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${chartTab === 'current' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      Current Build
                    </button>
                    <button 
                      onClick={() => setChartTab('global')}
                      className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${chartTab === 'global' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      Global Market
                    </button>
                  </div>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={chartTab === 'current' ? currentBuildDrivers : globalMarketDrivers} 
                      margin={{ top: 0, right: 20, left: -20, bottom: 0 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} width={120} />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'}}
                        formatter={(value) => [`${value}% impact`, 'Weight']}
                      />
                      <Bar dataKey="weight" radius={[0, 4, 4, 0]} animationDuration={1200}>
                        {
                          (chartTab === 'current' ? currentBuildDrivers : globalMarketDrivers).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#colorGradient)`} />
                          ))
                        }
                      </Bar>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="100%" stopColor="#db2777" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;
