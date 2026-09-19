'use client';
import {FormEvent,useEffect,useState,useMemo} from 'react';
import {Activity,Archive,BarChart3,Bell,Building2,Calendar,CalendarDays,CheckCircle2,ChevronLeft,CircleDollarSign,ClipboardCheck,Compass,CreditCard,ExternalLink,FileText,Globe2,Home,Lock,LogOut,MapPin,Menu,Navigation,Phone,Plus,Search,Settings,ShieldCheck,Smartphone,Store,User,UserCheck,Users,X} from 'lucide-react';
type Row=Record<string,any>;type Data=Record<string,any>;

const nav=[['dashboard','الرئيسية','Dashboard',Home],['customers','العملاء والأطباء','Customers',Store],['visits','التقارير اليومية','Daily reports',Activity],['collections','التحصيلات','Collections',CircleDollarSign],['invoices','الفواتير','Invoices',FileText],['plans','الخطط','Plans',CalendarDays],['leaves','الإجازات','Leave requests',Archive],['approvals','الموافقات','Approvals',ClipboardCheck],['reports','التقارير','Reports',BarChart3],['team','الفريق والمستخدمون','Team & users',Users],['settings','الإعدادات','Settings',Settings],['audit','سجل التدقيق','Audit log',ShieldCheck]] as const;

const tr:Record<string,[string,string]>={draft:['مسودة','Draft'],submitted:['مرسل','Submitted'],pending:['قيد الانتظار','Pending'],approved:['معتمد','Approved'],confirmed:['مؤكد','Confirmed'],rejected:['مرفوض','Rejected'],cancelled:['ملغي','Cancelled'],completed:['مكتمل','Completed'],active:['نشط','Active'],inactive:['غير نشط','Inactive'],suspended:['موقوف','Suspended'],prospect:['محتمل','Prospect']};

const typeTr:Record<string,[string,string]>={clinic:['عيادة بيطرية','Veterinary clinic'],pharmacy:['صيدلية بيطرية','Veterinary pharmacy'],poultry_farm:['مزرعة دواجن','Poultry farm'],farm:['مزرعة ماشية','Farm'],feed_mill:['مصنع أعلاف','Feed mill'],distributor:['موزع أدوية','Distributor']};

const money=(v:any,c='EGP',lang='ar')=>new Intl.NumberFormat(lang==='ar'?'ar-EG':'en-US',{style:'currency',currency:c,maximumFractionDigits:2}).format(Number(v||0));
const date=(v:any,lang='ar')=>v?new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{dateStyle:'medium'}).format(new Date(v)):'';

// Haversine formula to compute distance in KM
function calcDistance(lat1:number,lon1:number,lat2:number,lon2:number){
  const R=6371;
  const dLat=(lat2-lat1)*Math.PI/180;
  const dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return R*c;
}

async function request(url:string,opts?:RequestInit){
  const r=await fetch(url,opts);
  const j=await r.json().catch(()=>({}));
  if(r.status===401){location.href='/login';throw new Error('unauthorized')}
  if(!r.ok)throw new Error(j.error||'save_failed');
  return j;
}

function Status({value,lang}:{value:string;lang:string}){
  return <span className={'status '+value}>{tr[value]?.[lang==='ar'?0:1]||value}</span>;
}

function Empty({lang}:{lang:string}){
  return <div className="empty"><Archive/><b>{lang==='ar'?'لا توجد بيانات للعرض':'No data to display'}</b></div>;
}

export function Workspace(){
  const [data,setData]=useState<Data|null>(null),[page,setPage]=useState('dashboard'),[lang,setLang]=useState<'ar'|'en'>('ar'),[menu,setMenu]=useState(false),[modal,setModal]=useState<string|null>(null),[toast,setToast]=useState(''),[query,setQuery]=useState('');
  const ar=lang==='ar';

  const load=()=>request('/api/data').then(d=>{setData(d);setLang(d.actor.language==='en'?'en':'ar')}).catch(e=>setToast(e.message));
  useEffect(()=>{void load()},[]);

  const can=(p:string)=>data?.actor.permissions.includes(p);
  const allowedNav=useMemo(()=>{
    if(!data)return [];
    return nav.filter(([id])=>id!=='approvals'||['visits','collections','invoices','plans','leaves'].some(m=>can(m+'.approve'))).filter(([id])=>id!=='audit'||can('audit.view')).filter(([id])=>id!=='settings'||can('settings.manage')||can('areas.manage')||can('roles.manage')).filter(([id])=>id!=='team'||can('users.view'));
  },[data]);

  async function logout(){
    await request('/api/auth/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
    location.href='/login';
  }

  if(!data)return <div className="loader"><div className="brand-mark">F</div><span>{ar?'جارٍ تجهيز مساحة العمل...':'Preparing your workspace...'}</span></div>;

  const pageTitle=nav.find(n=>n[0]===page);
  return (
    <div className="shell" dir={ar?'rtl':'ltr'}>
      <aside className={menu?'sidebar open':'sidebar'}>
        <div className="sidebar-head">
          <div className="brand-mark">K</div>
          <div>
            <b>{data.companies[0]?.settings?.brand||'KENAVET'}</b>
            <small>{ar?'إدارة العمليات الميدانية والمندوبين':'Field operations & reps'}</small>
          </div>
          <button className="icon mobile-only" onClick={()=>setMenu(false)}><X/></button>
        </div>
        <nav>
          {allowedNav.map(([id,ara,en,Icon])=>(
            <button key={id} className={page===id?'active':''} onClick={()=>{setPage(id);setMenu(false)}}>
              <Icon/>
              <span>{ar?ara:en}</span>
              {id==='approvals'&&data.approval_requests.filter((r:Row)=>r.status==='pending').length>0&&<em>{data.approval_requests.filter((r:Row)=>r.status==='pending').length}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{data.actor.name.slice(0,1)}</div>
          <div>
            <b>{data.actor.name}</b>
            <small>{data.actor.email}</small>
          </div>
          <button className="icon" onClick={logout} title={ar?'تسجيل الخروج':'Sign out'}><LogOut/></button>
        </div>
        <div style={{textAlign:'center',fontSize:10,color:'var(--muted)',opacity:0.55,padding:'4px 0'}}>تطوير: محمد الحاوي © KENAVET</div>
      </aside>

      <main className="main">
        <header>
          <button className="icon mobile-only" onClick={()=>setMenu(true)}><Menu/></button>
          <div>
            <p>{ar?'مساحة العمل الميداني':'Field Workspace'}</p>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <h1>{pageTitle?.[ar?1:2]}</h1>
              <span className="app-platform-tag"><Smartphone style={{width:14,height:14}}/> Android & iOS PWA</span>
            </div>
          </div>
          <div className="header-actions">
            <div className="search">
              <Search/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={ar?'بحث سريع...':'Quick search...'}/>
            </div>
            <button className="icon" onClick={()=>setPage('notifications')} title={ar?'الإشعارات':'Notifications'}>
              <Bell/>
              {data.notifications.some((n:Row)=>!n.read_at)&&<i/>}
            </button>
            <button className="lang" onClick={()=>setLang(ar?'en':'ar')}><Globe2/>{ar?'EN':'ع'}</button>
          </div>
        </header>

        <section className="content">
          {page==='dashboard'&&<Dashboard d={data} lang={lang} setPage={setPage} open={setModal}/>}
          {page==='customers'&&<Customers d={data} lang={lang} q={query} open={setModal}/>}
          {['visits','collections','invoices','plans','leaves'].includes(page)&&<ModulePage module={page} d={data} lang={lang} q={query} open={setModal}/>}
          {page==='approvals'&&<Approvals d={data} lang={lang} done={load} toast={setToast}/>}
          {page==='reports'&&<Reports d={data} lang={lang}/>}
          {page==='team'&&<Team d={data} lang={lang} open={setModal}/>}
          {page==='settings'&&<SettingsPage d={data} lang={lang} open={setModal}/>}
          {page==='audit'&&<Audit d={data} lang={lang}/>}
          {page==='notifications'&&<Notifications d={data} lang={lang} done={load}/>}
        </section>

        <MobileNav page={page} setPage={setPage} open={setModal} lang={lang}/>
      </main>

      {modal&&modal.startsWith('profile:')&&(
        <CustomerProfileModal id={modal.split(':')[1]} d={data} lang={lang} close={()=>setModal(null)} open={setModal}/>
      )}

      {modal&&!modal.startsWith('profile:')&&(
        <CreateModal type={modal} d={data} lang={lang} close={()=>setModal(null)} done={()=>{setModal(null);setToast(ar?'تم الحفظ بنجاح':'Saved successfully');load()}}/>
      )}

      {toast&&<div className="toast" onClick={()=>setToast('')}>{toast}<X/></div>}
    </div>
  );
}

function Dashboard({d,lang,setPage,open}:{d:Data;lang:string;setPage:(p:string)=>void;open:(p:string)=>void}){
  const ar=lang==='ar',m=d.metrics,manager=d.actor.permissions.includes('dashboard.management');
  const cards=manager?[
    [ar?'إجمالي العملاء المصرح بهم':'Total customers',m.customers,'customers'],
    [ar?'زيارات اليوم':'Visits today',m.visits?.today||0,'visits'],
    [ar?'تحصيل الشهر':'Monthly collection',money(m.collections?.total,d.companies[0].settings.currency,lang),'collections'],
    [ar?'قيمة الفواتير':'Invoice value',money(m.invoices?.total,d.companies[0].settings.currency,lang),'invoices']
  ]:[
    [ar?'عملاء منطقتك':'Your customers',d.customers.length,'customers'],
    [ar?'زيارات اليوم':'Visits today',m.visits?.today||0,'visits'],
    [ar?'تحصيل اليوم':'Collection today',money(d.collections.filter((x:Row)=>String(x.date).slice(0,10)===new Date().toISOString().slice(0,10)).reduce((s:number,x:Row)=>s+Number(x.amount),0),'EGP',lang),'collections'],
    [ar?'الفواتير المدخلة':'Entered invoices',m.invoices?.today||0,'invoices']
  ];

  return (
    <>
      <div className="hero">
        <div>
          <p>{ar?'مرحباً،':'Welcome,'}</p>
          <h2>{d.actor.name}</h2>
          <span>{new Intl.DateTimeFormat(ar?'ar-EG':'en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(new Date())}</span>
        </div>
        <div className="hero-orb"><Activity/></div>
      </div>

      <div className="kpis">
        {cards.map(([title,value,id],i)=>(
          <button className={'kpi k'+i} key={String(title)} onClick={()=>setPage(String(id))}>
            <span>{title}</span>
            <strong>{value}</strong>
            <small>{ar?'عرض التفاصيل':'View details'} <ChevronLeft/></small>
          </button>
        ))}
      </div>

      <div className="quick">
        <div className="section-title">
          <div>
            <span>{ar?'وصول سريع للعمليات الميدانية':'Quick Field Operations'}</span>
            <h3>{ar?'ابدأ مهمة جديدة':'Start a new task'}</h3>
          </div>
        </div>
        <div className="quick-grid">
          {[
            ['visits',ar?'تسجيل تقرير زيارة':'New daily report',Activity],
            ['collections',ar?'تسجيل تحصيل':'New collection',CircleDollarSign],
            ['invoices',ar?'إدخال فاتورة':'Invoice entry',FileText],
            ['leaves',ar?'طلب إجازة برصيد':'Leave request',Archive],
            ['plans',ar?'إنشاء خطة عمل':'New work plan',CalendarDays]
          ].map(([id,label,Icon]:any)=>(
            <button key={id} onClick={()=>open(id)}>
              <span><Icon/></span>{label}<Plus/>
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <Panel title={ar?'التقارير والزيارات الأخيرة':'Recent visits & reports'} action={()=>setPage('visits')} lang={lang}>
          {d.visits.slice(0,5).map((x:Row)=>(
            <div className="activity-row" key={x.id} style={{cursor:'pointer'}} onClick={()=>open('profile:'+x.customer_id)}>
              <div className="dot"><Activity/></div>
              <div>
                <b>{x.customer_name}</b>
                <small>{x.purpose||x.visit_type} · {date(x.date,lang)}</small>
              </div>
              <Status value={x.status} lang={lang}/>
            </div>
          ))}
          {!d.visits.length&&<p style={{color:'var(--muted)',margin:10}}>{ar?'لا توجد زيارات مسجلة حديثاً':'No recent visits'}</p>}
        </Panel>

        <Panel title={ar?'التنبيهات والموافقات':'Alerts & approvals'} lang={lang}>
          {m.activity.filter((x:Row)=>x.days>=d.companies[0].settings.activityDays).slice(0,3).map((x:Row)=>(
            <div className="alert-row" key={x.id} style={{cursor:'pointer'}} onClick={()=>open('profile:'+x.id)}>
              <span>!</span>
              <div>
                <b>{x.name}</b>
                <small>{ar?`لم تتم زيارته منذ ${x.days} يوماً`:`Not visited for ${x.days} days`}</small>
              </div>
            </div>
          ))}
          <div className="alert-row" style={{cursor:'pointer'}} onClick={()=>setPage('approvals')}>
            <span>⌛</span>
            <div>
              <b>{d.approval_requests.filter((x:Row)=>x.status==='pending').length} {ar?'طلبات بانتظار الاعتماد':'approvals pending'}</b>
              <small>{ar?'راجع مركز الموافقات للاطلاع والقرار':'Review approval center'}</small>
            </div>
          </div>
        </Panel>
      </div>

      {m.trend.length>0&&<Trend rows={m.trend} lang={lang}/>}
    </>
  );
}

function Panel({title,children,action,lang}:{title:string;children:React.ReactNode;action?:()=>void;lang:string}){
  return <div className="panel"><div className="panel-head"><h3>{title}</h3>{action&&<button className="link" onClick={action}>{lang==='ar'?'عرض الكل':'View all'}</button>}</div>{children}</div>;
}

function Trend({rows,lang}:{rows:Row[];lang:string}){
  const max=Math.max(...rows.map(x=>x.visits),1);
  return (
    <Panel title={lang==='ar'?'معدل الزيارات اليومية خلال 14 يوماً':'Visits trend — 14 days'} lang={lang}>
      <div className="bars">
        {rows.map(r=>(
          <div key={r.date} title={`${r.date}: ${r.visits}`}>
            <span style={{height:`${Math.max(8,r.visits/max*100)}%`}}/>
            <small>{String(r.date).slice(5)}</small>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Customers({d,lang,q,open}:{d:Data;lang:string;q:string;open:(x:string)=>void}){
  const ar=lang==='ar';
  const [selRegion,setSelRegion]=useState('');
  const [selArea,setSelArea]=useState('');
  const [nearMe,setNearMe]=useState(false);
  const [userCoords,setUserCoords]=useState<{lat:number;lng:number}|null>(null);

  // Available areas for selected region
  const availableAreas=useMemo(()=>{
    if(!selRegion)return d.areas;
    return d.areas.filter((a:Row)=>a.region_id===selRegion);
  },[d.areas,selRegion]);

  function findNearMe(){
    if(!navigator.geolocation){alert(ar?'تحديد الموقع الجغرافي غير مدعوم في متصفحك':'Geolocation not supported');return;}
    navigator.geolocation.getCurrentPosition(pos=>{
      setUserCoords({lat:pos.coords.latitude,lng:pos.coords.longitude});
      setNearMe(true);
    },()=>alert(ar?'يرجى السماح بالوصول إلى الموقع الجغرافي GPS':'Please allow GPS location access'));
  }

  let rows=d.customers.filter((x:Row)=>{
    const matchText=[x.name,x.name_en,x.code,x.phone,x.area_name,x.region_name,x.contact_person,x.city,x.address].join(' ').toLowerCase().includes(q.toLowerCase());
    const matchReg=!selRegion||x.region_id===selRegion;
    const matchArea=!selArea||x.area_id===selArea;
    return matchText&&matchReg&&matchArea;
  });

  if(nearMe&&userCoords){
    rows=rows.map((c:Row)=>{
      if(c.latitude&&c.longitude){
        const dist=calcDistance(userCoords.lat,userCoords.lng,Number(c.latitude),Number(c.longitude));
        return {...c,_dist:dist};
      }
      return {...c,_dist:99999};
    }).sort((a:Row,b:Row)=>(a._dist||99999)-(b._dist||99999));
  }

  return (
    <>
      <PageBar 
        title={ar?'تكويد وبيانات العملاء والأطباء':'Customers & Doctors Directory'} 
        sub={ar?`${rows.length} عميلاً متاحاً وفق تصفيتك وصلاحياتك الجغرافية`:`${rows.length} accessible customers`} 
        action={d.actor.permissions.includes('customers.create')?()=>open('customers'):undefined} 
        label={ar?'تكويد عميل جديد':'New customer'}
      />

      <div className="filter-bar">
        <select value={selRegion} onChange={e=>{setSelRegion(e.target.value);setSelArea('')}}>
          <option value="">{ar?'— تصفية بكل المحافظات —':'All governorates'}</option>
          {d.regions.map((r:Row)=><option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <select value={selArea} onChange={e=>setSelArea(e.target.value)}>
          <option value="">{ar?'— تصفية بالمدينة / المركز —':'All cities/centers'}</option>
          {availableAreas.map((a:Row)=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <button className={`gps-btn ${nearMe?'gps-active':''}`} onClick={findNearMe}>
          <Compass style={{width:16,height:16}}/>
          {nearMe?(ar?'✅ تم ترتيب الأقرب لموقعي GPS':'Arranged by proximity'):(ar?'📍 إظهار العملاء الأقرب لموقعي الحالي':'Show nearest customers (GPS)')}
        </button>

        {nearMe&&<button className="link" onClick={()=>{setNearMe(false);setUserCoords(null)}}>{ar?'إلغاء الترتيب':'Reset'}</button>}
      </div>

      <div className="cards-list">
        {rows.map((x:Row)=>(
          <article className="customer-card" key={x.id}>
            <div className="customer-avatar" style={{cursor:'pointer'}} onClick={()=>open('profile:'+x.id)}>{x.name.slice(0,1)}</div>
            <div className="customer-main" style={{cursor:'pointer'}} onClick={()=>open('profile:'+x.id)}>
              <div>
                <b>{x.name}</b>
                <code>{x.code}</code>
                {x._dist!==undefined&&x._dist<9000&&(
                  <span className="distance-badge">
                    <MapPin style={{width:12,height:12}}/>
                    {x._dist<1?`${Math.round(x._dist*1000)} م`:`${x._dist.toFixed(1)} كم`}
                  </span>
                )}
              </div>
              <p>
                {typeTr[x.type]?.[ar?0:1]||x.type} · 📍 {x.region_name?`${x.region_name} - `:''}{x.area_name}
                {x.contact_person&&<span> · 👨‍⚕️ {x.contact_person}</span>}
              </p>
              <span>📞 {x.phone} {x.representative_name?`· 👤 ${x.representative_name}`:''}</span>
            </div>
            <div className="customer-meta">
              <Status value={x.status} lang={lang}/>
              <span className="class">{x.classification}</span>
            </div>
            <div className="card-actions">
              <button onClick={()=>open('profile:'+x.id)}><User/>{ar?'البروفايل':'Profile'}</button>
              <button onClick={()=>open('visits:'+x.id)}><Activity/>{ar?'تقرير زيارة':'Visit'}</button>
              <button onClick={()=>open('collections:'+x.id)}><CircleDollarSign/>{ar?'تحصيل':'Collection'}</button>
              <button onClick={()=>open('invoices:'+x.id)}><FileText/>{ar?'فاتورة':'Invoice'}</button>
              {(x.latitude&&x.longitude)||(x.details?.maps_link)?(
                <a 
                  className="maps-link-btn" 
                  href={x.details?.maps_link||`https://www.google.com/maps/search/?api=1&query=${x.latitude},${x.longitude}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={e=>e.stopPropagation()}
                >
                  <Navigation style={{width:13,height:13}}/>{ar?'اللوكيشن':'Maps'}
                </a>
              ):null}
            </div>
          </article>
        ))}
      </div>
      {!rows.length&&<Empty lang={lang}/>}
    </>
  );
}

function PageBar({title,sub,action,label}:{title:string;sub:string;action?:()=>void;label?:string}){
  return (
    <div className="pagebar">
      <div><h2>{title}</h2><p>{sub}</p></div>
      {action&&<button className="primary" onClick={action}><Plus/>{label}</button>}
    </div>
  );
}

function ModulePage({module,d,lang,q,open}:{module:string;d:Data;lang:string;q:string;open:(x:string)=>void}){
  const ar=lang==='ar';
  const [planFilter,setPlanFilter]=useState<string>('all');

  const label:{[x:string]:string}={
    visits:ar?'التقارير اليومية والزيارات الميدانية':'Daily reports & visits',
    collections:ar?'سجل التحصيلات المالية':'Collections',
    invoices:ar?'إدخالات الفواتير':'Invoice entries',
    plans:ar?'خطط العمل':'Work plans',
    leaves:ar?'طلبات الإجازة والأرصدة':'Leave requests & balances'
  };

  const isRep=d.actor.permissions.includes('customers.view_area_only')&&!d.actor.permissions.includes('invoices.view_customer_history')&&!d.actor.permissions.includes('dashboard.management');

  let rows=(d[module]||[]).filter((x:Row)=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));
  if(module==='plans'&&planFilter!=='all'){
    rows=rows.filter((x:Row)=>x.plan_type===planFilter);
  }

  // Current user's leave balances
  const myBalances=useMemo(()=>{
    if(module!=='leaves')return [];
    return d.leave_types.map((lt:Row)=>{
      const bal=d.leave_balances.find((b:Row)=>b.user_id===d.actor.id&&b.leave_type_id===lt.id);
      const opening=Number(bal?.opening||0);
      const used=Number(bal?.used||0);
      return {
        id:lt.id,
        name:lt.name,
        opening,
        used,
        remaining:Math.max(0,opening-used)
      };
    });
  },[module,d]);

  return (
    <>
      <PageBar 
        title={label[module]} 
        sub={ar?`${rows.length} سجلاً متاحاً وفق صلاحياتك`:`${rows.length} accessible records`} 
        action={d.actor.permissions.includes(module+'.create')?()=>open(module):undefined} 
        label={module==='visits'?(ar?'تسجيل تقرير يومي':'New daily report'):module==='collections'?(ar?'تسجيل تحصيل جديد':'New collection'):module==='invoices'?(ar?'إدخال فاتورة جديدة':'New invoice entry'):module==='leaves'?(ar?'تقديم طلب إجازة':'New leave request'):(ar?'إنشاء خطة جديدة':'New plan')}
      />

      {/* Leave Balance Cards Widget */}
      {module==='leaves'&&myBalances.length>0&&(
        <div className="leave-balances">
          {myBalances.map((b:any)=>(
            <div className="balance-card" key={b.id}>
              <h4>{b.name}</h4>
              <div className="balance-numbers">
                <span className="remaining">{b.remaining} {ar?'أيام متبقية':'days left'}</span>
              </div>
              <span className="sub-nums">{ar?`الرصيد الكلي: ${b.opening} · المستهلك: ${b.used}`:`Total: ${b.opening} · Used: ${b.used}`}</span>
            </div>
          ))}
        </div>
      )}

      {/* Plan Type Tabs */}
      {module==='plans'&&(
        <div className="plan-tabs">
          {[
            ['all',ar?'جميع الخطط':'All plans'],
            ['weekly',ar?'خطط أسبوعية (Weekly)':'Weekly plans'],
            ['monthly',ar?'خطط شهرية (Monthly)':'Monthly plans'],
            ['annual',ar?'خطط سنوية (Annual)':'Annual plans']
          ].map(([val,title])=>(
            <button key={val} className={`plan-tab ${planFilter===val?'active':''}`} onClick={()=>setPlanFilter(val)}>
              {title}
            </button>
          ))}
        </div>
      )}

      {/* Invoices Permission Notice for Representatives */}
      {module==='invoices'&&isRep&&(
        <div className="perm-alert">
          <Lock/>
          <div>
            <b>{ar?'صلاحية الاطلاع على سجل فواتير ومشتريات العملاء:':'Customer purchase history permission:'}</b>
            <p style={{margin:'2px 0 0',opacity:.9}}>
              {ar?'الاطلاع على السجل التاريخي لفواتير ومشتريات العملاء يتطلب اعتماد الإدارة أو مدير المنطقة. يمكنك إدخال الفواتير الجديدة مباشرة بواسطة زر "إدخال فاتورة جديدة" أعلاه.':'Viewing historical customer purchase history requires manager or finance approval. You have permission for direct Invoice Entry above.'}
            </p>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{ar?'المرجع':'Reference'}</th>
              <th>{ar?'العميل / العنوان':'Customer / title'}</th>
              <th>{ar?'المندوب / المسؤول':'Representative'}</th>
              <th>{ar?'التاريخ':'Date'}</th>
              {module==='visits'&&<th>{ar?'تأكيد GPS / الوصول':'GPS & Arrival'}</th>}
              {module==='plans'&&<th>{ar?'نوع الخطة':'Plan type'}</th>}
              {['collections','invoices'].includes(module)&&<th>{ar?'القيمة':'Amount'}</th>}
              {module==='collections'&&<th>{ar?'طريقة الدفع':'Payment'}</th>}
              <th>{ar?'الحالة':'Status'}</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {rows.map((x:Row)=>(
              <tr key={x.id}>
                <td><code>{String(x.reference||x.client_transaction_id||x.id).slice(0,16)}</code></td>
                <td>
                  <b 
                    style={{cursor:x.customer_id?'pointer':'default',color:x.customer_id?'var(--brand)':'inherit'}} 
                    onClick={()=>x.customer_id&&open('profile:'+x.customer_id)}
                  >
                    {x.customer_name||x.title||x.notes||'—'}
                  </b>
                  <small>{x.region_name?`${x.region_name} - `:''}{x.area_name}</small>
                </td>
                <td>{x.representative_name}</td>
                <td>{date(x.date,lang)}</td>
                {module==='visits'&&(
                  <td>
                    {x.latitude&&x.longitude?(
                      <span className="distance-badge" title={`Lat: ${x.latitude}, Lng: ${x.longitude}`}>
                        <MapPin style={{width:12,height:12}}/> {ar?'موثق بالـ GPS':'GPS Verified'}
                      </span>
                    ):(
                      <small style={{color:'var(--muted)'}}>—</small>
                    )}
                  </td>
                )}
                {module==='plans'&&<td><span className="status active">{x.plan_type==='weekly'?(ar?'أسبوعية':'Weekly'):x.plan_type==='monthly'?(ar?'شهرية':'Monthly'):(ar?'سنوية':'Annual')}</span></td>}
                {['collections','invoices'].includes(module)&&<td><b className="money">{money(x.amount,x.currency,lang)}</b></td>}
                {module==='collections'&&<td><small>{x.payment_method==='cash'?(ar?'نقدي (كاش)':'Cash'):x.payment_method==='cheque'?(ar?'شيك بنكي':'Cheque'):x.payment_method==='instapay'?'InstaPay':x.payment_method==='bank_transfer'?(ar?'تحويل بنكي':'Bank transfer'):x.payment_method}</small></td>}
                <td><Status value={x.status} lang={lang}/></td>
                <td>
                  {x.status==='draft'&& (
                    <button className="tiny" onClick={async()=>{await request(`/api/${module}/${x.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'submit'})});location.reload()}}>
                      {ar?'إرسال للاعتماد':'Submit'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length&&<Empty lang={lang}/>}
      </div>
    </>
  );
}

function Approvals({d,lang,done,toast}:{d:Data;lang:string;done:()=>void;toast:(x:string)=>void}){
  const ar=lang==='ar',actions=new Set(d.approval_actions.map((x:Row)=>x.request_id)),rows=d.approval_requests.filter((x:Row)=>x.status==='pending'&&!actions.has(x.id));
  
  async function decide(id:string,decision:string){
    const comment=prompt(ar?'أضف تعليقاً على القرار (اختياري)':'Optional decision comment')||'';
    try{
      await request('/api/approvals/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({decision,comment})});
      toast(ar?'تم اعتماد القرار وتحديث السجل':'Decision saved and record updated');
      done();
    }catch(e){
      toast(e instanceof Error?e.message:'save_failed');
    }
  }

  const moduleNames:Record<string,[string,string]>={
    visits:['تقرير زيارة يومية','Daily report'],
    collections:['عملية تحصيل مالي','Collection payment'],
    invoices:['فاتورة مشتريات عميل','Invoice entry'],
    plans:['خطة عمل ميدانية','Work plan'],
    leaves:['طلب إجازة برصيد (للمدير)','Leave request']
  };

  return (
    <>
      <PageBar title={ar?'مركز الموافقات والاعتمادات':'Approval Center'} sub={ar?`${rows.length} طلبات تحتاج قرارك واعتمادك`:`${rows.length} pending approvals require your action`}/>
      <div className="approval-grid">
        {rows.map((x:Row)=>(
          <article className="approval" key={x.id}>
            <div>
              <span className="type">{moduleNames[x.module]?.[ar?0:1]||x.module}</span>
              <Status value={x.status} lang={lang}/>
            </div>
            <h3>{ar?'طلب اعتماد جديد':'Pending approval request'}</h3>
            <p>{ar?'تاريخ التقديم':'Submitted'}: {date(x.created_at,lang)}</p>
            <small style={{display:'block',margin:'6px 0'}}><b>{ar?'رقم العملية':'Reference'}:</b> {String(x.entity_id).slice(0,18)}</small>
            <div>
              <button className="success" onClick={()=>decide(x.id,'approved')}><CheckCircle2/>{ar?'اعتماد وموافقة':'Approve'}</button>
              <button className="danger" onClick={()=>decide(x.id,'rejected')}><X/>{ar?'رفض الطلب':'Reject'}</button>
            </div>
          </article>
        ))}
      </div>
      {!rows.length&&<Empty lang={lang}/>}
    </>
  );
}

function Reports({d,lang}:{d:Data;lang:string}){
  const ar=lang==='ar',[viewMode,setViewMode]=useState<'standard'|'reps_doctors'>('reps_doctors');
  const [module,setModule]=useState('visits');

  // Detailed Reps & Doctors Coverage Report data calculation
  const repsReport=useMemo(()=>{
    const reps=d.users.filter((u:Row)=>u.active);
    return reps.map((rep:Row)=>{
      const assignedAreas=d.user_areas.filter((ua:Row)=>ua.user_id===rep.id);
      const repCustomers=d.customers.filter((c:Row)=>c.representative_id===rep.id);
      const repVisits=d.visits.filter((v:Row)=>v.representative_id===rep.id);
      const repCollections=d.collections.filter((c:Row)=>c.representative_id===rep.id);
      const repInvoices=d.invoices.filter((i:Row)=>i.representative_id===rep.id);

      const clinics=repCustomers.filter((c:Row)=>c.type==='clinic').length;
      const farms=repCustomers.filter((c:Row)=>['poultry_farm','farm'].includes(c.type)).length;
      const pharmacies=repCustomers.filter((c:Row)=>['pharmacy','feed_mill','distributor'].includes(c.type)).length;
      const totalCollected=repCollections.reduce((s:number,c:Row)=>s+Number(c.amount||0),0);
      const supervisor=d.users.find((u:Row)=>u.id===rep.supervisor_id);

      return {
        id:rep.id,
        name:rep.name,
        code:rep.employee_code||'—',
        areasCount:assignedAreas.length,
        areasNames:assignedAreas.map((a:Row)=>a.area_name).filter(Boolean).slice(0,4).join('، ')+(assignedAreas.length>4?'...':''),
        regionsNames:Array.from(new Set(assignedAreas.map((a:Row)=>a.region_name).filter(Boolean))).join('، ')||'—',
        supervisorName:supervisor?.name||(ar?'مدير عام الشركة':'General Manager'),
        clinics,
        farms,
        pharmacies,
        totalCustomers:repCustomers.length,
        totalVisits:repVisits.length,
        totalCollected,
        totalInvoices:repInvoices.length,
        lastVisit:repVisits[0]?.date
      };
    });
  },[d,ar]);

  return (
    <>
      <PageBar 
        title={ar?'مركز التقارير والرقابة الميدانية':'Reporting & Analytics Center'} 
        sub={ar?'تقارير تفصيلية لتغطية المناديب والدكاترة والمزارع مع إمكانية التصدير':'Detailed coverage reports for representatives and doctors'}
      />

      <div className="plan-tabs" style={{marginBottom:15}}>
        <button className={`plan-tab ${viewMode==='reps_doctors'?'active':''}`} onClick={()=>setViewMode('reps_doctors')}>
          <Users style={{width:14,height:14,display:'inline',marginInlineEnd:5}}/>
          {ar?'تقرير تغطية المناديب والدكاترة والمزارع':'Reps & Doctors Coverage Report'}
        </button>
        <button className={`plan-tab ${viewMode==='standard'?'active':''}`} onClick={()=>setViewMode('standard')}>
          <BarChart3 style={{width:14,height:14,display:'inline',marginInlineEnd:5}}/>
          {ar?'تصدير البيانات والجداول (Excel / CSV)':'Export Data (Excel/CSV)'}
        </button>
      </div>

      {viewMode==='reps_doctors'&&(
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{ar?'المندوب':'Representative'}</th>
                <th>{ar?'المحافظات والمدن المسندة':'Assigned Territories'}</th>
                <th>{ar?'المشرف / المدير المباشر':'Supervisor'}</th>
                <th>{ar?'العيادات (دكاترة)':'Doctors/Clinics'}</th>
                <th>{ar?'المزارع':'Farms'}</th>
                <th>{ar?'الصيدليات والموزعون':'Pharmacies'}</th>
                <th>{ar?'إجمالي العملاء':'Total Clients'}</th>
                <th>{ar?'الزيارات المنفذة':'Visits Done'}</th>
                <th>{ar?'إجمالي التحصيل':'Total Collected'}</th>
                <th>{ar?'الفواتير المدخلة':'Invoices'}</th>
              </tr>
            </thead>
            <tbody>
              {repsReport.map((r:any)=>(
                <tr key={r.id}>
                  <td>
                    <b>{r.name}</b>
                    <code>{r.code}</code>
                  </td>
                  <td>
                    <b>{r.regionsNames}</b>
                    <small>{r.areasNames||ar?'لم تحدد مناطق بعد':'No areas assigned'}</small>
                  </td>
                  <td>{r.supervisorName}</td>
                  <td><b style={{color:'var(--brand)'}}>{r.clinics}</b> {ar?'طبيب/عيادة':'clinic'}</td>
                  <td><b>{r.farms}</b> {ar?'مزرعة':'farm'}</td>
                  <td>{r.pharmacies}</td>
                  <td><b>{r.totalCustomers}</b></td>
                  <td><b>{r.totalVisits}</b> {ar?'زيارة':'visits'}</td>
                  <td><b className="money">{money(r.totalCollected,'EGP',lang)}</b></td>
                  <td>{r.totalInvoices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode==='standard'&&(
        <>
          <div className="filters">
            <select value={module} onChange={e=>setModule(e.target.value)}>
              <option value="visits">{ar?'التقارير والزيارات اليومية':'Visits & daily reports'}</option>
              <option value="collections">{ar?'التحصيلات النقدية والبنكية':'Collections'}</option>
              <option value="invoices">{ar?'الفواتير':'Invoices'}</option>
              <option value="plans">{ar?'خطط العمل':'Work plans'}</option>
              <option value="leaves">{ar?'الإجازات والأرصدة':'Leaves'}</option>
              <option value="customers">{ar?'بيانات العملاء':'Customers'}</option>
            </select>
            <input type="date" id="from" title={ar?'من تاريخ':'From date'}/>
            <input type="date" id="to" title={ar?'إلى تاريخ':'To date'}/>
            <button className="primary" onClick={()=>{const from=(document.querySelector('#from') as HTMLInputElement).value,to=(document.querySelector('#to') as HTMLInputElement).value;open(`/api/export?module=${module}&format=xlsx&from=${from}&to=${to}`)}}>{ar?'تصدير Excel':'Export Excel'}</button>
            <button onClick={()=>open(`/api/export?module=${module}&format=csv`)}>{ar?'تصدير CSV':'Export CSV'}</button>
            <button onClick={()=>window.print()}>{ar?'طباعة / PDF':'Print / PDF'}</button>
          </div>
          <div className="grid-2">
            <Panel title={ar?'متابعة نشاط وخمول العملاء':'Customer activity & inactivity'} lang={lang}>
              {d.metrics.activity.slice(0,8).map((x:Row)=>(
                <div className="rank" key={x.id}>
                  <b>{x.name}</b>
                  <span>{x.days} {ar?'يوم منذ آخر زيارة':'days since last visit'}</span>
                </div>
              ))}
            </Panel>
            <Panel title={ar?'الإنجاز الفعلي مقابل خطة العمل':'Plan vs actual performance'} lang={lang}>
              {d.metrics.performance.slice(0,8).map((x:Row)=>(
                <div className="progress-row" key={x.id}>
                  <div>
                    <b>{x.title}</b>
                    <span>{x.actual_visits} / {x.visit_target} {ar?'زيارة':'visits'}</span>
                  </div>
                  <progress value={x.actual_visits} max={Math.max(x.visit_target,1)}/>
                </div>
              ))}
            </Panel>
          </div>
        </>
      )}
    </>
  );
}

function Team({d,lang,open}:{d:Data;lang:string;open:(x:string)=>void}){
  const ar=lang==='ar';
  return (
    <>
      <PageBar title={ar?'فريق العمل والمندوبون':'Team & Sales Reps'} sub={ar?`${d.users.length} مستخدماً مسجلين بالسيستم`:`${d.users.length} users registered`} action={d.actor.permissions.includes('users.create')?()=>open('users'):undefined} label={ar?'تكويد موظف / مندوب جديد':'New employee'}/>
      <div className="team-grid">
        {d.users.map((u:Row)=>(
          <article key={u.id}>
            <div className="avatar">{u.name.slice(0,1)}</div>
            <b>{u.name}</b>
            <span>{u.employee_code}</span>
            <small>{u.email}</small>
            <Status value={u.active?'active':'inactive'} lang={lang}/>
          </article>
        ))}
      </div>
    </>
  );
}

function SettingsPage({d,lang,open}:{d:Data;lang:string;open:(x:string)=>void}){
  const ar=lang==='ar';
  return (
    <>
      <PageBar title={ar?'إعدادات النظام والهيكل':'System Settings & Hierarchy'} sub={ar?'إدارة الفروع والمناطق والصلاحيات ومسارات الاعتماد':'Manage regions, areas, roles, workflows and balances'}/>
      <div className="settings-grid">
        {[
          ['settings',Settings,ar?'ملف الشركة والنظام':'Company Profile',d.companies[0].name],
          ['areas',Store,ar?'محافظات ومراكز مصر':'Egypt Governorates & Cities',`${d.regions.length} محافظة / ${d.areas.length} مركز ومدينة`],
          ['roles',ShieldCheck,ar?'الأدوار والصلاحيات':'Roles & Permissions',`${d.roles.length} أدوار معرفة`],
          ['workflow',ClipboardCheck,ar?'مسارات الاعتمادات':'Approval Workflows',`${d.approval_workflows.length} مسار معتمد`],
          ['balance',CalendarDays,ar?'أرصدة الإجازات السنوية':'Leave Balances',`${d.leave_balances.length} رصيد موظف`]
        ].map(([id,Icon,title,sub]:any)=>(
          <button key={id} onClick={()=>open(id)}>
            <Icon/>
            <div><b>{title}</b><span>{sub}</span></div>
            <ChevronLeft/>
          </button>
        ))}
      </div>
    </>
  );
}

function Audit({d,lang}:{d:Data;lang:string}){
  const ar=lang==='ar';
  return (
    <>
      <PageBar title={ar?'سجل التدقيق الأمني':'Security Audit Log'} sub={ar?'سجل غير قابل للتعديل لكافة العمليات والتحصيلات الحساسة':'Immutable history of critical transactions and edits'}/>
      <div className="timeline">
        {d.audit_logs.map((x:Row)=>(
          <div key={x.id}>
            <i/>
            <div>
              <b>{x.action}</b>
              <p>{x.user_name||'System'} · {x.entity} {x.entity_id&&'· '+String(x.entity_id).slice(0,8)}</p>
              <small>{date(x.created_at,lang)}</small>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Notifications({d,lang,done}:{d:Data;lang:string;done:()=>void}){
  const ar=lang==='ar';
  return (
    <>
      <PageBar title={ar?'مركز الإشعارات':'Notifications'} sub={ar?'آخر التنبيهات واعتمادات الطلبات':'Latest alerts and approval notices'}/>
      <div className="notifications">
        {d.notifications.map((x:Row)=>(
          <button className={x.read_at?'':'unread'} key={x.id} onClick={async()=>{await request('/api/notifications/'+x.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:'{}'});done()}}>
            <Bell/>
            <div>
              <b>{x.title}</b>
              <p>{x.body}</p>
              <small>{date(x.created_at,lang)}</small>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function MobileNav({page,setPage,open,lang}:{page:string;setPage:(x:string)=>void;open:(x:string)=>void;lang:string}){
  return (
    <nav className="mobile-nav">
      {[
        ['dashboard',Home,lang==='ar'?'الرئيسية':'Home'],
        ['customers',Store,lang==='ar'?'العملاء':'Customers'],
        ['new',Plus,lang==='ar'?'زيارة جديدة':'New visit'],
        ['collections',CircleDollarSign,lang==='ar'?'التحصيل':'Collection'],
        ['reports',Menu,lang==='ar'?'المزيد':'More']
      ].map(([id,Icon,label]:any)=>(
        <button key={id} className={page===id?'active':id==='new'?'center':''} onClick={()=>id==='new'?open('visits'):setPage(id)}>
          <Icon/>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

const open=(url:string)=>window.open(url,'_blank','noopener,noreferrer');

// Customer / Doctor Profile Modal Component
function CustomerProfileModal({id,d,lang,close,open}:{id:string;d:Data;lang:string;close:()=>void;open:(x:string)=>void}){
  const ar=lang==='ar';
  const [tab,setTab]=useState<'visits'|'collections'|'invoices'>('visits');
  const customer=d.customers.find((c:Row)=>c.id===id);

  if(!customer)return null;

  const visits=d.visits.filter((v:Row)=>v.customer_id===id);
  const collections=d.collections.filter((c:Row)=>c.customer_id===id);
  const invoices=d.invoices.filter((i:Row)=>i.customer_id===id);

  const canViewInvoices=d.actor.permissions.includes('invoices.view_customer_history')||d.actor.permissions.includes('invoices.view_all')||d.actor.permissions.includes('invoices.view_team')||d.actor.permissions.includes('dashboard.management');

  const mapsUrl=customer.details?.maps_link||(customer.latitude&&customer.longitude?`https://www.google.com/maps/search/?api=1&query=${customer.latitude},${customer.longitude}`:'');

  return (
    <div className="modal-bg" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
      <div className="profile-modal">
        <div className="profile-header">
          <div className="profile-header-top">
            <div>
              <span style={{fontSize:11,color:'var(--brand)',fontWeight:700}}>{ar?'بروفايل العميل / الطبيب':'Customer & Doctor Profile'}</span>
              <h2 style={{margin:'4px 0 0',fontSize:22}}>{customer.name}</h2>
              {customer.name_en&&<small style={{color:'var(--muted)'}}>{customer.name_en}</small>}
            </div>
            <button type="button" className="icon" onClick={close}><X/></button>
          </div>
          
          <div className="profile-badges">
            <span className="class">VIP / فئة {customer.classification}</span>
            <span className="rep-badge">{typeTr[customer.type]?.[ar?0:1]||customer.type}</span>
            <Status value={customer.status} lang={lang}/>
            <code>{customer.code}</code>
            {customer.latitude&&customer.longitude&&(
              <span className="distance-badge"><MapPin style={{width:12,height:12}}/> GPS: {Number(customer.latitude).toFixed(4)}, {Number(customer.longitude).toFixed(4)}</span>
            )}
          </div>

          <div className="profile-grid-info">
            {customer.contact_person&&<div><b>👨‍⚕️ {ar?'الطبيب / جهة الاتصال:':'Doctor / Contact:'}</b> {customer.contact_person}</div>}
            <div><b>📞 {ar?'الهاتف:':'Phone:'}</b> {customer.phone}</div>
            {customer.whatsapp&&<div><b>💬 {ar?'واتساب:':'WhatsApp:'}</b> {customer.whatsapp}</div>}
            <div><b>📍 {ar?'المحافظة والمدينة:':'Governorate & City:'}</b> {customer.region_name?`${customer.region_name} - `:''}{customer.area_name} {customer.city?`(${customer.city})`:''}</div>
            <div><b>👤 {ar?'المندوب المسؤول:':'Assigned Rep:'}</b> {customer.representative_name||(ar?'غير محدد':'Unassigned')}</div>
            {customer.address&&<div><b>🏠 {ar?'العنوان بالتفصيل:':'Address:'}</b> {customer.address}</div>}
          </div>
        </div>

        <div className="profile-actions-bar">
          <button className="primary" onClick={()=>{close();open('visits:'+customer.id)}}><Activity/>{ar?'تسجيل تقرير زيارة':'Record visit'}</button>
          <button className="primary" style={{background:'#1c577a'}} onClick={()=>{close();open('collections:'+customer.id)}}><CircleDollarSign/>{ar?'تسجيل تحصيل':'Record collection'}</button>
          <button className="primary" style={{background:'#5e437c'}} onClick={()=>{close();open('invoices:'+customer.id)}}><FileText/>{ar?'إدخال فاتورة':'Enter invoice'}</button>
          {mapsUrl&&(
            <a className="maps-link-btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink style={{width:14,height:14}}/>{ar?'فتح الموقع على Google Maps':'Open Google Maps'}
            </a>
          )}
        </div>

        <div className="profile-tabs">
          <button className={`profile-tab-btn ${tab==='visits'?'active':''}`} onClick={()=>setTab('visits')}>
            {ar?`سجل الزيارات والتقارير (${visits.length})`:`Visits (${visits.length})`}
          </button>
          <button className={`profile-tab-btn ${tab==='collections'?'active':''}`} onClick={()=>setTab('collections')}>
            {ar?`سجل التحصيلات (${collections.length})`:`Collections (${collections.length})`}
          </button>
          <button className={`profile-tab-btn ${tab==='invoices'?'active':''}`} onClick={()=>setTab('invoices')}>
            {ar?`سجل الفواتير (${canViewInvoices?invoices.length:'محمي'})`:`Invoices (${canViewInvoices?invoices.length:'Protected'})`}
          </button>
        </div>

        <div className="profile-body">
          {tab==='visits'&&(
            visits.length>0?(
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{ar?'التاريخ':'Date'}</th>
                      <th>{ar?'المندوب':'Representative'}</th>
                      <th>{ar?'نوع الزيارة':'Type'}</th>
                      <th>{ar?'الغرض':'Purpose'}</th>
                      <th>{ar?'النتيجة':'Outcome'}</th>
                      <th>{ar?'تأكيد الـ GPS':'GPS Verification'}</th>
                      <th>{ar?'المتابعة القادمة':'Next follow-up'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((v:Row)=>(
                      <tr key={v.id}>
                        <td>{date(v.date,lang)}</td>
                        <td>{v.representative_name}</td>
                        <td>{v.visit_type}</td>
                        <td><b>{v.purpose||'—'}</b></td>
                        <td>{v.outcome||'—'}</td>
                        <td>
                          {v.latitude&&v.longitude?(
                            <span className="distance-badge"><MapPin style={{width:11,height:11}}/> {ar?'حضور موثق':'Verified'}</span>
                          ):(
                            <small>—</small>
                          )}
                        </td>
                        <td>{date(v.follow_up,lang)||'—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ):(
              <Empty lang={lang}/>
            )
          )}

          {tab==='collections'&&(
            collections.length>0?(
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{ar?'التاريخ':'Date'}</th>
                      <th>{ar?'المندوب':'Representative'}</th>
                      <th>{ar?'المبلغ':'Amount'}</th>
                      <th>{ar?'طريقة الدفع':'Method'}</th>
                      <th>{ar?'المرجع / الشيك':'Ref'}</th>
                      <th>{ar?'الحالة':'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((c:Row)=>(
                      <tr key={c.id}>
                        <td>{date(c.date,lang)}</td>
                        <td>{c.representative_name}</td>
                        <td><b className="money">{money(c.amount,c.currency,lang)}</b></td>
                        <td>{c.payment_method}</td>
                        <td><code>{c.reference||'—'}</code></td>
                        <td><Status value={c.status} lang={lang}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ):(
              <Empty lang={lang}/>
            )
          )}

          {tab==='invoices'&&(
            canViewInvoices?(
              invoices.length>0?(
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{ar?'رقم الفاتورة':'Invoice #'}</th>
                        <th>{ar?'التاريخ':'Date'}</th>
                        <th>{ar?'المندوب':'Representative'}</th>
                        <th>{ar?'القيمة':'Amount'}</th>
                        <th>{ar?'الحالة':'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv:Row)=>(
                        <tr key={inv.id}>
                          <td><code>{inv.reference}</code></td>
                          <td>{date(inv.date,lang)}</td>
                          <td>{inv.representative_name}</td>
                          <td><b className="money">{money(inv.amount,inv.currency,lang)}</b></td>
                          <td><Status value={inv.status} lang={lang}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ):(
                <Empty lang={lang}/>
              )
            ):(
              <div className="perm-alert" style={{margin:'20px 0'}}>
                <Lock/>
                <div>
                  <b>{ar?'الاطلاع على سجل المشتريات التاريخي محمي':'Purchase History is Restricted'}</b>
                  <p style={{margin:'4px 0 0'}}>
                    {ar?'الاطلاع على فواتير المشتريات السابقة لهذا العميل يتطلب موافقة واعتماد مدير المنطقة أو الإدارة المالية. يمكنك فقط إدخال فواتير جديدة من خلال زر "إدخال فاتورة" أعلاه.':'Viewing historical purchase invoices requires territory manager or finance approval. You can submit new invoices via the button above.'}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Data Entry Modal Component
function CreateModal({type,d,lang,close,done}:{type:string;d:Data;lang:string;close:()=>void;done:()=>void}){
  const ar=lang==='ar',[kind,preset]=type.split(':'),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const [selectedCustId,setSelectedCustId]=useState(preset||'');
  const [payMethod,setPayMethod]=useState('cash');
  const [gpsLoading,setGpsLoading]=useState(false);
  const [gpsData,setGpsData]=useState<{lat:number;lng:number;time:string}|null>(null);

  const customers=d.customers;
  const currentCustomer=useMemo(()=>customers.find((c:Row)=>c.id===selectedCustId),[customers,selectedCustId]);

  function captureGpsForVisit(){
    if(!navigator.geolocation){alert(ar?'تحديد الموقع الجغرافي غير مدعوم':'Geolocation not supported');return;}
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(pos=>{
      setGpsLoading(false);
      setGpsData({
        lat:pos.coords.latitude,
        lng:pos.coords.longitude,
        time:new Date().toLocaleTimeString(ar?'ar-EG':'en-US')
      });
    },()=>{
      setGpsLoading(false);
      alert(ar?'تعذر الوصول إلى الموقع الجغرافي. تأكد من تفعيل GPS':'Could not access GPS. Please check location permissions.');
    });
  }

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setBusy(true);
    setError('');
    const f=new FormData(e.currentTarget),file=f.get('attachment');
    f.delete('attachment');
    const obj:Record<string,any>=Object.fromEntries(f);

    for(const k of ['visit_target','new_customer_target','activityDays','opening','year'])if(obj[k])obj[k]=Number(obj[k]);
    for(const k of ['annualPlans','requireGps'])obj[k]=f.get(k)==='on';

    if(kind==='customers'){
      obj.details={
        maps_link:f.get('maps_link')?String(f.get('maps_link')):undefined
      };
      delete obj.maps_link;
      delete obj.region_id;
    }

    if(kind==='visits'&&gpsData){
      obj.latitude=gpsData.lat;
      obj.longitude=gpsData.lng;
      obj.check_in=new Date().toISOString();
    }

    if(kind==='collections'){
      obj.client_transaction_id=crypto.randomUUID();
      obj.details={
        bank:f.get('bank')?String(f.get('bank')):undefined,
        cheque_number:f.get('cheque_number')?String(f.get('cheque_number')):undefined,
        due_date:f.get('due_date')?String(f.get('due_date')):undefined
      };
      delete obj.bank;
      delete obj.cheque_number;
      delete obj.due_date;
    }

    if(kind==='users')obj.area_ids=f.getAll('area_ids');
    if(kind==='roles')obj.permissions=f.getAll('permissions');
    if(kind==='workflow')obj.steps=[{permission:f.get('permission'),label:f.get('step_label')}];

    try{
      const record=await request('/api/'+kind,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(obj)});
      if(file instanceof File&&file.size&&['customers','visits','collections','invoices','plans','leaves'].includes(kind)){
        const upload=new FormData();
        upload.set('file',file);
        upload.set('module',kind);
        upload.set('entity_id',record.id);
        await request('/api/attachments',{method:'POST',body:upload});
      }
      done();
    }catch(x){
      setError(message(x instanceof Error?x.message:'save_failed',ar));
    }finally{
      setBusy(false);
    }
  }

  return (
    <div className="modal-bg" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <div>
            <span>{ar?'إدخال عمليات ميدانية وبيانات':'Field Data Entry'}</span>
            <h2>{modalTitle(kind,ar)}</h2>
          </div>
          <button type="button" className="icon" onClick={close}><X/></button>
        </div>

        <div className="form-grid">
          {kind==='customers'&&<CustomerFields d={d} ar={ar}/>}

          {['visits','collections','invoices'].includes(kind)&&(
            <>
              <Field label={ar?'اختيار العميل من منطقتك المصرح بها':'Select territory customer'}>
                <select name="customer_id" value={selectedCustId} onChange={e=>setSelectedCustId(e.target.value)} required>
                  <option value="">{ar?'— اختر العميل من قائمة منطقتك —':'— Choose customer —'}</option>
                  {customers.map((x:Row)=>(
                    <option key={x.id} value={x.id}>
                      {x.name} {x.contact_person?`(${x.contact_person})`:''} · 📍 {x.region_name?`${x.region_name} - `:''}{x.area_name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={ar?'التاريخ':'Date'}>
                <input name="date" type="date" required defaultValue={new Date().toISOString().slice(0,10)}/>
              </Field>

              {currentCustomer&&(
                <div className="customer-preview">
                  <div className="preview-top">
                    <b>{currentCustomer.name}</b>
                    <span className="class">{currentCustomer.classification}</span>
                    <span className="rep-badge">{typeTr[currentCustomer.type]?.[ar?0:1]||currentCustomer.type}</span>
                    <Status value={currentCustomer.status} lang={lang}/>
                  </div>
                  <div className="preview-details">
                    {currentCustomer.contact_person&&<span>👨‍⚕️ {ar?'الطبيب / المسؤول:':'Contact:'} {currentCustomer.contact_person}</span>}
                    <span>📞 {ar?'الهاتف:':'Phone:'} {currentCustomer.phone}</span>
                    <span>📍 {ar?'المحافظة والمدينة:':'Territory:'} {currentCustomer.region_name?`${currentCustomer.region_name} - `:''}{currentCustomer.area_name} {currentCustomer.city?`(${currentCustomer.city})`:''}</span>
                    {currentCustomer.address&&<span>🏠 {currentCustomer.address}</span>}
                  </div>
                </div>
              )}
            </>
          )}

          {kind==='visits'&&(
            <>
              <Field label={ar?'نوع الزيارة':'Visit type'}>
                <select name="visit_type">
                  <option value="routine">{ar?'زيارة دورية اعتيادية':'Routine'}</option>
                  <option value="follow_up">{ar?'زيارة متابعة':'Follow-up'}</option>
                  <option value="sales">{ar?'زيارة مبيعات وعرض أصناف':'Sales pitch'}</option>
                  <option value="collection">{ar?'زيارة تحصيل ومطابقة':'Collection'}</option>
                </select>
              </Field>

              <Field label={ar?'إثبات الحضور والموقع الجغرافي GPS':'GPS Check-in Proof'}>
                <button type="button" className={`gps-btn ${gpsData?'gps-active':''}`} onClick={captureGpsForVisit}>
                  <MapPin style={{width:16,height:16}}/>
                  {gpsLoading?(ar?'جارٍ التقاط الموقع...':'Locating...'):gpsData?(ar?`✅ تم تسجيل الحضور (${gpsData.time})`:`Checked in at ${gpsData.time}`):(ar?'📍 تسجيل الحضور وتأكيد الموقع GPS الآن':'Confirm Arrival & Record GPS')}
                </button>
                {gpsData&&<small style={{display:'block',marginTop:4,color:'var(--brand)'}}>Lat: {gpsData.lat.toFixed(5)}, Lng: {gpsData.lng.toFixed(5)}</small>}
              </Field>

              <Field label={ar?'الغرض من الزيارة':'Visit purpose'} wide>
                <textarea name="purpose" placeholder={ar?'سجل الغرض من مقابلة الطبيب أو المسؤول...':'Document the purpose of this visit...'} required/>
              </Field>
              <Field label={ar?'النتيجة والاتفاق':'Outcome & results'} wide>
                <textarea name="outcome" placeholder={ar?'ما تم الاتفاق عليه والطلبيات المحتملة...':'Agreed items or potential orders...'}/>
              </Field>
              <Field label={ar?'تاريخ المتابعة القادمة':'Next follow-up date'}>
                <input name="follow_up" type="date"/>
              </Field>
            </>
          )}

          {kind==='collections'&&(
            <>
              <Field label={ar?'المبلغ المحصل':'Collected amount'}>
                <input name="amount" inputMode="decimal" pattern="\d+(\.\d{1,2})?" placeholder="0.00" required/>
              </Field>
              <Field label={ar?'العملة':'Currency'}>
                <input name="currency" defaultValue="EGP" required maxLength={3}/>
              </Field>
              <Field label={ar?'طريقة الدفع':'Payment method'}>
                <select name="payment_method" value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                  <option value="cash">{ar?'نقدي (كاش)':'Cash'}</option>
                  <option value="cheque">{ar?'شيك بنكي':'Cheque'}</option>
                  <option value="bank_transfer">{ar?'تحويل بنكي':'Bank transfer'}</option>
                  <option value="instapay">InstaPay (إنستاباي)</option>
                  <option value="wallet">{ar?'محفظة إلكترونية (فودافون كاش وغيرها)':'Wallet'}</option>
                </select>
              </Field>
              <Field label={ar?'رقم الإيصال / المرجع':'Receipt / Reference #'}>
                <input name="reference" placeholder={ar?'رقم الإيصال الورقي إن وجد':'Paper receipt #'}/>
              </Field>

              {payMethod==='cheque'&&(
                <>
                  <Field label={ar?'رقم الشيك':'Cheque number'}>
                    <input name="cheque_number" placeholder="00012345" required/>
                  </Field>
                  <Field label={ar?'اسم البنك المسحوب عليه':'Bank name'}>
                    <input name="bank" placeholder={ar?'مثال: البنك الأهلي المصري':'e.g. National Bank'} required/>
                  </Field>
                  <Field label={ar?'تاريخ استحقاق الشيك':'Cheque due date'}>
                    <input name="due_date" type="date" required/>
                  </Field>
                </>
              )}

              {payMethod==='bank_transfer'&&(
                <Field label={ar?'اسم البنك المحول إليه':'Bank name'}>
                  <input name="bank" placeholder={ar?'مثال: بنك مصر / CIB':'e.g. CIB Bank'} required/>
                </Field>
              )}
            </>
          )}

          {kind==='invoices'&&(
            <>
              <Field label={ar?'رقم الفاتورة / أمر التوريد':'Invoice / PO #'}>
                <input name="reference" placeholder="INV-2026-0001" required/>
              </Field>
              <Field label={ar?'إجمالي قيمة الفاتورة':'Invoice total amount'}>
                <input name="amount" inputMode="decimal" placeholder="0.00" required/>
              </Field>
              <Field label={ar?'العملة':'Currency'}>
                <input name="currency" defaultValue="EGP" required/>
              </Field>
            </>
          )}

          {kind==='plans'&&<PlanFields d={d} ar={ar}/>}
          {kind==='leaves'&&<LeaveFields d={d} ar={ar}/>}
          {kind==='users'&&<UserFields d={d} ar={ar}/>}
          {kind==='areas'&&<AreaFields d={d} ar={ar}/>}
          {kind==='roles'&&<RoleFields d={d} ar={ar}/>}
          {kind==='workflow'&&<WorkflowFields d={d} ar={ar}/>}
          {kind==='settings'&&<SettingsFields d={d} ar={ar}/>}
          {kind==='balance'&&<BalanceFields d={d} ar={ar}/>}

          {/* Contextual Attachment Label */}
          {['customers','visits','collections','invoices','plans','leaves'].includes(kind)&&(
            <Field 
              label={
                kind==='customers'?(ar?'مرفق صورة المنشأة / السجل التجاري / كارت الطبيب (اختياري)':'Facility / Business Card Attachment (optional)'):
                kind==='collections'?(ar?'مرفق صورة الشيك أو إيصال التحصيل الورقي (حتى 10MB)':'Cheque or Receipt Photo (up to 10MB)'):
                kind==='invoices'?(ar?'مرفق صورة الفاتورة أو أمر التوريد (حتى 10MB)':'Invoice / PO Document Photo (up to 10MB)'):
                kind==='visits'?(ar?'مرفق صورة الزيارة أو الروشتة (اختياري)':'Visit Photo / Prescription (optional)'):
                (ar?'مرفق المستند أو التقرير (اختياري)':'Attachment (optional)')
              } 
              wide
            >
              <input name="attachment" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,audio/mpeg,audio/mp4"/>
            </Field>
          )}

          {['visits','collections','invoices','plans','leaves'].includes(kind)&&(
            <>
              <Field label={ar?'ملاحظات إضافية':'Additional notes'} wide>
                <textarea name="notes" placeholder={ar?'أي ملاحظات تود توثيقها...':'Any additional notes...'}/>
              </Field>
              <Field label={ar?'حالة الإرسال':'Submission'}>
                <select name="status">
                  <option value="submitted">{ar?'إرسال للاعتماد والمراجعة':'Submit for approval'}</option>
                  <option value="draft">{ar?'حفظ كمسودة أولاً':'Save as draft'}</option>
                </select>
              </Field>
            </>
          )}
        </div>

        {error&&<div className="error">{error}</div>}

        <div className="modal-actions">
          <button type="button" onClick={close}>{ar?'إلغاء':'Cancel'}</button>
          <button className="primary" disabled={busy}>{busy?(ar?'جارٍ الحفظ...':'Saving...'):(ar?'تأكيد وحفظ':'Confirm & Save')}</button>
        </div>
      </form>
    </div>
  );
}

function Field({label,children,wide}:{label:string;children:React.ReactNode;wide?:boolean}){
  return <label className={wide?'wide':''}><span>{label}</span>{children}</label>;
}

function CustomerFields({d,ar}:{d:Data;ar:boolean}){
  const [selectedReg,setSelectedReg]=useState('');
  const [lat,setLat]=useState('');
  const [lng,setLng]=useState('');
  const [mapsLink,setMapsLink]=useState('');
  const [gpsBusy,setGpsBusy]=useState(false);

  // Available cities for selected governorate
  const filteredCities=useMemo(()=>{
    if(!selectedReg)return d.areas;
    return d.areas.filter((a:Row)=>a.region_id===selectedReg);
  },[d.areas,selectedReg]);

  function getGPSLocation(){
    if(!navigator.geolocation){alert(ar?'تحديد الموقع الجغرافي غير مدعوم':'Geolocation not supported');return;}
    setGpsBusy(true);
    navigator.geolocation.getCurrentPosition(pos=>{
      setGpsBusy(false);
      const latitude=pos.coords.latitude.toFixed(6);
      const longitude=pos.coords.longitude.toFixed(6);
      setLat(latitude);
      setLng(longitude);
      setMapsLink(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    },()=>{
      setGpsBusy(false);
      alert(ar?'تعذر الحصول على الموقع الجغرافي. تأكد من تفعيل الـ GPS وإعطاء الإذن للمتصفح.':'Could not fetch GPS location.');
    });
  }

  return (
    <>
      <Field label={ar?'اسم المنشأة / العميل':'Customer name'}><input name="name" placeholder={ar?'مثال: عيادة د. محمد البيطرية / مزرعة الوادي':'e.g. Dr. Mohamed Clinic'} required/></Field>
      <Field label={ar?'الاسم بالإنجليزية':'English name'}><input name="name_en"/></Field>
      <Field label={ar?'الطبيب / الشخص المسؤول':'Doctor / Contact person'}><input name="contact_person" placeholder={ar?'د. فلان الفلاني':'Dr. Name'}/></Field>
      <Field label={ar?'نوع المنشأة':'Customer type'}>
        <select name="type">
          <option value="clinic">{ar?'عيادة بيطرية':'Veterinary clinic'}</option>
          <option value="pharmacy">{ar?'صيدلية بيطرية':'Veterinary pharmacy'}</option>
          <option value="feed_mill">{ar?'مصنع أعلاف':'Feed mill'}</option>
          <option value="poultry_farm">{ar?'مزرعة دواجن':'Poultry farm'}</option>
          <option value="farm">{ar?'مزرعة ماشية':'Livestock farm'}</option>
          <option value="distributor">{ar?'موزع أدوية بيطرية':'Distributor'}</option>
        </select>
      </Field>
      <Field label={ar?'الهاتف للتواصل':'Phone'}><input name="phone" placeholder="01012345678" required/></Field>
      <Field label={ar?'واتساب':'WhatsApp'}><input name="whatsapp" placeholder="01012345678"/></Field>

      {/* Governorate & City Cascading Selection */}
      <Field label={ar?'المحافظة':'Governorate'}>
        <select name="region_id" value={selectedReg} onChange={e=>setSelectedReg(e.target.value)} required>
          <option value="">{ar?'— اختر المحافظة (جميع محافظات مصر) —':'— Select Egypt Governorate —'}</option>
          {d.regions.map((r:Row)=><option value={r.id} key={r.id}>{r.name}</option>)}
        </select>
      </Field>

      <Field label={ar?'المدينة / المركز التابع للمحافظة':'City / District'}>
        <select name="area_id" required>
          <option value="">{selectedReg?(ar?'— اختر المدينة أو المركز —':'— Select City —'):(ar?'— اختر المحافظة أولاً —':'— Choose Governorate First —')}</option>
          {filteredCities.map((x:Row)=><option value={x.id} key={x.id}>{x.name}</option>)}
        </select>
      </Field>

      <Field label={ar?'القرية / الحي / المنطقة الفرعية':'Neighborhood / Village'}><input name="city" placeholder={ar?'مثال: شارع المحافظة / حي الزهور / قرية كذا':'e.g. District / Village'}/></Field>

      {/* Rep Assignment */}
      <Field label={ar?'المندوب المسؤول عن العميل':'Assigned sales representative'}>
        <select name="representative_id">
          <option value="">{ar?'— اختياري (تحديد المندوب لاحقاً) —':'— Optional —'}</option>
          {d.users.map((x:Row)=><option value={x.id} key={x.id}>{x.name} {x.employee_code?`(${x.employee_code})`:''}</option>)}
        </select>
      </Field>

      <Field label={ar?'التصنيف':'Classification'}>
        <select name="classification">
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>VIP</option>
        </select>
      </Field>

      <Field label={ar?'الحالة':'Status'}>
        <select name="status">
          <option value="active">{ar?'نشط':'Active'}</option>
          <option value="prospect">{ar?'محتمل':'Prospect'}</option>
        </select>
      </Field>

      <Field label={ar?'العنوان بالتفصيل (بار العنوان)':'Detailed address'} wide>
        <textarea name="address" placeholder={ar?'سجل العنوان التفصيلي وأقرب علامة مميزة...':'Full street address and landmarks...'}/>
      </Field>

      {/* GPS & Location Link Fields */}
      <Field label={ar?'رابط موقع اللوكيشن (Google Maps)':'Google Maps Location Link'} wide>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input name="maps_link" value={mapsLink} onChange={e=>setMapsLink(e.target.value)} placeholder="https://maps.app.goo.gl/... أو اضغط لتحديد الموقع" style={{flex:1}}/>
          <button type="button" className="gps-btn" onClick={getGPSLocation} style={{marginTop:0,whiteSpace:'nowrap'}}>
            <MapPin style={{width:14,height:14}}/>
            {gpsBusy?(ar?'جارٍ التحديد...':'Locating...'):(ar?'📍 تحديد موقعي الآن GPS':'Pick Current GPS')}
          </button>
        </div>
      </Field>

      <Field label={ar?'خط العرض (Latitude)':'Latitude'}>
        <input name="latitude" value={lat} onChange={e=>setLat(e.target.value)} placeholder="30.58768"/>
      </Field>
      <Field label={ar?'خط الطول (Longitude)':'Longitude'}>
        <input name="longitude" value={lng} onChange={e=>setLng(e.target.value)} placeholder="31.50200"/>
      </Field>
    </>
  );
}

function PlanFields({d,ar}:{d:Data;ar:boolean}){
  return (
    <>
      <Field label={ar?'عنوان خطة العمل':'Plan title'}><input name="title" placeholder={ar?'مثال: خطة الأسبوع الثالث - قطاع الزقازيق':'Plan title'} required/></Field>
      <Field label={ar?'تقسيم الخطة':'Plan interval / type'}>
        <select name="plan_type">
          <option value="weekly">{ar?'أسبوعية (Weekly)':'Weekly'}</option>
          <option value="monthly">{ar?'شهرية (Monthly)':'Monthly'}</option>
          <option value="annual">{ar?'سنوية (Annual)':'Annual'}</option>
        </select>
      </Field>
      <Field label={ar?'تاريخ البداية':'Start date'}><input name="date" type="date" required/></Field>
      <Field label={ar?'تاريخ النهاية':'End date'}><input name="end_date" type="date" required/></Field>
      <Field label={ar?'المنطقة':'Area'}>
        <select name="area_id" required>
          {d.areas.map((x:Row)=><option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </Field>
      <Field label={ar?'مستهدف عدد الزيارات':'Visit target'}><input name="visit_target" type="number" min="0" defaultValue="20"/></Field>
      <Field label={ar?'مستهدف التحصيل (جنيه)':'Collection target'}><input name="collection_target" defaultValue="50000"/></Field>
      <Field label={ar?'مستهدف المبيعات والفواتير (جنيه)':'Sales target'}><input name="sales_target" defaultValue="80000"/></Field>
      <Field label={ar?'مستهدف عملاء جدد':'New customers target'}><input name="new_customer_target" type="number" min="0" defaultValue="5"/></Field>
    </>
  );
}

function LeaveFields({d,ar}:{d:Data;ar:boolean}){
  const [selectedType,setSelectedType]=useState(d.leave_types[0]?.id||'');
  const [startDate,setStartDate]=useState(new Date().toISOString().slice(0,10));
  const [endDate,setEndDate]=useState(new Date().toISOString().slice(0,10));

  const myBal=useMemo(()=>{
    const b=d.leave_balances.find((x:Row)=>x.user_id===d.actor.id&&x.leave_type_id===selectedType);
    if(!b)return null;
    const rem=Math.max(0,Number(b.opening)-Number(b.used));
    return {opening:Number(b.opening),used:Number(b.used),rem};
  },[d,selectedType]);

  const days=useMemo(()=>{
    try{
      const diff=Math.round((Date.parse(endDate)-Date.parse(startDate))/86400000)+1;
      return diff>0?diff:0;
    }catch{return 0;}
  },[startDate,endDate]);

  return (
    <>
      <div style={{gridColumn:'1/-1',background:'#eaf3f0',border:'1px solid #cce3d8',padding:'10px 14px',borderRadius:10,fontSize:13,color:'var(--brand)'}}>
        <b>📌 {ar?'جهة الاعتماد والموافقة: مدير الشركة / الإدارة العليا':'Approver: Company General Manager / HR'}</b>
        <p style={{margin:'2px 0 0',fontSize:11,opacity:.85}}>
          {ar?'متاح للمندوب أو المدير تقديم طلب الإجازة، ويصل مباشرة للمدير العام للاعتماد مع خصم الرصيد تلقائياً.':'Reps and Managers can submit leave requests; routed to General Manager for approval.'}
        </p>
      </div>

      <Field label={ar?'نوع الإجازة المطلوبة':'Leave type'}>
        <select name="leave_type_id" value={selectedType} onChange={e=>setSelectedType(e.target.value)} required>
          {d.leave_types.map((x:Row)=><option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </Field>

      {myBal&&(
        <div style={{gridColumn:'1/-1',background:'#f1f7f4',padding:'8px 12px',borderRadius:8,fontSize:12,color:'var(--brand)',display:'flex',gap:16}}>
          <span>{ar?`الرصيد المتاح: ${myBal.rem} يوم`:`Available balance: ${myBal.rem} days`}</span>
          <span>{ar?`إجمالي الرصيد: ${myBal.opening} يوم`:`Total: ${myBal.opening} days`}</span>
          <span>{ar?`المستهلك سابقاً: ${myBal.used} يوم`:`Used: ${myBal.used} days`}</span>
        </div>
      )}

      <Field label={ar?'تاريخ البداية (من)':'From date'}><input name="date" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} required/></Field>
      <Field label={ar?'تاريخ النهاية (إلى)':'To date'}><input name="end_date" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} required/></Field>

      <div style={{gridColumn:'1/-1',fontSize:12,fontWeight:700,color:myBal&&days>myBal.rem?'var(--danger)':'var(--brand)'}}>
        {ar?`عدد أيام الإجازة المحسوبة: ${days} يوم`:`Calculated days: ${days}`}
        {myBal&&days>myBal.rem&&` (${ar?'تنبيه: يتجاوز رصيدك المتبقي!':'Warning: exceeds available balance!'})`}
      </div>
    </>
  );
}

function UserFields({d,ar}:{d:Data;ar:boolean}){
  // Auto-generate next employee code in sequence
  const nextCode=useMemo(()=>{
    const numbers=d.users.map((u:Row)=>{
      const m=String(u.employee_code||'').match(/\d+/);
      return m?parseInt(m[0],10):0;
    });
    const max=numbers.length?Math.max(...numbers):0;
    return `EMP-${String(max+1).padStart(3,'0')}`;
  },[d.users]);

  // Multi-governorate & multi-city selection
  const [selectedGovernorates,setSelectedGovernorates]=useState<string[]>([]);
  const [selectedAreas,setSelectedAreas]=useState<string[]>([]);

  function toggleGovernorate(regId:string){
    if(selectedGovernorates.includes(regId)){
      setSelectedGovernorates(selectedGovernorates.filter(id=>id!==regId));
      // Remove areas of this governorate
      const regAreaIds=new Set(d.areas.filter((a:Row)=>a.region_id===regId).map((a:Row)=>a.id));
      setSelectedAreas(selectedAreas.filter(id=>!regAreaIds.has(id)));
    }else{
      setSelectedGovernorates([...selectedGovernorates,regId]);
    }
  }

  function selectAllInGov(regId:string){
    const regAreaIds=d.areas.filter((a:Row)=>a.region_id===regId).map((a:Row)=>a.id);
    const combined=new Set([...selectedAreas,...regAreaIds]);
    setSelectedAreas(Array.from(combined));
  }

  function toggleArea(areaId:string){
    if(selectedAreas.includes(areaId)){
      setSelectedAreas(selectedAreas.filter(id=>id!==areaId));
    }else{
      setSelectedAreas([...selectedAreas,areaId]);
    }
  }

  return (
    <>
      <Field label={ar?'الاسم بالكامل':'Full name'}><input name="name" required/></Field>
      <Field label={ar?'البريد الإلكتروني للولوج':'Email'}><input name="email" type="email" required/></Field>
      <Field label={ar?'كلمة المرور المؤقتة':'Temporary password'}><input name="password" type="password" minLength={12} defaultValue="DemoPass!2026" required/></Field>
      
      {/* Auto-Sequential Employee Code */}
      <Field label={ar?'كود الموظف (تسلسل تلقائي)':'Employee code (auto-sequence)'}>
        <input name="employee_code" defaultValue={nextCode} required/>
      </Field>

      <Field label={ar?'رقم الهاتف':'Phone'}><input name="phone" placeholder="01012345678"/></Field>

      <Field label={ar?'الدور الوظيفي والصلاحيات':'Role'}>
        <select name="role_id" required>
          {d.roles.map((x:Row)=><option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </Field>

      {/* Optional Supervisor / Area Manager */}
      <Field label={ar?'المشرف / مدير المناديب التابع له (اختياري)':'Supervisor / Area Manager (optional)'}>
        <select name="supervisor_id">
          <option value="">{ar?'— لا يوجد (يتبع الإدارة العليا مباشرة) —':'— Direct to General Management —'}</option>
          {d.users.map((x:Row)=><option key={x.id} value={x.id}>{x.name} {x.employee_code?`(${x.employee_code})`:''}</option>)}
        </select>
      </Field>

      {/* Multi-Governorates and Multi-Cities Territory Picker */}
      <div style={{gridColumn:'1/-1',margin:'10px 0'}}>
        <b>📍 {ar?'المحافظات والمدن المسندة للمندوب / المدير (تحديد أكثر من محافظة وأكثر من مدينة)':'Assigned Governorates & Cities (Multi-select)'}</b>
        <p style={{fontSize:12,color:'var(--muted)',margin:'3px 0 10px'}}>
          {ar?'اختر المحافظة ثم حدد المدن أو المراكز التابعة لها، أو اضغط "تحديد كل مدن المحافظة".':'Select governorate and choose individual cities or select all.'}
        </p>

        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
          {d.regions.map((r:Row)=>(
            <button 
              type="button" 
              key={r.id} 
              className={`plan-tab ${selectedGovernorates.includes(r.id)?'active':''}`}
              onClick={()=>toggleGovernorate(r.id)}
            >
              {selectedGovernorates.includes(r.id)?'✓ ':''}{r.name}
            </button>
          ))}
        </div>

        {selectedGovernorates.length>0&&(
          <div className="multi-gov-box">
            {selectedGovernorates.map(regId=>{
              const region=d.regions.find((r:Row)=>r.id===regId);
              const regAreas=d.areas.filter((a:Row)=>a.region_id===regId);
              return (
                <div className="gov-group" key={regId}>
                  <div className="gov-group-head">
                    <span>🏢 محافظة {region?.name} ({regAreas.filter((a:Row)=>selectedAreas.includes(a.id)).length} / {regAreas.length} مدينة مختارة)</span>
                    <button type="button" onClick={()=>selectAllInGov(regId)}>{ar?'تحديد كل المدن والمراكز':'Select All Cities'}</button>
                  </div>
                  <div className="gov-areas-grid">
                    {regAreas.map((a:Row)=>(
                      <label key={a.id}>
                        <input 
                          type="checkbox" 
                          name="area_ids" 
                          value={a.id} 
                          checked={selectedAreas.includes(a.id)}
                          onChange={()=>toggleArea(a.id)}
                        />
                        {a.name}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedAreas.length===0&&selectedGovernorates.length===0&&(
          <small style={{color:'var(--muted)'}}>{ar?'يرجى اختيار محافظة واحدة على الأقل من القائمة أعلاه لعرض مدنها ومراكزها.':'Please choose at least one governorate above.'}</small>
        )}
      </div>
    </>
  );
}

function AreaFields({d,ar}:{d:Data;ar:boolean}){
  return (
    <>
      <Field label={ar?'اسم المدينة / المركز الجديد':'New city / district name'}><input name="name" required/></Field>
      <Field label={ar?'المحافظة التابعة لها':'Governorate'}>
        <select name="region_id" required>
          {d.regions.map((x:Row)=><option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </Field>
    </>
  );
}

function RoleFields({d,ar}:{d:Data;ar:boolean}){
  return (
    <>
      <Field label={ar?'اسم الدور':'Role name'}><input name="name" required/></Field>
      <Field label={ar?'الصلاحيات الممنوحة':'Permissions'} wide>
        <div className="permission-list">
          {d.permissions.map((x:string)=><label key={x}><input type="checkbox" name="permissions" value={x}/>{x}</label>)}
        </div>
      </Field>
    </>
  );
}

function WorkflowFields({d,ar}:{d:Data;ar:boolean}){
  return (
    <>
      <Field label={ar?'الوحدة المرتبطة':'Module'}>
        <select name="module">{['visits','collections','invoices','plans','leaves'].map(x=><option key={x}>{x}</option>)}</select>
      </Field>
      <Field label={ar?'اسم مسار الاعتماد':'Workflow name'}><input name="name" required/></Field>
      <Field label={ar?'صلاحية المعتمد':'Approver permission'}>
        <select name="permission">{d.permissions.filter((x:string)=>x.endsWith('.approve')).map((x:string)=><option key={x}>{x}</option>)}</select>
      </Field>
      <Field label={ar?'اسم الخطوة':'Step label'}><input name="step_label" placeholder={ar?'مثال: اعتماد المدير المالي':'e.g. Finance approval'} required/></Field>
    </>
  );
}

function SettingsFields({d,ar}:{d:Data;ar:boolean}){
  const c=d.companies[0],s=c.settings;
  return (
    <>
      <Field label={ar?'اسم النظام':'System brand'}><input name="brand" defaultValue={s.brand} required/></Field>
      <Field label={ar?'اسم الشركة':'Company name'}><input name="companyName" defaultValue={c.name} required/></Field>
      <Field label={ar?'العملة':'Currency'}><input name="currency" defaultValue={s.currency} required/></Field>
      <Field label={ar?'المنطقة الزمنية':'Timezone'}><input name="timezone" defaultValue={s.timezone} required/></Field>
      <Field label={ar?'لون العلامة التجارية':'Brand color'}><input name="primaryColor" type="color" defaultValue={s.primaryColor}/></Field>
      <Field label={ar?'حد خمول العميل (بالأيام)':'Inactivity threshold (days)'}><input name="activityDays" type="number" defaultValue={s.activityDays}/></Field>
      <Field label={ar?'خصائص العمليات الميدانية':'Field features'} wide>
        <label className="check"><input name="annualPlans" type="checkbox" defaultChecked={s.annualPlans}/>{ar?'تفعيل إمكانية الخطط السنوية':'Enable annual work plans'}</label>
        <label className="check"><input name="requireGps" type="checkbox" defaultChecked={s.requireGps}/>{ar?'إلزام تسجيل الموقع الجغرافي GPS عند تسجيل الزيارة':'Require GPS coordinates on visits'}</label>
      </Field>
    </>
  );
}

function BalanceFields({d,ar}:{d:Data;ar:boolean}){
  return (
    <>
      <Field label={ar?'الموظف / المندوب':'Employee'}><select name="user_id">{d.users.map((x:Row)=><option value={x.id} key={x.id}>{x.name}</option>)}</select></Field>
      <Field label={ar?'نوع الإجازة':'Leave type'}><select name="leave_type_id">{d.leave_types.map((x:Row)=><option value={x.id} key={x.id}>{x.name}</option>)}</select></Field>
      <Field label={ar?'السنة المالية':'Year'}><input name="year" type="number" defaultValue={new Date().getFullYear()}/></Field>
      <Field label={ar?'الرصيد الافتتاحي (أيام)':'Opening balance'}><input name="opening" type="number" min="0" step="0.5" defaultValue="21"/></Field>
    </>
  );
}

function modalTitle(kind:string,ar:boolean){
  const t:Record<string,[string,string]>={
    customers:['تكويد عميل أو طبيب جديد','New customer or doctor directory'],
    visits:['تسجيل تقرير زيارة يومية','Record daily report / visit'],
    collections:['تسجيل تحصيل مالي','Record collection payment'],
    invoices:['إدخال فاتورة مشتريات','Enter purchase invoice'],
    plans:['إنشاء خطة عمل ميدانية','New field work plan'],
    leaves:['تقديم طلب إجازة برصيد','Submit leave request'],
    users:['تكويد موظف / مندوب جديد بالفريق','New employee directory'],
    areas:['إضافة مدينة أو مركز جديد','New city or district'],
    roles:['تعريف دور وصلاحيات','Define role & permissions'],
    workflow:['إعداد مسار اعتماد','Configure approval workflow'],
    settings:['تعديل إعدادات النظام','System & company profile'],
    balance:['تحديد رصيد إجازة لموظف','Set employee leave balance']
  };
  return t[kind]?.[ar?0:1]||kind;
}

function message(code:string,ar:boolean){
  const m:Record<string,[string,string]>={
    customer_unavailable:['العميل غير متاح ضمن منطقتك المصرح بها','Customer is outside your assigned territory'],
    idempotency_conflict:['تم تسجيل هذه العملية مسبقاً بنفس رقم المعاملة','Transaction ID was already recorded'],
    insufficient_balance:['رصيد الإجازة المتاح لديك لا يكفي لعدد الأيام المطلوبة','Insufficient leave balance for requested duration'],
    leave_overlap:['يوجد طلب إجازة آخر متداخل مع هذه الفترة','Leave request overlaps another submitted period'],
    forbidden:['ليس لديك صلاحية لتنفيذ هذا الإجراء','You do not have permission for this action'],
    workflow_required:['يلزم تكوين مسار اعتماد أولاً لهذا النوع من الطلبات','Approval workflow must be configured first'],
    save_failed:['تعذر حفظ البيانات، يرجى مراجعة الحقول وإعادة المحاولة','Could not save the data. Please verify inputs.']
  };
  return m[code]?.[ar?0:1]||code;
}
