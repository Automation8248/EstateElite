import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// YOUR UPLOADED IMAGES ONLY (no Unsplash)
// ─────────────────────────────────────────────────────────────────────────────
const HERO_IMG = "https://i.ibb.co/GfNmY5qw/ddd67bc4-91a4-4c24-b2fa-72d352859656.png";
const MY_IMGS  = [
  "https://i.ibb.co/4gCDZDzD/images-13.jpg",
  "https://i.ibb.co/HpX5v1g7/images-12.jpg",
  "https://i.ibb.co/BHXtbYzs/luxury-bedroom-designs-gurugram-8-jpg.webp",
  "https://i.ibb.co/7txbG3dM/images-11.jpg",
  "https://i.ibb.co/JwqQcQ8m/images-9.jpg",
  "https://i.ibb.co/8g21xp62/images-8.jpg",
  "https://i.ibb.co/vvwrZtcX/images-7.jpg",
  "https://i.ibb.co/G6RszRX/images-6.jpg",
  "https://i.ibb.co/gLmfp668/9-H4-A5504copy-4e4e05eda0e74a50a2846d3ac5d9127c.jpg",
  "https://i.ibb.co/WvLZP4rP/images-10.jpg",
];
const img = (i) => MY_IMGS[i % MY_IMGS.length];

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
const DEF_SETTINGS = {
  siteName:"EstateElite", tagline:"New York's Premier Rental Platform",
  heroImg:HERO_IMG,
  facebook:"https://facebook.com", instagram:"https://instagram.com",
  twitter:"https://twitter.com",  whatsapp:"https://wa.me/",
  address:"123 Estate Ave, Suite 400, New York, NY 10001",
  phone:"+1 (212) 555-0198", email:"hello@estateelite.com",
  hours:"Mon–Fri: 9 AM – 6 PM EST | Sat: 10 AM – 3 PM EST",
  currency:"USD", currencySymbol:"$", inrRate:83,
  razorpayKey:"rzp_test_YOUR_KEY_HERE",
  applyFee:2, premiumFee:50,
  privacy:`1. Information We Collect\nWe collect name, email, phone, income when you apply. Payments processed by Razorpay — we never store card details.\n\n2. How We Use It\nTo process applications, communicate with landlords, and improve our platform.\n\n3. Data Sharing\nWe do not sell your data. Limited sharing with property managers under confidentiality agreements.\n\n4. Cookies\nEssential cookies only.\n\n5. Contact\nprivacy@estateelite.com`,
  terms:`1. Acceptance\nBy using EstateElite you agree to these Terms.\n\n2. Application Fees\nApplication fees are non-refundable once processed through Razorpay.\n\n3. Listing Accuracy\nWe strive for accuracy but availability may change without notice.\n\n4. No Guarantee of Tenancy\nPaying fees does not guarantee approval — decisions rest with property managers.\n\n5. Governing Law\nState of New York, USA.\n\n6. Contact\nlegal@estateelite.com`,
  footerNote:"© 2025 EstateElite Inc. All rights reserved.",
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED APARTMENTS (only your images, cycle for all 32)
// ─────────────────────────────────────────────────────────────────────────────
const SEED = Array.from({length:32},(_,i)=>{
  const d=[
    {name:"Horizon Residency 101",address:"101 Riverside Dr, Manhattan, NY",price:850,beds:1,baths:1,sqft:680,floor:3,type:"1BHK",tag:"Hot Deal",amenities:["WiFi","Parking","Gym"],desc:"Sun-drenched apartment with panoramic river views, polished concrete floors, and chef-grade kitchen appliances."},
    {name:"Azure Tower Suite 204",address:"204 Park Ave, Midtown, NY",price:999,beds:2,baths:2,sqft:1120,floor:12,type:"2BHK",tag:"Featured",amenities:["Pool","Gym","Concierge","Spa"],desc:"Luxury corner unit with floor-to-ceiling windows, smart home system, and private terrace access."},
    {name:"Maple Grove Residence",address:"305 Oak Street, Brooklyn, NY",price:780,beds:2,baths:1,sqft:950,floor:2,type:"2BHK",tag:"",amenities:["Parking","Laundry","Balcony"],desc:"Charming brownstone with exposed brick, hardwood floors, and a private garden view."},
    {name:"Skybridge Penthouse A",address:"800 High Rise Blvd, Chelsea, NY",price:1002,beds:3,baths:2,sqft:1850,floor:28,type:"3BHK",tag:"Premium",amenities:["Pool","Gym","Rooftop","Valet"],desc:"Breathtaking penthouse with 270° skyline views, private rooftop, and bespoke Italian finishes."},
    {name:"Verdant Living 102",address:"102 Green Lane, Astoria, NY",price:720,beds:1,baths:1,sqft:600,floor:1,type:"1BHK",tag:"",amenities:["Garden","Pet Friendly","WiFi"],desc:"Ground-floor gem with private garden access, updated kitchen, and spacious storage."},
    {name:"Crimson Heights 601",address:"601 Fifth Ave, Uptown, NY",price:960,beds:2,baths:2,sqft:1050,floor:6,type:"2BHK",tag:"New",amenities:["Gym","Doorman","Storage"],desc:"Newly renovated with custom cabinetry, quartz counters, and in-unit washer/dryer."},
    {name:"Pearl District 7A",address:"7 Harbor View, DUMBO, NY",price:875,beds:2,baths:1,sqft:880,floor:7,type:"2BHK",tag:"",amenities:["Harbor View","Gym","Balcony"],desc:"Stunning DUMBO loft with industrial character, updated kitchen, and glorious bridge views."},
    {name:"Sunset Loft 808",address:"808 West End Ave, UWS, NY",price:920,beds:2,baths:2,sqft:1000,floor:8,type:"2BHK",tag:"Featured",amenities:["Park View","Gym","Laundry"],desc:"Upper West Side prewar apartment with high ceilings, crown moldings, and Central Park proximity."},
    {name:"Metro Studio 9B",address:"9 Commerce St, Financial, NY",price:650,beds:0,baths:1,sqft:480,floor:9,type:"Studio",tag:"Budget",amenities:["WiFi","Gym Access","Metro Near"],desc:"Compact, smartly designed studio in the Financial District — perfect for professionals."},
    {name:"Cobalt Terrace 10C",address:"10 Riverside Blvd, Hell's Kitchen, NY",price:985,beds:2,baths:2,sqft:1100,floor:10,type:"2BHK",tag:"",amenities:["Terrace","Spa","Parking","Pool"],desc:"Wraparound terrace overlooking Hudson River with spa access and private parking."},
    {name:"Ivory Court 11D",address:"11 Nostrand Ave, Bed-Stuy, NY",price:790,beds:2,baths:1,sqft:900,floor:4,type:"2BHK",tag:"",amenities:["Backyard","Pet Friendly","WiFi"],desc:"Spacious Bed-Stuy apartment with shared backyard, exposed brick, and subway access."},
    {name:"Onyx Plaza 1202",address:"1202 Lexington Ave, Midtown, NY",price:1002,beds:3,baths:3,sqft:1600,floor:12,type:"3BHK",tag:"Premium",amenities:["Concierge","Pool","Gym","Sauna"],desc:"Ultra-luxury three-bedroom with marble baths, gourmet kitchen, and full concierge."},
    {name:"Birchwood Studio 13A",address:"13 Albany Ave, Crown Heights, NY",price:600,beds:0,baths:1,sqft:420,floor:3,type:"Studio",tag:"Budget",amenities:["Laundry","WiFi","Bike Room"],desc:"Affordable Crown Heights studio with natural light and newly updated bathroom."},
    {name:"Sapphire Crest 14E",address:"14 Flatbush Ave, Brooklyn, NY",price:840,beds:2,baths:1,sqft:860,floor:5,type:"2BHK",tag:"",amenities:["Rooftop","Gym","Storage"],desc:"Flatbush two-bedroom with rooftop access, modern fixtures, and subway nearby."},
    {name:"Ember Heights 15F",address:"15 Grand Concourse, Bronx, NY",price:710,beds:1,baths:1,sqft:650,floor:6,type:"1BHK",tag:"",amenities:["Parking","Gym","WiFi"],desc:"Art Deco Bronx gem with original terrazzo floors, renovated kitchen, and parking."},
    {name:"Velvet Loft 16G",address:"16 Wyckoff Ave, Bushwick, NY",price:760,beds:2,baths:1,sqft:820,floor:2,type:"2BHK",tag:"Hot Deal",amenities:["Skylights","Pet Friendly","Gym"],desc:"Trendy Bushwick loft with exposed rafters, skylights, and vibrant neighborhood."},
    {name:"Celestia Tower 17H",address:"17 Queens Blvd, Forest Hills, NY",price:890,beds:2,baths:2,sqft:970,floor:17,type:"2BHK",tag:"New",amenities:["Pool","Gym","Concierge","Spa"],desc:"High-floor residence with soundproofed windows, resort-style pool, and concierge."},
    {name:"Terracotta Walk 18I",address:"18 Jamaica Ave, Queens, NY",price:730,beds:1,baths:1,sqft:670,floor:3,type:"1BHK",tag:"",amenities:["Balcony","Laundry","Parking"],desc:"Warm one-bedroom with private balcony, in-building laundry, and ample closet space."},
    {name:"Slate Row 19J",address:"19 Bay Ridge Ave, Brooklyn, NY",price:800,beds:2,baths:1,sqft:870,floor:4,type:"2BHK",tag:"",amenities:["Waterfront View","Gym","Parking"],desc:"Bay Ridge two-bedroom with water views, updated appliances, and community gym."},
    {name:"Aurora Nest 20K",address:"20 Steinway St, Astoria, NY",price:815,beds:2,baths:1,sqft:900,floor:3,type:"2BHK",tag:"Featured",amenities:["Garden","WiFi","Pet Friendly"],desc:"Astoria charmer with private garden, original moldings, and vibrant dining nearby."},
    {name:"Creme Residences 21L",address:"21 Northern Blvd, LIC, NY",price:950,beds:2,baths:2,sqft:1050,floor:9,type:"2BHK",tag:"New",amenities:["Skyline View","Pool","Gym"],desc:"LIC luxury with unobstructed Manhattan skyline views and resort-style amenities."},
    {name:"Boulder Peak 22M",address:"22 Bainbridge Ave, Bronx, NY",price:670,beds:1,baths:1,sqft:590,floor:5,type:"1BHK",tag:"Budget",amenities:["WiFi","Laundry","Storage"],desc:"Quiet Bronx retreat with fresh interiors, generous closets, and great transit."},
    {name:"Flint & Oak 23N",address:"23 Court St, Carroll Gardens, NY",price:930,beds:2,baths:2,sqft:1010,floor:2,type:"2BHK",tag:"",amenities:["Garden","Parking","Dishwasher"],desc:"Carroll Gardens classic with backyard garden, renovated kitchen, and oak floors."},
    {name:"Dune Residences 24O",address:"24 Richmond Terrace, Staten Island, NY",price:750,beds:2,baths:1,sqft:920,floor:1,type:"2BHK",tag:"",amenities:["Patio","Garage","Pet Friendly"],desc:"Staten Island two-bedroom with private patio, attached garage, and quiet neighborhood."},
    {name:"Echo Lofts 25P",address:"25 Broadway, Williamsburg, NY",price:870,beds:2,baths:1,sqft:940,floor:4,type:"2BHK",tag:"Hot Deal",amenities:["Rooftop","Gym","Bike Storage"],desc:"Williamsburg loft with 14-ft ceilings, polished floors, and rooftop deck access."},
    {name:"Zephyr Court 26Q",address:"26 Pelham Pkwy, Bronx, NY",price:700,beds:1,baths:1,sqft:620,floor:6,type:"1BHK",tag:"",amenities:["Elevator","WiFi","Laundry"],desc:"Pelham one-bedroom with elevator, updated bath, laundry, and bus at the door."},
    {name:"Gilded Flats 27R",address:"27 Madison Ave, Midtown South, NY",price:1000,beds:2,baths:2,sqft:1080,floor:11,type:"2BHK",tag:"Premium",amenities:["Concierge","Gym","Wine Cellar"],desc:"Midtown South address with full concierge, wine cellar, and Miele appliances."},
    {name:"Copper Hall 28S",address:"28 Atlantic Ave, Boerum Hill, NY",price:855,beds:2,baths:1,sqft:860,floor:3,type:"2BHK",tag:"",amenities:["Balcony","Storage","WiFi"],desc:"Boerum Hill beauty with sun-drenched balcony and curated dining steps away."},
    {name:"Indigo Spire 29T",address:"29 Ocean Ave, Marine Park, NY",price:780,beds:2,baths:1,sqft:890,floor:5,type:"2BHK",tag:"",amenities:["Ocean View","Parking","Pet OK"],desc:"Marine Park apartment with ocean glimpses, two bedrooms, and dedicated parking."},
    {name:"Topaz Manor 30U",address:"30 Eastern Pkwy, Crown Heights, NY",price:910,beds:2,baths:2,sqft:1000,floor:7,type:"2BHK",tag:"Featured",amenities:["Gym","Pool","Sauna","Concierge"],desc:"Crown Heights manor with resort amenities, renovated interiors, and art deco lobby."},
    {name:"Rosewood Suites 31V",address:"31 Fulton St, Financial District, NY",price:975,beds:2,baths:2,sqft:1020,floor:15,type:"2BHK",tag:"New",amenities:["Gym","Pool","Rooftop","Bar"],desc:"Converted bank building with vault-door feature wall and rooftop bar access."},
    {name:"Palladium Heights 32W",address:"32 University Pl, Greenwich Village, NY",price:1002,beds:3,baths:2,sqft:1500,floor:20,type:"3BHK",tag:"Premium",amenities:["Concierge","Gym","Library"],desc:"Greenwich Village showstopper with triple-aspect views, library room, and chef's kitchen."},
  ];
  return {...(d[i]||d[i%d.length]), id:i+1, img:img(i), available:true};
});

const TAG_META = {
  Premium:{bg:"#7c2d12",color:"#fdba74"},
  Featured:{bg:"#1e3a8a",color:"#93c5fd"},
  "Hot Deal":{bg:"#7f1d1d",color:"#fca5a5"},
  New:{bg:"#14532d",color:"#86efac"},
  Budget:{bg:"#4c1d95",color:"#c4b5fd"},
  "":{bg:"transparent",color:"transparent"},
};

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS (safe)
// ─────────────────────────────────────────────────────────────────────────────
const sGet = async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sSet = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };

// ─────────────────────────────────────────────────────────────────────────────
// PRICE FORMAT
// ─────────────────────────────────────────────────────────────────────────────
const fmtPrice = (usd, s) => {
  if (!s) return `$${usd}`;
  const amt = s.currency === "INR" ? Math.round(usd * s.inrRate)
            : s.currency === "EUR" ? Math.round(usd * 0.92)
            : s.currency === "GBP" ? Math.round(usd * 0.79)
            : usd;
  return `${s.currencySymbol}${amt.toLocaleString()}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// LOAD RAZORPAY SCRIPT
// ─────────────────────────────────────────────────────────────────────────────
const loadRazorpay = () => new Promise((res) => {
  if (window.Razorpay) { res(true); return; }
  const s = document.createElement("script");
  s.src = "https://checkout.razorpay.com/v1/checkout.js";
  s.onload = () => res(true);
  s.onerror = () => res(false);
  document.head.appendChild(s);
});

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;scroll-behavior:smooth}
body{background:#07070e;color:#ede9e0;font-family:'Outfit',sans-serif}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#09091a}::-webkit-scrollbar-thumb{background:#c9a227;border-radius:4px}
.serif{font-family:'Cormorant Garamond',serif}
.gold{color:#d4af37}

/* BUTTONS */
.btn-g{background:linear-gradient(135deg,#b8912a,#e8c84a,#b8912a);background-size:200%;color:#050508;border:none;padding:12px 28px;border-radius:8px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;font-size:.9rem;transition:all .25s;white-space:nowrap;display:inline-block}
.btn-g:hover{background-position:right;box-shadow:0 6px 24px rgba(212,175,55,.4);transform:translateY(-1px)}
.btn-gh{background:transparent;border:1.5px solid #d4af37;color:#d4af37;padding:10px 22px;border-radius:8px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;font-size:.88rem;transition:all .2s}
.btn-gh:hover{background:rgba(212,175,55,.12)}
.btn-bk{display:inline-flex;align-items:center;gap:8px;background:rgba(212,175,55,.07);border:1px solid rgba(212,175,55,.22);color:#d4af37;padding:9px 18px;border-radius:8px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;font-size:.85rem;transition:all .2s}
.btn-bk:hover{background:rgba(212,175,55,.16);border-color:#d4af37}
.btn-d{background:#3b0a0a;border:1px solid #7f1d1d;color:#fca5a5;padding:7px 13px;border-radius:7px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:.82rem;transition:all .2s}
.btn-d:hover{background:#7f1d1d}

/* FORM FIELDS */
.fld{background:#141428;border:1.5px solid rgba(212,175,55,.15);color:#ede9e0;padding:11px 15px;border-radius:9px;font-family:'Outfit',sans-serif;font-size:.92rem;width:100%;outline:none;transition:border .2s}
.fld:focus{border-color:#d4af37}

/* CARD */
.apt-card{background:#0f0f1e;border:1px solid rgba(212,175,55,.16);border-radius:14px;overflow:hidden;transition:transform .22s,box-shadow .22s,border-color .22s;cursor:pointer}
.apt-card:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.55);border-color:rgba(212,175,55,.38)}
.tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:.68rem;font-weight:700;letter-spacing:.9px;text-transform:uppercase}
.dvd{height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,.36),transparent);margin:22px 0}
.fade{animation:fi .4s ease}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}

/* MODAL OVERLAY */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.86);display:flex;align-items:flex-start;justify-content:center;z-index:9000;padding:20px;backdrop-filter:blur(6px);overflow-y:auto}
.mbox{background:#0a0a18;border:1px solid rgba(212,175,55,.2);border-radius:18px;padding:32px;width:100%;max-width:560px;margin:auto;position:relative}

/* SUCCESS POPUP */
.success-popup{position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;backdrop-filter:blur(8px)}
.success-box{background:linear-gradient(135deg,#0a0a18,#0f1a0a);border:1px solid #22c55e;border-radius:20px;padding:48px 40px;text-align:center;max-width:460px;width:100%;box-shadow:0 0 60px rgba(34,197,94,.15)}

/* ADMIN FULL SCREEN */
.adm-wrap{position:fixed;inset:0;z-index:10000;display:flex;background:#07070e;overflow:hidden}
.adm-side{width:250px;min-width:250px;background:#060613;border-right:1px solid rgba(212,175,55,.12);display:flex;flex-direction:column;transition:transform .3s ease,margin .3s ease;z-index:10}
.adm-side.collapsed{margin-left:-250px}
.adm-body{flex:1;overflow-y:auto;background:#08080f;transition:all .3s}
.anav{display:flex;align-items:center;gap:12px;padding:13px 22px;cursor:pointer;color:#6b6478;font-size:.88rem;font-weight:500;transition:all .18s;border-left:3px solid transparent;user-select:none}
.anav:hover{color:#ede9e0;background:rgba(212,175,55,.06)}
.anav.on{color:#d4af37;background:rgba(212,175,55,.1);border-left-color:#d4af37}
.adm-topbar{height:60px;background:#060613;border-bottom:1px solid rgba(212,175,55,.1);display:flex;align-items:center;padding:0 24px;gap:16px;flex-shrink:0}

/* SETTINGS TABS */
.stab{padding:8px 18px;border-radius:20px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:.82rem;font-weight:600;border:1px solid rgba(212,175,55,.18);color:#7a7285;transition:all .2s;background:transparent}
.stab.on{background:#d4af37;color:#050508;border-color:#d4af37}

/* GRID */
.grid3{display:grid;grid-template-columns:repeat(auto-fill,minmax(305px,1fr));gap:24px}
.sec{padding:64px 5%;max-width:1320px;margin:0 auto}

/* TOGGLE SWITCH */
.tog-wrap{display:flex;align-items:center;gap:10px;cursor:pointer}
.tog{width:44px;height:24px;border-radius:12px;background:#2a2a3a;position:relative;transition:background .2s;flex-shrink:0}
.tog.on{background:#d4af37}
.tog::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .2s}
.tog.on::after{transform:translateX(20px)}

/* RESPONSIVE */
@media(max-width:768px){
  .adm-side{position:absolute;height:100%;z-index:20}
  .adm-side.collapsed{transform:translateX(-100%);margin-left:0}
  .detail-grid{grid-template-columns:1fr!important}
  .contact-grid{grid-template-columns:1fr!important}
}
`;

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]     = useState("home");
  const [apts, setApts]     = useState([]);
  const [sel, setSel]       = useState(null);
  const [apps, setApps]     = useState([]);
  const [settings, setSettings] = useState(DEF_SETTINGS);
  const [showApply, setApply]   = useState(false);
  const [showAdmin, setAdmin]   = useState(false);
  const [adminAuth, setAuth]    = useState(false);
  const [successPay, setSuccessPay] = useState(null);
  const [toast, setToast]   = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const a = await sGet("ee_apts5"); setApts(a || SEED);
      const p = await sGet("ee_apps5"); setApps(p || []);
      const s = await sGet("ee_settings5"); setSettings(s ? {...DEF_SETTINGS,...s} : DEF_SETTINGS);
      setLoaded(true);
    })();
    loadRazorpay();
  }, []);

  const saveApts = useCallback(async (l) => { setApts(l); await sSet("ee_apts5", l); }, []);
  const saveApps = useCallback(async (l) => { setApps(l); await sSet("ee_apps5", l); }, []);
  const saveSettings = useCallback(async (s) => { setSettings(s); await sSet("ee_settings5", s); }, []);

  const notify = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null), 3500); };
  const go = (v, apt=null) => { if(apt) setSel(apt); setView(v); window.scrollTo(0,0); };

  if (!loaded) return (
    <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#07070e"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:48,height:48,border:"3px solid rgba(212,175,55,.2)",borderTop:"3px solid #d4af37",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}/>
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
        <p style={{color:"#7a7285",fontFamily:"'Outfit',sans-serif"}}>Loading EstateElite…</p>
      </div>
    </div>
  );

  if (showAdmin) return (
    <>
      <style>{CSS}</style>
      {toast && <Toast t={toast}/>}
      <AdminScreen auth={adminAuth} setAuth={setAuth} apts={apts} saveApts={saveApts}
        apps={apps} saveApps={saveApps} settings={settings} saveSettings={saveSettings}
        onClose={()=>{setAdmin(false);setAuth(false);}} notify={notify}/>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      {toast && <Toast t={toast}/>}
      {successPay && <SuccessPopup data={successPay} s={settings} onClose={()=>setSuccessPay(null)}/>}
      <Header view={view} go={go} s={settings} onAdmin={()=>setAdmin(true)}/>
      <div className="fade" key={view}>
        {view==="home"    && <Home apts={apts} go={go} s={settings}/>}
        {view==="list"    && <ListPage apts={apts} go={go} s={settings}/>}
        {view==="detail"  && sel && <Detail apt={sel} go={go} s={settings} onApply={()=>setApply(true)}/>}
        {view==="privacy" && <TextPage title="Privacy Policy" text={settings.privacy} go={go}/>}
        {view==="terms"   && <TextPage title="Terms & Conditions" text={settings.terms} go={go}/>}
        {view==="contact" && <Contact go={go} s={settings} notify={notify}/>}
      </div>
      {showApply && sel && (
        <ApplyModal apt={sel} s={settings} onClose={()=>setApply(false)}
          notify={notify} saveApps={saveApps} apps={apps}
          onSuccess={(data)=>{ setApply(false); setSuccessPay(data); }}/>
      )}
      <Footer go={go} s={settings}/>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
function Toast({t}) {
  return <div style={{position:"fixed",bottom:28,right:28,zIndex:99998,background:t.type==="ok"?"#15803d":"#991b1b",color:"#fff",padding:"13px 22px",borderRadius:10,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,.6)",fontSize:".9rem",maxWidth:320,wordBreak:"break-word",fontFamily:"'Outfit',sans-serif"}}>{t.type==="ok"?"✓ ":"✕ "}{t.msg}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS POPUP
// ─────────────────────────────────────────────────────────────────────────────
function SuccessPopup({data, s, onClose}) {
  return (
    <div className="success-popup">
      <div className="success-box">
        <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(34,197,94,.15)",border:"2px solid #22c55e",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:"2.2rem"}}>✅</div>
        <h2 className="serif" style={{fontSize:"2rem",marginBottom:10,color:"#22c55e"}}>Payment Successful!</h2>
        <p style={{color:"#9ca3af",marginBottom:24,lineHeight:1.7,fontSize:".95rem"}}>
          Your application for <b style={{color:"#ede9e0"}}>{data.aptName}</b> has been received.<br/>
          We'll contact you at <b style={{color:"#ede9e0"}}>{data.email}</b> within 2–5 business days.
        </p>
        {data.paymentId && (
          <div style={{background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.2)",borderRadius:10,padding:"12px 16px",marginBottom:24}}>
            <p style={{fontSize:".78rem",color:"#6b7280",marginBottom:4}}>Payment Reference ID</p>
            <p style={{fontFamily:"monospace",color:"#22c55e",fontSize:".88rem",wordBreak:"break-all"}}>{data.paymentId}</p>
          </div>
        )}
        <div style={{background:"rgba(212,175,55,.07)",border:"1px solid rgba(212,175,55,.2)",borderRadius:10,padding:"12px 16px",marginBottom:28,textAlign:"left"}}>
          <div style={{fontSize:".78rem",color:"#7a7285",marginBottom:8}}>Application Summary</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:".82rem"}}>
            {[["Applicant",data.name],["Plan",data.plan],["Amount Paid",fmtPrice(data.amount,s)],["Date",new Date().toLocaleDateString()]].map(([k,v])=>(
              <div key={k}><div style={{color:"#6b7280",fontSize:".72rem"}}>{k}</div><div style={{color:"#ede9e0",fontWeight:600,marginTop:2}}>{v}</div></div>
            ))}
          </div>
        </div>
        <button className="btn-g" onClick={onClose} style={{width:"100%",padding:"14px",fontSize:"1rem"}}>Back to Listings</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────────────────────
function Header({view, go, s, onAdmin}) {
  const [mOpen, setMOpen] = useState(false);
  const links = [["Home","home"],["Apartments","list"],["Contact","contact"]];
  return (
    <header style={{position:"sticky",top:0,zIndex:1000,background:"rgba(7,7,14,.97)",borderBottom:"1px solid rgba(212,175,55,.14)",backdropFilter:"blur(14px)"}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",height:70}}>
        <div className="serif gold" style={{fontSize:"1.6rem",fontWeight:700,cursor:"pointer"}} onClick={()=>go("home")}>
          ◆ {s.siteName}
        </div>
        <nav style={{display:"flex",gap:28,alignItems:"center"}}>
          {links.map(([l,v])=>(
            <span key={v} onClick={()=>go(v)} style={{cursor:"pointer",color:view===v?"#d4af37":"#7a7285",fontWeight:view===v?600:400,fontSize:".9rem",transition:"color .2s"}}>{l}</span>
          ))}
          <button className="btn-gh" style={{padding:"7px 16px",fontSize:".8rem"}} onClick={onAdmin}>⚙ Admin</button>
        </nav>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BACK BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function Back({onClick, label="Back"}) {
  return (
    <button className="btn-bk" onClick={onClick}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      {label}
    </button>
  );
}

// Section header
function SH({sub, title, center=false}) {
  return (
    <div style={{marginBottom:40,textAlign:center?"center":"left"}}>
      <div style={{color:"#d4af37",letterSpacing:"2.5px",fontSize:".7rem",textTransform:"uppercase",fontWeight:600,marginBottom:8}}>{sub}</div>
      <h2 className="serif" style={{fontSize:"clamp(1.8rem,4vw,2.6rem)",lineHeight:1.1}}>{title}</h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APT CARD — tag always top-left
// ─────────────────────────────────────────────────────────────────────────────
function ACard({apt, go, s}) {
  const tm = TAG_META[apt.tag]||TAG_META[""];
  return (
    <div className="apt-card" onClick={()=>go("detail",apt)}>
      <div style={{position:"relative",height:210,overflow:"hidden",background:"#0a0a18"}}>
        <img src={apt.img} alt={apt.name}
          style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform .5s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          onError={e=>{e.target.onerror=null;e.target.src=MY_IMGS[0];}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(7,7,14,.82) 0%,transparent 55%)"}}/>

        {/* TAG — TOP LEFT ALWAYS VISIBLE */}
        {apt.tag && (
          <div style={{position:"absolute",top:0,left:0,zIndex:5}}>
            <span style={{
              display:"block",
              background:tm.bg,
              color:tm.color,
              fontSize:".7rem",
              fontWeight:800,
              letterSpacing:"1px",
              textTransform:"uppercase",
              padding:"6px 14px",
              borderRadius:"0 0 10px 0",
              fontFamily:"'Outfit',sans-serif",
              boxShadow:"2px 2px 8px rgba(0,0,0,.4)",
            }}>{apt.tag}</span>
          </div>
        )}

        {/* PRICE — BOTTOM LEFT */}
        <div style={{position:"absolute",bottom:12,left:14,zIndex:5}}>
          <span style={{background:"rgba(7,7,14,.9)",padding:"5px 13px",borderRadius:20,fontSize:".82rem",color:"#d4af37",fontWeight:700,border:"1px solid rgba(212,175,55,.3)"}}>
            {fmtPrice(apt.price, s)}<span style={{color:"#7a7285",fontSize:".7rem"}}>/mo</span>
          </span>
        </div>

        {!apt.available&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.62)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:4}}>
            <span style={{background:"#991b1b",color:"#fca5a5",padding:"6px 16px",borderRadius:20,fontWeight:700,fontSize:".8rem"}}>UNAVAILABLE</span>
          </div>
        )}
      </div>
      <div style={{padding:"16px 18px 20px"}}>
        <h3 style={{fontWeight:700,fontSize:"1rem",marginBottom:5,lineHeight:1.3}}>{apt.name}</h3>
        <p style={{color:"#7a7285",fontSize:".8rem",marginBottom:12}}>📍 {apt.address}</p>
        <div style={{display:"flex",gap:14,color:"#7a7285",fontSize:".8rem"}}>
          <span>🛏 {apt.beds===0?"Studio":`${apt.beds} Bed`}</span>
          <span>🛁 {apt.baths} Bath</span>
          <span>📐 {apt.sqft} sqft</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
function Home({apts, go, s}) {
  const featured = apts.filter(a=>["Featured","Premium"].includes(a.tag)).slice(0,6);
  const hotDeals = apts.filter(a=>a.tag==="Hot Deal").slice(0,3);
  return (
    <>
      {/* HERO */}
      <div style={{position:"relative",minHeight:"92vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 5%",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`url(${s.heroImg||HERO_IMG})`,backgroundSize:"cover",backgroundPosition:"center",opacity:.28}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(7,7,14,.15) 0%,rgba(7,7,14,.65) 55%,#07070e 100%)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#d4af37,transparent)"}}/>
        <div style={{position:"relative",zIndex:2,maxWidth:820}}>
          <div style={{display:"inline-block",border:"1px solid rgba(212,175,55,.38)",borderRadius:30,padding:"6px 22px",marginBottom:26,fontSize:".72rem",letterSpacing:"3px",textTransform:"uppercase",color:"#d4af37",fontWeight:600}}>
            {s.tagline}
          </div>
          <h1 className="serif" style={{fontSize:"clamp(2.8rem,7vw,5rem)",lineHeight:1.08,marginBottom:22,fontWeight:700}}>
            Discover Your Perfect<br/><span style={{color:"#d4af37"}}>Dream Apartment</span>
          </h1>
          <p style={{color:"#7a7285",fontSize:"1.06rem",lineHeight:1.82,maxWidth:540,margin:"0 auto 44px"}}>
            {apts.filter(a=>a.available).length}+ exclusive residences. Studios to penthouses — all under {fmtPrice(1002,s)}/month.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn-g" style={{padding:"15px 44px",fontSize:"1rem"}} onClick={()=>go("list")}>Browse All Apartments</button>
            <button className="btn-gh" style={{padding:"15px 36px"}} onClick={()=>go("contact")}>Contact Us</button>
          </div>
        </div>
        <div style={{position:"absolute",bottom:34,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:.4}}>
          <span style={{fontSize:".68rem",letterSpacing:"2px",color:"#7a7285",textTransform:"uppercase"}}>Scroll</span>
          <div style={{width:1,height:38,background:"linear-gradient(#d4af37,transparent)"}}/>
        </div>
      </div>

      {/* STATS */}
      <div style={{background:"#0f0f1e",borderTop:"1px solid rgba(212,175,55,.13)",borderBottom:"1px solid rgba(212,175,55,.13)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 5%",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:24}}>
          {[[`${apts.filter(a=>a.available).length}+`,"Available Units"],[fmtPrice(600,s),"Starting Price"],[fmtPrice(1002,s),"Max Price"],["5 ★","Verified Listings"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div className="serif gold" style={{fontSize:"2.1rem",fontWeight:700}}>{n}</div>
              <div style={{color:"#7a7285",fontSize:".8rem",marginTop:5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      {featured.length>0&&(
        <section className="sec">
          <SH sub="Handpicked For You" title="Featured Residences"/>
          <div className="grid3">{featured.map(a=><ACard key={a.id} apt={a} go={go} s={s}/>)}</div>
          <div style={{textAlign:"center",marginTop:48}}>
            <button className="btn-g" onClick={()=>go("list")}>View All {apts.length}+ Apartments →</button>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section style={{background:"#0f0f1e",borderTop:"1px solid rgba(212,175,55,.13)",borderBottom:"1px solid rgba(212,175,55,.13)",padding:"64px 5%"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <SH sub="Simple 4-Step Process" title="How It Works" center/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:40}}>
            {[["01","Browse","Explore curated apartments with photos, specs and amenities."],
              ["02","Apply","Pay a small application fee to submit your rental inquiry."],
              ["03","Unlock","Upgrade to Premium for direct landlord contact & priority review."],
              ["04","Move In","Get approved and move into your dream apartment!"]
            ].map(([n,t,d])=>(
              <div key={n} style={{textAlign:"center"}}>
                <div className="serif" style={{fontSize:"2.8rem",fontWeight:700,color:"rgba(212,175,55,.2)",lineHeight:1}}>{n}</div>
                <div style={{fontWeight:700,fontSize:"1rem",margin:"10px 0 8px",color:"#d4af37"}}>{t}</div>
                <div style={{color:"#7a7285",fontSize:".87rem",lineHeight:1.65}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOT DEALS */}
      {hotDeals.length>0&&(
        <section className="sec">
          <SH sub="Limited Time" title="Hot Deals"/>
          <div className="grid3">{hotDeals.map(a=><ACard key={a.id} apt={a} go={go} s={s}/>)}</div>
        </section>
      )}

      {/* PHOTO STRIP */}
      <section style={{padding:"0 0 64px"}}>
        <div style={{display:"flex",gap:4,overflowX:"auto",padding:"0 5% 4px"}}>
          {MY_IMGS.map((im,i)=>(
            <div key={i} style={{flexShrink:0,width:200,height:140,overflow:"hidden",borderRadius:10,border:"1px solid rgba(212,175,55,.12)"}}>
              <img src={im} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .4s",display:"block"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIST PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ListPage({apts, go, s}) {
  const [search, setSearch] = useState("");
  const [fType,  setFType]  = useState("All");
  const [fPrice, setFPrice] = useState(1002);
  const types = ["All","Studio","1BHK","2BHK","3BHK"];
  const vis = apts.filter(a=>{
    const q=search.toLowerCase();
    return (a.name.toLowerCase().includes(q)||a.address.toLowerCase().includes(q)||a.type.toLowerCase().includes(q))
      &&(fType==="All"||a.type===fType)&&a.price<=fPrice;
  });
  return (
    <section style={{padding:"44px 5% 80px",maxWidth:1320,margin:"0 auto"}}>
      <div style={{marginBottom:32}}>
        <Back onClick={()=>go("home")} label="Home"/>
        <h1 className="serif" style={{fontSize:"2.4rem",marginTop:20,marginBottom:4}}>All <span className="gold">Apartments</span></h1>
        <p style={{color:"#7a7285"}}>{vis.length} units found</p>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:36,background:"#0f0f1e",padding:"18px 20px",borderRadius:13,border:"1px solid rgba(212,175,55,.13)"}}>
        <input className="fld" placeholder="Search by name, area, type…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:"1 1 220px",maxWidth:320}}/>
        <select className="fld" value={fType} onChange={e=>setFType(e.target.value)} style={{flex:"0 0 120px",cursor:"pointer"}}>
          {types.map(t=><option key={t}>{t}</option>)}
        </select>
        <div style={{flex:"1 1 200px",display:"flex",alignItems:"center",gap:12}}>
          <span style={{color:"#7a7285",fontSize:".82rem",whiteSpace:"nowrap"}}>Max: <b style={{color:"#d4af37"}}>{fmtPrice(fPrice,s)}</b></span>
          <input type="range" min={500} max={1002} value={fPrice} onChange={e=>setFPrice(+e.target.value)} style={{flex:1,accentColor:"#d4af37"}}/>
        </div>
        <button className="btn-gh" style={{padding:"9px 16px",fontSize:".8rem"}} onClick={()=>{setSearch("");setFType("All");setFPrice(1002);}}>Reset</button>
      </div>
      {vis.length===0
        ? <div style={{textAlign:"center",padding:"80px 0",color:"#7a7285"}}>No apartments match your criteria.</div>
        : <div className="grid3">{vis.map(a=><ACard key={a.id} apt={a} go={go} s={s}/>)}</div>
      }
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────────────
function Detail({apt, go, s, onApply}) {
  const tm = TAG_META[apt.tag]||TAG_META[""];
  return (
    <div style={{maxWidth:1060,margin:"0 auto",padding:"40px 5% 90px"}}>
      <div style={{marginBottom:28}}><Back onClick={()=>go("list")} label="Back to Listings"/></div>
      <div style={{borderRadius:18,overflow:"hidden",border:"1px solid rgba(212,175,55,.16)",background:"#0f0f1e"}}>
        {/* IMAGE */}
        <div style={{position:"relative",height:"clamp(240px,45vw,480px)",background:"#0a0a18"}}>
          <img src={apt.img} alt={apt.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
            onError={e=>{e.target.onerror=null;e.target.src=MY_IMGS[0];}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(7,7,14,.9) 0%,transparent 50%)"}}/>
          {apt.tag&&(
            <div style={{position:"absolute",top:0,left:0,zIndex:5}}>
              <span style={{display:"block",background:tm.bg,color:tm.color,fontSize:".75rem",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",padding:"7px 16px",borderRadius:"0 0 10px 0",fontFamily:"'Outfit',sans-serif",boxShadow:"2px 2px 8px rgba(0,0,0,.4)"}}>
                {apt.tag}
              </span>
            </div>
          )}
          <div style={{position:"absolute",bottom:28,left:28,right:200}}>
            <div className="serif" style={{fontSize:"clamp(1.6rem,4vw,2.6rem)",fontWeight:700,lineHeight:1.1}}>{apt.name}</div>
            <div style={{color:"#9ca3af",marginTop:6}}>📍 {apt.address}</div>
          </div>
        </div>
        {/* CONTENT */}
        <div className="detail-grid" style={{padding:"32px",display:"grid",gridTemplateColumns:"1fr 300px",gap:36}}>
          <div>
            <h2 className="serif" style={{fontSize:"1.6rem",marginBottom:14}}>About This Unit</h2>
            <p style={{color:"#9ca3af",lineHeight:1.82,marginBottom:24,fontSize:".95rem"}}>{apt.desc}</p>
            <h4 style={{fontWeight:600,marginBottom:12,fontSize:".82rem",color:"#7a7285",textTransform:"uppercase",letterSpacing:1}}>Amenities</h4>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {apt.amenities.map(a=><span key={a} style={{background:"#141428",border:"1px solid rgba(212,175,55,.18)",padding:"6px 14px",borderRadius:20,fontSize:".82rem",color:"#d4af37"}}>✓ {a}</span>)}
            </div>
          </div>
          {/* PRICE BOX */}
          <div>
            <div style={{background:"#0a0a18",border:"1px solid rgba(212,175,55,.18)",borderRadius:14,padding:24}}>
              <div className="serif gold" style={{fontSize:"2.2rem",fontWeight:700}}>{fmtPrice(apt.price,s)}<span style={{fontSize:".9rem",color:"#7a7285"}}>/mo</span></div>
              <div className="dvd"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
                {[["Type",apt.type],["Beds",apt.beds===0?"Studio":apt.beds],["Baths",apt.baths],["Floor",apt.floor],["Area",`${apt.sqft} sqft`],["Status",apt.available?"✓ Available":"✗ Taken"]].map(([k,v])=>(
                  <div key={k}>
                    <div style={{color:"#7a7285",fontSize:".7rem",textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{k}</div>
                    <div style={{fontWeight:600,fontSize:".88rem",color:k==="Status"?(apt.available?"#22c55e":"#ef4444"):"#ede9e0"}}>{v}</div>
                  </div>
                ))}
              </div>
              {apt.available
                ? <button className="btn-g" style={{width:"100%",padding:"14px",fontSize:".95rem"}} onClick={onApply}>Apply Now →</button>
                : <div style={{textAlign:"center",color:"#7a7285",padding:"13px",border:"1px solid rgba(212,175,55,.14)",borderRadius:8,fontSize:".9rem"}}>Currently Unavailable</div>
              }
              <p style={{color:"#6b7280",fontSize:".72rem",textAlign:"center",marginTop:12}}>🔒 Secure Razorpay Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLY MODAL — with Razorpay
// ─────────────────────────────────────────────────────────────────────────────
function ApplyModal({apt, s, onClose, notify, saveApps, apps, onSuccess}) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("standard");
  const [form, setForm] = useState({name:"",email:"",phone:"",income:"",moveDate:"",message:""});
  const [err,  setErr]  = useState("");
  const [paying, setPaying] = useState(false);

  const plans = [
    {id:"standard", icon:"📝", label:"Standard Apply",  price:s.applyFee,   badge:"Basic",      desc:`Submit your application to the property manager. ${fmtPrice(s.applyFee,s)} one-time fee.`},
    {id:"premium",  icon:"👑", label:"Premium Unlock",  price:s.premiumFee, badge:"Recommended",desc:`Direct landlord contact + priority review + guaranteed response. ${fmtPrice(s.premiumFee,s)}.`},
  ];

  const validate = () => {
    if (!form.name.trim()) return setErr("Full name is required.");
    if (!form.email.trim()||!/\S+@\S+\.\S+/.test(form.email)) return setErr("Valid email is required.");
    if (!form.phone.trim()) return setErr("Phone number is required.");
    setErr(""); setStep(2);
  };

  const handlePay = async () => {
    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay) { notify("Razorpay failed to load. Check your internet connection.", "err"); return; }

    const selectedPlan = plans.find(p=>p.id===plan);
    const amtUsd = selectedPlan.price;
    const currency = s.currency||"USD";
    let amountInUnit;
    if(currency==="INR") amountInUnit = Math.round(amtUsd * s.inrRate * 100);
    else amountInUnit = amtUsd * 100;

    if (!s.razorpayKey || s.razorpayKey.includes("YOUR_KEY")) {
      notify("Razorpay key not configured. Go to Admin → Settings → Payment.", "err"); return;
    }

    setPaying(true);
    const options = {
      key: s.razorpayKey,
      amount: amountInUnit,
      currency,
      name: s.siteName || "EstateElite",
      description: `Application for ${apt.name} — ${selectedPlan.label}`,
      image: s.heroImg || HERO_IMG,
      prefill: { name:form.name, email:form.email, contact:form.phone },
      theme: { color:"#d4af37" },
      handler: async (response) => {
        const app = { ...form, id:Date.now(), apartmentId:apt.id, apartmentName:apt.name,
          plan:selectedPlan.label, amount:amtUsd, paymentId:response.razorpay_payment_id,
          date:new Date().toISOString() };
        await saveApps([...apps, app]);
        setPaying(false);
        onSuccess({ ...app, aptName:apt.name });
      },
      modal: { ondismiss: ()=>setPaying(false) }
    };
    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", ()=>{ setPaying(false); notify("Payment failed. Please try again.", "err"); });
      rzp.open();
    } catch(e) { setPaying(false); notify("Could not open payment. Check your Razorpay key.", "err"); }
  };

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox">
        {/* HEADER */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div>
            <h2 className="serif" style={{fontSize:"1.5rem",lineHeight:1.2}}>Apply for Apartment</h2>
            <p style={{color:"#7a7285",fontSize:".82rem",marginTop:4}}>{apt.name}</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#7a7285",fontSize:"1.4rem",cursor:"pointer",padding:"4px",lineHeight:1}}>✕</button>
        </div>

        {/* STEP INDICATOR */}
        <div style={{display:"flex",alignItems:"center",margin:"20px 0 28px"}}>
          {["Your Details","Choose Plan","Payment"].map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center",flex:i<2?1:0}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:step>i?"#d4af37":step===i+1?"#d4af37":"#1a1a2e",border:`2px solid ${step>=i+1?"#d4af37":"rgba(212,175,55,.18)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:700,color:step>=i+1?"#050508":"#7a7285",flexShrink:0}}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{fontSize:".72rem",color:step===i+1?"#d4af37":"#6b7280",margin:"0 6px",whiteSpace:"nowrap"}}>{s}</span>
              {i<2&&<div style={{flex:1,height:1,background:step>i+1?"#d4af37":"rgba(212,175,55,.14)",marginRight:6}}/>}
            </div>
          ))}
        </div>

        {/* STEP 1 — DETAILS */}
        {step===1&&(
          <div style={{display:"grid",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:6}}>Full Name *</label>
                <input className="fld" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="John Doe"/>
              </div>
              <div>
                <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:6}}>Phone Number *</label>
                <input className="fld" type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+1 234 567 8900"/>
              </div>
            </div>
            <div>
              <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:6}}>Email Address *</label>
              <input className="fld" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:6}}>Monthly Income ({s.currencySymbol})</label>
                <input className="fld" type="number" value={form.income} onChange={e=>setForm({...form,income:e.target.value})} placeholder="5000"/>
              </div>
              <div>
                <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:6}}>Preferred Move-In Date</label>
                <input className="fld" type="date" value={form.moveDate} onChange={e=>setForm({...form,moveDate:e.target.value})}/>
              </div>
            </div>
            <div>
              <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:6}}>Message to Landlord (optional)</label>
              <textarea className="fld" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell the landlord about yourself…" style={{resize:"vertical",minHeight:80}}/>
            </div>
            {err&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"10px 14px",color:"#fca5a5",fontSize:".84rem"}}>⚠ {err}</div>}
            <button className="btn-g" onClick={validate} style={{width:"100%",padding:"14px",marginTop:4}}>Continue →</button>
          </div>
        )}

        {/* STEP 2 — PLAN */}
        {step===2&&(
          <div>
            <p style={{color:"#9ca3af",fontSize:".88rem",marginBottom:20}}>Choose how you'd like to apply for <b style={{color:"#ede9e0"}}>{apt.name}</b></p>
            <div style={{display:"grid",gap:14,marginBottom:24}}>
              {plans.map(p=>(
                <div key={p.id} onClick={()=>setPlan(p.id)} style={{border:`2px solid ${plan===p.id?"#d4af37":"rgba(212,175,55,.15)"}`,borderRadius:12,padding:"18px 20px",cursor:"pointer",background:plan===p.id?"rgba(212,175,55,.07)":"#141428",transition:"all .2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:"1.4rem"}}>{p.icon}</span>
                      <div>
                        <div style={{fontWeight:700,color:plan===p.id?"#d4af37":"#ede9e0",fontSize:".95rem"}}>{p.label}</div>
                        <span style={{background:"rgba(212,175,55,.14)",color:"#d4af37",fontSize:".65rem",padding:"2px 8px",borderRadius:10,fontWeight:700}}>{p.badge}</span>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div className="serif gold" style={{fontSize:"1.6rem",fontWeight:700}}>{fmtPrice(p.price,s)}</div>
                      <div style={{fontSize:".72rem",color:"#7a7285"}}>one-time</div>
                    </div>
                  </div>
                  <p style={{color:"#9ca3af",fontSize:".82rem",lineHeight:1.5}}>{p.desc}</p>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(212,175,55,.05)",border:"1px solid rgba(212,175,55,.12)",borderRadius:10,padding:"12px 16px",marginBottom:22,display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:"1.2rem"}}>🔒</span>
              <div>
                <div style={{fontWeight:600,fontSize:".85rem",marginBottom:2}}>Secure Payment via Razorpay</div>
                <p style={{color:"#7a7285",fontSize:".76rem"}}>All payments are encrypted and processed securely. We never store card details.</p>
              </div>
            </div>
            <div style={{display:"flex",gap:11}}>
              <Back onClick={()=>setStep(1)} label="Back"/>
              <button className="btn-g" onClick={()=>setStep(3)} style={{flex:1,padding:"13px"}}>Review & Pay →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — CONFIRM */}
        {step===3&&(
          <div>
            <div style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.14)",borderRadius:12,padding:20,marginBottom:20}}>
              <h4 style={{fontWeight:700,marginBottom:16,color:"#d4af37",fontSize:".9rem",textTransform:"uppercase",letterSpacing:.5}}>Application Summary</h4>
              <div style={{display:"grid",gap:10}}>
                {[["Apartment",apt.name],["Applicant",form.name],["Email",form.email],["Phone",form.phone],form.moveDate&&["Move-In",form.moveDate],form.income&&["Income",`${s.currencySymbol}${form.income}/mo`]].filter(Boolean).map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(212,175,55,.07)"}}>
                    <span style={{color:"#7a7285",fontSize:".82rem"}}>{k}</span>
                    <span style={{fontWeight:600,fontSize:".88rem",textAlign:"right",maxWidth:"60%"}}>{v}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",marginTop:4}}>
                  <span style={{fontWeight:700,fontSize:".9rem"}}>Total Amount</span>
                  <span className="serif gold" style={{fontSize:"1.5rem",fontWeight:700}}>{fmtPrice(plans.find(p=>p.id===plan).price,s)}</span>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:11}}>
              <Back onClick={()=>setStep(2)} label="Back"/>
              <button className="btn-g" onClick={handlePay} disabled={paying} style={{flex:1,padding:"14px",opacity:paying?.7:1}}>
                {paying?"Processing…":`Pay ${fmtPrice(plans.find(p=>p.id===plan).price,s)} via Razorpay →`}
              </button>
            </div>
            <p style={{color:"#6b7280",fontSize:".75rem",textAlign:"center",marginTop:14}}>
              By proceeding you agree to our <span style={{color:"#d4af37",cursor:"pointer"}}>Terms & Conditions</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function Contact({go, s, notify}) {
  const [form, setForm] = useState({name:"",email:"",subject:"",msg:""});
  const [sent, setSent] = useState(false);
  const send = () => {
    if(!form.name||!form.email||!form.msg){notify("Please fill all required fields.","err");return;}
    setSent(true); notify("Message sent! We'll reply within 24h.");
  };
  return (
    <section style={{padding:"44px 5% 90px",maxWidth:900,margin:"0 auto"}}>
      <div style={{marginBottom:28}}><Back onClick={()=>go("home")} label="Home"/></div>
      <SH sub="Get In Touch" title="Contact Us"/>
      <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40}}>
        <div>
          {sent?(
            <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:"3rem",marginBottom:18}}>💌</div>
              <h3 className="serif" style={{fontSize:"1.6rem",marginBottom:10}}>Message Sent!</h3>
              <p style={{color:"#7a7285"}}>We'll reply to <b>{form.email}</b> within 24 hours.</p>
            </div>
          ):(
            <div style={{display:"grid",gap:16}}>
              {[["name","Your Name *","text"],["email","Email *","email"],["subject","Subject","text"]].map(([k,l,t])=>(
                <div key={k}><label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>{l}</label>
                <input className="fld" type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={l.replace(" *","")}/></div>
              ))}
              <div><label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>Message *</label>
              <textarea className="fld" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="How can we help?" style={{resize:"vertical",minHeight:130}}/></div>
              <button className="btn-g" onClick={send} style={{padding:"14px"}}>Send Message →</button>
            </div>
          )}
        </div>
        <div style={{display:"grid",gap:16,alignContent:"start"}}>
          {[["📍","Address",s.address],["📞","Phone",s.phone],["📧","Email",s.email],["🕐","Hours",s.hours]].map(([i,t,v])=>(
            <div key={t} style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.13)",borderRadius:12,padding:"18px 22px"}}>
              <div style={{fontSize:"1.3rem",marginBottom:8}}>{i}</div>
              <div style={{fontWeight:700,marginBottom:4,fontSize:".95rem"}}>{t}</div>
              <div style={{color:"#7a7285",fontSize:".87rem",whiteSpace:"pre-line",lineHeight:1.7}}>{v}</div>
            </div>
          ))}
          {/* SOCIAL */}
          <div style={{display:"flex",gap:12,marginTop:4}}>
            {[["f","#1877f2",s.facebook,"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"],
              ["i","#e1306c",s.instagram,"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9a4 4 0 0 0-4 4v9a4 4 0 0 0 4 4z"],
              ["t","#1da1f2",s.twitter,"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"],
              ["w","#25d366",s.whatsapp,"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"]
            ].filter(([,, url])=>url).map(([k,col,url,path])=>(
              <a key={k} href={url} target="_blank" rel="noopener noreferrer"
                style={{width:40,height:40,borderRadius:8,background:`${col}22`,border:`1px solid ${col}44`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
                onMouseEnter={e=>e.currentTarget.style.background=`${col}44`}
                onMouseLeave={e=>e.currentTarget.style.background=`${col}22`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT PAGE (Privacy / Terms — editable from admin)
// ─────────────────────────────────────────────────────────────────────────────
function TextPage({title, text, go}) {
  const [w1,...rest]=title.split(" ");
  const sections = (text||"").split("\n\n").filter(Boolean);
  return (
    <section style={{padding:"44px 5% 90px",maxWidth:820,margin:"0 auto"}}>
      <div style={{marginBottom:28}}><Back onClick={()=>go("home")} label="Home"/></div>
      <h1 className="serif" style={{fontSize:"2.4rem",marginBottom:6}}><span className="gold">{w1}</span> {rest.join(" ")}</h1>
      <p style={{color:"#7a7285",marginBottom:40}}>Last updated: {new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</p>
      {sections.map((sec,i)=>{
        const lines=sec.split("\n");
        const heading=lines[0];
        const body=lines.slice(1).join("\n");
        return(
          <div key={i} style={{marginBottom:28}}>
            <h3 style={{fontWeight:700,fontSize:"1.02rem",marginBottom:10,color:"#d4af37"}}>{heading}</h3>
            {body&&<p style={{color:"#9ca3af",lineHeight:1.82,whiteSpace:"pre-line"}}>{body}</p>}
            <div className="dvd"/>
          </div>
        );
      })}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer({go, s}) {
  return (
    <footer style={{background:"#0f0f1e",borderTop:"1px solid rgba(212,175,55,.13)",padding:"56px 5% 32px"}}>
      <div style={{maxWidth:1320,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:44,marginBottom:52}}>
          <div>
            <div className="serif gold" style={{fontSize:"1.5rem",fontWeight:700,marginBottom:14}}>◆ {s.siteName}</div>
            <p style={{color:"#7a7285",fontSize:".87rem",lineHeight:1.8,marginBottom:18}}>Premium apartment rental platform. Discover your perfect home with transparent pricing.</p>
            <div style={{display:"flex",gap:10}}>
              {[["#1877f2",s.facebook,"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"],
                ["#e1306c",s.instagram,"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9a4 4 0 0 0-4 4v9a4 4 0 0 0 4 4z"],
                ["#25d366",s.whatsapp,"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"]
              ].filter(([,url])=>url).map(([col,url,path],i)=>(
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  style={{width:36,height:36,borderRadius:8,background:`${col}20`,border:`1px solid ${col}40`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>
                </a>
              ))}
            </div>
          </div>
          {[["Quick Links",[["Home","home"],["Browse Apartments","list"],["Contact Us","contact"]]],
            ["Legal",[["Privacy Policy","privacy"],["Terms & Conditions","terms"]]]
          ].map(([title,links])=>(
            <div key={title}>
              <h4 style={{fontWeight:700,marginBottom:16,fontSize:".88rem",textTransform:"uppercase",letterSpacing:1,color:"#ede9e0"}}>{title}</h4>
              <div style={{display:"grid",gap:10}}>
                {links.map(([l,v])=><span key={v+l} onClick={()=>go(v)} style={{color:"#7a7285",cursor:"pointer",fontSize:".87rem",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#d4af37"} onMouseLeave={e=>e.target.style.color="#7a7285"}>{l}</span>)}
              </div>
            </div>
          ))}
          <div>
            <h4 style={{fontWeight:700,marginBottom:16,fontSize:".88rem",textTransform:"uppercase",letterSpacing:1,color:"#ede9e0"}}>Contact</h4>
            <div style={{color:"#7a7285",fontSize:".87rem",lineHeight:2.1}}>
              <div>📍 {s.address?.split(",")[0]}</div>
              <div>📞 {s.phone}</div>
              <div>📧 {s.email}</div>
            </div>
          </div>
        </div>
        <div className="dvd" style={{margin:"0 0 22px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <p style={{color:"#7a7285",fontSize:".8rem"}}>{s.footerNote}</p>
          <p style={{color:"#7a7285",fontSize:".8rem"}}>Payments by <span style={{color:"#d4af37"}}>Razorpay</span></p>
        </div>
      </div>
    </footer>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CONFIRM DIALOG
// ═════════════════════════════════════════════════════════════════════════════
function ConfirmDialog({msg, sub, confirmLabel="Yes, Delete", confirmColor="#ef4444", onConfirm, onCancel}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99999,padding:20,backdropFilter:"blur(6px)"}}>
      <div style={{background:"#0f0f1e",border:"1px solid rgba(239,68,68,.3)",borderRadius:18,padding:"40px 36px",maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(239,68,68,.12)",border:"2px solid rgba(239,68,68,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"1.8rem"}}>⚠️</div>
        <h3 style={{fontWeight:700,fontSize:"1.2rem",marginBottom:10,color:"#ede9e0"}}>{msg}</h3>
        {sub&&<p style={{color:"#7a7285",fontSize:".88rem",lineHeight:1.6,marginBottom:24}}>{sub}</p>}
        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:sub?0:24}}>
          <button onClick={onCancel} style={{flex:1,padding:"12px",background:"transparent",border:"1.5px solid rgba(212,175,55,.25)",color:"#9ca3af",borderRadius:8,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:".9rem"}}>Cancel</button>
          <button onClick={onConfirm} style={{flex:1,padding:"12px",background:confirmColor,border:"none",color:"#fff",borderRadius:8,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:".9rem"}}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN TOAST (appears inside admin panel) ─────────────────────────────────
function AdminToast({t}) {
  if (!t) return null;
  const isOk = t.type !== "err";
  return (
    <div style={{position:"fixed",top:80,right:24,zIndex:99990,background:isOk?"#14532d":"#7f1d1d",border:`1px solid ${isOk?"#22c55e":"#ef4444"}`,color:"#fff",padding:"14px 20px",borderRadius:12,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,.6)",fontSize:".88rem",maxWidth:340,display:"flex",alignItems:"center",gap:10,fontFamily:"'Outfit',sans-serif",animation:"slideIn .3s ease"}}>
      <span style={{fontSize:"1.2rem"}}>{isOk?"✅":"❌"}</span>
      <span>{t.msg}</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN — FULL SCREEN
// ═════════════════════════════════════════════════════════════════════════════
const DEFAULT_ADMIN_PW = "EE@Secure2024";

function AdminScreen({auth, setAuth, apts, saveApts, apps, saveApps, settings, saveSettings, onClose, notify}) {
  const [tab,      setTab]      = useState("dashboard");
  const [pw,       setPw]       = useState("");
  const [pwErr,    setPwErr]    = useState("");
  const [sideOpen, setSideOpen] = useState(true);
  const [adminPw,  setAdminPw]  = useState(DEFAULT_ADMIN_PW);
  const [pwLoaded, setPwLoaded] = useState(false);
  const [aToast,   setAToast]   = useState(null);
  const [confirm,  setConfirm]  = useState(null); // {msg, sub, onConfirm}

  useEffect(()=>{
    sGet("ee_adminpw").then(v=>{
      if(v && typeof v==="string") setAdminPw(v);
      setPwLoaded(true);
    }).catch(()=>setPwLoaded(true));
  },[]);

  // Admin-specific notify that shows top-right toast inside admin
  const aNotify = (msg, type="ok") => {
    setAToast({msg, type});
    setTimeout(()=>setAToast(null), 3200);
  };

  // Confirm helper: returns promise
  const askConfirm = (msg, sub) => new Promise(res=>{
    setConfirm({msg, sub, resolve:res});
  });

  const login = () => {
    if(!pwLoaded) return;
    if(pw===adminPw){ setAuth(true); setPwErr(""); setPw(""); }
    else setPwErr("Incorrect password. Please try again.");
  };

  if(!auth) return (
    <div className="admin-wrap" style={{alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.22)",borderRadius:20,padding:"50px 44px",width:"100%",maxWidth:420,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(212,175,55,.1)",border:"2px solid rgba(212,175,55,.25)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:"2rem"}}>🔐</div>
        <h2 className="serif gold" style={{fontSize:"2rem",marginBottom:8}}>Admin Access</h2>
        <p style={{color:"#7a7285",marginBottom:30,fontSize:".9rem"}}>Owner-only area. Enter your admin password to continue.</p>
        <input className="fld" type="password" placeholder="••••••••••" value={pw}
          onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}
          style={{textAlign:"center",letterSpacing:"6px",marginBottom:16,fontSize:"1.1rem"}} autoFocus/>
        {pwErr&&(
          <div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"10px",marginBottom:14,color:"#fca5a5",fontSize:".84rem"}}>
            ⚠️ {pwErr}
          </div>
        )}
        <div style={{display:"flex",gap:12,marginTop:4}}>
          <button className="btn-gh" onClick={onClose} style={{flex:1,padding:"12px"}}>← Exit</button>
          <button className="btn-g" onClick={login} disabled={!pwLoaded} style={{flex:1,padding:"12px",opacity:pwLoaded?1:.6}}>
            {pwLoaded?"Login →":"Loading…"}
          </button>
        </div>
        <p style={{color:"rgba(212,175,55,.25)",fontSize:".7rem",marginTop:22}}>Default: EE@Secure2024</p>
      </div>
    </div>
  );

  const navs=[
    {id:"dashboard",   icon:"📊",label:"Dashboard"},
    {id:"listings",    icon:"🏠",label:"Manage Listings"},
    {id:"add",         icon:"➕",label:"Add Apartment"},
    {id:"applications",icon:"📋",label:"Applications"},
    {id:"featured",    icon:"⭐",label:"Featured Control"},
    {id:"settings",    icon:"⚙️", label:"Site Settings"},
  ];

  return (
    <div className="admin-wrap">
      {/* CONFIRM DIALOG */}
      {confirm&&(
        <ConfirmDialog
          msg={confirm.msg} sub={confirm.sub}
          onConfirm={()=>{ const r=confirm.resolve; setConfirm(null); r(true); }}
          onCancel={()=>{ const r=confirm.resolve; setConfirm(null); r(false); }}
        />
      )}

      {/* ADMIN TOAST */}
      <AdminToast t={aToast}/>

      {/* SIDEBAR */}
      <div className={`adm-side${sideOpen?"":" collapsed"}`}>
        <div style={{padding:"18px 20px 14px",borderBottom:"1px solid rgba(212,175,55,.1)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <div className="serif gold" style={{fontSize:"1.1rem",fontWeight:700,lineHeight:1.2}}>◆ {settings.siteName}</div>
            <div style={{fontSize:".65rem",color:"#6b7280",letterSpacing:"1.5px",textTransform:"uppercase",marginTop:3}}>Admin Panel</div>
          </div>
          <button onClick={()=>setSideOpen(false)} title="Collapse sidebar"
            style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",color:"#fca5a5",cursor:"pointer",fontSize:".75rem",padding:"5px 9px",borderRadius:6,fontFamily:"'Outfit',sans-serif",fontWeight:600}}>✕</button>
        </div>
        <nav style={{flex:1,paddingTop:6,overflowY:"auto"}}>
          {navs.map(({id,icon,label})=>(
            <div key={id} className={`anav${tab===id?" on":""}`} onClick={()=>setTab(id)} title={label}>
              <span style={{fontSize:"1rem",minWidth:24,textAlign:"center",flexShrink:0}}>{icon}</span>
              <span style={{whiteSpace:"nowrap"}}>{label}</span>
            </div>
          ))}
        </nav>
        <div style={{padding:"14px 18px",borderTop:"1px solid rgba(212,175,55,.1)",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",flexShrink:0,display:"block"}}/>
            <span style={{fontSize:".74rem",color:"#6b7280"}}>Admin · Logged in</span>
          </div>
          <button className="btn-d" style={{width:"100%",padding:"9px",fontSize:".82rem"}} onClick={onClose}>← Exit Admin</button>
        </div>
      </div>

      {/* BODY */}
      <div className="adm-body">
        {/* TOP BAR with hamburger */}
        <div className="adm-topbar">
          <button
            onClick={()=>setSideOpen(v=>!v)}
            title="Toggle sidebar"
            style={{background:"rgba(212,175,55,.08)",border:"1px solid rgba(212,175,55,.2)",borderRadius:8,color:"#d4af37",cursor:"pointer",padding:"8px 11px",display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
            <span style={{width:20,height:2,background:"#d4af37",borderRadius:2,display:"block",transition:"all .3s"}}/>
            <span style={{width:14,height:2,background:"#d4af37",borderRadius:2,display:"block",transition:"all .3s",opacity:sideOpen?.7:1}}/>
            <span style={{width:20,height:2,background:"#d4af37",borderRadius:2,display:"block",transition:"all .3s"}}/>
          </button>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:"1.1rem"}}>{navs.find(n=>n.id===tab)?.icon}</span>
            <span className="serif gold" style={{fontSize:"1.05rem",fontWeight:700}}>{navs.find(n=>n.id===tab)?.label}</span>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{background:"rgba(34,197,94,.12)",border:"1px solid rgba(34,197,94,.28)",color:"#22c55e",padding:"4px 12px",borderRadius:20,fontSize:".73rem",fontWeight:600,whiteSpace:"nowrap"}}>
              {apts.filter(a=>a.available).length} Live
            </span>
            <span style={{background:"rgba(96,165,250,.1)",border:"1px solid rgba(96,165,250,.25)",color:"#60a5fa",padding:"4px 12px",borderRadius:20,fontSize:".73rem",fontWeight:600,whiteSpace:"nowrap"}}>
              {apps.length} Apps
            </span>
            <span style={{background:"rgba(212,175,55,.1)",border:"1px solid rgba(212,175,55,.22)",color:"#d4af37",padding:"4px 12px",borderRadius:20,fontSize:".73rem",fontWeight:600,whiteSpace:"nowrap"}}>
              {settings.currency}
            </span>
          </div>
        </div>

        <div style={{padding:"28px 36px",minHeight:"calc(100vh - 60px)"}}>
          {tab==="dashboard"    && <ADash    apts={apts} apps={apps} s={settings} setTab={setTab}/>}
          {tab==="listings"     && <AListings apts={apts} saveApts={saveApts} aNotify={aNotify} askConfirm={askConfirm} s={settings}/>}
          {tab==="add"          && <AAdd     apts={apts} saveApts={saveApts} aNotify={aNotify} setTab={setTab}/>}
          {tab==="applications" && <AApps    apps={apps} saveApps={saveApps} aNotify={aNotify} askConfirm={askConfirm} s={settings}/>}
          {tab==="featured"     && <AFeatured apts={apts} saveApts={saveApts} aNotify={aNotify}/>}
          {tab==="settings"     && <ASettings settings={settings} saveSettings={saveSettings} aNotify={aNotify} adminPw={adminPw} setAdminPw={setAdminPw}/>}
        </div>
      </div>
    </div>
  );
}

// ADMIN HEAD
function AH({title, sub}) {
  return (
    <div style={{marginBottom:32}}>
      <h1 className="serif gold" style={{fontSize:"1.9rem",marginBottom:4}}>{title}</h1>
      {sub&&<p style={{color:"#7a7285",fontSize:".87rem"}}>{sub}</p>}
      <div className="dvd" style={{margin:"14px 0 0"}}/>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function ADash({apts, apps, s, setTab}) {
  const rev = apps.reduce((sum,a)=>sum+(a.amount||0),0);
  const stats=[
    {icon:"🏠",l:"Total Listings",v:apts.length,c:"#d4af37"},
    {icon:"✅",l:"Available",v:apts.filter(a=>a.available).length,c:"#22c55e"},
    {icon:"❌",l:"Unavailable",v:apts.filter(a=>!a.available).length,c:"#ef4444"},
    {icon:"📋",l:"Applications",v:apps.length,c:"#60a5fa"},
    {icon:"💰",l:`Revenue (${s.currencySymbol})`,v:fmtPrice(rev,s),c:"#a78bfa"},
  ];
  return (
    <>
      <AH title="Dashboard" sub={`Welcome back. Here's your ${s.siteName} overview.`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:18,marginBottom:40}}>
        {stats.map(({icon,l,v,c})=>(
          <div key={l} style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.13)",borderRadius:14,padding:"20px"}}>
            <div style={{fontSize:"1.5rem",marginBottom:10}}>{icon}</div>
            <div className="serif" style={{fontSize:"1.9rem",fontWeight:700,color:c}}>{v}</div>
            <div style={{color:"#7a7285",fontSize:".8rem",marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.13)",borderRadius:14,padding:24}}>
          <h3 style={{fontWeight:700,marginBottom:18,fontSize:".95rem",color:"#d4af37"}}>⚡ Quick Actions</h3>
          <div style={{display:"grid",gap:10}}>
            {[["➕ Add New Apartment","add"],["📋 View Applications","applications"],["⚙️ Site Settings","settings"],["🏠 Manage Listings","listings"]].map(([l,t])=>(
              <button key={t} className="btn-gh" style={{width:"100%",textAlign:"left",padding:"10px 16px",fontSize:".87rem"}} onClick={()=>setTab(t)}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.13)",borderRadius:14,padding:24}}>
          <h3 style={{fontWeight:700,marginBottom:18,fontSize:".95rem",color:"#d4af37"}}>🕐 Recent Applications</h3>
          {apps.length===0?<p style={{color:"#7a7285",fontSize:".87rem"}}>No applications yet.</p>
          :[...apps].reverse().slice(0,5).map(a=>(
            <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(212,175,55,.07)"}}>
              <div><div style={{fontWeight:600,fontSize:".86rem"}}>{a.name}</div><div style={{color:"#7a7285",fontSize:".74rem"}}>{a.apartmentName}</div></div>
              <span style={{color:"#d4af37",fontWeight:700,fontSize:".86rem"}}>{fmtPrice(a.amount||0,s)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── ALL LISTINGS ──────────────────────────────────────────────────────────────
function AListings({apts, saveApts, aNotify, askConfirm, s}) {
  const [editId, setEditId] = useState(null);
  const [ef,     setEf]     = useState({});
  const [srch,   setSrch]   = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (a) => {
    setEditId(a.id);
    setEf({...a, amenities: (a.amenities||[]).join(", ")});
    // scroll to top of body
    document.querySelector(".adm-body")?.scrollTo({top:0,behavior:"smooth"});
  };

  const cancelEdit = () => { setEditId(null); setEf({}); };

  const saveEdit = async () => {
    if(!ef.name?.trim()){ aNotify("Apartment name is required.", "err"); return; }
    if(!ef.address?.trim()){ aNotify("Address is required.", "err"); return; }
    if(!ef.price || isNaN(+ef.price)){ aNotify("Valid price is required.", "err"); return; }
    setSaving(true);
    const updated = {
      ...ef,
      id: editId,
      price:  +ef.price  || 0,
      beds:   +ef.beds   || 0,
      baths:  +ef.baths  || 1,
      sqft:   +ef.sqft   || 0,
      floor:  +ef.floor  || 1,
      amenities: (ef.amenities||"").split(",").map(x=>x.trim()).filter(Boolean),
    };
    const newList = apts.map(a => a.id===editId ? updated : a);
    await saveApts(newList);
    setSaving(false);
    setEditId(null);
    setEf({});
    aNotify(`✓ "${updated.name}" updated successfully!`);
  };

  const deleteApt = async (apt) => {
    const ok = await askConfirm(
      `Delete "${apt.name}"?`,
      "This action cannot be undone. The apartment will be permanently removed from your listings."
    );
    if(!ok) return;
    const newList = apts.filter(a=>a.id!==apt.id);
    await saveApts(newList);
    if(editId===apt.id){ setEditId(null); setEf({}); }
    aNotify(`🗑 "${apt.name}" has been deleted.`);
  };

  const toggleAvail = async (apt) => {
    const newList = apts.map(a=>a.id===apt.id?{...a,available:!a.available}:a);
    await saveApts(newList);
    aNotify(`${apt.available?"🔴 Marked Unavailable":"✅ Marked Available"}: ${apt.name}`);
  };

  const fld = (k,v) => setEf(p=>({...p,[k]:v}));

  const vis = apts.filter(a => !srch ||
    (a.name+a.address+a.type).toLowerCase().includes(srch.toLowerCase())
  );

  return (
    <>
      <AH title="Manage Listings" sub={`${apts.length} total · ${apts.filter(a=>a.available).length} available · ${apts.filter(a=>!a.available).length} unavailable`}/>

      {/* SEARCH BAR */}
      <div style={{display:"flex",gap:12,marginBottom:22,alignItems:"center",flexWrap:"wrap"}}>
        <input className="fld" placeholder="🔍  Search by name, address, or type…"
          value={srch} onChange={e=>setSrch(e.target.value)} style={{maxWidth:340}}/>
        <span style={{color:"#6b7280",fontSize:".84rem"}}>{vis.length} results</span>
        {srch&&<button className="btn-gh" style={{padding:"8px 14px",fontSize:".8rem"}} onClick={()=>setSrch("")}>Clear</button>}
      </div>

      {/* EDIT FORM (shown at top when editing) */}
      {editId && (
        <div style={{background:"#0a0a18",border:"2px solid #d4af37",borderRadius:14,padding:26,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <h4 style={{color:"#d4af37",fontWeight:700,fontSize:"1rem"}}>✏️ Editing: {ef.name}</h4>
            <button className="btn-gh" style={{padding:"7px 14px",fontSize:".8rem"}} onClick={cancelEdit}>✕ Cancel</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:".78rem",color:"#7a7285",display:"block",marginBottom:5}}>Apartment Name *</label>
              <input className="fld" style={{padding:"10px 13px"}} value={ef.name||""} onChange={e=>fld("name",e.target.value)}/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:".78rem",color:"#7a7285",display:"block",marginBottom:5}}>Address *</label>
              <input className="fld" style={{padding:"10px 13px"}} value={ef.address||""} onChange={e=>fld("address",e.target.value)}/>
            </div>
            {[["price","Price (USD) *","number"],["sqft","Area (sqft)","number"],["floor","Floor","number"],["beds","Bedrooms (0=Studio)","number"],["baths","Bathrooms","number"]].map(([k,l,t])=>(
              <div key={k}>
                <label style={{fontSize:".78rem",color:"#7a7285",display:"block",marginBottom:5}}>{l}</label>
                <input className="fld" style={{padding:"10px 13px"}} type={t} min={0} value={ef[k]||""} onChange={e=>fld(k,e.target.value)}/>
              </div>
            ))}
            <div>
              <label style={{fontSize:".78rem",color:"#7a7285",display:"block",marginBottom:5}}>Unit Type</label>
              <select className="fld" style={{padding:"10px 13px",cursor:"pointer"}} value={ef.type||"1BHK"} onChange={e=>fld("type",e.target.value)}>
                {["Studio","1BHK","2BHK","3BHK"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:".78rem",color:"#7a7285",display:"block",marginBottom:5}}>Badge</label>
              <select className="fld" style={{padding:"10px 13px",cursor:"pointer"}} value={ef.tag||""} onChange={e=>fld("tag",e.target.value)}>
                {["","Featured","Premium","Hot Deal","New","Budget"].map(t=><option key={t}>{t||"None"}</option>)}
              </select>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:".78rem",color:"#7a7285",display:"block",marginBottom:5}}>Image URL</label>
              <input className="fld" style={{padding:"10px 13px"}} value={ef.img||""} onChange={e=>fld("img",e.target.value)} placeholder="https://i.ibb.co/…"/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:".78rem",color:"#7a7285",display:"block",marginBottom:5}}>Amenities (comma-separated)</label>
              <input className="fld" style={{padding:"10px 13px"}} value={ef.amenities||""} onChange={e=>fld("amenities",e.target.value)} placeholder="Gym, Pool, WiFi, Balcony"/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:".78rem",color:"#7a7285",display:"block",marginBottom:5}}>Description</label>
              <textarea className="fld" style={{minHeight:80,padding:"10px 13px"}} value={ef.desc||""} onChange={e=>fld("desc",e.target.value)}/>
            </div>
            <div style={{gridColumn:"1/-1",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>fld("available",!ef.available)}>
              <div className={`tog${ef.available?" on":""}`}/>
              <span style={{fontSize:".9rem",userSelect:"none"}}>{ef.available?"✅ Available":"❌ Unavailable"}</span>
            </div>
          </div>
          {ef.img&&<div style={{marginTop:14}}><img src={ef.img} alt="" style={{height:90,borderRadius:8,objectFit:"cover",border:"1px solid rgba(212,175,55,.15)",display:"block"}} onError={e=>e.target.style.display="none"}/></div>}
          <div style={{display:"flex",gap:12,marginTop:20}}>
            <button className="btn-gh" onClick={cancelEdit} style={{padding:"11px 20px"}}>✕ Cancel</button>
            <button className="btn-g" onClick={saveEdit} disabled={saving} style={{padding:"11px 28px",opacity:saving?.7:1,fontSize:".95rem"}}>
              {saving?"Saving…":"💾 Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div style={{display:"grid",gap:10}}>
        {vis.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:"#6b7280"}}>No apartments match your search.</div>}
        {vis.map(a=>(
          <div key={a.id} style={{background:"#0f0f1e",border:`1.5px solid ${editId===a.id?"#d4af37":"rgba(212,175,55,.12)"}`,borderRadius:12,overflow:"hidden",transition:"border-color .2s"}}>
            <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
              {/* Image */}
              <div style={{width:68,height:52,borderRadius:8,overflow:"hidden",flexShrink:0,border:"1px solid rgba(212,175,55,.12)",background:"#0a0a18",position:"relative"}}>
                <img src={a.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} onError={e=>e.target.style.opacity="0"}/>
                {a.tag&&(
                  <div style={{position:"absolute",top:0,left:0,background:TAG_META[a.tag]?.bg||"#374151",color:TAG_META[a.tag]?.color||"#fff",fontSize:".5rem",fontWeight:800,padding:"2px 5px",letterSpacing:".5px",textTransform:"uppercase",borderRadius:"0 0 4px 0",lineHeight:1.4}}>
                    {a.tag}
                  </div>
                )}
              </div>
              {/* Info */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:".93rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                <div style={{color:"#7a7285",fontSize:".76rem",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {a.address} · <b style={{color:"#d4af37"}}>{fmtPrice(a.price,s)}/mo</b> · {a.type} · Floor {a.floor} · {a.beds===0?"Studio":`${a.beds} Bed`}
                </div>
              </div>
              {/* Actions */}
              <div style={{display:"flex",gap:8,flexShrink:0,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                {/* Availability toggle */}
                <button
                  onClick={()=>toggleAvail(a)}
                  style={{background:a.available?"rgba(34,197,94,.1)":"rgba(239,68,68,.1)",border:`1px solid ${a.available?"#22c55e":"#ef4444"}`,color:a.available?"#22c55e":"#ef4444",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:".74rem",fontWeight:700,whiteSpace:"nowrap",transition:"all .2s"}}>
                  {a.available?"✓ Active":"✗ Taken"}
                </button>
                {/* Edit */}
                <button
                  onClick={()=>editId===a.id?cancelEdit():startEdit(a)}
                  className="btn-gh"
                  style={{padding:"5px 13px",fontSize:".8rem",background:editId===a.id?"rgba(212,175,55,.15)":"transparent"}}>
                  {editId===a.id?"✕ Cancel":"✏️ Edit"}
                </button>
                {/* Delete */}
                <button className="btn-d" onClick={()=>deleteApt(a)} style={{padding:"5px 12px",fontSize:".8rem"}}>🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── ADD APARTMENT ─────────────────────────────────────────────────────────────
function AAdd({apts, saveApts, aNotify, setTab}) {
  const blank = {name:"",address:"",price:"",beds:1,baths:1,sqft:"",floor:1,type:"1BHK",tag:"",amenities:"",desc:"",img:"",available:true};
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const save = async () => {
    if (!form.name.trim())   { aNotify("Apartment name is required.", "err"); return; }
    if (!form.address.trim()){ aNotify("Address is required.", "err"); return; }
    if (!form.price || isNaN(+form.price)||+form.price<=0) { aNotify("Valid price is required.", "err"); return; }
    setSaving(true);
    const apt = {
      ...form, id: Date.now(),
      price:+form.price, beds:+form.beds||0, baths:+form.baths||1,
      sqft:+form.sqft||0, floor:+form.floor||1,
      amenities:(form.amenities||"").split(",").map(x=>x.trim()).filter(Boolean),
      img: form.img.trim() || img(apts.length),
    };
    await saveApts([...apts, apt]);
    setSaving(false);
    aNotify(`✅ "${apt.name}" added successfully!`);
    setForm(blank);
    setTimeout(()=>setTab("listings"), 800);
  };

  return (
    <>
      <AH title="Add New Apartment" sub="Fill in all details below to list a new property."/>
      <div style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.14)",borderRadius:16,padding:30,maxWidth:820}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Apartment Name *</label>
            <input className="fld" value={form.name} onChange={e=>f("name",e.target.value)} placeholder="e.g. Skyview Penthouse 5A"/>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Full Address *</label>
            <input className="fld" value={form.address} onChange={e=>f("address",e.target.value)} placeholder="123 Main St, Manhattan, NY 10001"/>
          </div>
          <div>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Monthly Rent (USD) *</label>
            <input className="fld" type="number" min={1} max={9999} value={form.price} onChange={e=>f("price",e.target.value)} placeholder="850"/>
          </div>
          <div>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Area (sqft)</label>
            <input className="fld" type="number" min={0} value={form.sqft} onChange={e=>f("sqft",e.target.value)} placeholder="750"/>
          </div>
          <div>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Bedrooms (0 = Studio)</label>
            <input className="fld" type="number" min={0} max={10} value={form.beds} onChange={e=>f("beds",e.target.value)}/>
          </div>
          <div>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Bathrooms</label>
            <input className="fld" type="number" min={1} max={10} value={form.baths} onChange={e=>f("baths",e.target.value)}/>
          </div>
          <div>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Floor Number</label>
            <input className="fld" type="number" min={1} value={form.floor} onChange={e=>f("floor",e.target.value)}/>
          </div>
          <div>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Unit Type</label>
            <select className="fld" value={form.type} onChange={e=>f("type",e.target.value)} style={{cursor:"pointer"}}>
              {["Studio","1BHK","2BHK","3BHK"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Badge / Tag</label>
            <select className="fld" value={form.tag} onChange={e=>f("tag",e.target.value)} style={{cursor:"pointer"}}>
              {["","Featured","Premium","Hot Deal","New","Budget"].map(t=><option key={t}>{t||"None"}</option>)}
            </select>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Image URL <span style={{color:"#6b7280"}}>(leave blank to auto-use your uploaded images)</span></label>
            <input className="fld" value={form.img} onChange={e=>f("img",e.target.value)} placeholder="https://i.ibb.co/…"/>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Amenities <span style={{color:"#6b7280"}}>(comma-separated)</span></label>
            <input className="fld" value={form.amenities} onChange={e=>f("amenities",e.target.value)} placeholder="Gym, Pool, WiFi, Parking, Balcony, Pet Friendly"/>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label style={{fontSize:".8rem",color:"#7a7285",display:"block",marginBottom:7}}>Description</label>
            <textarea className="fld" value={form.desc} onChange={e=>f("desc",e.target.value)} style={{resize:"vertical",minHeight:100}} placeholder="Describe the apartment — views, finishes, neighbourhood…"/>
          </div>
          <div style={{gridColumn:"1/-1",display:"flex",alignItems:"center",gap:12,cursor:"pointer",userSelect:"none"}} onClick={()=>f("available",!form.available)}>
            <div className={`tog${form.available?" on":""}`}/>
            <span style={{fontSize:".9rem"}}>{form.available?"✅ Available immediately":"❌ Not yet available"}</span>
          </div>
        </div>
        {form.img.trim()&&(
          <div style={{marginTop:16}}>
            <p style={{fontSize:".75rem",color:"#6b7280",marginBottom:8}}>Image Preview:</p>
            <img src={form.img} alt="preview" style={{height:110,borderRadius:10,objectFit:"cover",border:"1px solid rgba(212,175,55,.15)",display:"block"}} onError={e=>e.target.style.display="none"}/>
          </div>
        )}
        <div style={{display:"flex",gap:12,marginTop:24,paddingTop:20,borderTop:"1px solid rgba(212,175,55,.08)"}}>
          <button className="btn-gh" onClick={()=>setForm(blank)} style={{padding:"12px 20px"}}>↺ Reset Form</button>
          <button className="btn-g" onClick={save} disabled={saving} style={{flex:1,padding:"13px",fontSize:".95rem",opacity:saving?.7:1}}>
            {saving?"Adding Apartment…":"✅ Add Apartment"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── APPLICATIONS ──────────────────────────────────────────────────────────────
function AApps({apps, saveApps, aNotify, askConfirm, s}) {
  const [filter, setFilter] = useState("all");
  const vis = filter==="all"?apps:apps.filter(a=>a.plan?.toLowerCase().includes(filter));
  const pm = {
    standard:{label:"Standard",bg:"#1f2937",color:"#9ca3af"},
    premium:{label:"Premium",bg:"#1e1b4b",color:"#c4b5fd"},
  };

  const deleteApp = async (app) => {
    const ok = await askConfirm(
      `Delete application from "${app.name}"?`,
      "This will permanently remove this application record."
    );
    if(!ok) return;
    await saveApps(apps.filter(a=>a.id!==app.id));
    aNotify(`🗑 Application from "${app.name}" deleted.`);
  };

  return (
    <>
      <AH title="Applications" sub={`${apps.length} total applications received`}/>
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap"}}>
        {[["all",`All (${apps.length})`],["standard","Standard"],["premium","Premium"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} className={`stab${filter===v?" on":""}`}>{l}</button>
        ))}
      </div>
      {vis.length===0
        ? <div style={{textAlign:"center",padding:"80px 0",color:"#6b7280"}}>No applications in this category.</div>
        : <div style={{display:"grid",gap:14}}>
          {[...vis].reverse().map(app=>{
            const pKey = (app.plan||"").toLowerCase().includes("premium")?"premium":"standard";
            const p = pm[pKey];
            return (
              <div key={app.id} style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.12)",borderRadius:13,padding:"18px 22px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:".97rem"}}>{app.name}</span>
                    <span style={{background:p.bg,color:p.color,fontSize:".69rem",padding:"3px 9px",borderRadius:10,fontWeight:700}}>{p.label}</span>
                    {app.paymentId&&<span style={{background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.25)",color:"#22c55e",fontSize:".69rem",padding:"3px 9px",borderRadius:10,fontWeight:700}}>✓ Paid</span>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{color:"#6b7280",fontSize:".76rem"}}>{new Date(app.date).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</span>
                    <button className="btn-d" onClick={()=>deleteApp(app)} style={{padding:"4px 10px",fontSize:".75rem"}}>🗑</button>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
                  {[["📧 Email",app.email],["📞 Phone",app.phone],["🏠 Apartment",app.apartmentName],["💳 Paid",fmtPrice(app.amount||0,s)],app.moveDate&&["🗓 Move-in",app.moveDate],app.income&&["💰 Income",`${s.currencySymbol}${app.income}/mo`]].filter(Boolean).map(([l,v],idx)=>(
                    <div key={idx}>
                      <div style={{color:"#6b7280",fontSize:".72rem"}}>{l}</div>
                      <div style={{fontSize:".85rem",marginTop:2,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div>
                    </div>
                  ))}
                </div>
                {app.message&&<div style={{marginTop:12,padding:"10px 14px",background:"#141428",borderRadius:8,fontSize:".82rem",color:"#7a7285",fontStyle:"italic",borderLeft:"3px solid rgba(212,175,55,.22)"}}>"{app.message}"</div>}
                {app.paymentId&&<div style={{marginTop:8,fontSize:".72rem",color:"#6b7280"}}>Payment ID: <code style={{color:"#d4af37",fontSize:".72rem"}}>{app.paymentId}</code></div>}
              </div>
            );
          })}
        </div>
      }
    </>
  );
}

// ── FEATURED CONTROL ──────────────────────────────────────────────────────────
function AFeatured({apts, saveApts, aNotify}) {
  const tags = ["Featured","Premium","Hot Deal","New","Budget",""];
  const setTag = async (apt, tag) => {
    await saveApts(apts.map(a=>a.id===apt.id?{...a,tag}:a));
    aNotify(tag ? `✅ "${apt.name}" tagged as "${tag}"` : `✅ Tag removed from "${apt.name}"`);
  };
  return (
    <>
      <AH title="Featured Control" sub="Assign or remove tags on any apartment. Changes reflect instantly on the website."/>
      <div style={{display:"grid",gap:12}}>
        {apts.map(a=>(
          <div key={a.id} style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.12)",borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            <img src={a.img} alt="" style={{width:56,height:44,objectFit:"cover",borderRadius:7,border:"1px solid rgba(212,175,55,.12)",flexShrink:0,background:"#0a0a18"}} onError={e=>e.target.style.opacity="0"}/>
            <div style={{flex:1,minWidth:180}}>
              <div style={{fontWeight:700,fontSize:".9rem"}}>{a.name}</div>
              <div style={{color:"#7a7285",fontSize:".76rem",marginTop:2}}>{a.type} · Floor {a.floor} · {fmtPrice(a.price,{currency:"USD",currencySymbol:"$"})}/mo</div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {tags.map(t=>{
                const tm = TAG_META[t]||{bg:"#1f2937",color:"#9ca3af"};
                const active = a.tag===t;
                return(
                  <button key={t||"none"} onClick={()=>setTag(a,t)}
                    style={{padding:"4px 12px",borderRadius:20,border:`1.5px solid ${active?tm.bg||"#d4af37":"rgba(212,175,55,.15)"}`,background:active?tm.bg||"rgba(212,175,55,.1)":"transparent",color:active?tm.color||"#d4af37":"#6b7280",fontSize:".72rem",fontWeight:700,cursor:"pointer",transition:"all .2s",textTransform:"uppercase",letterSpacing:".5px"}}>
                    {t||"None"}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────
function ASettings({settings, saveSettings, aNotify, adminPw, setAdminPw}) {
  const [stab, setStab] = useState("general");
  const [s,    setS]    = useState({...settings});
  const [newPw,setNewPw] = useState("");
  const [confPw,setConfPw] = useState("");

  const upd = (k,v) => setS(p=>({...p,[k]:v}));
  const save = async () => { await saveSettings(s); aNotify("✅ Settings saved successfully!");};

  const changePw = async () => {
    if (!newPw || newPw.length < 6) { aNotify("Password must be at least 6 characters.", "err"); return; }
    if (newPw !== confPw) { aNotify("Passwords do not match.", "err"); return; }
    await sSet("ee_adminpw", newPw);
    setAdminPw(newPw);
    setNewPw(""); setConfPw("");
    aNotify("✅ Admin password changed successfully!");
  };

  const currencies = [
    {code:"USD",symbol:"$",name:"US Dollar"},
    {code:"INR",symbol:"₹",name:"Indian Rupee"},
    {code:"EUR",symbol:"€",name:"Euro"},
    {code:"GBP",symbol:"£",name:"British Pound"},
  ];

  const settabsList = [
    {id:"general",label:"General"},
    {id:"social",label:"Social & Contact"},
    {id:"payment",label:"Payment"},
    {id:"pages",label:"Pages"},
    {id:"security",label:"Security"},
  ];

  return (
    <>
      <AH title="Site Settings" sub="Control every aspect of your platform from here."/>
      <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
        {settabsList.map(t=>(
          <button key={t.id} className={`stab${stab===t.id?" on":""}`} onClick={()=>setStab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={{background:"#0f0f1e",border:"1px solid rgba(212,175,55,.13)",borderRadius:16,padding:28,maxWidth:760}}>

        {/* GENERAL */}
        {stab==="general"&&(
          <div style={{display:"grid",gap:20}}>
            <h3 style={{fontWeight:700,color:"#d4af37",marginBottom:4}}>🏠 General Settings</h3>
            {[["siteName","Site Name"],["tagline","Hero Tagline"],["heroImg","Hero Image URL"],["footerNote","Footer Copyright Text"]].map(([k,l])=>(
              <div key={k}>
                <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>{l}</label>
                <input className="fld" value={s[k]||""} onChange={e=>upd(k,e.target.value)}/>
              </div>
            ))}
            {s.heroImg&&<img src={s.heroImg} alt="hero preview" style={{height:100,borderRadius:8,objectFit:"cover",border:"1px solid rgba(212,175,55,.14)",display:"block"}} onError={e=>e.target.style.display="none"}/>}
          </div>
        )}

        {/* SOCIAL & CONTACT */}
        {stab==="social"&&(
          <div style={{display:"grid",gap:20}}>
            <h3 style={{fontWeight:700,color:"#d4af37",marginBottom:4}}>📱 Social Media Links</h3>
            {[["facebook","🔵 Facebook URL"],["instagram","🔴 Instagram URL"],["twitter","🐦 Twitter/X URL"],["whatsapp","💬 WhatsApp URL"]].map(([k,l])=>(
              <div key={k}>
                <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>{l}</label>
                <input className="fld" value={s[k]||""} onChange={e=>upd(k,e.target.value)} placeholder="https://…"/>
              </div>
            ))}
            <div className="dvd"/>
            <h3 style={{fontWeight:700,color:"#d4af37",marginBottom:4}}>📍 Contact Information</h3>
            {[["address","Office Address"],["phone","Phone Number"],["email","Contact Email"],["hours","Business Hours"]].map(([k,l])=>(
              <div key={k}>
                <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>{l}</label>
                <input className="fld" value={s[k]||""} onChange={e=>upd(k,e.target.value)}/>
              </div>
            ))}
          </div>
        )}

        {/* PAYMENT */}
        {stab==="payment"&&(
          <div style={{display:"grid",gap:20}}>
            <h3 style={{fontWeight:700,color:"#d4af37",marginBottom:4}}>💳 Payment Gateway (Razorpay)</h3>
            <div>
              <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>Razorpay Key ID</label>
              <input className="fld" value={s.razorpayKey||""} onChange={e=>upd("razorpayKey",e.target.value)} placeholder="rzp_live_XXXXXXXXXX"/>
              <p style={{color:"#6b7280",fontSize:".76rem",marginTop:6}}>Get from: <b style={{color:"#d4af37"}}>dashboard.razorpay.com → API Keys</b></p>
            </div>
            <div className="dvd"/>
            <h3 style={{fontWeight:700,color:"#d4af37",marginBottom:4}}>💱 Currency Settings</h3>
            <div>
              <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:10}}>Display Currency</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {currencies.map(c=>(
                  <div key={c.code} onClick={()=>upd("currency",c.code)||upd("currencySymbol",c.symbol)} style={{border:`2px solid ${s.currency===c.code?"#d4af37":"rgba(212,175,55,.15)"}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",background:s.currency===c.code?"rgba(212,175,55,.08)":"#141428",transition:"all .2s",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:"1.3rem",fontFamily:"serif"}}>{c.symbol}</span>
                    <div><div style={{fontWeight:700,fontSize:".9rem",color:s.currency===c.code?"#d4af37":"#ede9e0"}}>{c.code}</div><div style={{fontSize:".76rem",color:"#7a7285"}}>{c.name}</div></div>
                  </div>
                ))}
              </div>
            </div>
            {s.currency==="INR"&&(
              <div>
                <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>USD → INR Conversion Rate</label>
                <input className="fld" type="number" value={s.inrRate||83} onChange={e=>upd("inrRate",+e.target.value)}/>
                <p style={{color:"#6b7280",fontSize:".76rem",marginTop:6}}>Current rate: 1 USD = ₹{s.inrRate||83}</p>
              </div>
            )}
            <div className="dvd"/>
            <h3 style={{fontWeight:700,color:"#d4af37",marginBottom:4}}>💰 Application Fees</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>Standard Apply Fee (USD)</label>
                <input className="fld" type="number" min={1} value={s.applyFee||2} onChange={e=>upd("applyFee",+e.target.value)}/>
                <p style={{color:"#6b7280",fontSize:".75rem",marginTop:5}}>Shown as: {fmtPrice(s.applyFee||2,s)}</p>
              </div>
              <div>
                <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>Premium Fee (USD)</label>
                <input className="fld" type="number" min={1} value={s.premiumFee||50} onChange={e=>upd("premiumFee",+e.target.value)}/>
                <p style={{color:"#6b7280",fontSize:".75rem",marginTop:5}}>Shown as: {fmtPrice(s.premiumFee||50,s)}</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGES */}
        {stab==="pages"&&(
          <div style={{display:"grid",gap:24}}>
            <h3 style={{fontWeight:700,color:"#d4af37",marginBottom:4}}>📄 Page Content</h3>
            <p style={{color:"#7a7285",fontSize:".86rem",marginTop:-12}}>Use blank lines to separate sections. Each section's first line becomes the heading.</p>
            <div>
              <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>Privacy Policy</label>
              <textarea className="fld" value={s.privacy||""} onChange={e=>upd("privacy",e.target.value)} style={{resize:"vertical",minHeight:200,fontSize:".84rem"}}/>
            </div>
            <div>
              <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>Terms & Conditions</label>
              <textarea className="fld" value={s.terms||""} onChange={e=>upd("terms",e.target.value)} style={{resize:"vertical",minHeight:200,fontSize:".84rem"}}/>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {stab==="security"&&(
          <div style={{display:"grid",gap:20}}>
            <h3 style={{fontWeight:700,color:"#d4af37",marginBottom:4}}>🔐 Change Admin Password</h3>
            <div style={{background:"rgba(212,175,55,.05)",border:"1px solid rgba(212,175,55,.15)",borderRadius:10,padding:"14px 18px",marginBottom:4}}>
              <p style={{color:"#9ca3af",fontSize:".86rem",lineHeight:1.7}}>
                ⚠️ Your admin password is stored securely. It is <b style={{color:"#ede9e0"}}>not visible in source code</b>. Only you know it. Keep it safe — there is no recovery option.
              </p>
            </div>
            <div>
              <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>New Password (min 6 characters)</label>
              <input className="fld" type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Enter new password"/>
            </div>
            <div>
              <label style={{fontSize:".82rem",color:"#7a7285",display:"block",marginBottom:7}}>Confirm New Password</label>
              <input className="fld" type="password" value={confPw} onChange={e=>setConfPw(e.target.value)} placeholder="Re-enter new password"/>
            </div>
            <button className="btn-g" onClick={changePw} style={{padding:"13px 28px",width:"fit-content"}}>Update Password →</button>
          </div>
        )}

        <div style={{marginTop:28,paddingTop:20,borderTop:"1px solid rgba(212,175,55,.1)"}}>
          <button className="btn-g" onClick={save} style={{padding:"13px 36px",fontSize:"1rem"}}>💾 Save All Settings</button>
        </div>
      </div>
    </>
  );
}
