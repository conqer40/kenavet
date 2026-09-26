import * as fs from 'fs';
import * as path from 'path';

// Read existing presentation deck to allow viewing inside presentation tab
const presPath = path.join('D:', 'CRM', 'docs', 'FieldForce_Pro_Interactive_Presentation.html');
let presHtml = '';
if (fs.existsSync(presPath)) {
  presHtml = fs.readFileSync(presPath, 'utf8');
}

// Generate the complete self-contained KENAVET CRM web application
const appHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>KENAVET | إدارة المناديب والعمليات والمخازن البيطرية</title>
  <meta name="author" content="محمد الحاوي">
  <meta name="theme-color" content="#176b55">
  <link rel="icon" href="./presentation_assets/01_login.png">
  <style>
    :root {
      --brand: #176b55;
      --brand2: #0f5644;
      --gold: #d6a84b;
      --ink: #172520;
      --muted: #6d7b76;
      --line: #e3e9e6;
      --bg: #f4f7f5;
      --card: #ffffff;
      --danger: #b94141;
      --warning: #d97706;
      --shadow: 0 12px 35px rgba(20,56,44,.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Cairo", Tahoma, sans-serif;
      background: var(--bg);
      color: var(--ink);
      min-height: 100vh;
      line-height: 1.5;
    }
    button, input, select, textarea { font-family: inherit; font-size: inherit; }
    button { cursor: pointer; }
    
    /* Layout */
    .app-wrapper { display: flex; min-height: 100vh; }
    .sidebar {
      width: 280px;
      background: #ffffff;
      border-left: 1px solid var(--line);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 50;
      transition: transform 0.25s ease;
    }
    .sidebar-brand {
      padding: 22px 20px;
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      width: 44px;
      height: 44px;
      background: var(--brand);
      color: white;
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 22px;
      box-shadow: 0 4px 10px rgba(23,107,85,0.25);
    }
    .brand-text b { font-size: 19px; display: block; color: var(--brand2); letter-spacing: -0.3px; }
    .brand-text small { font-size: 11px; color: var(--muted); }
    
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border: 0;
      background: none;
      border-radius: 10px;
      color: #556560;
      font-size: 13px;
      font-weight: 600;
      text-align: right;
      transition: all 0.15s ease;
      width: 100%;
    }
    .nav-btn:hover { background: #eaf4f0; color: var(--brand); }
    .nav-btn.active {
      background: #eaf4f0;
      color: var(--brand);
      font-weight: 700;
      box-shadow: inset 3px 0 0 var(--brand);
    }
    .nav-btn .badge {
      margin-right: auto;
      background: #d54a4a;
      color: white;
      font-size: 10px;
      padding: 2px 7px;
      border-radius: 12px;
      font-weight: 700;
    }
    
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--line);
      background: #fafcfb;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #e4f1ed;
      color: var(--brand);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 15px;
    }
    .user-info b { font-size: 13px; display: block; }
    .user-info small { font-size: 11px; color: var(--muted); }
    .role-badge {
      display: inline-block;
      font-size: 10px;
      background: #e2f0ea;
      color: var(--brand);
      padding: 2px 7px;
      border-radius: 6px;
      font-weight: 700;
    }
    .dev-credit {
      text-align: center;
      font-size: 10.5px;
      color: var(--muted);
      opacity: 0.7;
      padding-top: 6px;
    }
    
    /* Main Content */
    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .topbar {
      height: 74px;
      background: #ffffff;
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: center;
      padding: 0 28px;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .menu-toggle {
      display: none;
      background: none;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 18px;
    }
    .topbar-title h1 { font-size: 19px; font-weight: 700; color: var(--ink); }
    .topbar-title small { font-size: 11.5px; color: var(--muted); }
    .topbar-actions {
      margin-right: auto;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .role-picker {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f0f6f3;
      padding: 6px 12px;
      border-radius: 10px;
      border: 1px solid #d2e6dc;
      font-size: 12px;
    }
    .role-picker select {
      background: white;
      border: 1px solid #c2ded0;
      border-radius: 6px;
      padding: 5px 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--brand2);
      outline: none;
    }
    
    .btn-primary {
      background: var(--brand);
      color: white;
      border: 0;
      padding: 9px 16px;
      border-radius: 9px;
      font-weight: 700;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }
    .btn-primary:hover { background: var(--brand2); }
    .btn-outline {
      background: white;
      border: 1px solid var(--line);
      padding: 8px 14px;
      border-radius: 9px;
      font-weight: 600;
      font-size: 12.5px;
      color: var(--ink);
    }
    .btn-warning {
      background: #f59e0b;
      color: white;
      border: 0;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
    }
    
    .content-body {
      padding: 24px 28px;
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
    }
    
    /* Hero */
    .hero-banner {
      background: linear-gradient(135deg, #0d4e3d 0%, #176b55 100%);
      color: white;
      border-radius: 18px;
      padding: 26px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
    }
    .hero-banner:after {
      content: "";
      position: absolute;
      width: 320px;
      height: 320px;
      border: 60px solid rgba(255,255,255,0.05);
      border-radius: 50%;
      bottom: -120px;
      left: -80px;
    }
    .hero-content h2 { font-size: 25px; margin-bottom: 6px; }
    .hero-content p { font-size: 13px; opacity: 0.88; max-width: 650px; }
    .hero-pills { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
    .hero-pill { background: rgba(255,255,255,0.15); padding: 5px 12px; border-radius: 20px; font-size: 12px; }
    
    /* Stats Cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }
    .stat-card span { font-size: 12px; color: var(--muted); }
    .stat-card strong { font-size: 24px; color: var(--ink); font-weight: 800; }
    .stat-card small { font-size: 11.5px; color: var(--brand); font-weight: 600; }
    
    /* Progress Bars for Target */
    .progress-bar-wrap {
      width: 100%;
      height: 8px;
      background: #e6edea;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 6px;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: 10px;
      transition: width 0.3s ease;
    }
    .fill-green { background: #10b981; }
    .fill-yellow { background: #f59e0b; }
    .fill-red { background: #ef4444; }
    
    /* Tables and Cards */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .section-header h3 { font-size: 18px; font-weight: 700; }
    
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .client-card {
      background: white;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }
    .client-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .client-card h4 { font-size: 15px; margin-bottom: 2px; }
    .client-card p { font-size: 12px; color: var(--muted); }
    .badge-type {
      background: #eef4f1;
      color: var(--brand);
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
    }
    .client-meta {
      display: flex;
      gap: 8px;
      font-size: 11.5px;
      color: var(--muted);
      flex-wrap: wrap;
    }
    .client-meta span { display: flex; align-items: center; gap: 4px; }
    .client-actions {
      border-top: 1px solid var(--line);
      padding-top: 10px;
      display: flex;
      gap: 8px;
    }
    .btn-sm {
      padding: 6px 10px;
      border-radius: 7px;
      font-size: 11.5px;
      font-weight: 600;
      border: 1px solid var(--line);
      background: #fafcfb;
      color: var(--ink);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .btn-sm.primary { background: #eaf4f0; color: var(--brand); border-color: #cde4db; }
    
    /* Table */
    .table-container {
      background: white;
      border: 1px solid var(--line);
      border-radius: 14px;
      overflow-x: auto;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      margin-bottom: 24px;
    }
    table { width: 100%; border-collapse: collapse; text-align: right; }
    th {
      background: #fafcfb;
      padding: 12px 16px;
      font-size: 12px;
      color: var(--muted);
      border-bottom: 1px solid var(--line);
      font-weight: 700;
    }
    td {
      padding: 13px 16px;
      border-bottom: 1px solid var(--line);
      font-size: 13px;
    }
    tr:last-child td { border-bottom: 0; }
    .status-pill {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    .status-confirmed, .status-approved { background: #e3f5ec; color: #116847; }
    .status-submitted, .status-pending { background: #fdf2dc; color: #9c6c13; }
    .status-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .status-rejected { background: #fde8e8; color: #b02a2a; }
    
    /* Price Threshold Warning Box */
    .price-alert-box {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 10px;
      padding: 12px 14px;
      color: #92400e;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    /* Modals */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(16,32,26,0.6);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(2px);
    }
    .modal-box {
      background: white;
      border-radius: 16px;
      width: min(680px, 100%);
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 50px rgba(0,0,0,0.25);
    }
    .modal-header {
      padding: 18px 22px;
      border-bottom: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 { font-size: 17px; }
    .modal-close {
      background: none;
      border: 0;
      font-size: 20px;
      color: var(--muted);
      cursor: pointer;
    }
    .modal-body { padding: 20px 22px; display: grid; gap: 14px; }
    .form-group { display: grid; gap: 6px; }
    .form-group label { font-size: 12.5px; font-weight: 700; color: var(--ink); }
    .form-group input, .form-group select, .form-group textarea {
      border: 1px solid #d2ded9;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      outline: none;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 3px rgba(23,107,85,0.1);
    }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .modal-footer {
      padding: 14px 22px;
      border-top: 1px solid var(--line);
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      background: #fafcfb;
    }
    
    /* Presentation Tab */
    .deck-frame {
      width: 100%;
      height: 82vh;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: #0b0f19;
    }
    
    /* Toast */
    .toast-msg {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: #133c30;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 200;
      display: none;
    }
    
    @media (max-width: 820px) {
      .sidebar {
        position: fixed;
        right: 0;
        transform: translateX(100%);
      }
      .sidebar.open { transform: translateX(0); }
      .menu-toggle { display: block; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .form-row-2 { grid-template-columns: 1fr; }
      .content-body { padding: 16px; }
      .topbar { padding: 0 16px; }
    }
  </style>
</head>
<body>

<div class="app-wrapper">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">K</div>
      <div class="brand-text">
        <b>KENAVET</b>
        <small>إدارة المناديب والعمليات والمخازن</small>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <button class="nav-btn active" id="btn-dashboard" onclick="showTab('dashboard')">
        <span>📊</span> الرئيسية (Dashboard)
      </button>
      <button class="nav-btn" id="btn-customers" onclick="showTab('customers')">
        <span>🏪</span> العملاء والأطباء
      </button>
      <button class="nav-btn" id="btn-visits" onclick="showTab('visits')">
        <span>⚡</span> التقارير اليومية (Visits)
      </button>
      <button class="nav-btn" id="btn-collections" onclick="showTab('collections')">
        <span>💰</span> التحصيلات المالية
      </button>
      <button class="nav-btn" id="btn-invoices" onclick="showTab('invoices')">
        <span>📑</span> الفواتير والحد الأدنى للأسعار
        <span class="badge" id="pendingInvoicesBadge" style="display:none;">1</span>
      </button>
      <button class="nav-btn" id="btn-rep-targets" onclick="showTab('rep_targets')">
        <span>📈</span> تقرير تحقيق المناديب (YTD وشهري)
      </button>
      <button class="nav-btn" id="btn-warehouse" onclick="showTab('warehouse')">
        <span>📦</span> المخازن واستلام الكميات
      </button>
      <button class="nav-btn" id="btn-leaves" onclick="showTab('leaves')">
        <span>🌴</span> الإجازات والاعتمادات
        <span class="badge" id="pendingLeaveBadge">2</span>
      </button>
      <button class="nav-btn" id="btn-radar" onclick="showTab('radar')">
        <span>🧭</span> رادار GPS والعملاء القريبين
      </button>
      <button class="nav-btn" id="btn-team" onclick="showTab('team')">
        <span>👥</span> فريق العمل والمناديب
      </button>
      <button class="nav-btn" id="btn-presentation" onclick="showTab('presentation')">
        <span>🎬</span> العرض التقديمي والتحميلات
      </button>
    </nav>
    
    <div class="sidebar-footer">
      <div class="user-pill">
        <div class="user-avatar" id="avatarLetter">م</div>
        <div class="user-info">
          <b id="userName">م. محمد الحاوي (المدير العام)</b>
          <small id="userEmail">admin@fieldforce.local</small>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="role-badge" id="roleBadge">Super Admin (المدير العام)</span>
        <span style="font-size:11px;color:var(--brand);font-weight:700;" id="userTerritory">27 محافظة</span>
      </div>
      <div class="dev-credit">برمجة وتطوير: م. محمد الحاوي © KENAVET</div>
    </div>
  </aside>

  <!-- Main Area -->
  <div class="main-wrapper">
    <header class="topbar">
      <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
      <div class="topbar-title">
        <h1 id="pageTitle">لوحة القيادة والمؤشرات الميدانية</h1>
        <small id="pageSubtitle">شركة KENAVET للأدوية واللقاحات البيطرية</small>
      </div>
      
      <div class="topbar-actions">
        <!-- Live Role Switcher for instant testing -->
        <div class="role-picker">
          <span>تبديل المستخدم:</span>
          <select id="userSelector" onchange="changeUserRole(this.value)">
            <option value="admin">👑 المدير العام (Admin) — شامل كل الصلاحيات والتقارير</option>
            <option value="manager">👔 مدير المنطقة (Tanta Mgr) — اعتماد استثناءات الأسعار والتقارير</option>
            <option value="rep">🩺 د. أحمد محمد (Rep) — مندوب المبيعات الميداني</option>
            <option value="acc">💼 إيمان عادل (Finance) — الإدارة المالية والتحصيلات</option>
            <option value="warehouse">📦 عم حامد دسوقي (Warehouse) — أمين المخزن (استلام كميات وأصناف فقط)</option>
          </select>
        </div>
        
        <button class="btn-primary" id="btnQuickAction" onclick="openActionModal()">
          <span>+</span> إضافة عملية جديدة
        </button>
      </div>
    </header>

    <div class="content-body" id="mainContent">
      <!-- Dynamic Views Injected Here -->
    </div>
  </div>
</div>

<!-- Modal Dialog -->
<div class="modal-backdrop" id="modalBackdrop" style="display:none;">
  <div class="modal-box" id="modalBox">
    <!-- Dynamic Modal Content -->
  </div>
</div>

<!-- Toast -->
<div class="toast-msg" id="toast"></div>

<!-- Embedded Real Data & Complete Logic -->
<script>
  // 1. KENAVET Products Catalog with Official & Minimum Floor Selling Prices
  const kenavetProducts = [
    { id: 'P01', name: 'كينا-فلور 30% (فلورفينيكول بيطري فموي 1 لتر)', listPrice: 450, minPrice: 380, unit: 'لتر' },
    { id: 'P02', name: 'كينا-كولستين 100 جم (مضاد حيوي معوي تركيز عالي)', listPrice: 180, minPrice: 150, unit: 'عبوة' },
    { id: 'P03', name: 'تايلوزين فوسفات 20% (مضاد للميكوبلازما 1 كجم)', listPrice: 320, minPrice: 270, unit: 'كجم' },
    { id: 'P04', name: 'لقاح نيوكاسل + جمبورو مستورد معتمد (1000 جرعة)', listPrice: 850, minPrice: 750, unit: 'أمبول' },
    { id: 'P05', name: 'توكسين-أوف بيولوجي مضاد سموم فطرية ومنشط كبد (5 لتر)', listPrice: 620, minPrice: 530, unit: 'جالون' },
    { id: 'P06', name: 'أملاح وفيتامينات هـ + سيلينيوم فورت (1 كجم)', listPrice: 210, minPrice: 175, unit: 'كجم' },
    { id: 'P07', name: 'أموكسيسيلين 50% بيطري فورت سريع الامتصاص (1 كجم)', listPrice: 390, minPrice: 330, unit: 'كجم' },
    { id: 'P08', name: 'كينا-دوكسي 20% بودرة مائية للعلاج التنفسي (500 جم)', listPrice: 280, minPrice: 240, unit: 'عبوة' }
  ];

  // 2. Governorates & Cities of Egypt (27 Governorates)
  const governorates = [
    {name: "القاهرة", areas: ["مدينة نصر", "المعادي", "مصر الجديدة", "التجمع الخامس", "حلوان", "شبرا", "وسط البلد", "المرج", "الزيتون", "المقطم"]},
    {name: "الجيزة", areas: ["الدقي", "المهندسين", "الهرم", "فيصل", "6 أكتوبر", "الشيخ زايد", "العجوزة", "الحوامدية", "البدرشين", "العياط"]},
    {name: "الإسكندرية", areas: ["سموحة", "ميامي", "المنتزه", "الرمل", "العجمي", "سيدي جابر", "لوران", "محرم بك", "برج العرب", "العامرية"]},
    {name: "الشرقية", areas: ["الزقازيق", "بلبيس", "منيا القمح", "فاقوس", "العاشر من رمضان", "أبو حماد", "ديرب نجم", "القنايات", "ههيا", "أبو كبير"]},
    {name: "الغربية", areas: ["طنطا", "المحلة الكبرى", "كفر الزيات", "زفتى", "السنطة", "بسيون", "سمنود", "قطور"]},
    {name: "الدقهلية", areas: ["المنصورة", "ميت غمر", "السنبلاوين", "دكرنس", "طلخا", "بلقاس", "شربين", "أجا", "المنزلة"]},
    {name: "القليوبية", areas: ["بنها", "شبرا الخيمة", "قليوب", "الخانكة", "القناطر الخيرية", "طوخ", "كفر شكر", "العبور"]},
    {name: "المنوفية", areas: ["شبين الكوم", "قويسنا", "بركة السبع", "تلا", "الشهداء", "منوف", "أشمون", "السادات"]},
    {name: "البحيرة", areas: ["دمنهور", "كفر الدوار", "إيتاي البارود", "كوم حمادة", "أبو المطامير", "حوش عيسى", "رشيد", "وادي النطرون"]},
    {name: "كفر الشيخ", areas: ["كفر الشيخ", "دسوق", "فوه", "مطوبس", "بيلا", "قلين", "سيدي سالم", "الحامول", "بلطيم"]},
    {name: "دمياط", areas: ["دمياط", "دمياط الجديدة", "رأس البر", "كفر سعد", "فارسكور", "الزرقا"]},
    {name: "بورسعيد", areas: ["حي الشرق", "حي العرب", "حي المناخ", "حي الضواحي", "بورفؤاد"]},
    {name: "الإسماعيلية", areas: ["الإسماعيلية", "فايد", "القنطرة غرب", "القنطرة شرق", "التل الكبير"]},
    {name: "السويس", areas: ["حي السويس", "الأربعين", "الجناين", "حي فيصل", "عتاقة"]},
    {name: "الفيوم", areas: ["الفيوم", "سنورس", "إطسا", "طامية", "يوسف الصديق", "أبشواي"]},
    {name: "بني سويف", areas: ["بني سويف", "الواسطى", "ناصر", "إهناسيا", "ببا", "الفشن", "سمسطا"]},
    {name: "المنيا", areas: ["المنيا", "مغاغة", "بني مزار", "مطاي", "سمالوط", "أبو قرقاص", "ملوي"]},
    {name: "أسيوط", areas: ["أسيوط", "ديروط", "القوصية", "أبنوب", "منفلوط", "الفتح", "أبو تيج"]},
    {name: "سوهاج", areas: ["سوهاج", "أخميم", "المراغة", "طهطا", "طما", "جهينة", "جرجا"]},
    {name: "قنا", areas: ["قنا", "نجع حمادي", "دشنا", "قوص", "أبو تشت", "فرشوط", "نقادة"]},
    {name: "الأقصر", areas: ["الأقصر", "إسنا", "أرمنت", "القرنة", "البياضية", "الزينية"]},
    {name: "أسوان", areas: ["أسوان", "كوم أمبو", "إدفو", "نصر النوبة", "دراو", "أبو سمبل"]},
    {name: "مطروح", areas: ["مرسى مطروح", "الحمام", "العلمين", "الضبعة", "سيوة", "السلوم"]},
    {name: "البحر الأحمر", areas: ["الغردقة", "سفاجا", "القصير", "مرسى علم", "رأس غارب"]},
    {name: "الوادي الجديد", areas: ["الخارجة", "الداخلة", "الفرافرة", "باريس", "بلاط"]},
    {name: "شمال سيناء", areas: ["العريش", "بئر العبد", "الشيخ زويد", "رفح"]},
    {name: "جنوب سيناء", areas: ["شرم الشيخ", "طور سيناء", "دهب", "نويبع", "رأس سدر"]}
  ];

  // 3. User Roles Profile Definitions
  const defaultUsers = {
    admin: {
      name: "م. محمد الحاوي (المدير العام)",
      email: "admin@fieldforce.local",
      role: "Super Admin",
      roleAr: "المدير العام",
      governorate: "كافة المحافظات (27 محافظة)",
      canAll: true,
      canApprove: true,
      canFinance: true,
      canViewInvoices: true,
      canWarehouse: true,
      canTargets: true
    },
    manager: {
      name: "د. خالد منصور (مدير فرع طنطا والدلتا)",
      email: "tanta.mgr@fieldforce.local",
      role: "Area Manager",
      roleAr: "مدير منطقة الغربية والدلتا",
      governorate: "الغربية والدلتا",
      canAll: false,
      canApprove: true,
      canFinance: false,
      canViewInvoices: true,
      canWarehouse: true,
      canTargets: true
    },
    rep: {
      name: "د. أحمد محمد (طبيب ومندوب بيطري)",
      email: "dr.ahmed@fieldforce.local",
      role: "Representative",
      roleAr: "طبيب ومندوب بيطري",
      governorate: "الشرقية",
      canAll: false,
      canApprove: false,
      canFinance: false,
      canViewInvoices: true, // Can create and view their own invoices with min price check
      canWarehouse: false,
      canTargets: false
    },
    acc: {
      name: "إيمان عادل (الإدارة المالية)",
      email: "acc@fieldforce.local",
      role: "Finance",
      roleAr: "محاسب مالي معتمد",
      governorate: "الإدارة المالية المركزية",
      canAll: false,
      canApprove: false,
      canFinance: true,
      canViewInvoices: true,
      canWarehouse: true,
      canTargets: true
    },
    warehouse: {
      name: "عم حامد دسوقي (أمين المخزن الرئيسي)",
      email: "store@fieldforce.local",
      role: "Warehouse",
      roleAr: "أمين المخزن والتوريدات",
      governorate: "المخزن المركزي (العاشر من رمضان)",
      canAll: false,
      canApprove: false,
      canFinance: false,
      canViewInvoices: false,
      canWarehouse: true,
      canTargets: false
    }
  };

  let currentUser = defaultUsers.admin;
  let activeTab = 'dashboard';

  // Reps Target & Actual Data (Year-To-Date and Monthly Performance in EGP)
  const repsPerformanceData = [
    {
      code: "EMP-006",
      name: "د. أحمد محمد الشافعي",
      territory: "الشرقية (الزقازيق، بلبيس، القنايات)",
      ytdSalesTarget: 950000,
      ytdSalesActual: 980000,
      ytdCollectTarget: 800000,
      ytdCollectActual: 835000,
      monthlySalesTarget: 110000,
      monthlySalesActual: 118000,
      monthlyCollectTarget: 95000,
      monthlyCollectActual: 102000
    },
    {
      code: "EMP-007",
      name: "م. عمر إبراهيم حسنين",
      territory: "القاهرة والجيزة (مدينة نصر، 6 أكتوبر)",
      ytdSalesTarget: 1100000,
      ytdSalesActual: 1040000,
      ytdCollectTarget: 900000,
      ytdCollectActual: 885000,
      monthlySalesTarget: 125000,
      monthlySalesActual: 120000,
      monthlyCollectTarget: 105000,
      monthlyCollectActual: 98000
    },
    {
      code: "EMP-008",
      name: "د. يوسف خالد المنصوري",
      territory: "الدقهلية (المنصورة، ميت غمر، دكرنس)",
      ytdSalesTarget: 850000,
      ytdSalesActual: 890000,
      ytdCollectTarget: 720000,
      ytdCollectActual: 745000,
      monthlySalesTarget: 100000,
      monthlySalesActual: 106000,
      monthlyCollectTarget: 85000,
      monthlyCollectActual: 91000
    },
    {
      code: "EMP-009",
      name: "د. مصطفى علي عبد الرحمن",
      territory: "الغربية (طنطا، المحلة الكبرى، زفتى)",
      ytdSalesTarget: 900000,
      ytdSalesActual: 820000,
      ytdCollectTarget: 760000,
      ytdCollectActual: 705000,
      monthlySalesTarget: 105000,
      monthlySalesActual: 94000,
      monthlyCollectTarget: 90000,
      monthlyCollectActual: 81000
    },
    {
      code: "EMP-010",
      name: "د. هبة محمود الشناوي",
      territory: "القليوبية (بنها، طوخ، القناطر الخيرية)",
      ytdSalesTarget: 750000,
      ytdSalesActual: 765000,
      ytdCollectTarget: 640000,
      ytdCollectActual: 650000,
      monthlySalesTarget: 85000,
      monthlySalesActual: 88000,
      monthlyCollectTarget: 72000,
      monthlyCollectActual: 75000
    },
    {
      code: "EMP-011",
      name: "د. كريم حسن زهران",
      territory: "البحيرة (دمنهور، كفر الدوار، كوم حمادة)",
      ytdSalesTarget: 850000,
      ytdSalesActual: 790000,
      ytdCollectTarget: 720000,
      ytdCollectActual: 680000,
      monthlySalesTarget: 95000,
      monthlySalesActual: 89000,
      monthlyCollectTarget: 80000,
      monthlyCollectActual: 73000
    }
  ];

  // Seed Initial Records in LocalStorage if empty
  function initStore() {
    if (!localStorage.getItem('kenavet_customers')) {
      const initialCustomers = [
        {id: 1, name: "مزرعة النور للدواجن (100 ألف طائر)", gov: "الشرقية", city: "الزقازيق", type: "مزرعة دواجن", class: "VIP", contact: "د. أحمد رضوان", phone: "01012345678", rep: "د. أحمد محمد", gps: "30.5877,31.5020", lat: 30.5877, lng: 31.5020},
        {id: 2, name: "صيدلية الرحمة البيطرية الكبرى", gov: "الشرقية", city: "القنايات", type: "صيدلية بيطرية", class: "A", contact: "د. سامي العوضي", phone: "01123456789", rep: "د. أحمد محمد", gps: "30.6120,31.4580", lat: 30.6120, lng: 31.4580},
        {id: 3, name: "عيادة د. حسام البيطرية", gov: "الشرقية", city: "بلبيس", type: "عيادة بيطرية", class: "B", contact: "د. حسام الشريف", phone: "01234567890", rep: "د. أحمد محمد", gps: "30.4180,31.5640", lat: 30.4180, lng: 31.5640},
        {id: 4, name: "مزرعة البركة للتسمين وإنتاج الألبان", gov: "الغربية", city: "طنطا", type: "مزرعة ماشية", class: "VIP", contact: "م. إبراهيم كمال", phone: "01099887766", rep: "د. خالد منصور", gps: "30.7865,31.0004", lat: 30.7865, lng: 31.0004},
        {id: 5, name: "شركة السلام لتجارة الأدوية واللقاحات", gov: "الغربية", city: "المحلة الكبرى", type: "موزع معتمد", class: "VIP", contact: "د. محمود شحاتة", phone: "01055443322", rep: "د. خالد منصور", gps: "30.9706,31.1669", lat: 30.9706, lng: 31.1669},
        {id: 6, name: "مزرعة الأهرام للثروة الداجنة", gov: "الجيزة", city: "6 أكتوبر", type: "مزرعة دواجن", class: "A", contact: "د. هاني شاكر", phone: "01200112233", rep: "م. مصطفى علي", gps: "29.9723,30.9421", lat: 29.9723, lng: 30.9421},
        {id: 7, name: "مجمع النيل البيطري", gov: "القاهرة", city: "مدينة نصر", type: "عيادة بيطرية", class: "A", contact: "د. شريف عبد المنعم", phone: "01088776655", rep: "د. عمر إبراهيم", gps: "30.0561,31.3301", lat: 30.0561, lng: 31.3301},
        {id: 8, name: "صيدلية الدلتا الحديثة", gov: "الدقهلية", city: "المنصورة", type: "صيدلية بيطرية", class: "B", contact: "د. وائل جلال", phone: "01177665544", rep: "د. يوسف خالد", gps: "31.0409,31.3785", lat: 31.0409, lng: 31.3785}
      ];
      localStorage.setItem('kenavet_customers', JSON.stringify(initialCustomers));
    }

    if (!localStorage.getItem('kenavet_visits')) {
      const initialVisits = [
        {id: 101, customer: "مزرعة النور للدواجن", date: "2026-09-26", rep: "د. أحمد محمد", gov: "الشرقية", type: "زيارة فنية", outcome: "تم فحص الدورة وطلب 50 كرتونة مضاد حيوي ومحصنات", gps: "30.5877, 31.5020", status: "معتمدة"},
        {id: 102, customer: "صيدلية الرحمة البيطرية", date: "2026-09-25", rep: "د. أحمد محمد", gov: "الشرقية", type: "متابعة دورية", outcome: "سداد دفعة نقدية وتسليم أحدث كتالوج للأدوية", gps: "30.6120, 31.4580", status: "معتمدة"},
        {id: 103, customer: "مزرعة البركة للتسمين", date: "2026-09-26", rep: "د. خالد منصور", gov: "الغربية", type: "زيارة طارئة", outcome: "تقديم استشارة بيطرية لعلاج أعراض تنفسية", gps: "30.7865, 31.0004", status: "معتمدة"},
        {id: 104, customer: "شركة السلام لتجارة الأدوية", date: "2026-09-24", rep: "د. خالد منصور", gov: "الغربية", type: "مراجعة كشف حساب", outcome: "استلام شيك بنكي آجل على البنك الأهلي", gps: "30.9706, 31.1669", status: "معتمدة"}
      ];
      localStorage.setItem('kenavet_visits', JSON.stringify(initialVisits));
    }

    if (!localStorage.getItem('kenavet_collections')) {
      const initialCollections = [
        {id: "COL-1001", customer: "مزرعة النور للدواجن", amount: 45000, method: "شيك بنكي", ref: "CHQ-889021", bank: "البنك الأهلي المصري", date: "2026-09-26", rep: "د. أحمد محمد", status: "مؤكد مالياً", receipt: "مرفق إيصال"},
        {id: "COL-1002", customer: "صيدلية الرحمة البيطرية", amount: 15500, method: "تحويل InstaPay", ref: "INSTA-99201", bank: "بنك مصر", date: "2026-09-25", rep: "د. أحمد محمد", status: "مؤكد مالياً", receipt: "مرفق إشعار"},
        {id: "COL-1003", customer: "شركة السلام للأدوية", amount: 82000, method: "شيك بنكي", ref: "CHQ-334109", bank: "بنك QNB", date: "2026-09-24", rep: "د. خالد منصور", status: "مؤكد مالياً", receipt: "مرفق إيصال"},
        {id: "COL-1004", customer: "مزرعة الأهرام للدواجن", amount: 28000, method: "سند نقدي", ref: "REC-4401", bank: "خزينة الشركة", date: "2026-09-23", rep: "م. مصطفى علي", status: "قيد المراجعة", receipt: "بإيصال مؤقت"}
      ];
      localStorage.setItem('kenavet_collections', JSON.stringify(initialCollections));
    }

    if (!localStorage.getItem('kenavet_invoices')) {
      const initialInvoices = [
        {
          id: "INV-2026-081",
          customer: "مزرعة النور للدواجن",
          product: "كينا-فلور 30% (فلورفينيكول بيطري فموي 1 لتر)",
          qty: 100,
          unit: "لتر",
          price: 360, // Below minPrice (380)
          listPrice: 450,
          minPrice: 380,
          total: 36000,
          rep: "د. أحمد محمد",
          date: "2026-09-26",
          status: "بانتظار اعتماد مدير المنطقة",
          priceWarning: true,
          notes: "خصم استثنائي لطلبية كميات كبيرة (100 لتر)"
        },
        {
          id: "INV-2026-082",
          customer: "شركة السلام للأدوية واللقاحات",
          product: "لقاح نيوكاسل + جمبورو مستورد معتمد (1000 جرعة)",
          qty: 50,
          unit: "أمبول",
          price: 780, // Above minPrice (750)
          listPrice: 850,
          minPrice: 750,
          total: 39000,
          rep: "د. خالد منصور",
          date: "2026-09-25",
          status: "معتمدة تلقائياً (ضمن النطاق)",
          priceWarning: false,
          notes: "سعر بيع نظامي معتمد"
        },
        {
          id: "INV-2026-083",
          customer: "صيدلية الرحمة البيطرية الكبرى",
          product: "توكسين-أوف بيولوجي مضاد سموم فطرية (5 لتر)",
          qty: 30,
          unit: "جالون",
          price: 500, // Below minPrice (530)
          listPrice: 620,
          minPrice: 530,
          total: 15000,
          rep: "د. أحمد محمد",
          date: "2026-09-24",
          status: "معتمدة من مدير المنطقة",
          priceWarning: true,
          notes: "اعتمد مدير المنطقة الخصم 30 ج.م للعبوة"
        },
        {
          id: "INV-2026-084",
          customer: "مزرعة البركة للتسمين",
          product: "تايلوزين فوسفات 20% (مضاد للميكوبلازما 1 كجم)",
          qty: 60,
          unit: "كجم",
          price: 290, // Above minPrice (270)
          listPrice: 320,
          minPrice: 270,
          total: 17400,
          rep: "د. خالد منصور",
          date: "2026-09-23",
          status: "معتمدة تلقائياً (ضمن النطاق)",
          priceWarning: false,
          notes: "سعر رسمي ضمن النطاق المسموح"
        }
      ];
      localStorage.setItem('kenavet_invoices', JSON.stringify(initialInvoices));
    }

    // Warehouse Supply Shipments (Receipts with item names and quantities only, NO PRICES)
    if (!localStorage.getItem('kenavet_warehouse_receipts')) {
      const initialReceipts = [
        {
          id: "RCV-2026-401",
          supplyDate: "2026-09-26 10:30 ص",
          itemName: "كينا-فلور 30% (فلورفينيكول بيطري فموي 1 لتر)",
          qty: "800 لتر",
          supplier: "مصنع كينافيت للأدوية واللقاحات (العبور)",
          batchNumber: "LOT-KF-260901",
          receiver: "عم حامد دسوقي (أمين المخزن)",
          condition: "تم الفحص الفني والاستلام سليم ومطابق",
          notes: "تم التخزين بالثلاجة الرئيسية في درجة حرارة 15-25 مئوية"
        },
        {
          id: "RCV-2026-402",
          supplyDate: "2026-09-25 02:15 م",
          itemName: "لقاح نيوكاسل + جمبورو مستورد معتمد (1000 جرعة)",
          qty: "1,500 أمبول",
          supplier: "شحنة الاستيراد الدولي المبردة (قرية البضائع)",
          batchNumber: "LOT-VAC-9921",
          receiver: "عم حامد دسوقي (أمين المخزن)",
          condition: "تم فحص سلسلة التبريد (Cold Chain 2-8°C)",
          notes: "استلام تحت إشراف د. مراقبة الجودة البيطرية"
        },
        {
          id: "RCV-2026-403",
          supplyDate: "2026-09-24 11:00 ص",
          itemName: "تايلوزين فوسفات 20% (مضاد للميكوبلازما 1 كجم)",
          qty: "500 كرتونة (6,000 كجم)",
          supplier: "شركة النيل للصناعات الكيماوية والبيطرية",
          batchNumber: "LOT-TYL-3301",
          receiver: "عم حامد دسوقي (أمين المخزن)",
          condition: "تم الاستلام والمطابقة لشهادة التحليل",
          notes: "تم الرص في عنبر الأدوية الجافة قطاع B"
        },
        {
          id: "RCV-2026-404",
          supplyDate: "2026-09-22 09:45 ص",
          itemName: "توكسين-أوف بيولوجي مضاد سموم فطرية (5 لتر)",
          qty: "400 جالون",
          supplier: "مصنع كينافيت للإنتاج الحيواني",
          batchNumber: "LOT-TOX-774",
          receiver: "عم حامد دسوقي (أمين المخزن)",
          condition: "سليم ومطابق للمواصفات القياسية",
          notes: "عنبر السوائل والإضافات العلفية"
        }
      ];
      localStorage.setItem('kenavet_warehouse_receipts', JSON.stringify(initialReceipts));
    }

    if (!localStorage.getItem('kenavet_leaves')) {
      const initialLeaves = [
        {id: "LV-201", rep: "د. أحمد محمد", role: "مندوب مبيعات", type: "إجازة سنوية", from: "2026-09-28", to: "2026-09-30", days: 3, reason: "ظروف عائلية خاصة", status: "قيد الانتظار"},
        {id: "LV-202", rep: "م. عمر إبراهيم", role: "مندوب القاهرة", type: "إجازة عارضة", from: "2026-09-25", to: "2026-09-25", days: 1, reason: "أمر طارئ", status: "معتمدة"},
        {id: "LV-203", rep: "د. يوسف خالد", role: "مندوب الدقهلية", type: "إجازة مرضية", from: "2026-09-26", to: "2026-09-27", days: 2, reason: "وعكة صحية وإجهاد", status: "قيد الانتظار"}
      ];
      localStorage.setItem('kenavet_leaves', JSON.stringify(initialLeaves));
    }
  }

  function getStore(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  function setStore(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Haversine Distance Calc
  function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))).toFixed(1);
  }

  // User Switcher
  function changeUserRole(roleKey) {
    currentUser = defaultUsers[roleKey] || defaultUsers.admin;
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('roleBadge').textContent = currentUser.roleAr;
    document.getElementById('avatarLetter').textContent = currentUser.name.slice(0, 1);
    document.getElementById('userTerritory').textContent = currentUser.governorate;

    // Adjust visibility of action buttons
    const quickBtn = document.getElementById('btnQuickAction');
    if (currentUser.role === 'Warehouse') {
      quickBtn.innerHTML = '<span>+</span> إذن استلام مخزني';
      showTab('warehouse');
    } else {
      quickBtn.innerHTML = '<span>+</span> إضافة عملية جديدة';
      showTab(activeTab === 'warehouse' ? 'dashboard' : activeTab);
    }

    showToast('تم التبديل بنجاح إلى: ' + currentUser.roleAr);
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3200);
  }

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
  }

  // Tabs Navigation
  function showTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const curBtn = document.getElementById('btn-' + tabId.replace('_', '-'));
    if (curBtn) curBtn.classList.add('active');

    const main = document.getElementById('mainContent');
    const title = document.getElementById('pageTitle');
    const subtitle = document.getElementById('pageSubtitle');

    if (window.innerWidth <= 820) {
      document.getElementById('sidebar').classList.remove('open');
    }

    if (tabId === 'dashboard') {
      title.textContent = 'لوحة القيادة والمؤشرات الميدانية والمبيعات';
      subtitle.textContent = 'نظام إدارة المناديب والعمليات والمخازن البيطرية | KENAVET';
      renderDashboard();
    } else if (tabId === 'customers') {
      title.textContent = 'سجل العملاء والمزارع والعيادات البيطرية';
      subtitle.textContent = 'تكويد وتوزيع عملاء 27 محافظة مصرية مع إحداثيات GPS';
      renderCustomers();
    } else if (tabId === 'visits') {
      title.textContent = 'التقارير اليومية والزيارات الميدانية';
      subtitle.textContent = 'توثيق خط السير، إثبات الزيارة، وتحديد العميل بناءً على منطقته';
      renderVisits();
    } else if (tabId === 'collections') {
      title.textContent = 'سندات التحصيل المالي وإيصالات الخزينة';
      subtitle.textContent = 'إثباتات التحصيل النقدي، الشيكات البنكية، ومعاملات InstaPay بالجنيه';
      renderCollections();
    } else if (tabId === 'invoices') {
      title.textContent = 'فواتير المبيعات والحد الأدنى للأسعار مع موافقة مدير المنطقة';
      subtitle.textContent = 'التحقق الآلي من الحد الأدنى لسعر بيع كل صنف وطلب اعتماد مدير المنطقة عند تجاوزه';
      renderInvoices();
    } else if (tabId === 'rep_targets') {
      title.textContent = 'تقرير أداء وتحقيق المناديب (Year-To-Date وشهري)';
      subtitle.textContent = 'مبيعات وتحصيلات المناديب بالجنيه المصري (EGP) مقارنة بالمستهدفات ونسب التحقيق';
      renderRepTargets();
    } else if (tabId === 'warehouse') {
      title.textContent = 'المخازن والتوريدات (استلام كميات وأسماء الأصناف وموعد التوريد)';
      subtitle.textContent = 'صلاحية مخصصة لأمناء المخازن لاستلام الشحنات وتوثيق الكميات دون إظهار الأسعار';
      renderWarehouse();
    } else if (tabId === 'leaves') {
      title.textContent = 'منظومة الإجازات والأرصدة والاعتمادات';
      subtitle.textContent = 'طلبات الإجازات، أرصدة الموظفين، والموافقات الإدارية اللحظية';
      renderLeaves();
    } else if (tabId === 'radar') {
      title.textContent = 'رادار GPS والعملاء الأقرب لموقع المندوب';
      subtitle.textContent = 'تحديد المزارع والعيادات في نطاق المندوب بناءً على خطوط الطول والعرض';
      renderRadar();
    } else if (tabId === 'team') {
      title.textContent = 'كشف أطباء ومندوبي شركة KENAVET';
      subtitle.textContent = 'كود الموظف التسلسلي EMP، المحافظات المسندة، والرتب الوظيفية';
      renderTeam();
    } else if (tabId === 'presentation') {
      title.textContent = 'العرض التقديمي التفاعلي وحزمة التحميلات';
      subtitle.textContent = 'تطبيق الأندرويد APK، العرض التقديمي PDF، ودليل الاستخدام الشامل Word';
      renderPresentation();
    }
  }

  // --- Views Renders ---
  function renderDashboard() {
    const custs = getStore('kenavet_customers');
    const visits = getStore('kenavet_visits');
    const cols = getStore('kenavet_collections');
    const invs = getStore('kenavet_invoices');
    const receipts = getStore('kenavet_warehouse_receipts');
    const totalCollected = cols.reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const pendingPriceInvs = invs.filter(i => i.status.includes('بانتظار اعتماد')).length;

    let html = \`
      <div class="hero-banner">
        <div class="hero-content">
          <h2>مرحباً بك في منصة KENAVET المتكاملة 🌿</h2>
          <p>أهلاً بك يا <strong>\${currentUser.name}</strong>. النظام يربط بين المناديب في الميدان، إدارة المبيعات، الإدارة المالية، وأمناء المخازن في منظومة موحدة سريعة ودقيقة.</p>
          <div class="hero-pills">
            <span class="hero-pill">📍 النطاق الجغرافي: \${currentUser.governorate}</span>
            <span class="hero-pill">🛡️ الدور الوظيفي: \${currentUser.roleAr}</span>
            <span class="hero-pill">📱 تطبيق الهاتف: متصل أونلاين 24/7</span>
          </div>
        </div>
        <div style="text-align:left;">
          <button class="btn-primary" style="background:#fff;color:var(--brand2);" onclick="showTab('rep_targets')">
            📈 تقرير تحقيق المناديب (YTD) ←
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span>إجمالي العملاء والمزارع</span>
          <strong>\${custs.length}</strong>
          <small>موزعين عبر 27 محافظة</small>
        </div>
        <div class="stat-card">
          <span>التقارير الميدانية بالـ GPS</span>
          <strong>\${visits.length}</strong>
          <small>زيارات موثقة لحظياً</small>
        </div>
        <div class="stat-card">
          <span>إجمالي التحصيلات (EGP)</span>
          <strong style="color:var(--brand);">\${totalCollected.toLocaleString()} ج.م</strong>
          <small>شيكات، نقد، وInstaPay</small>
        </div>
        <div class="stat-card">
          <span>فواتير تتطلب موافقة السعر</span>
          <strong style="\${pendingPriceInvs > 0 ? 'color:#b45309;' : 'color:var(--brand);'}">\${pendingPriceInvs}</strong>
          <small>تجاوزت الحد الأدنى للخصم</small>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:20px;">
        <div class="table-container">
          <div style="padding:16px 20px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;">
            <h4 style="margin:0;">آخر الزيارات والتقارير الميدانية</h4>
            <a href="javascript:showTab('visits')" style="font-size:12px;color:var(--brand);text-decoration:none;font-weight:700;">عرض الكل ←</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>العميل / المزرعة</th>
                <th>المندوب</th>
                <th>المحافظة</th>
                <th>النتيجة والطلبية</th>
              </tr>
            </thead>
            <tbody>
              \${visits.slice(0, 4).map(v => \`
                <tr>
                  <td><strong>\${v.customer}</strong></td>
                  <td>\${v.rep}</td>
                  <td><span class="badge-type">\${v.gov}</span></td>
                  <td><small style="color:var(--muted)">\${v.outcome.slice(0, 48)}...</small></td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>

        <div style="background:white;border:1px solid var(--line);border-radius:14px;padding:20px;">
          <h4 style="margin-bottom:14px;">⚡ اختصارات الوظائف والعمليات الميدانية</h4>
          <div style="display:grid;gap:10px;">
            <button class="btn-sm primary" style="padding:12px;justify-content:center;" onclick="showTab('rep_targets')">
              📈 فتح تقرير أرقام وتحقيق المناديب (YTD وشهري)
            </button>
            <button class="btn-sm primary" style="padding:12px;justify-content:center;" onclick="openAddInvoiceModal()">
              📑 إدخال فاتورة جديدة مع فحص الحد الأدنى للسعر
            </button>
            <button class="btn-sm primary" style="padding:12px;justify-content:center;" onclick="showTab('warehouse')">
              📦 أذون استلام التوريدات للمخازن (كميات وأصناف)
            </button>
            <button class="btn-sm primary" style="padding:12px;justify-content:center;" onclick="openAddVisitModal()">
              📝 إرسال تقرير زيارة ميدانية (GPS)
            </button>
            <button class="btn-sm primary" style="padding:12px;justify-content:center;" onclick="openAddCollectionModal()">
              💵 تسجيل سند تحصيل مالي / شيك
            </button>
            <button class="btn-sm" style="padding:12px;justify-content:center;background:#0284c7;color:white;" onclick="showTab('presentation')">
              📱 تحميل تطبيق الأندرويد KENAVET.apk
            </button>
          </div>
        </div>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Customers ---
  function renderCustomers() {
    let custs = getStore('kenavet_customers');
    if (!currentUser.canAll && currentUser.governorate && currentUser.role === 'Representative') {
      custs = custs.filter(c => c.gov === currentUser.governorate || currentUser.governorate.includes(c.gov));
    }

    let html = \`
      <div class="section-header">
        <div>
          <h3>قائمة العملاء والمزارع (\${custs.length} عميل)</h3>
          <p style="font-size:12px;color:var(--muted);">تكويد المزارع والعيادات والصيدليات مع إحداثيات GPS وروابط خرائط جوجل</p>
        </div>
        <button class="btn-primary" onclick="openAddCustomerModal()">+ تكويد عميل جديد</button>
      </div>

      <div class="card-grid">
        \${custs.map(c => \`
          <div class="client-card">
            <div class="client-card-top">
              <div>
                <h4>\${c.name}</h4>
                <p>👤 المسؤول: \${c.contact} | 📞 \${c.phone}</p>
              </div>
              <span class="badge-type">\${c.type}</span>
            </div>
            <div class="client-meta">
              <span>📍 \${c.gov} - \${c.city}</span>
              <span>👨‍⚕️ المندوب: \${c.rep}</span>
              <span style="color:#d97706;font-weight:700;">★ تصنيف \${c.class}</span>
            </div>
            <div class="client-actions">
              <a href="https://maps.google.com/?q=\${c.gps}" target="_blank" class="btn-sm primary">
                🗺️ موقع المزرعة (Google Maps)
              </a>
              <button class="btn-sm" onclick="openAddVisitForCustomer('\${c.name}', '\${c.gov}')">
                ⚡ تقرير زيارة
              </button>
              <button class="btn-sm" onclick="openAddInvoiceForCustomer('\${c.name}')">
                📑 إصدار فاتورة
              </button>
            </div>
          </div>
        \`).join('')}
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Visits ---
  function renderVisits() {
    let visits = getStore('kenavet_visits');
    if (!currentUser.canAll && currentUser.governorate && currentUser.role === 'Representative') {
      visits = visits.filter(v => v.gov === currentUser.governorate);
    }

    let html = \`
      <div class="section-header">
        <div>
          <h3>التقارير والزيارات اليومية الموثقة بالـ GPS</h3>
          <p style="font-size:12px;color:var(--muted);">لا يحتاج المندوب لكتابة اسم العميل يدوياً؛ بل يختاره من قائمة عملاء منطقته</p>
        </div>
        <button class="btn-primary" onclick="openAddVisitModal()">+ إرسال تقرير زيارة جديد</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>العميل / المزرعة</th>
              <th>التاريخ</th>
              <th>المندوب المسجل</th>
              <th>المحافظة</th>
              <th>نوع الزيارة</th>
              <th>إحداثيات الـ GPS</th>
              <th>نتيجة الزيارة والطلبات</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            \${visits.map(v => \`
              <tr>
                <td><strong>\${v.id}</strong></td>
                <td><strong>\${v.customer}</strong></td>
                <td>\${v.date}</td>
                <td>\${v.rep}</td>
                <td><span class="badge-type">\${v.gov}</span></td>
                <td>\${v.type}</td>
                <td><small style="color:var(--brand);font-weight:700;">📍 \${v.gps}</small></td>
                <td>\${v.outcome}</td>
                <td><span class="status-pill status-confirmed">\${v.status}</span></td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Collections ---
  function renderCollections() {
    let cols = getStore('kenavet_collections');

    let html = \`
      <div class="section-header">
        <div>
          <h3>سندات التحصيل المالي والشيكات البنكية (بالجنيه المصري)</h3>
          <p style="font-size:12px;color:var(--muted);">توثيق عمليات التحصيل الميداني، رقم الشيك، البنك، وتأكيد الإدارة المالية</p>
        </div>
        <button class="btn-primary" onclick="openAddCollectionModal()">+ تسجيل سند تحصيل جديد</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>رقم السند</th>
              <th>العميل</th>
              <th>المبلغ المحصل</th>
              <th>طريقة السداد</th>
              <th>المرجع / رقم الشيك</th>
              <th>البنك / الخزينة</th>
              <th>التاريخ</th>
              <th>المندوب المحصل</th>
              <th>الحالة المالية</th>
            </tr>
          </thead>
          <tbody>
            \${cols.map(c => \`
              <tr>
                <td><strong>\${c.id}</strong></td>
                <td><strong>\${c.customer}</strong></td>
                <td style="color:var(--brand);font-weight:800;">\${Number(c.amount).toLocaleString()} ج.م</td>
                <td><span class="badge-type">\${c.method}</span></td>
                <td><code>\${c.ref}</code></td>
                <td>\${c.bank}</td>
                <td>\${c.date}</td>
                <td>\${c.rep}</td>
                <td><span class="status-pill \${c.status.includes('مؤكد')?'status-confirmed':'status-pending'}">\${c.status}</span></td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Invoices with Minimum Price Threshold & Area Manager Approval ---
  function renderInvoices() {
    let invs = getStore('kenavet_invoices');

    let html = \`
      <div class="section-header">
        <div>
          <h3>فواتير المبيعات والتحقق من الحد الأدنى للأسعار</h3>
          <p style="font-size:12px;color:var(--muted);">
            لكل منتج بيطري حد أدنى لسعر البيع المسموح؛ في حال تجاوزه للأسفل يتطلب الأمر اعتماد وموافقة <strong>مدير المنطقة</strong>.
          </p>
        </div>
        <button class="btn-primary" onclick="openAddInvoiceModal()">+ إدخال فاتورة مبيعات جديدة</button>
      </div>

      <!-- Price Policy Guide -->
      <div style="background:#f0f7f4;border:1px solid #c9e3d8;border-radius:12px;padding:14px 18px;margin-bottom:18px;">
        <h4 style="color:var(--brand2);font-size:13.5px;margin-bottom:6px;">📋 لائحة الأسعار الرسمية والحد الأدنى للبيع المعتمد بشركة KENAVET:</h4>
        <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:12px;">
          \${kenavetProducts.map(p => \`
            <span style="background:white;padding:5px 10px;border-radius:8px;border:1px solid #d2ded9;">
              <strong>\${p.name.split(' ')[0]}</strong>: رسمي \${p.listPrice} ج.م | 
              <b style="color:#b45309;">حد أدنى: \${p.minPrice} ج.م</b>
            </span>
          \`).join('')}
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>العميل / المزرعة</th>
              <th>الصنف البيطري</th>
              <th>الكمية</th>
              <th>سعر البيع الفعلي</th>
              <th>الحد الأدنى المسموح</th>
              <th>الإجمالي</th>
              <th>المندوب</th>
              <th>حالة الفاتورة والاعتماد</th>
              \${currentUser.canApprove ? '<th>قرار مدير المنطقة</th>' : ''}
            </tr>
          </thead>
          <tbody>
            \${invs.map(inv => \`
              <tr>
                <td><strong>\${inv.id}</strong></td>
                <td><strong>\${inv.customer}</strong></td>
                <td>\${inv.product}</td>
                <td>\${inv.qty} \${inv.unit}</td>
                <td style="\${inv.price < inv.minPrice ? 'color:#b91c1c;font-weight:800;' : 'color:var(--brand);font-weight:700;'}">
                  \${inv.price} ج.م
                </td>
                <td style="color:var(--muted);font-weight:600;">\${inv.minPrice} ج.م</td>
                <td style="color:var(--brand);font-weight:800;">\${Number(inv.total).toLocaleString()} ج.م</td>
                <td>\${inv.rep}</td>
                <td>
                  <span class="status-pill \${inv.status.includes('بانتظار') ? 'status-warning' : 'status-confirmed'}">
                    \${inv.status}
                  </span>
                </td>
                \${currentUser.canApprove ? \`
                  <td>
                    \${inv.status.includes('بانتظار') ? \`
                      <button class="btn-sm primary" onclick="approveInvoicePrice('\${inv.id}')" title="موافقة مدير المنطقة على استثناء السعر">
                        ✓ اعتماد السعر
                      </button>
                      <button class="btn-sm" style="color:red;" onclick="rejectInvoicePrice('\${inv.id}')" title="رفض السعر وإلزام المندوب بالحد الأدنى">
                        ✗ رفض
                      </button>
                    \` : '<small style="color:#10b981;font-weight:700;">معتمدة نظامياً</small>'}
                  </td>
                \` : ''}
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  function approveInvoicePrice(id) {
    const invs = getStore('kenavet_invoices');
    const inv = invs.find(i => i.id === id);
    if (inv) {
      inv.status = 'معتمدة من مدير المنطقة (استثناء سعر)';
      setStore('kenavet_invoices', invs);
      showToast('✓ قام مدير المنطقة باعتماد السعر الاستثنائي للفاتورة ' + id);
      renderInvoices();
    }
  }

  function rejectInvoicePrice(id) {
    const invs = getStore('kenavet_invoices');
    const inv = invs.find(i => i.id === id);
    if (inv) {
      inv.status = 'مرفوضة من مدير المنطقة (تجاوز الحد الأدنى)';
      setStore('kenavet_invoices', invs);
      showToast('✗ تم رفض السعر الاستثنائي. يجب تعديل السعر للحد الأدنى المسموح.');
      renderInvoices();
    }
  }

  // --- Warehouse & Supplies Module (Quantities and Items Only, No Prices) ---
  function renderWarehouse() {
    const receipts = getStore('kenavet_warehouse_receipts');

    let html = \`
      <div class="section-header">
        <div>
          <h3>إدارة المخازن واستلام الكميات والتوريدات</h3>
          <p style="font-size:12px;color:var(--muted);">
            صلاحية مخصصة لأمناء المخازن لاستلام الشحنات وتوثيق <strong>الكميات بأسماء الأصناف فقط وموعد التوريد</strong> دون ظهور أي مبالغ أو أسعار مالية.
          </p>
        </div>
        <button class="btn-primary" onclick="openAddWarehouseReceiptModal()">+ تسجيل إذن استلام توريد جديد</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span>إجمالي أذون التوريد المستلمة</span>
          <strong>\${receipts.length}</strong>
          <small>مطابقة للمواصفات</small>
        </div>
        <div class="stat-card">
          <span>حالة سلسلة التبريد (Cold Chain)</span>
          <strong style="color:var(--brand);">2 - 8 °C</strong>
          <small>مراقبة حرارة اللقاحات</small>
        </div>
        <div class="stat-card">
          <span>المخزن الرئيسي</span>
          <strong>قطاع A / B</strong>
          <small>العاشر من رمضان</small>
        </div>
        <div class="stat-card">
          <span>أمين المخزن المسؤول</span>
          <strong style="font-size:16px;">عم حامد دسوقي</strong>
          <small>إذن تسليم واستلام</small>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>رقم إذن الاستلام</th>
              <th>موعد وتاريخ التوريد</th>
              <th>اسم الصنف فقط</th>
              <th>الكمية المستلمة</th>
              <th>جهة التوريد / المورد</th>
              <th>رقم التشغيلة (Batch)</th>
              <th>حالة الفحص والاستلام</th>
              <th>أمين المخزن المسجل</th>
            </tr>
          </thead>
          <tbody>
            \${receipts.map(r => \`
              <tr>
                <td><strong>\${r.id}</strong></td>
                <td><small style="font-weight:700;">\${r.supplyDate}</small></td>
                <td><strong style="color:var(--brand2);">\${r.itemName}</strong></td>
                <td><span class="badge-type" style="background:#e0f2fe;color:#0369a1;font-size:12px;">\${r.qty}</span></td>
                <td>\${r.supplier}</td>
                <td><code>\${r.batchNumber}</code></td>
                <td><span class="status-pill status-confirmed">✓ \${r.condition}</span></td>
                <td>\${r.receiver}</td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Reps Sales & Collection Achievement Report (Year-To-Date & Monthly) ---
  function renderRepTargets() {
    // Calculate Company Totals
    const totalYtdSalesTarget = repsPerformanceData.reduce((s, r) => s + r.ytdSalesTarget, 0);
    const totalYtdSalesActual = repsPerformanceData.reduce((s, r) => s + r.ytdSalesActual, 0);
    const totalYtdSalesPct = ((totalYtdSalesActual / totalYtdSalesTarget) * 100).toFixed(1);

    const totalYtdCollectTarget = repsPerformanceData.reduce((s, r) => s + r.ytdCollectTarget, 0);
    const totalYtdCollectActual = repsPerformanceData.reduce((s, r) => s + r.ytdCollectActual, 0);
    const totalYtdCollectPct = ((totalYtdCollectActual / totalYtdCollectTarget) * 100).toFixed(1);

    const totalMonthSalesTarget = repsPerformanceData.reduce((s, r) => s + r.monthlySalesTarget, 0);
    const totalMonthSalesActual = repsPerformanceData.reduce((s, r) => s + r.monthlySalesActual, 0);
    const totalMonthSalesPct = ((totalMonthSalesActual / totalMonthSalesTarget) * 100).toFixed(1);

    const totalMonthCollectTarget = repsPerformanceData.reduce((s, r) => s + r.monthlyCollectTarget, 0);
    const totalMonthCollectActual = repsPerformanceData.reduce((s, r) => s + r.monthlyCollectActual, 0);
    const totalMonthCollectPct = ((totalMonthCollectActual / totalMonthCollectTarget) * 100).toFixed(1);

    let html = \`
      <div class="section-header">
        <div>
          <h3>تقرير تحقيق المستهدفات والأرقام للمناديب (Year-To-Date وشهري)</h3>
          <p style="font-size:12px;color:var(--muted);">
            تقرير رقابي شامل ومفصل للمديرين والإدارة العليا يوضح حجم البيع والتحصيل <strong>بالجنيه المصري فقط (EGP)</strong> من أول السنة وحتى تاريخه والشهري مع نسب التحقيق.
          </p>
        </div>
        <button class="btn-outline" onclick="window.print()">🖨️ طباعة التقرير كـ PDF</button>
      </div>

      <!-- Executive Company Totals (All numbers in EGP) -->
      <div class="stats-grid">
        <div class="stat-card" style="border-right:4px solid var(--brand);">
          <span>إجمالي بيع الشركة من أول السنة (YTD)</span>
          <strong style="color:var(--brand);">\${totalYtdSalesActual.toLocaleString()} ج.م</strong>
          <small>التارجت: \${totalYtdSalesTarget.toLocaleString()} ج.م (تحقيق \${totalYtdSalesPct}%)</small>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill fill-green" style="width:\${Math.min(totalYtdSalesPct, 100)}%;"></div>
          </div>
        </div>

        <div class="stat-card" style="border-right:4px solid #0284c7;">
          <span>إجمالي تحصيل الشركة من أول السنة (YTD)</span>
          <strong style="color:#0284c7;">\${totalYtdCollectActual.toLocaleString()} ج.م</strong>
          <small>التارجت: \${totalYtdCollectTarget.toLocaleString()} ج.م (تحقيق \${totalYtdCollectPct}%)</small>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill fill-green" style="width:\${Math.min(totalYtdCollectPct, 100)}%;"></div>
          </div>
        </div>

        <div class="stat-card" style="border-right:4px solid #10b981;">
          <span>مبيعات الشهر الحالي (سبتمبر 2026)</span>
          <strong>\${totalMonthSalesActual.toLocaleString()} ج.م</strong>
          <small>التارجت: \${totalMonthSalesTarget.toLocaleString()} ج.م (تحقيق \${totalMonthSalesPct}%)</small>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill \${totalMonthSalesPct >= 100 ? 'fill-green' : 'fill-yellow'}" style="width:\${Math.min(totalMonthSalesPct, 100)}%;"></div>
          </div>
        </div>

        <div class="stat-card" style="border-right:4px solid #f59e0b;">
          <span>تحصيلات الشهر الحالي (سبتمبر 2026)</span>
          <strong style="color:#b45309;">\${totalMonthCollectActual.toLocaleString()} ج.م</strong>
          <small>التارجت: \${totalMonthCollectTarget.toLocaleString()} ج.م (تحقيق \${totalMonthCollectPct}%) ⭐</small>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill fill-green" style="width:\${Math.min(totalMonthCollectPct, 100)}%;"></div>
          </div>
        </div>
      </div>

      <!-- Detailed Matrix Table by Rep -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th rowspan="2" style="vertical-align:middle;">المندوب والكود والمحافظة</th>
              <th colspan="3" style="text-align:center;background:#eef7f3;color:var(--brand2);border-left:1px solid var(--line);">
                مبيعات من أول السنة (Year-To-Date Sales)
              </th>
              <th colspan="3" style="text-align:center;background:#f0f9ff;color:#0369a1;border-left:1px solid var(--line);">
                تحصيلات من أول السنة (Year-To-Date Collections)
              </th>
              <th colspan="3" style="text-align:center;background:#fefce8;color:#854d0e;border-left:1px solid var(--line);">
                مبيعات الشهر الحالي (Monthly Sales)
              </th>
              <th colspan="3" style="text-align:center;background:#fdf2f8;color:#9d174d;border-left:1px solid var(--line);">
                تحصيل الشهر الحالي (Monthly Collections)
              </th>
              <th rowspan="2" style="vertical-align:middle;text-align:center;">تقييم التحقيق</th>
            </tr>
            <tr>
              <th style="background:#f4faf7;">تارجت سنوي</th>
              <th style="background:#f4faf7;">بيع فعلي</th>
              <th style="background:#f4faf7;border-left:1px solid var(--line);">نسبة %</th>

              <th style="background:#f8fcfe;">تارجت سنوي</th>
              <th style="background:#f8fcfe;">تحصيل فعلي</th>
              <th style="background:#f8fcfe;border-left:1px solid var(--line);">نسبة %</th>

              <th style="background:#fefee7;">تارجت شهري</th>
              <th style="background:#fefee7;">بيع فعلي</th>
              <th style="background:#fefee7;border-left:1px solid var(--line);">نسبة %</th>

              <th style="background:#fdf4f9;">تارجت شهري</th>
              <th style="background:#fdf4f9;">تحصيل فعلي</th>
              <th style="background:#fdf4f9;border-left:1px solid var(--line);">نسبة %</th>
            </tr>
          </thead>
          <tbody>
            \${repsPerformanceData.map(rep => {
              const ytdSalePct = ((rep.ytdSalesActual / rep.ytdSalesTarget) * 100).toFixed(1);
              const ytdColPct = ((rep.ytdCollectActual / rep.ytdCollectTarget) * 100).toFixed(1);
              const mSalePct = ((rep.monthlySalesActual / rep.monthlySalesTarget) * 100).toFixed(1);
              const mColPct = ((rep.monthlyCollectActual / rep.monthlyCollectTarget) * 100).toFixed(1);
              const isTop = (ytdSalePct >= 100 && ytdColPct >= 100) || mSalePct >= 105;

              return \`
                <tr>
                  <td>
                    <strong>\${rep.name}</strong>
                    <div style="font-size:11px;color:var(--muted);display:flex;gap:6px;margin-top:2px;">
                      <code>\${rep.code}</code> | <span>\${rep.territory}</span>
                    </div>
                  </td>

                  <!-- YTD Sales -->
                  <td>\${rep.ytdSalesTarget.toLocaleString()} ج.م</td>
                  <td style="color:var(--brand);font-weight:700;">\${rep.ytdSalesActual.toLocaleString()} ج.م</td>
                  <td style="border-left:1px solid var(--line);">
                    <b style="\${ytdSalePct >= 100 ? 'color:#10b981;' : 'color:#d97706;'}">\${ytdSalePct}%</b>
                  </td>

                  <!-- YTD Collections -->
                  <td>\${rep.ytdCollectTarget.toLocaleString()} ج.م</td>
                  <td style="color:#0284c7;font-weight:700;">\${rep.ytdCollectActual.toLocaleString()} ج.م</td>
                  <td style="border-left:1px solid var(--line);">
                    <b style="\${ytdColPct >= 100 ? 'color:#10b981;' : 'color:#d97706;'}">\${ytdColPct}%</b>
                  </td>

                  <!-- Monthly Sales -->
                  <td>\${rep.monthlySalesTarget.toLocaleString()} ج.م</td>
                  <td style="font-weight:700;">\${rep.monthlySalesActual.toLocaleString()} ج.م</td>
                  <td style="border-left:1px solid var(--line);">
                    <b style="\${mSalePct >= 100 ? 'color:#10b981;' : 'color:#d97706;'}">\${mSalePct}%</b>
                  </td>

                  <!-- Monthly Collections -->
                  <td>\${rep.monthlyCollectTarget.toLocaleString()} ج.م</td>
                  <td style="font-weight:700;">\${rep.monthlyCollectActual.toLocaleString()} ج.م</td>
                  <td style="border-left:1px solid var(--line);">
                    <b style="\${mColPct >= 100 ? 'color:#10b981;' : 'color:#d97706;'}">\${mColPct}%</b>
                  </td>

                  <!-- Status -->
                  <td style="text-align:center;">
                    \${isTop ? 
                      '<span class="status-pill status-confirmed">⭐ متفوق ومحقق</span>' :
                      (ytdSalePct >= 90 ? '<span class="status-pill status-confirmed">✓ مطابق للهدف</span>' : '<span class="status-pill status-warning">⚠️ يحتاج متابعة</span>')
                    }
                  </td>
                </tr>
              \`;
            }).join('')}
          </tbody>
        </table>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Leaves ---
  function renderLeaves() {
    const leaves = getStore('kenavet_leaves');

    let html = \`
      <div class="section-header">
        <div>
          <h3>منظومة إدارة الإجازات والاعتمادات</h3>
          <p style="font-size:12px;color:var(--muted);">تقديم طلب إجازة إلكتروني مباشرة للإدارة واعتمادها لحظياً</p>
        </div>
        <button class="btn-primary" onclick="openLeaveModal()">+ طلب إجازة جديدة</button>
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-bottom:24px;">
        <div class="stat-card">
          <span>الرصيد السنوي المتبقي</span>
          <strong style="color:var(--brand);">18 يوماً</strong>
          <small>من أصل 21 يوماً</small>
        </div>
        <div class="stat-card">
          <span>رصيد العوارض</span>
          <strong>5 أيام</strong>
          <small>من أصل 7 أيام</small>
        </div>
        <div class="stat-card">
          <span>إجازات معتمدة هذا العام</span>
          <strong>3 أيام</strong>
          <small>موثقة رسمياً</small>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>الموظف / المندوب</th>
              <th>الصفة</th>
              <th>نوع الإجازة</th>
              <th>من تاريخ</th>
              <th>إلى تاريخ</th>
              <th>المدة</th>
              <th>السبب</th>
              <th>الحالة</th>
              \${currentUser.canApprove ? '<th>الإجراء الإداري</th>' : ''}
            </tr>
          </thead>
          <tbody>
            \${leaves.map(l => \`
              <tr>
                <td><strong>\${l.id}</strong></td>
                <td><strong>\${l.rep}</strong></td>
                <td><small>\${l.role}</small></td>
                <td><span class="badge-type">\${l.type}</span></td>
                <td>\${l.from}</td>
                <td>\${l.to}</td>
                <td><strong>\${l.days} أيام</strong></td>
                <td>\${l.reason}</td>
                <td><span class="status-pill \${l.status==='معتمدة'?'status-confirmed':'status-pending'}">\${l.status}</span></td>
                \${currentUser.canApprove ? \`
                  <td>
                    \${l.status === 'قيد الانتظار' ? \`
                      <button class="btn-sm primary" onclick="approveLeave('\${l.id}')">✓ اعتماد</button>
                      <button class="btn-sm" style="color:red;" onclick="rejectLeave('\${l.id}')">✗ رفض</button>
                    \` : '<small style="color:green;">تمت المعالجة</small>'}
                  </td>
                \` : ''}
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Radar ---
  function renderRadar() {
    const myLat = 30.5877;
    const myLng = 31.5020;
    const custs = getStore('kenavet_customers');

    const withDist = custs.map(c => ({
      ...c,
      distance: calcDistance(myLat, myLng, c.lat || 30.5877, c.lng || 31.5020)
    })).sort((a, b) => a.distance - b.distance);

    let html = \`
      <div class="section-header">
        <div>
          <h3>رادار الـ GPS والعملاء القريبين لموقعك الحالي 🧭</h3>
          <p style="font-size:12px;color:var(--muted);">موقعك الحالي المقدر: <strong>الزقازيق، محافظة الشرقية (30.5877, 31.5020)</strong></p>
        </div>
      </div>

      <div class="card-grid">
        \${withDist.map(c => \`
          <div class="client-card" style="border-right:4px solid var(--brand);">
            <div class="client-card-top">
              <div>
                <h4>\${c.name}</h4>
                <p>📍 \${c.gov} - \${c.city}</p>
              </div>
              <span class="badge-type" style="background:#dbeafe;color:#1e40af;">تبعد \${c.distance} كم</span>
            </div>
            <div class="client-meta">
              <span>👤 المسؤول: \${c.contact}</span>
              <span>📞 \${c.phone}</span>
              <span class="badge-type">\${c.type}</span>
            </div>
            <div class="client-actions">
              <a href="https://maps.google.com/?q=\${c.gps}" target="_blank" class="btn-sm primary">
                🗺️ بدء الملاحة بالـ GPS
              </a>
              <button class="btn-sm" onclick="openAddVisitForCustomer('\${c.name}', '\${c.gov}')">
                تسجيل زيارة فورية
              </button>
            </div>
          </div>
        \`).join('')}
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Team ---
  function renderTeam() {
    let html = \`
      <div class="section-header">
        <div>
          <h3>فريق العمل وأطباء شركة KENAVET الميدانيين</h3>
          <p style="font-size:12px;color:var(--muted);">أكواد تسلسل الموظفين EMP، المحافظات الموزعة، ومسؤوليات كل طبيب بيطري</p>
        </div>
      </div>

      <div class="card-grid">
        <div class="client-card">
          <div class="client-card-top">
            <div>
              <h4>د. أحمد محمد الشافعي</h4>
              <p>كود الموظف: <code>EMP-006</code> | 📞 01012340006</p>
            </div>
            <span class="badge-type">طبيب ومندوب بيطري</span>
          </div>
          <div class="client-meta">
            <span>📍 المحافظة المسندة: الشرقية (الزقازيق، القنايات، بلبيس)</span>
            <span>👔 المشرف المباشر: د. سارة حسن</span>
          </div>
        </div>

        <div class="client-card">
          <div class="client-card-top">
            <div>
              <h4>د. خالد منصور</h4>
              <p>كود الموظف: <code>EMP-002</code> | 📞 01012340002</p>
            </div>
            <span class="badge-type">مدير منطقة الغربية والدلتا</span>
          </div>
          <div class="client-meta">
            <span>📍 المحافظة المسندة: الغربية، الدقهلية، كفر الشيخ</span>
            <span>👔 المشرف المباشر: المدير العام</span>
          </div>
        </div>

        <div class="client-card">
          <div class="client-card-top">
            <div>
              <h4>م. عمر إبراهيم</h4>
              <p>كود الموظف: <code>EMP-007</code> | 📞 01012340007</p>
            </div>
            <span class="badge-type">مندوب مبيعات لقاحات</span>
          </div>
          <div class="client-meta">
            <span>📍 المحافظة المسندة: القاهرة والجيزة</span>
            <span>👔 المشرف المباشر: د. سارة حسن</span>
          </div>
        </div>

        <div class="client-card">
          <div class="client-card-top">
            <div>
              <h4>إيمان عادل</h4>
              <p>كود الموظف: <code>EMP-014</code> | 📞 01012340014</p>
            </div>
            <span class="badge-type">المحاسب المالي للشركة</span>
          </div>
          <div class="client-meta">
            <span>📍 المسؤولية: اعتماد التحصيلات المالية والشيكات البنكية</span>
            <span>👔 الإدارة المركزية</span>
          </div>
        </div>

        <div class="client-card">
          <div class="client-card-top">
            <div>
              <h4>عم حامد دسوقي</h4>
              <p>كود الموظف: <code>EMP-020</code> | 📞 01012340020</p>
            </div>
            <span class="badge-type" style="background:#fef3c7;color:#92400e;">أمين المخزن الرئيسي</span>
          </div>
          <div class="client-meta">
            <span>📍 المسؤولية: استلام الكميات والتوريدات بأسماء الأصناف</span>
            <span>🏢 المخزن المركزي بالعاشر من رمضان</span>
          </div>
        </div>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Presentation Tab ---
  function renderPresentation() {
    let html = \`
      <div style="background:white;border:1px solid var(--line);border-radius:14px;padding:22px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
          <div>
            <h3 style="margin-bottom:4px;">حزمة التنزيلات الرسمية لشركة KENAVET 📥</h3>
            <p style="font-size:12px;color:var(--muted);">يمكنك تحميل التطبيق والعرض والتقرير مباشرة من هذه الروابط أو مشاركتها مع العميل:</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="./KENAVET.apk" download class="btn-primary" style="background:#059669;text-decoration:none;">
              📱 تحميل تطبيق الأندرويد (KENAVET.apk)
            </a>
            <a href="./KENAVET_FieldForce_Presentation.pdf" target="_blank" class="btn-primary" style="background:#0284c7;text-decoration:none;">
              📄 تحميل العرض التقديمي (PDF)
            </a>
            <a href="./FieldForce_Pro_Comprehensive_User_Guide.docx" download class="btn-primary" style="background:#6366f1;text-decoration:none;">
              📝 دليل الاستخدام الكامل (Word)
            </a>
          </div>
        </div>
      </div>

      <div class="section-header">
        <h3>العرض التقديمي التفاعلي المباشر (19 شريحة)</h3>
        <span style="font-size:12px;color:var(--muted);">استخدم الأسهم أو الماوس للتنقل</span>
      </div>
      <iframe src="./FieldForce_Pro_Interactive_Presentation.html" class="deck-frame"></iframe>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  // --- Modals Actions ---
  function openActionModal() {
    if (currentUser.role === 'Warehouse') {
      openAddWarehouseReceiptModal();
    } else {
      openAddInvoiceModal();
    }
  }

  // Modal: Add Customer
  function openAddCustomerModal() {
    const govOpts = governorates.map(g => \`<option value="\${g.name}">\${g.name}</option>\`).join('');
    const box = document.getElementById('modalBox');
    box.innerHTML = \`
      <div class="modal-header">
        <h3>➕ تكويد عميل / مزرعة / عيادة بيطرية جديدة</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>اسم العميل أو المزرعة *</label>
          <input type="text" id="mCustName" placeholder="مثال: مزرعة الأبرار للدواجن" required>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>المحافظة *</label>
            <select id="mCustGov" onchange="updateCities(this.value)">
              \${govOpts}
            </select>
          </div>
          <div class="form-group">
            <label>المدينة / المركز *</label>
            <select id="mCustCity">
              <!-- populated -->
            </select>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>النشاط البيطري *</label>
            <select id="mCustType">
              <option value="مزرعة دواجن">مزرعة دواجن</option>
              <option value="مزرعة ماشية">مزرعة ماشية وتسمين</option>
              <option value="صيدلية بيطرية">صيدلية بيطرية</option>
              <option value="عيادة بيطرية">عيادة بيطرية</option>
              <option value="موزع معتمد">موزع أدوية معتمد</option>
            </select>
          </div>
          <div class="form-group">
            <label>تصنيف العميل</label>
            <select id="mCustClass">
              <option value="VIP">عميل VIP (مزارع كبرى)</option>
              <option value="A">تصنيف A</option>
              <option value="B">تصنيف B</option>
              <option value="C">تصنيف C</option>
            </select>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>اسم الطبيب أو المسؤول</label>
            <input type="text" id="mCustContact" placeholder="د. أحمد...">
          </div>
          <div class="form-group">
            <label>رقم الهاتف للتواصل</label>
            <input type="tel" id="mCustPhone" placeholder="010...">
          </div>
        </div>
        <div class="form-group">
          <label>رابط أو إحداثيات الموقع بالـ GPS</label>
          <input type="text" id="mCustGps" placeholder="مثال: 30.5877,31.5020 أو رابط Google Maps">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline" onclick="closeModal()">إلغاء</button>
        <button class="btn-primary" onclick="saveCustomer()">حفظ وتكويد العميل</button>
      </div>
    \`;
    updateCities(governorates[0].name);
    document.getElementById('modalBackdrop').style.display = 'flex';
  }

  function updateCities(govName) {
    const gov = governorates.find(g => g.name === govName);
    const citySelect = document.getElementById('mCustCity');
    if (!citySelect || !gov) return;
    citySelect.innerHTML = gov.areas.map(a => \`<option value="\${a}">\${a}</option>\`).join('');
  }

  function saveCustomer() {
    const name = document.getElementById('mCustName').value.trim();
    if (!name) { alert('يرجى كتابة اسم العميل أو المزرعة'); return; }
    const gov = document.getElementById('mCustGov').value;
    const city = document.getElementById('mCustCity').value;
    const type = document.getElementById('mCustType').value;
    const cls = document.getElementById('mCustClass').value;
    const contact = document.getElementById('mCustContact').value || 'الطبيب المسؤول';
    const phone = document.getElementById('mCustPhone').value || '01000000000';
    const gps = document.getElementById('mCustGps').value || '30.5877,31.5020';

    const custs = getStore('kenavet_customers');
    custs.unshift({
      id: Date.now(),
      name,
      gov,
      city,
      type,
      class: cls,
      contact,
      phone,
      rep: currentUser.name,
      gps,
      lat: 30.5877,
      lng: 31.5020
    });
    setStore('kenavet_customers', custs);
    closeModal();
    showToast('تم تكويد العميل ' + name + ' بنجاح!');
    if (activeTab === 'customers') renderCustomers();
    else if (activeTab === 'dashboard') renderDashboard();
  }

  // Modal: Add Invoice with Live Minimum Price Threshold Check
  function openAddInvoiceModal() {
    const custs = getStore('kenavet_customers');
    const custOpts = custs.map(c => \`<option value="\${c.name}">\${c.name} (\${c.gov})</option>\`).join('');
    const prodOpts = kenavetProducts.map(p => \`<option value="\${p.id}">\${p.name} (السعر: \${p.listPrice} ج.م | حد أدنى: \${p.minPrice} ج.م)</option>\`).join('');

    const box = document.getElementById('modalBox');
    box.innerHTML = \`
      <div class="modal-header">
        <h3>📑 إدخال فاتورة مبيعات جديدة والتحقق من الحد الأدنى للأسعار</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>اختيار العميل أو المزرعة *</label>
          <select id="mInvCust">
            \${custOpts}
          </select>
        </div>

        <div class="form-group">
          <label>اختيار الصنف البيطري *</label>
          <select id="mInvProd" onchange="onProductSelect(this.value)">
            \${prodOpts}
          </select>
        </div>

        <!-- Product Price Info Indicator -->
        <div id="mProdInfoBox" style="background:#eaf4f0;border:1px solid #cce3d8;border-radius:8px;padding:10px 14px;font-size:12.5px;color:var(--brand2);">
          <!-- dynamic info -->
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label>الكمية المطلوبة *</label>
            <input type="number" id="mInvQty" value="10" min="1" oninput="calculateInvoiceTotal()">
          </div>
          <div class="form-group">
            <label>سعر البيع المقترح للوحدة (بالجنيه EGP) *</label>
            <input type="number" id="mInvPrice" value="450" min="1" oninput="checkPriceThreshold()">
          </div>
        </div>

        <!-- Dynamic Live Price Warning / Confirmation -->
        <div id="mPriceAlert" style="display:none;"></div>

        <div class="form-row-2">
          <div class="form-group">
            <label>القيمة الإجمالية للفاتورة</label>
            <input type="text" id="mInvTotal" readonly style="background:#f8faf9;font-weight:800;color:var(--brand);font-size:15px;">
          </div>
          <div class="form-group">
            <label>تاريخ الفاتورة</label>
            <input type="date" id="mInvDate" value="\${new Date().toISOString().slice(0, 10)}">
          </div>
        </div>

        <div class="form-group">
          <label>ملاحظات الفاتورة وتبرير الخصم (إن وجد)</label>
          <textarea id="mInvNotes" placeholder="اكتب مبررات الخصم أو تفاصيل إضافية..." rows="2"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline" onclick="closeModal()">إلغاء</button>
        <button class="btn-primary" onclick="saveInvoice()">حفظ وإرسال الفاتورة</button>
      </div>
    \`;

    onProductSelect(kenavetProducts[0].id);
    document.getElementById('modalBackdrop').style.display = 'flex';
  }

  function openAddInvoiceForCustomer(custName) {
    openAddInvoiceModal();
    setTimeout(() => {
      const s = document.getElementById('mInvCust');
      if (s) s.value = custName;
    }, 50);
  }

  let selectedProd = kenavetProducts[0];
  function onProductSelect(prodId) {
    selectedProd = kenavetProducts.find(p => p.id === prodId) || kenavetProducts[0];
    const info = document.getElementById('mProdInfoBox');
    if (info) {
      info.innerHTML = \`
        <strong>\${selectedProd.name}</strong><br>
        السعر الرسمي المعتمد: <b>\${selectedProd.listPrice} ج.م</b> | 
        <span style="color:#b45309;font-weight:700;">الحد الأدنى المسموح به: \${selectedProd.minPrice} ج.م</span> (\${selectedProd.unit})
      \`;
    }
    const priceInput = document.getElementById('mInvPrice');
    if (priceInput) {
      priceInput.value = selectedProd.listPrice;
    }
    checkPriceThreshold();
  }

  function checkPriceThreshold() {
    const price = Number(document.getElementById('mInvPrice').value || 0);
    const alertBox = document.getElementById('mPriceAlert');
    if (!alertBox || !selectedProd) return;

    if (price < selectedProd.minPrice) {
      const diff = selectedProd.minPrice - price;
      alertBox.className = 'price-alert-box';
      alertBox.style.display = 'flex';
      alertBox.innerHTML = \`
        <span>⚠️</span>
        <div>
          <strong>تنبيه: السعر المقترح (\${price} ج.م) أقل من الحد الأدنى المسموح (\${selectedProd.minPrice} ج.م) بفارق \${diff} ج.م!</strong><br>
          <small>وفقاً للائحة الشركة: ستتحول الفاتورة تلقائياً إلى حالة <strong>"بانتظار اعتماد مدير المنطقة"</strong> للموافقة على هذا الاستثناء.</small>
        </div>
      \`;
    } else {
      alertBox.className = '';
      alertBox.style.display = 'block';
      alertBox.innerHTML = \`
        <div style="background:#eef7f2;border:1px solid #c1e4d3;color:#146c43;padding:8px 12px;border-radius:8px;font-size:12px;">
          ✓ السعر نظامي وضمن النطاق المسموح به (أعلى من أو يساوي الحد الأدنى). الفاتورة ستعتمد تلقائياً.
        </div>
      \`;
    }
    calculateInvoiceTotal();
  }

  function calculateInvoiceTotal() {
    const qty = Number(document.getElementById('mInvQty').value || 0);
    const price = Number(document.getElementById('mInvPrice').value || 0);
    const total = qty * price;
    const totalEl = document.getElementById('mInvTotal');
    if (totalEl) totalEl.value = total.toLocaleString() + ' ج.م';
  }

  function saveInvoice() {
    const customer = document.getElementById('mInvCust').value;
    const qty = Number(document.getElementById('mInvQty').value || 1);
    const price = Number(document.getElementById('mInvPrice').value || selectedProd.listPrice);
    const date = document.getElementById('mInvDate').value;
    const notes = document.getElementById('mInvNotes').value.trim();
    const total = qty * price;

    const isBelowMin = price < selectedProd.minPrice;
    const status = isBelowMin ? 'بانتظار اعتماد مدير المنطقة' : 'معتمدة تلقائياً (ضمن النطاق)';

    const invs = getStore('kenavet_invoices');
    const newInv = {
      id: 'INV-2026-0' + (invs.length + 85),
      customer,
      product: selectedProd.name,
      qty,
      unit: selectedProd.unit,
      price,
      listPrice: selectedProd.listPrice,
      minPrice: selectedProd.minPrice,
      total,
      rep: currentUser.name,
      date,
      status,
      priceWarning: isBelowMin,
      notes: notes || (isBelowMin ? 'طلب خصم استثنائي تحت اعتماد مدير المنطقة' : 'فاتورة مبيعات نظامية')
    };

    invs.unshift(newInv);
    setStore('kenavet_invoices', invs);
    closeModal();

    if (isBelowMin) {
      showToast('⚠️ تم إرسال الفاتورة بنجاح وتحويلها لمدير المنطقة للاعتماد لتجاوز الحد الأدنى للسعر');
    } else {
      showToast('✓ تم تسجيل الفاتورة واعتمادها تلقائياً بمبلغ ' + total.toLocaleString() + ' ج.م');
    }

    if (activeTab === 'invoices') renderInvoices();
    else if (activeTab === 'dashboard') renderDashboard();
  }

  // Modal: Add Warehouse Receipt (Quantities & Items Only, NO PRICES)
  function openAddWarehouseReceiptModal() {
    const prodOpts = kenavetProducts.map(p => \`<option value="\${p.name}">\${p.name} (\${p.unit})</option>\`).join('');

    const box = document.getElementById('modalBox');
    box.innerHTML = \`
      <div class="modal-header">
        <h3>📦 تسجيل إذن استلام توريد مخزني جديد</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:#fef3c7;border:1px solid #fde68a;color:#92400e;padding:10px 14px;border-radius:8px;font-size:12px;">
          🔒 <strong>تنبيه خاص بالمخازن:</strong> يتم توثيق الشحنة بالكميات وأسماء الأصناف وتاريخ التوريد فقط (بدون أي بيانات أسعار أو مبالغ مالية).
        </div>

        <div class="form-group">
          <label>اسم الصنف البيطري المستلم *</label>
          <select id="mWhItem">
            \${prodOpts}
          </select>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label>الكمية المستلمة فعلياً *</label>
            <input type="number" id="mWhQty" placeholder="مثال: 500" required>
          </div>
          <div class="form-group">
            <label>وحدة الصرف / التعبئة</label>
            <select id="mWhUnit">
              <option value="كرتونة">كرتونة</option>
              <option value="عبوة">عبوة</option>
              <option value="لتر">لتر</option>
              <option value="كجم">كجم</option>
              <option value="أمبول">أمبول</option>
              <option value="جالون">جالون</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label>تاريخ وموعد التوريد *</label>
            <input type="datetime-local" id="mWhDate" value="\${new Date().toISOString().slice(0, 16)}">
          </div>
          <div class="form-group">
            <label>رقم التشغيلة (Batch Number) *</label>
            <input type="text" id="mWhBatch" value="LOT-KNV-\${Math.floor(1000 + Math.random()*9000)}">
          </div>
        </div>

        <div class="form-group">
          <label>المورد / المصنع المورّد</label>
          <input type="text" id="mWhSupplier" value="مصنع كينافيت للأدوية واللقاحات (العبور)">
        </div>

        <div class="form-group">
          <label>حالة الفحص الظاهري والمطابقة الفنية</label>
          <select id="mWhCondition">
            <option value="تم الفحص الفني والمطابقة وسليم بالكامل">تم الفحص الفني والمطابقة وسليم بالكامل</option>
            <option value="سلسلة التبريد منضبطة ومطابقة (2-8°C)">سلسلة التبريد منضبطة ومطابقة (2-8°C)</option>
            <option value="تم الاستلام تحت الفحص المعملي">تم الاستلام تحت الفحص المعملي</option>
          </select>
        </div>

        <div class="form-group">
          <label>ملاحظات الاستلام ورقم إذن التوريد الورقي</label>
          <textarea id="mWhNotes" placeholder="ملاحظات موقع التخزين والعنبر..." rows="2"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline" onclick="closeModal()">إلغاء</button>
        <button class="btn-primary" onclick="saveWarehouseReceipt()">تأكيد وحفظ إذن الاستلام</button>
      </div>
    \`;
    document.getElementById('modalBackdrop').style.display = 'flex';
  }

  function saveWarehouseReceipt() {
    const itemName = document.getElementById('mWhItem').value;
    const qtyNum = document.getElementById('mWhQty').value;
    if (!qtyNum) { alert('يرجى تحديد الكمية المستلمة'); return; }
    const unit = document.getElementById('mWhUnit').value;
    const supplyDate = document.getElementById('mWhDate').value.replace('T', ' ');
    const batchNumber = document.getElementById('mWhBatch').value;
    const supplier = document.getElementById('mWhSupplier').value || 'مورد معتمد';
    const condition = document.getElementById('mWhCondition').value;
    const notes = document.getElementById('mWhNotes').value.trim();

    const receipts = getStore('kenavet_warehouse_receipts');
    receipts.unshift({
      id: 'RCV-2026-' + (receipts.length + 405),
      supplyDate,
      itemName,
      qty: qtyNum + ' ' + unit,
      supplier,
      batchNumber,
      receiver: currentUser.name,
      condition,
      notes: notes || 'تم الاستلام والتخزين في المخزن الرئيسي'
    });
    setStore('kenavet_warehouse_receipts', receipts);
    closeModal();
    showToast('✓ تم تسجيل إذن الاستلام المخزني للصنف ' + itemName.split(' ')[0] + ' بكمية ' + qtyNum + ' ' + unit);
    if (activeTab === 'warehouse') renderWarehouse();
    else if (activeTab === 'dashboard') renderDashboard();
  }

  // Modal: Add Daily Visit
  function openAddVisitModal() {
    const custs = getStore('kenavet_customers');
    const custOpts = custs.map(c => \`<option value="\${c.name}" data-gov="\${c.gov}">\${c.name} (\${c.gov} - \${c.city})</option>\`).join('');

    const box = document.getElementById('modalBox');
    box.innerHTML = \`
      <div class="modal-header">
        <h3>⚡ إرسال تقرير زيارة ميدانية جديدة</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>اختيار العميل أو المزرعة من القائمة *</label>
          <select id="mVisitCust">
            \${custOpts}
          </select>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>نوع الزيارة</label>
            <select id="mVisitType">
              <option value="متابعة دورية">متابعة دورية روتينية</option>
              <option value="استشارة بيطرية">استشارة بيطرية وتشخيص</option>
              <option value="عرض منتجات جديدة">عرض منتجات ولقاحات جديدة</option>
              <option value="تحصيل وسداد">تحصيل وسداد حسابات</option>
              <option value="زيارة طارئة">زيارة طارئة لمشكلة في القطيع</option>
            </select>
          </div>
          <div class="form-group">
            <label>إثبات الحضور بالـ GPS</label>
            <input type="text" id="mVisitGps" value="30.5877, 31.5020 (تم الالتقاط تلقائياً)" readonly style="background:#f0f7f4;color:var(--brand);font-weight:700;">
          </div>
        </div>
        <div class="form-group">
          <label>نتائج الزيارة والتوصيات والطلبات *</label>
          <textarea id="mVisitOutcome" placeholder="اكتب تفاصيل الزيارة، حالة القطيع، والأدوية المطلوبة..." rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>تاريخ المتابعة القادمة</label>
          <input type="date" id="mVisitNext" value="2026-10-02">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline" onclick="closeModal()">إلغاء</button>
        <button class="btn-primary" onclick="saveVisit()">إرسال التقرير اللحظي</button>
      </div>
    \`;
    document.getElementById('modalBackdrop').style.display = 'flex';
  }

  function openAddVisitForCustomer(custName, gov) {
    openAddVisitModal();
    setTimeout(() => {
      const s = document.getElementById('mVisitCust');
      if (s) s.value = custName;
    }, 50);
  }

  function saveVisit() {
    const custSelect = document.getElementById('mVisitCust');
    const customer = custSelect.value;
    const selectedOption = custSelect.options[custSelect.selectedIndex];
    const gov = selectedOption?.getAttribute('data-gov') || currentUser.governorate;
    const type = document.getElementById('mVisitType').value;
    const outcome = document.getElementById('mVisitOutcome').value.trim() || 'تمت الزيارة بنجاح وتم فحص الحالة وتأكيد متطلبات العميل';
    const gps = "30.5877, 31.5020";

    const visits = getStore('kenavet_visits');
    visits.unshift({
      id: Math.floor(100 + Math.random() * 900),
      customer,
      date: new Date().toISOString().slice(0, 10),
      rep: currentUser.name,
      gov,
      type,
      outcome,
      gps,
      status: "معتمدة"
    });
    setStore('kenavet_visits', visits);
    closeModal();
    showToast('تم إرسال تقرير الزيارة بنجاح!');
    if (activeTab === 'visits') renderVisits();
    else if (activeTab === 'dashboard') renderDashboard();
  }

  // Modal: Add Collection
  function openAddCollectionModal() {
    const custs = getStore('kenavet_customers');
    const custOpts = custs.map(c => \`<option value="\${c.name}">\${c.name}</option>\`).join('');

    const box = document.getElementById('modalBox');
    box.innerHTML = \`
      <div class="modal-header">
        <h3>💰 تسجيل سند تحصيل مالي / شيك بنكي</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>اسم العميل المسدد *</label>
          <select id="mColCust">
            \${custOpts}
          </select>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>المبلغ المحصل (بالجنيه المصري EGP) *</label>
            <input type="number" id="mColAmount" placeholder="مثال: 25000" required>
          </div>
          <div class="form-group">
            <label>طريقة السداد *</label>
            <select id="mColMethod">
              <option value="شيك بنكي">شيك بنكي آجل</option>
              <option value="سند نقدي">نقدي (كاش بالخزينة)</option>
              <option value="تحويل InstaPay">تحويل InstaPay فوري</option>
              <option value="تحويل بنكي">تحويل بنكي مباشر</option>
            </select>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>رقم الشيك أو المعاملة</label>
            <input type="text" id="mColRef" placeholder="CHQ-..." value="CHQ-\${Math.floor(100000 + Math.random()*900000)}">
          </div>
          <div class="form-group">
            <label>اسم البنك المسحوب عليه</label>
            <input type="text" id="mColBank" placeholder="مثال: البنك الأهلي المصري" value="البنك الأهلي المصري">
          </div>
        </div>
        <div class="form-group">
          <label>صورة الشيك أو إيصال السداد</label>
          <input type="file" accept="image/*" style="padding:6px;">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline" onclick="closeModal()">إلغاء</button>
        <button class="btn-primary" onclick="saveCollection()">حفظ وتأكيد السند</button>
      </div>
    \`;
    document.getElementById('modalBackdrop').style.display = 'flex';
  }

  function saveCollection() {
    const customer = document.getElementById('mColCust').value;
    const amount = document.getElementById('mColAmount').value;
    if (!amount) { alert('يرجى تحديد مبلغ التحصيل'); return; }
    const method = document.getElementById('mColMethod').value;
    const ref = document.getElementById('mColRef').value || 'REC-Auto';
    const bank = document.getElementById('mColBank').value || 'البنك الأهلي';

    const cols = getStore('kenavet_collections');
    cols.unshift({
      id: 'COL-' + Math.floor(1000 + Math.random() * 9000),
      customer,
      amount: Number(amount),
      method,
      ref,
      bank,
      date: new Date().toISOString().slice(0, 10),
      rep: currentUser.name,
      status: "مؤكد مالياً",
      receipt: "مرفق الإيصال"
    });
    setStore('kenavet_collections', cols);
    closeModal();
    showToast('تم تسجيل سند التحصيل بمبلغ ' + Number(amount).toLocaleString() + ' ج.م بنجاح!');
    if (activeTab === 'collections') renderCollections();
    else if (activeTab === 'dashboard') renderDashboard();
  }

  // Modal: Add Leave
  function openLeaveModal() {
    const box = document.getElementById('modalBox');
    box.innerHTML = \`
      <div class="modal-header">
        <h3>🌴 تقديم طلب إجازة رسمي</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-row-2">
          <div class="form-group">
            <label>نوع الإجازة *</label>
            <select id="mLvType">
              <option value="إجازة سنوية">إجازة سنوية اعتيادية</option>
              <option value="إجازة عارضة">إجازة عارضة (طارئة)</option>
              <option value="إجازة مرضية">إجازة مرضية</option>
            </select>
          </div>
          <div class="form-group">
            <label>عدد الأيام المطلوبة *</label>
            <input type="number" id="mLvDays" value="2" min="1" max="15">
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>تاريخ البدء</label>
            <input type="date" id="mLvFrom" value="2026-09-29">
          </div>
          <div class="form-group">
            <label>تاريخ العودة للعمل</label>
            <input type="date" id="mLvTo" value="2026-10-01">
          </div>
        </div>
        <div class="form-group">
          <label>سبب الإجازة وملاحظات المندوب</label>
          <textarea id="mLvReason" placeholder="اذكر سبب طلب الإجازة وترتيب متابعة العملاء أثناء الغياب..." rows="2"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline" onclick="closeModal()">إلغاء</button>
        <button class="btn-primary" onclick="saveLeave()">إرسال الطلب للاعتماد</button>
      </div>
    \`;
    document.getElementById('modalBackdrop').style.display = 'flex';
  }

  function saveLeave() {
    const type = document.getElementById('mLvType').value;
    const days = document.getElementById('mLvDays').value || 2;
    const from = document.getElementById('mLvFrom').value;
    const to = document.getElementById('mLvTo').value;
    const reason = document.getElementById('mLvReason').value.trim() || 'ظروف شخصية خاصة';

    const leaves = getStore('kenavet_leaves');
    leaves.unshift({
      id: 'LV-' + Math.floor(200 + Math.random() * 800),
      rep: currentUser.name,
      role: currentUser.roleAr,
      type,
      from,
      to,
      days,
      reason,
      status: "قيد الانتظار"
    });
    setStore('kenavet_leaves', leaves);
    closeModal();
    showToast('تم إرسال طلب الإجازة للمدير العام للاعتماد!');
    if (activeTab === 'leaves') renderLeaves();
  }

  function approveLeave(id) {
    const leaves = getStore('kenavet_leaves');
    const lv = leaves.find(l => l.id === id);
    if (lv) {
      lv.status = 'معتمدة';
      setStore('kenavet_leaves', leaves);
      showToast('تم اعتماد الإجازة رقم ' + id + ' بنجاح!');
      renderLeaves();
    }
  }

  function rejectLeave(id) {
    const leaves = getStore('kenavet_leaves');
    const lv = leaves.find(l => l.id === id);
    if (lv) {
      lv.status = 'مرفوضة';
      setStore('kenavet_leaves', leaves);
      showToast('تم رفض طلب الإجازة.');
      renderLeaves();
    }
  }

  function closeModal() {
    document.getElementById('modalBackdrop').style.display = 'none';
  }

  // Initialize Data Store and First Tab
  initStore();
  showTab('dashboard');
</script>

</body>
</html>
`;

// Write to docs/index.html
const outputIndex = path.join('D:', 'CRM', 'docs', 'index.html');
fs.writeFileSync(outputIndex, appHtml, 'utf8');
console.log('✅ Generated complete live KENAVET CRM web application at:', outputIndex);

// Copy to brain artifact directory as well
const brainDir = 'C:\\Users\\M\\.gemini\\antigravity\\brain\\d197869b-798f-48f9-98d4-df4d053d7792';
if (fs.existsSync(brainDir)) {
  fs.copyFileSync(outputIndex, path.join(brainDir, 'index.html'));
  console.log('✅ Copied to brain directory');
}
