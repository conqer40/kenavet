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
  <title>KENAVET | إدارة المناديب والعمليات الميدانية</title>
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
      width: 270px;
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
      font-size: 13.5px;
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
    .topbar-title h1 { font-size: 20px; font-weight: 700; color: var(--ink); }
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
    .hero-content h2 { font-size: 26px; margin-bottom: 6px; }
    .hero-content p { font-size: 13.5px; opacity: 0.85; max-width: 600px; }
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
    .stat-card strong { font-size: 26px; color: var(--ink); font-weight: 800; }
    .stat-card small { font-size: 11.5px; color: var(--brand); font-weight: 600; }
    
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
      padding: 14px 16px;
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
    .status-rejected { background: #fde8e8; color: #b02a2a; }
    
    /* Filter Bar */
    .filter-row {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .search-box {
      flex: 1;
      min-width: 220px;
      background: white;
      border: 1px solid var(--line);
      border-radius: 9px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .search-box input { border: 0; outline: none; width: 100%; }
    .filter-select {
      background: white;
      border: 1px solid var(--line);
      border-radius: 9px;
      padding: 8px 12px;
      font-size: 12.5px;
      outline: none;
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
      width: min(650px, 100%);
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
        <small>العمليات والرقابة الميدانية البيطرية</small>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <button class="nav-btn active" onclick="showTab('dashboard')">
        <span>📊</span> الرئيسية (Dashboard)
      </button>
      <button class="nav-btn" onclick="showTab('customers')">
        <span>🏪</span> العملاء والأطباء
      </button>
      <button class="nav-btn" onclick="showTab('visits')">
        <span>⚡</span> التقارير اليومية (Visits)
      </button>
      <button class="nav-btn" onclick="showTab('collections')">
        <span>💰</span> التحصيلات المالية
      </button>
      <button class="nav-btn" onclick="showTab('invoices')">
        <span>📑</span> الفواتير وحجب السجل
      </button>
      <button class="nav-btn" onclick="showTab('leaves')">
        <span>🌴</span> الإجازات والاعتمادات
        <span class="badge" id="pendingLeaveBadge">3</span>
      </button>
      <button class="nav-btn" onclick="showTab('radar')">
        <span>🧭</span> رادار GPS والعملاء القريبين
      </button>
      <button class="nav-btn" onclick="showTab('team')">
        <span>👥</span> فريق العمل والمناديب
      </button>
      <button class="nav-btn" onclick="showTab('presentation')">
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
        <span style="font-size:11px;color:var(--brand);font-weight:700;">27 محافظة</span>
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
            <option value="admin">👑 المدير العام (Admin) — كل المحافظات والصلاحيات</option>
            <option value="manager">👔 مدير المنطقة (Tanta Mgr) — الغربية والاعتمادات</option>
            <option value="rep">🩺 د. أحمد محمد (Rep) — مندوب الشرقية فقط</option>
            <option value="acc">💼 إيمان عادل (Finance) — المحاسب وسندات التحصيل</option>
          </select>
        </div>
        
        <button class="btn-primary" onclick="openActionModal()">
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
  // 1. Data Store
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
      canViewInvoices: true
    },
    manager: {
      name: "د. خالد منصور (مدير فرع طنطا)",
      email: "tanta.mgr@fieldforce.local",
      role: "Area Manager",
      roleAr: "مدير منطقة الغربية والدلتا",
      governorate: "الغربية",
      canAll: false,
      canApprove: true,
      canFinance: false,
      canViewInvoices: true
    },
    rep: {
      name: "د. أحمد محمد (طبيب ومندوب بيطري)",
      email: "dr.ahmed@fieldforce.local",
      role: "Representative",
      roleAr: "مندوب الشرقية والقنايات",
      governorate: "الشرقية",
      canAll: false,
      canApprove: false,
      canFinance: false,
      canViewInvoices: false // Gated
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
      canViewInvoices: true
    }
  };

  let currentUser = defaultUsers.admin;
  let activeTab = 'dashboard';

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
        {id: 101, customer: "مزرعة النور للدواجن", date: "2026-09-19", rep: "د. أحمد محمد", gov: "الشرقية", type: "زيارة فنية", outcome: "تم فحص الدورة وطلب 50 كرتونة مضاد حيوي ومحصنات", gps: "30.5877, 31.5020", status: "معتمدة"},
        {id: 102, customer: "صيدلية الرحمة البيطرية", date: "2026-09-18", rep: "د. أحمد محمد", gov: "الشرقية", type: "متابعة دورية", outcome: "سداد دفعة نقدية وتسليم أحدث كتالوج للأدوية", gps: "30.6120, 31.4580", status: "معتمدة"},
        {id: 103, customer: "مزرعة البركة للتسمين", date: "2026-09-19", rep: "د. خالد منصور", gov: "الغربية", type: "زيارة طارئة", outcome: "تقديم استشارة بيطرية لعلاج أعراض تنفسية", gps: "30.7865, 31.0004", status: "معتمدة"},
        {id: 104, customer: "شركة السلام لتجارة الأدوية", date: "2026-09-17", rep: "د. خالد منصور", gov: "الغربية", type: "مراجعة كشف حساب", outcome: "استلام شيك بنكي آجل على البنك الأهلي", gps: "30.9706, 31.1669", status: "معتمدة"}
      ];
      localStorage.setItem('kenavet_visits', JSON.stringify(initialVisits));
    }

    if (!localStorage.getItem('kenavet_collections')) {
      const initialCollections = [
        {id: "COL-1001", customer: "مزرعة النور للدواجن", amount: 45000, method: "شيك بنكي", ref: "CHQ-889021", bank: "البنك الأهلي المصري", date: "2026-09-19", rep: "د. أحمد محمد", status: "مؤكد مالياً", receipt: "مرفق إيصال"},
        {id: "COL-1002", customer: "صيدلية الرحمة البيطرية", amount: 15500, method: "تحويل InstaPay", ref: "INSTA-99201", bank: "بنك مصر", date: "2026-09-18", rep: "د. أحمد محمد", status: "مؤكد مالياً", receipt: "مرفق إشعار"},
        {id: "COL-1003", customer: "شركة السلام للأدوية", amount: 82000, method: "شيك بنكي", ref: "CHQ-334109", bank: "بنك QNB", date: "2026-09-17", rep: "د. خالد منصور", status: "مؤكد مالياً", receipt: "مرفق إيصال"},
        {id: "COL-1004", customer: "مزرعة الأهرام للدواجن", amount: 28000, method: "سند نقدي", ref: "REC-4401", bank: "خزينة الشركة", date: "2026-09-16", rep: "م. مصطفى علي", status: "قيد المراجعة", receipt: "بإيصال مؤقت"}
      ];
      localStorage.setItem('kenavet_collections', JSON.stringify(initialCollections));
    }

    if (!localStorage.getItem('kenavet_leaves')) {
      const initialLeaves = [
        {id: "LV-201", rep: "د. أحمد محمد", role: "مندوب مبيعات", type: "إجازة سنوية", from: "2026-09-24", to: "2026-09-26", days: 3, reason: "ظروف عائلية خاصة", status: "قيد الانتظار"},
        {id: "LV-202", rep: "م. عمر إبراهيم", role: "مندوب القاهرة", type: "إجازة عارضة", from: "2026-09-21", to: "2026-09-21", days: 1, reason: "أمر طارئ", status: "معتمدة"},
        {id: "LV-203", rep: "د. يوسف خالد", role: "مندوب الدقهلية", type: "إجازة مرضية", from: "2026-09-22", to: "2026-09-23", days: 2, reason: "وعكة صحية وإجهاد", status: "قيد الانتظار"}
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
    currentUser = defaultUsers[roleKey];
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('roleBadge').textContent = currentUser.roleAr;
    document.getElementById('avatarLetter').textContent = currentUser.name.slice(0, 1);
    showToast('تم التبديل بنجاح إلى: ' + currentUser.roleAr);
    showTab(activeTab);
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3000);
  }

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
  }

  // Tabs Navigation
  function showTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event?.currentTarget?.classList?.add('active');

    const main = document.getElementById('mainContent');
    const title = document.getElementById('pageTitle');
    const subtitle = document.getElementById('pageSubtitle');

    if (window.innerWidth <= 820) {
      document.getElementById('sidebar').classList.remove('open');
    }

    if (tabId === 'dashboard') {
      title.textContent = 'لوحة القيادة والمؤشرات الميدانية';
      subtitle.textContent = 'نظام إدارة المناديب والعمليات البيطرية | KENAVET';
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
      subtitle.textContent = 'إثباتات التحصيل النقدي، الشيكات البنكية، ومعاملات InstaPay';
      renderCollections();
    } else if (tabId === 'invoices') {
      title.textContent = 'الفواتير وحجب السجل المالي';
      subtitle.textContent = 'عرض الفواتير للمحاسب والمدير مع حجب السجل التاريخي عن المناديب';
      renderInvoices();
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
    const totalCollected = cols.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    let html = \`
      <div class="hero-banner">
        <div class="hero-content">
          <h2>مرحباً بك في منصة KENAVET 🌿</h2>
          <p>أهلاً بك يا <strong>\${currentUser.name}</strong>. النظام مفعل بالكامل ويعمل أونلاين لمتابعة العمليات البيطرية وسير المناديب عبر 27 محافظة مصرية.</p>
          <div class="hero-pills">
            <span class="hero-pill">📍 نطاق صلاحيتك: \${currentUser.governorate}</span>
            <span class="hero-pill">🛡️ رتبة الحساب: \${currentUser.roleAr}</span>
            <span class="hero-pill">📱 تطبيق الأندرويد: متاح للتحميل</span>
          </div>
        </div>
        <div style="text-align:left;">
          <button class="btn-primary" style="background:#fff;color:var(--brand2);" onclick="showTab('visits')">
            + تسجيل تقرير زيارة اليوم
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span>إجمالي العملاء والمزارع</span>
          <strong>\${custs.length}</strong>
          <small>موزعين عبر المحافظات</small>
        </div>
        <div class="stat-card">
          <span>التقارير والزيارات الميدانية</span>
          <strong>\${visits.length}</strong>
          <small>موثقة بإحداثيات الـ GPS</small>
        </div>
        <div class="stat-card">
          <span>إجمالي التحصيلات المعتمدة</span>
          <strong style="color:var(--brand);">\${totalCollected.toLocaleString()} ج.م</strong>
          <small>شيكات ونقد وإنستاباي</small>
        </div>
        <div class="stat-card">
          <span>طلبات الإجازات المعلقة</span>
          <strong style="color:#d97706;">2</strong>
          <small>تحتاج اعتماد الإدارة</small>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:20px;">
        <div class="table-container">
          <div style="padding:16px 20px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;">
            <h4 style="margin:0;">آخر الزيارات والتقارير اليومية</h4>
            <a href="javascript:showTab('visits')" style="font-size:12px;color:var(--brand);text-decoration:none;font-weight:700;">عرض الكل ←</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>العميل / المزرعة</th>
                <th>المندوب</th>
                <th>المحافظة</th>
                <th>النتيجة</th>
              </tr>
            </thead>
            <tbody>
              \${visits.slice(0, 4).map(v => \`
                <tr>
                  <td><strong>\${v.customer}</strong></td>
                  <td>\${v.rep}</td>
                  <td><span class="badge-type">\${v.gov}</span></td>
                  <td><small style="color:var(--muted)">\${v.outcome.slice(0, 45)}...</small></td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>

        <div style="background:white;border:1px solid var(--line);border-radius:14px;padding:20px;">
          <h4 style="margin-bottom:14px;">⚡ اختصارات سريعة للمهام الميدانية</h4>
          <div style="display:grid;gap:10px;">
            <button class="btn-sm primary" style="padding:12px;justify-content:center;" onclick="openAddCustomerModal()">
              ➕ تكويد مزرعة / عيادة بيطرية جديدة
            </button>
            <button class="btn-sm primary" style="padding:12px;justify-content:center;" onclick="openAddVisitModal()">
              📝 إرسال تقرير زيارة ميدانية (GPS)
            </button>
            <button class="btn-sm primary" style="padding:12px;justify-content:center;" onclick="openAddCollectionModal()">
              💵 تسجيل سند تحصيل مالي / شيك
            </button>
            <button class="btn-sm" style="padding:12px;justify-content:center;" onclick="openLeaveModal()">
              🌴 تقديم طلب إجازة رسمي
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

  function renderCustomers() {
    let custs = getStore('kenavet_customers');
    if (!currentUser.canAll && currentUser.governorate) {
      custs = custs.filter(c => c.gov === currentUser.governorate || currentUser.governorate.includes(c.gov));
    }

    let html = \`
      <div class="section-header">
        <div>
          <h3>قائمة العملاء والمزارع (\${custs.length} عميل)</h3>
          <p style="font-size:12px;color:var(--muted);">يظهر للمندوب فقط عملاء نطاقه الجغرافي المسند إليه</p>
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
            </div>
          </div>
        \`).join('')}
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

  function renderVisits() {
    let visits = getStore('kenavet_visits');
    if (!currentUser.canAll && currentUser.governorate) {
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

  function renderCollections() {
    let cols = getStore('kenavet_collections');

    let html = \`
      <div class="section-header">
        <div>
          <h3>سندات التحصيل المالي والشيكات البنكية</h3>
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
              <th>المبلغ</th>
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

  function renderInvoices() {
    if (!currentUser.canViewInvoices) {
      document.getElementById('mainContent').innerHTML = \`
        <div style="background:#fff8e6;border:1px solid #f2dd9b;padding:30px;border-radius:16px;text-align:center;">
          <h3 style="color:#b45309;margin-bottom:10px;">🔒 صلاحية الدخول محجوبة (Gated Access)</h3>
          <p style="color:#78350f;max-width:600px;margin:0 auto 16px;">
            بناءً على طلب إدارة الشركة، <strong>يتم حجب السجل المالي التاريخي والفواتير السابقة عن مناديب المبيعات الميدانيين</strong>، ولا يتاح الاطلاع عليها إلا للإدارة المالية والمدير العام.
          </p>
          <small style="color:var(--muted)">يمكنك التبديل إلى حساب "المدير العام" أو "المحاسب المالي" من القائمة العلوية للاطلاع على الفواتير.</small>
        </div>
      \`;
      return;
    }

    let html = \`
      <div class="section-header">
        <div>
          <h3>فواتير المبيعات والأرصدة المدينة للعملاء</h3>
          <p style="font-size:12px;color:var(--muted);">متاحة للإدارة المالية والمدير العام لمتابعة سقف الائتمان ومديونيات العملاء</p>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>العميل</th>
              <th>القيمة الإجمالية</th>
              <th>المدفوع</th>
              <th>المتبقي</th>
              <th>تاريخ الاستحقاق</th>
              <th>المسؤول</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>INV-2026-081</strong></td>
              <td>مزرعة النور للدواجن</td>
              <td>120,000 ج.م</td>
              <td>45,000 ج.م</td>
              <td style="color:#b91c1c;font-weight:700;">75,000 ج.م</td>
              <td>2026-10-15</td>
              <td>د. أحمد محمد</td>
            </tr>
            <tr>
              <td><strong>INV-2026-082</strong></td>
              <td>شركة السلام للأدوية</td>
              <td>250,000 ج.م</td>
              <td>82,000 ج.م</td>
              <td style="color:#b91c1c;font-weight:700;">168,000 ج.م</td>
              <td>2026-11-01</td>
              <td>د. خالد منصور</td>
            </tr>
            <tr>
              <td><strong>INV-2026-083</strong></td>
              <td>مزرعة البركة للثروة الحيوانية</td>
              <td>95,000 ج.م</td>
              <td>95,000 ج.م</td>
              <td style="color:#15803d;font-weight:700;">0 ج.م (خالص)</td>
              <td>2026-09-10</td>
              <td>د. خالد منصور</td>
            </tr>
          </tbody>
        </table>
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

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

  function renderRadar() {
    // Rep coordinates in Zagazig
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
      </div>
    \`;
    document.getElementById('mainContent').innerHTML = html;
  }

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
    openAddVisitModal();
  }

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
          <label>نتائج الزيارة والتوصيات والملاحظات *</label>
          <textarea id="mVisitOutcome" placeholder="اكتب تفاصيل الزيارة، حالة القطيع، والأدوية المطلوبة..." rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>تاريخ المتابعة القادمة</label>
          <input type="date" id="mVisitNext" value="2026-09-27">
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
            <label>المبلغ المحصل (بالجنيه المصري) *</label>
            <input type="number" id="mColAmount" placeholder="مثال: 25000" required>
          </div>
          <div class="form-group">
            <label>طريقة السداد *</label>
            <select id="mColMethod">
              <option value="شيك بنكي">شيك بنكي آجل</option>
              <option value="نقدي (كاش)">نقدي (كاش بالخزينة)</option>
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
            <input type="date" id="mLvFrom" value="2026-09-25">
          </div>
          <div class="form-group">
            <label>تاريخ العودة للعمل</label>
            <input type="date" id="mLvTo" value="2026-09-27">
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

  // Initialize
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
