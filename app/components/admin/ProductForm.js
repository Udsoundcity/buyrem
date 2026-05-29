"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import ImageUpload from "@/app/components/admin/ImageUpload";
import VideoUpload from "@/app/components/admin/VideoUpload";

const EMPTY = {
  id:"",cat:"Beauty",name:"",tagline:"",price:"",originalPrice:"",
  badge:"",badgeColor:"#D4544A",bg:"#FAF5EE",thumbnail:"",description:"",
  purchases:0,rating:5.0,reviews:0,satisfaction:100,
  formLink:"",videoUrl:"",reviewScreenshots:[],
  problem:{title:"",body:""},
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

const TABS=["Basic Info","Images & Video","Sales Copy","Reviews & FAQ"];

function Field({label,required,hint,children}){
  return(
    <div className="admin-field">
      <label className="admin-label">{label}{required&&<span className="admin-req"> *</span>}</label>
      {children}
      {hint&&<p className="admin-input-hint">{hint}</p>}
    </div>
  );
}

function getVideoEmbedUrl(url){
  if(!url)return null;
  const yt=url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
  if(yt)return`https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const ys=url.match(/youtu\.be\/([^?\s]+)/);
  if(ys)return`https://www.youtube.com/embed/${ys[1]}?rel=0`;
  if(url.includes("youtube.com/embed/"))return url;
  const vm=url.match(/vimeo\.com\/(\d+)/);
  if(vm)return`https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

export default function ProductForm({initial=null,isEdit=false}){
  const router=useRouter();
  const [form,setForm]=useState(initial?{
    ...EMPTY,...initial,
    formLink:initial.formLink||"",
    videoUrl:initial.videoUrl||"",
    reviewScreenshots:initial.reviewScreenshots||[],
  }:EMPTY);
  const [tab,setTab]=useState(0);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);
  const [errors,setErrors]=useState({});

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  const set=(path,value)=>{
    setForm(prev=>{
      const next=structuredClone(prev);
      const keys=path.split(".");
      let obj=next;
      for(let i=0;i<keys.length-1;i++){const k=isNaN(keys[i])?keys[i]:Number(keys[i]);obj=obj[k];}
      const last=keys[keys.length-1];
      obj[isNaN(last)?last:Number(last)]=value;
      return next;
    });
  };

  const validate=()=>{
    const e={};
    if(!form.name.trim())e.name="Required";
    if(!form.price)e.price="Required";
    if(!form.originalPrice)e.originalPrice="Required";
    if(!form.thumbnail.trim())e.thumbnail="A thumbnail image is required";
    if(!form.description.trim())e.description="Required";
    return e;
  };

  const save=async()=>{
    const e=validate();
    if(Object.keys(e).length){setErrors(e);setTab(0);showToast("Please fill in all required fields.","error");return;}
    setSaving(true);
    const payload={
      ...form,
      price:Number(form.price),originalPrice:Number(form.originalPrice),
      purchases:Number(form.purchases)||0,rating:Number(form.rating)||5,
      reviews:Number(form.reviews)||0,satisfaction:Number(form.satisfaction)||100,
      reviewScreenshots:(form.reviewScreenshots||[]).filter(Boolean),
    };
    try{
      const res=await fetch(isEdit?`/api/products/${initial.id}`:"/api/products",{
        method:isEdit?"PUT":"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
      });
      const data=await res.json();
      setSaving(false);
      if(res.ok){showToast(isEdit?"Product updated!":"Product created!");setTimeout(()=>router.push("/admin/products"),1200);}
      else showToast(data.error||"Something went wrong.","error");
    }catch{setSaving(false);showToast("Network error. Please try again.","error");}
  };

  const addShot=()=>set("reviewScreenshots",[...(form.reviewScreenshots||[]),""]);
  const removeShot=(i)=>set("reviewScreenshots",(form.reviewScreenshots||[]).filter((_,idx)=>idx!==i));
  const updateShot=(i,url)=>{const u=[...(form.reviewScreenshots||[])];u[i]=url;set("reviewScreenshots",u);};

  return(
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

            {/* TAB 0 — Basic Info */}
            {tab===0&&(
              <>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">🏷️ Basic Information</div>
                  <Field label="Product Name" required>
                    <input className={`admin-input${errors.name?" error":""}`} value={form.name}
                      onChange={e=>{set("name",e.target.value);setErrors(p=>({...p,name:""}));}} placeholder="e.g. Vitamin C Glow Serum"/>
                    {errors.name&&<p style={{color:"#FCA5A5",fontSize:12,marginTop:4}}>{errors.name}</p>}
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
                    <Field label="Original Price (₦)" required hint="Must be higher than selling price">
                      <input className={`admin-input${errors.originalPrice?" error":""}`} type="number" value={form.originalPrice}
                        onChange={e=>{set("originalPrice",e.target.value);setErrors(p=>({...p,originalPrice:""}));}} placeholder="12000"/>
                    </Field>
                  </div>
                  <Field label="Tagline" hint="Short punchy line shown under the product name">
                    <input className="admin-input" value={form.tagline} onChange={e=>set("tagline",e.target.value)}
                      placeholder="Brighter skin in 7 days — or your money back."/>
                  </Field>
                  <Field label="Description" required>
                    <textarea className={`admin-textarea${errors.description?" error":""}`} value={form.description}
                      onChange={e=>{set("description",e.target.value);setErrors(p=>({...p,description:""}));}}
                      placeholder="Describe the product in 2–3 sentences..." rows={3}/>
                    {errors.description&&<p style={{color:"#FCA5A5",fontSize:12,marginTop:4}}>{errors.description}</p>}
                  </Field>
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">📸 Thumbnail Image</div>
                  <p className="admin-input-hint" style={{marginBottom:14}}>Shown on the homepage card and products listing.</p>
                  {errors.thumbnail&&<p style={{color:"#FCA5A5",fontSize:12,marginBottom:10}}>⚠️ {errors.thumbnail}</p>}
                  <ImageUpload value={form.thumbnail} onChange={url=>{set("thumbnail",url);setErrors(p=>({...p,thumbnail:""}));}}/>
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">📋 External Order Form <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Optional</span></div>
                  <Field label="Form Link URL" hint="If set, all Order Now buttons scroll to an embedded form. Leave empty to use the default WhatsApp order flow.">
                    <input className="admin-input" type="url" value={form.formLink} onChange={e=>set("formLink",e.target.value)}
                      placeholder="https://forms.google.com/... or https://typeform.com/..."/>
                  </Field>
                  {form.formLink&&(
                    <div style={{padding:"10px 14px",background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:8,fontSize:13,color:"#818CF8"}}>
                      ✓ Order buttons will scroll to the embedded form. WhatsApp modal is disabled for this product.
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

            {/* TAB 1 — Images & Video */}
            {tab===1&&(
              <>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">🖼️ Product Gallery</div>
                  <p className="admin-input-hint" style={{marginBottom:20}}>4 photos shown in the product detail gallery.</p>
                  {form.images.map((img,i)=>(
                    <div key={i} className="admin-array-item">
                      <div className="admin-array-item-title">Image {i+1}</div>
                      <div className="admin-grid-2">
                        <ImageUpload value={img.src} onChange={url=>set(`images.${i}.src`,url)}/>
                        <div style={{display:"flex",flexDirection:"column",gap:12}}>
                          <Field label="Alt Text" hint="Describes the image">
                            <input className="admin-input" value={img.alt}
                              onChange={e=>set(`images.${i}.alt`,e.target.value)} placeholder="e.g. Serum bottle front view"/>
                          </Field>
                          <Field label="Label" hint="Caption shown under thumbnail">
                            <input className="admin-input" value={img.label}
                              onChange={e=>set(`images.${i}.label`,e.target.value)} placeholder="e.g. Product Front"/>
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">🎬 Product Illustration Video <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)"}}>— Optional</span></div>
                  <p className="admin-input-hint" style={{marginBottom:14}}>
                    Upload a video from your device or paste a YouTube / Vimeo link.
                    If added, a "Product Illustration" section appears on the product page.
                  </p>
                  <VideoUpload
                    value={form.videoUrl}
                    onChange={url=>set("videoUrl",url)}
                    hint="MP4, WebM, MOV up to 200 MB — or paste a YouTube / Vimeo URL above"
                  />
                </div>
              </>
            )}

            {/* TAB 2 — Sales Copy */}
            {tab===2&&(
              <>
                <div className="admin-form-card">
                  <div className="admin-form-card-title">😔 Problem Statement</div>
                  <Field label="Problem Title">
                    <input className="admin-input" value={form.problem.title} onChange={e=>set("problem.title",e.target.value)} placeholder="Struggling with dull, uneven skin?"/>
                  </Field>
                  <Field label="Problem Description">
                    <textarea className="admin-textarea" value={form.problem.body} onChange={e=>set("problem.body",e.target.value)} rows={3} placeholder="Describe the pain point..."/>
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
                  <div className="admin-form-card-title">✓ Product Features (up to 6)</div>
                  <div className="admin-features-list">
                    {form.features.map((f,i)=>(
                      <div key={i} className="admin-feature-row">
                        <div className="admin-feature-num">{i+1}</div>
                        <input className="admin-input" value={f} onChange={e=>set(`features.${i}`,e.target.value)} placeholder={`Feature ${i+1}…`}/>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB 3 — Reviews & FAQ */}
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

                {/* Review Screenshots */}
                <div className="admin-form-card">
                  <div className="admin-form-card-title">
                    📸 Review Screenshots
                    <span style={{fontSize:12,fontWeight:400,color:"var(--a-muted)",marginLeft:8}}>— Optional</span>
                  </div>
                  <p className="admin-input-hint" style={{marginBottom:16}}>
                    Upload screenshots of customer reviews from WhatsApp, Instagram, etc. Only shown on the product page when at least one image is added.
                  </p>
                  {(form.reviewScreenshots||[]).map((src,i)=>(
                    <div key={i} className="admin-array-item" style={{marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div className="admin-array-item-title" style={{margin:0}}>Screenshot {i+1}</div>
                        <button onClick={()=>removeShot(i)}
                          style={{padding:"5px 12px",borderRadius:6,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#FCA5A5",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                          ✕ Remove
                        </button>
                      </div>
                      <ImageUpload value={src} onChange={url=>updateShot(i,url)} hint="Upload review screenshot or paste URL"/>
                    </div>
                  ))}
                  <button className="btn-admin-ghost" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={addShot}>
                    + Add Review Screenshot
                  </button>
                </div>

                <div className="admin-form-card">
                  <div className="admin-form-card-title">❓ Frequently Asked Questions (4)</div>
                  {form.faq.map((f,i)=>(
                    <div key={i} className="admin-array-item">
                      <div className="admin-array-item-title">Q&A {i+1}</div>
                      <Field label="Question"><input className="admin-input" value={f.q} onChange={e=>set(`faq.${i}.q`,e.target.value)} placeholder="e.g. How soon will I see results?"/></Field>
                      <Field label="Answer"><textarea className="admin-textarea" value={f.a} onChange={e=>set(`faq.${i}.a`,e.target.value)} rows={2} placeholder="Clear, concise answer."/></Field>
                    </div>
                  ))}
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
