"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import ImageUpload  from "@/app/components/admin/ImageUpload";
import VideoUpload  from "@/app/components/admin/VideoUpload";

const EMPTY = {
  id:"",cat:"Beauty",name:"",tagline:"",price:"",originalPrice:"",
  badge:"",badgeColor:"#D4544A",bg:"#FAF5EE",thumbnail:"",description:"",
  purchases:0,rating:5.0,reviews:0,satisfaction:100,
  formLink:"",videoUrl:"",reviewScreenshots:[],
  announcementBar:{ enabled:false, text:"", bgColor:"#7C3AED", textColor:"#ffffff", showClose:true },
  topStory:       { enabled:false, text:"", image:"" },
  customerStory:  { enabled:false, headline:"", content:"", image:"", ctaType:"whatsapp", ctaText:"Order Now" },
  usageComparison:{ enabled:false, autoplay:true, interval:3000,
    pairs:[{before:"",after:""},{before:"",after:""},{before:"",after:""},{before:"",after:""}] },
  howItWorks: {
    eyebrow:  "Dead simple to use",
    headline: "3 steps.",
    subline:  "That's it.",
    steps: [
      { n:"01", title:"", desc:"" },
      { n:"02", title:"", desc:"" },
      { n:"03", title:"", desc:"" },
    ],
  },
  problem:{ title:"", body:"" },
  solutions:[{icon:"🌟",title:"",body:""},{icon:"💧",title:"",body:""},{icon:"🛡️",title:"",body:""}],
  features:["","","","","",""],
  images:[
    {src:"",alt:"",label:"Product Front"},{src:"",alt:"",label:"View 2"},
    {src:"",alt:"",label:"View 3"},{src:"",alt:"",label:"View 4"},
  ],
  testimonials:[
    {name:"",location:"",rating:5,text:""},{name:"",location:"",rating:5,text:""},
    {name:"",location:"",rating:5,text:""},
  ],
  faq:[{q:"",a:""},{q:"",a:""},{q:"",a:""},{q:"",a:""}],
};

const TABS = ["Basic Info","Images & Video","Sales Copy","Reviews & FAQ","Stories & Extras"];

function Field({ label, required, hint, children }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}{required&&<span className="admin-req"> *</span>}</label>
      {children}
      {hint&&<p className="admin-input-hint">{hint}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange, hint }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button type="button" onClick={() => onChange(!checked)}
          style={{ width:44,height:24,borderRadius:100,border:"none",cursor:"pointer",
            background:checked?"#22C55E":"#334155",position:"relative",transition:"background .2s",flexShrink:0 }}>
          <span style={{ position:"absolute",top:3,width:18,height:18,borderRadius:"50%",background:"white",
            transition:"left .2s", left:checked?23:3, display:"block" }}/>
        </button>
        <span style={{ fontSize:14,fontWeight:600,color:"var(--a-text)" }}>{label}</span>
      </div>
      {hint&&<p className="admin-input-hint" style={{ marginTop:6 }}>{hint}</p>}
    </div>
  );
}

export default function ProductForm({ initial=null, isEdit=false }) {
  const router = useRouter();
  const [form, setForm] = useState(initial ? {
    ...EMPTY, ...initial,
    formLink:          initial.formLink          || "",
    videoUrl:          initial.videoUrl          || "",
    reviewScreenshots: initial.reviewScreenshots || [],
    announcementBar:   { ...EMPTY.announcementBar,   ...(initial.announcementBar   || {}) },
    topStory:          { ...EMPTY.topStory,          ...(initial.topStory          || {}) },
    customerStory:     { ...EMPTY.customerStory,     ...(initial.customerStory     || {}) },
    usageComparison:   { ...EMPTY.usageComparison,   ...(initial.usageComparison   || {}),
      pairs: Array.from({ length:4 }, (_, i) => (initial.usageComparison?.pairs?.[i] || { before:"", after:"" })) },
    howItWorks: {
      ...EMPTY.howItWorks,
      ...(initial.howItWorks || {}),
      steps: Array.from({ length:3 }, (_, i) => (initial.howItWorks?.steps?.[i] || { n:String(i+1).padStart(2,"0"), title:"", desc:"" })),
    },
  } : EMPTY);
  const [tab,    setTab]    = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast,  setToast]  = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const set = (path, value) => {
    setForm(prev => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length-1; i++) {
        const k = isNaN(keys[i]) ? keys[i] : Number(keys[i]);
        obj = obj[k];
      }
      const last = keys[keys.length-1];
      obj[isNaN(last) ? last : Number(last)] = value;
      return next;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name         = "Required";
    if (!form.price)              e.price         = "Required";
    if (!form.originalPrice)      e.originalPrice = "Required";
    if (!form.thumbnail.trim())   e.thumbnail     = "A thumbnail image is required";
    if (!form.description.trim()) e.description   = "Required";
    return e;
  };

  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); setTab(0); showToast("Please fill in all required fields.","error"); return; }
    setSaving(true);
    const payload = {
      ...form,
      price:             Number(form.price),
      originalPrice:     Number(form.originalPrice),
      purchases:         Number(form.purchases)    || 0,
      rating:            Number(form.rating)       || 5,
      reviews:           Number(form.reviews)      || 0,
      satisfaction:      Number(form.satisfaction) || 100,
      reviewScreenshots: (form.reviewScreenshots||[]).filter(Boolean),
      usageComparison: {
        ...form.usageComparison,
        pairs: (form.usageComparison?.pairs||[]).filter(p => p.before || p.after),
        interval: Number(form.usageComparison?.interval) || 3000,
      },
    };
    try {
      const res  = await fetch(isEdit?`/api/products/${initial.id}`:"/api/products",
        { method:isEdit?"PUT":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      const data = await res.json();
      setSaving(false);
      if (res.ok) { showToast(isEdit?"Product updated!":"Product created!"); setTimeout(()=>router.push("/admin/products"),1200); }
      else showToast(data.error||"Something went wrong.","error");
    } catch { setSaving(false); showToast("Network error. Please try again.","error"); }
  };

  const addShot    = () => set("reviewScreenshots",[...(form.reviewScreenshots||[]),""]);
  const removeShot = i  => set("reviewScreenshots",(form.reviewScreenshots||[]).filter((_,idx)=>idx!==i));
  const updateShot = (i,url) => { const u=[...(form.reviewScreenshots||[])]; u[i]=url; set("reviewScreenshots",u); };

  return (
    <div className="admin-wrap">
      <AdminSidebar/>
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">{isEdit?"✏️ Edit Product":"➕ Add New Product"}</div>
            <div className="admin-topbar-sub">{isEdit?`Editing: ${initial?.name}`:"Fill in the product details below"}</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-admin-ghost" onClick={()=>router.push("/admin/products")}>← Back</button>
            <button className="btn-admin-primary" onClick={save} disabled={saving}>
              {saving?"Saving…":isEdit?"💾 Save Changes":"✅ Create Product"}
            </button>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-form-page">
            <div className="admin-tabs">
              {TABS.map((t,i)=>(
                <button key={i} className={`admin-tab ${tab===i?"active":""}`} onClick={()=>setTab(i)}>{t}</button>
              ))}
            </div>

            {/* ── TAB 0: Basic Info ── */}
            {tab===0&&(
              <>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">🏷️ Basic Information</div>
                  <Field label="Product Name" required>
                    <input className={`admin-input${errors.name?" error":""}`} value={form.name}
                      onChange={e=>{set("name",e.target.value);setErrors(p=>({...p,name:""}));}} placeholder="e.g. Vitamin C Glow Serum"/>
                    {errors.name&&<p style={{color:"#FCA5A5",fontSize:12,marginTop:4}}>{errors.name}</p>}
                  </Field>
                  <Field label="Tagline" hint="Used as the hero headline on the product page — make it punchy and benefit-focused">
                    <input className="admin-input" value={form.tagline} onChange={e=>set("tagline",e.target.value)}
                      placeholder="Get visibly brighter skin in just 7 days — or pay nothing."/>
                  </Field>
                  <div className="admin-grid-2">
                    <Field label="Category" required>
                      <select className="admin-select" value={form.cat} onChange={e=>set("cat",e.target.value)}>
                        {["Beauty","Electronics","Health"].map(c=><option key={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Badge Text" hint="e.g. Bestseller, New (optional)">
                      <input className="admin-input" value={form.badge} onChange={e=>set("badge",e.target.value)} placeholder="Bestseller"/>
                    </Field>
                  </div>
                  <div className="admin-grid-2">
                    <Field label="Selling Price (₦)" required>
                      <input className={`admin-input${errors.price?" error":""}`} type="number" value={form.price}
                        onChange={e=>{set("price",e.target.value);setErrors(p=>({...p,price:""}));}} placeholder="8500"/>
                      {errors.price&&<p style={{color:"#FCA5A5",fontSize:12,marginTop:4}}>{errors.price}</p>}
                    </Field>
                    <Field label="Original Price (₦)" required hint="Must be higher — shown crossed out">
                      <input className={`admin-input${errors.originalPrice?" error":""}`} type="number" value={form.originalPrice}
                        onChange={e=>{set("originalPrice",e.target.value);setErrors(p=>({...p,originalPrice:""}));}} placeholder="12000"/>
                    </Field>
                  </div>
                  <Field label="Description" required hint="2–3 sentences about the product — used in the solution section">
                    <textarea className={`admin-textarea${errors.description?" error":""}`} value={form.description}
                      onChange={e=>{set("description",e.target.value);setErrors(p=>({...p,description:""}));}}
                      placeholder="Formulated specifically for Nigerian skin..." rows={3}/>
                    {errors.description&&<p style={{color:"#FCA5A5",fontSize:12,marginTop:4}}>{errors.description}</p>}
                  </Field>
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">📸 Thumbnail Image</div>
                  <p className="admin-input-hint" style={{marginBottom:14}}>Shown on homepage & product listing cards.</p>
                  {errors.thumbnail&&<p style={{color:"#FCA5A5",fontSize:12,marginBottom:10}}>⚠️ {errors.thumbnail}</p>}
                  <ImageUpload value={form.thumbnail} onChange={url=>{set("thumbnail",url);setErrors(p=>({...p,thumbnail:""}));}}/>
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">📋 External Order Form <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Optional</span></div>
                  <Field label="Form Link URL" hint="If set, all Order buttons scroll to an embedded form instead of opening WhatsApp.">
                    <input className="admin-input" type="url" value={form.formLink} onChange={e=>set("formLink",e.target.value)}
                      placeholder="https://www.cognitoforms.com/..."/>
                  </Field>
                  {form.formLink&&(
                    <div style={{padding:"10px 14px",background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:8,fontSize:13,color:"#818CF8"}}>
                      ✓ Order buttons will scroll to the embedded form at the bottom of the page.
                    </div>
                  )}
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">📊 Stats & Display</div>
                  <div className="admin-grid-3">
                    {[["purchases","Units Sold"],["rating","Rating (0–5)"],["reviews","No. of Reviews"],["satisfaction","Satisfaction %"]].map(([k,l])=>(
                      <Field key={k} label={l}>
                        <input className="admin-input" type="number" value={form[k]} onChange={e=>set(k,e.target.value)}/>
                      </Field>
                    ))}
                    <Field label="Badge Colour">
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <input type="color" value={form.badgeColor} onChange={e=>set("badgeColor",e.target.value)}
                          style={{width:44,height:38,borderRadius:8,border:"1px solid #334155",cursor:"pointer",padding:2,background:"transparent"}}/>
                        <input className="admin-input" value={form.badgeColor} onChange={e=>set("badgeColor",e.target.value)}/>
                      </div>
                    </Field>
                  </div>
                </div>
              </>
            )}

            {/* ── TAB 1: Images & Video ── */}
            {tab===1&&(
              <>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">🖼️ Product Gallery <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Auto-slides as hero carousel</span></div>
                  <p className="admin-input-hint" style={{marginBottom:20}}>These 4 images auto-slide at the top of the product page. First image shows first.</p>
                  {form.images.map((img,i)=>(
                    <div key={i} className="admin-array-item">
                      <div className="admin-array-item-title">Image {i+1}{i===0?" — Shows first":""}</div>
                      <div className="admin-grid-2">
                        <ImageUpload value={img.src} onChange={url=>set(`images.${i}.src`,url)}/>
                        <div style={{display:"flex",flexDirection:"column",gap:12}}>
                          <Field label="Alt Text"><input className="admin-input" value={img.alt} onChange={e=>set(`images.${i}.alt`,e.target.value)} placeholder="e.g. Serum bottle front"/></Field>
                          <Field label="Label"><input className="admin-input" value={img.label} onChange={e=>set(`images.${i}.label`,e.target.value)} placeholder="e.g. Product Front"/></Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">🎬 Product Illustration Video <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Optional</span></div>
                  <p className="admin-input-hint" style={{marginBottom:14}}>Upload a video or paste a YouTube/Vimeo URL. Shown in its own section below the testimonials.</p>
                  <VideoUpload value={form.videoUrl} onChange={url=>set("videoUrl",url)}
                    hint="MP4, WebM, MOV up to 200MB — or paste a YouTube/Vimeo URL"/>
                </div>
              </>
            )}

            {/* ── TAB 2: Sales Copy ── */}
            {tab===2&&(
              <>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">😔 Problem Statement</div>
                  <Field label="Problem Headline" hint="Make customers feel understood — address their pain point directly">
                    <input className="admin-input" value={form.problem.title} onChange={e=>set("problem.title",e.target.value)} placeholder="Tired of spending thousands on skincare that doesn't work?"/>
                  </Field>
                  <Field label="Problem Body">
                    <textarea className="admin-textarea" value={form.problem.body} onChange={e=>set("problem.body",e.target.value)} rows={3} placeholder="Describe the pain point in detail..."/>
                  </Field>
                </div>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">✅ Solutions (3)</div>
                  {form.solutions.map((s,i)=>(
                    <div key={i} className="admin-array-item">
                      <div className="admin-array-item-title">Solution {i+1}</div>
                      <div className="admin-grid-3">
                        <Field label="Icon"><input className="admin-input" value={s.icon} onChange={e=>set(`solutions.${i}.icon`,e.target.value)} placeholder="🌟"/></Field>
                        <Field label="Title"><input className="admin-input" value={s.title} onChange={e=>set(`solutions.${i}.title`,e.target.value)} placeholder="Fades dark spots"/></Field>
                        <Field label="Description"><input className="admin-input" value={s.body} onChange={e=>set(`solutions.${i}.body`,e.target.value)} placeholder="How this helps..."/></Field>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">🪜 How It Works — 3 Steps</div>
                  <p className="admin-input-hint" style={{marginBottom:16}}>Customise the step-by-step section. Leave all step titles empty to use smart defaults based on the product name.</p>
                  <div className="admin-grid-3" style={{marginBottom:16}}>
                    <Field label="Eyebrow Text" hint="Small label above headline">
                      <input className="admin-input" value={form.howItWorks?.eyebrow||""} onChange={e=>set("howItWorks.eyebrow",e.target.value)} placeholder="Dead simple to use"/>
                    </Field>
                    <Field label="Headline" hint="Main bold title">
                      <input className="admin-input" value={form.howItWorks?.headline||""} onChange={e=>set("howItWorks.headline",e.target.value)} placeholder="3 steps."/>
                    </Field>
                    <Field label="Sub-headline (italic)" hint="Shown in terracotta italic">
                      <input className="admin-input" value={form.howItWorks?.subline||""} onChange={e=>set("howItWorks.subline",e.target.value)} placeholder="That's it."/>
                    </Field>
                  </div>
                  {(form.howItWorks?.steps||[]).map((s,i)=>(
                    <div key={i} className="admin-array-item">
                      <div className="admin-array-item-title">Step {i+1}</div>
                      <div className="admin-grid-3">
                        <Field label="Step Number" hint="e.g. 01">
                          <input className="admin-input" value={s.n||""} onChange={e=>set(`howItWorks.steps.${i}.n`,e.target.value)} placeholder={String(i+1).padStart(2,"0")}/>
                        </Field>
                        <Field label="Step Title">
                          <input className="admin-input" value={s.title||""} onChange={e=>set(`howItWorks.steps.${i}.title`,e.target.value)} placeholder={["Cleanse your face","Apply the product","See real results"][i]}/>
                        </Field>
                        <Field label="Step Description">
                          <input className="admin-input" value={s.desc||""} onChange={e=>set(`howItWorks.steps.${i}.desc`,e.target.value)} placeholder="What happens in this step..."/>
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-form-card">
                  <p className="admin-input-hint" style={{marginBottom:14}}>These appear as green checkmark bullets under "Real results. In real time." Write as outcomes, not features.</p>
                  <div className="admin-features-list">
                    {form.features.map((f,i)=>(
                      <div key={i} className="admin-feature-row">
                        <div className="admin-feature-num">{i+1}</div>
                        <input className="admin-input" value={f} onChange={e=>set(`features.${i}`,e.target.value)} placeholder={`e.g. Dark spots visibly faded in 2 weeks`}/>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── TAB 3: Reviews & FAQ ── */}
            {tab===3&&(
              <>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">⭐ Customer Testimonials (3)</div>
                  {form.testimonials.map((t,i)=>(
                    <div key={i} className="admin-array-item">
                      <div className="admin-array-item-title">Testimonial {i+1}</div>
                      <div className="admin-grid-2">
                        <Field label="Name"><input className="admin-input" value={t.name} onChange={e=>set(`testimonials.${i}.name`,e.target.value)} placeholder="Amaka O."/></Field>
                        <Field label="Location"><input className="admin-input" value={t.location} onChange={e=>set(`testimonials.${i}.location`,e.target.value)} placeholder="Surulere, Lagos"/></Field>
                      </div>
                      <Field label="Rating">
                        <select className="admin-select" value={t.rating} onChange={e=>set(`testimonials.${i}.rating`,Number(e.target.value))}>
                          {[5,4,3,2,1].map(r=><option key={r} value={r}>{r} ⭐</option>)}
                        </select>
                      </Field>
                      <Field label="Review Text">
                        <textarea className="admin-textarea" value={t.text} onChange={e=>set(`testimonials.${i}.text`,e.target.value)} rows={2} placeholder="What the customer said..."/>
                      </Field>
                    </div>
                  ))}
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">📸 Review Screenshots <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Optional</span></div>
                  <p className="admin-input-hint" style={{marginBottom:16}}>Upload screenshots from WhatsApp, Instagram etc. Only shown when at least one image is added.</p>
                  {(form.reviewScreenshots||[]).map((src,i)=>(
                    <div key={i} className="admin-array-item" style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div className="admin-array-item-title" style={{margin:0}}>Screenshot {i+1}</div>
                        <button onClick={()=>removeShot(i)} style={{padding:"5px 12px",borderRadius:6,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#FCA5A5",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✕ Remove</button>
                      </div>
                      <ImageUpload value={src} onChange={url=>updateShot(i,url)} hint="Upload review screenshot or paste URL"/>
                    </div>
                  ))}
                  <button className="btn-admin-ghost" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={addShot}>+ Add Review Screenshot</button>
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">❓ Frequently Asked Questions (4)</div>
                  {form.faq.map((f,i)=>(
                    <div key={i} className="admin-array-item">
                      <div className="admin-array-item-title">Q&A {i+1}</div>
                      <Field label="Question"><input className="admin-input" value={f.q} onChange={e=>set(`faq.${i}.q`,e.target.value)} placeholder="e.g. When will I see results?"/></Field>
                      <Field label="Answer"><textarea className="admin-textarea" value={f.a} onChange={e=>set(`faq.${i}.a`,e.target.value)} rows={2} placeholder="Clear, concise answer."/></Field>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── TAB 4: Stories & Extras ── */}
            {tab===4&&(
              <>
                {/* Announcement Bar */}
                <div className="admin-form-card">
                  <div className="admin-form-card-title">📢 Announcement Bar <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Decorative strip above navbar</span></div>
                  <p className="admin-input-hint" style={{marginBottom:14}}>Appears above the page navigation. Use for promotions, urgency, or trust messages.</p>
                  <Toggle label="Enable Announcement Bar" checked={!!form.announcementBar?.enabled} onChange={v=>set("announcementBar.enabled",v)}
                    hint="Toggle off to hide completely — no empty space left behind."/>
                  {form.announcementBar?.enabled&&(
                    <>
                      <Field label="Message Text" hint="Keep it short and action-oriented">
                        <input className="admin-input" value={form.announcementBar?.text||""} onChange={e=>set("announcementBar.text",e.target.value)}
                          placeholder="🎉 Free delivery in Lagos today only — Limited time!"/>
                      </Field>
                      <div className="admin-grid-3">
                        <Field label="Background Color">
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <input type="color" value={form.announcementBar?.bgColor||"#7C3AED"} onChange={e=>set("announcementBar.bgColor",e.target.value)}
                              style={{width:44,height:38,borderRadius:8,border:"1px solid #334155",cursor:"pointer",padding:2,background:"transparent"}}/>
                            <input className="admin-input" value={form.announcementBar?.bgColor||"#7C3AED"} onChange={e=>set("announcementBar.bgColor",e.target.value)}/>
                          </div>
                        </Field>
                        <Field label="Text Color">
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <input type="color" value={form.announcementBar?.textColor||"#ffffff"} onChange={e=>set("announcementBar.textColor",e.target.value)}
                              style={{width:44,height:38,borderRadius:8,border:"1px solid #334155",cursor:"pointer",padding:2,background:"transparent"}}/>
                            <input className="admin-input" value={form.announcementBar?.textColor||"#ffffff"} onChange={e=>set("announcementBar.textColor",e.target.value)}/>
                          </div>
                        </Field>
                        <Field label="Show Close (×) Button">
                          <select className="admin-select" value={form.announcementBar?.showClose!==false?"yes":"no"}
                            onChange={e=>set("announcementBar.showClose",e.target.value==="yes")}>
                            <option value="yes">Yes — allow dismissal</option>
                            <option value="no">No — always visible</option>
                          </select>
                        </Field>
                      </div>
                      {/* Live preview */}
                      <div style={{borderRadius:8,overflow:"hidden",marginTop:4}}>
                        <div style={{background:form.announcementBar?.bgColor||"#7C3AED",color:form.announcementBar?.textColor||"#fff",
                          padding:"10px 16px",fontSize:13,fontWeight:700,textAlign:"center",position:"relative"}}>
                          {form.announcementBar?.text||"Your announcement text will appear here"}
                          {form.announcementBar?.showClose!==false&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",opacity:.7}}>×</span>}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Usage Comparison */}
                <div className="admin-form-card">
                  <div className="admin-form-card-title">🔄 Usage Comparison (Before & After) <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Optional</span></div>
                  <p className="admin-input-hint" style={{marginBottom:14}}>Auto-sliding carousel showing before/after pairs. Up to 4 pairs. Only shown when enabled and pairs have images.</p>
                  <Toggle label="Enable Before & After Carousel" checked={!!form.usageComparison?.enabled} onChange={v=>set("usageComparison.enabled",v)}/>
                  {form.usageComparison?.enabled&&(
                    <>
                      <div className="admin-grid-2" style={{marginBottom:16}}>
                        <Field label="Autoplay">
                          <select className="admin-select" value={form.usageComparison?.autoplay?"yes":"no"}
                            onChange={e=>set("usageComparison.autoplay",e.target.value==="yes")}>
                            <option value="yes">Yes — auto-slide</option>
                            <option value="no">No — manual only</option>
                          </select>
                        </Field>
                        <Field label="Slide Interval (ms)" hint="e.g. 3000 = 3 seconds">
                          <input className="admin-input" type="number" value={form.usageComparison?.interval||3000}
                            onChange={e=>set("usageComparison.interval",Number(e.target.value))} placeholder="3000"/>
                        </Field>
                      </div>
                      {(form.usageComparison?.pairs||[]).map((pair,i)=>(
                        <div key={i} className="admin-array-item">
                          <div className="admin-array-item-title">Pair {i+1}</div>
                          <div className="admin-grid-2">
                            <div>
                              <p className="admin-label" style={{marginBottom:8}}>BEFORE Image</p>
                              <ImageUpload value={pair.before} onChange={url=>set(`usageComparison.pairs.${i}.before`,url)} hint="Upload before image"/>
                            </div>
                            <div>
                              <p className="admin-label" style={{marginBottom:8}}>AFTER Image</p>
                              <ImageUpload value={pair.after} onChange={url=>set(`usageComparison.pairs.${i}.after`,url)} hint="Upload after image"/>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Top Story */}
                <div className="admin-form-card">
                  <div className="admin-form-card-title">📰 Top Story <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Displays before hero</span></div>
                  <Toggle label="Enable Top Story" checked={!!form.topStory?.enabled} onChange={v=>set("topStory.enabled",v)}/>
                  {form.topStory?.enabled&&(
                    <>
                      <Field label="Story Text" hint="Short attention-grabbing line displayed above the story image">
                        <textarea className="admin-textarea" rows={3} value={form.topStory?.text||""} onChange={e=>set("topStory.text",e.target.value)} placeholder="e.g. Thousands of Nigerians are already seeing results..."/>
                      </Field>
                      <div className="admin-form-card-title" style={{fontSize:13,marginBottom:12,marginTop:4}}>Story Image <span style={{fontWeight:400,color:"var(--a-muted)"}}>— Optional</span></div>
                      <ImageUpload value={form.topStory?.image||""} onChange={url=>set("topStory.image",url)} hint="Wide banner image shown below the story text"/>
                    </>
                  )}
                </div>

                {/* Customer Story */}
                <div className="admin-form-card">
                  <div className="admin-form-card-title">💬 Customer Story <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— After video section</span></div>
                  <Toggle label="Enable Customer Story" checked={!!form.customerStory?.enabled} onChange={v=>set("customerStory.enabled",v)}/>
                  {form.customerStory?.enabled&&(
                    <>
                      <Field label="Headline" hint="e.g. What one of our customers had to say">
                        <input className="admin-input" value={form.customerStory?.headline||""} onChange={e=>set("customerStory.headline",e.target.value)} placeholder="What one of our customers had to say"/>
                      </Field>
                      <Field label="Story Content" hint="Longer customer story — supports line breaks">
                        <textarea className="admin-textarea" rows={6} value={form.customerStory?.content||""} onChange={e=>set("customerStory.content",e.target.value)} placeholder="I had been struggling with my skin for years before I found this serum..."/>
                      </Field>
                      <div className="admin-form-card-title" style={{fontSize:13,marginBottom:12}}>Story Image <span style={{fontWeight:400,color:"var(--a-muted)"}}>— Optional</span></div>
                      <ImageUpload value={form.customerStory?.image||""} onChange={url=>set("customerStory.image",url)} hint="Customer photo, before/after, or supporting image"/>
                      <div className="admin-grid-2" style={{marginTop:16}}>
                        <Field label="CTA Button Text">
                          <input className="admin-input" value={form.customerStory?.ctaText||""} onChange={e=>set("customerStory.ctaText",e.target.value)} placeholder="Order Now"/>
                        </Field>
                        <Field label="CTA Action">
                          <select className="admin-select" value={form.customerStory?.ctaType||"whatsapp"} onChange={e=>set("customerStory.ctaType",e.target.value)}>
                            <option value="whatsapp">💬 WhatsApp Order</option>
                            <option value="form">📋 Scroll to Order Form</option>
                          </select>
                        </Field>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24,paddingTop:20,borderTop:"1px solid #334155"}}>
              <button className="btn-admin-ghost" onClick={()=>router.push("/admin/products")}>← Cancel</button>
              <button className="btn-admin-primary" onClick={save} disabled={saving} style={{padding:"12px 32px"}}>
                {saving?"Saving…":isEdit?"💾 Save Changes":"✅ Create Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast&&<div className={`admin-toast ${toast.type}`}>{toast.type==="success"?"✅":"❌"} {toast.msg}</div>}
    </div>
  );
}
