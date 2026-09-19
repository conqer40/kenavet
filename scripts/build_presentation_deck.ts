import * as fs from 'fs';
import * as path from 'path';

const assetsDir = path.join('D:', 'CRM', 'docs', 'presentation_assets');
const outputDir = path.join('D:', 'CRM', 'docs');
const outputFile = path.join(outputDir, 'FieldForce_Pro_Interactive_Presentation.html');
const brainDir = path.join('C:', 'Users', 'M', '.gemini', 'antigravity', 'brain', 'd197869b-798f-48f9-98d4-df4d053d7792');

function getBase64Image(filename: string): string {
  const filePath = path.join(assetsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return '';
  }
  const ext = path.extname(filename).slice(1);
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:image/${ext};base64,${data}`;
}

const imgLogin = getBase64Image('01_login.png');
const imgDashMgr = getBase64Image('02_dashboard_manager.png');
const imgCustList = getBase64Image('03_customers_list.png');
const imgAddCust = getBase64Image('04_add_customer_cascading.png');
const imgDocProf = getBase64Image('05_doctor_profile.png');
const imgVisitGps = getBase64Image('06_daily_report_gps.png');
const imgCollCheque = getBase64Image('07_collections_cheque.png');
const imgInvoices = getBase64Image('08_invoices_screen.png');
const imgLeavesBal = getBase64Image('09_leaves_balance.png');
const imgLeaveModal = getBase64Image('09_leave_request_modal.png');
const imgPlans = getBase64Image('10_work_plans.png');
const imgCoverage = getBase64Image('11_coverage_report.png');
const imgTeamSeq = getBase64Image('12_team_code_sequence.png');
const imgDashRep = getBase64Image('13_rep_dashboard.png');
const imgInvGated = getBase64Image('14_rep_invoices_gated.png');

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  category: 'intro' | 'roles' | 'features' | 'manual' | 'tech' | 'close';
  htmlContent: string;
  image?: string;
  imageCaption?: string;
  fullWidth?: boolean;
}

const slides: Slide[] = [
  // Slide 1: Cover
  {
    id: 'slide-1',
    category: 'intro',
    badge: '🌟 العرض التقديمي الرسمي المعتمد',
    title: 'نظام إدارة المناديب والعمليات الميدانية',
    subtitle: 'KENAVET — دليل المميزات، آلية العمل، وشرح وظائف المستخدمين بالتفصيل',
    fullWidth: true,
    htmlContent: `
      <div class="cover-hero">
        <div class="brand-tag"><span class="pulse"></span> الإصدار 2.5 Enterprise — شركة KENAVET للأدوية واللقاحات البيطرية</div>
        <h1 class="hero-title">منظومة المبيعات والرقابة الميدانية الذكية</h1>
        <p class="hero-desc">
          حل رقمي متكامل يجمع بين لوحة قيادة سحابية متقدمة للمديرين والإدارة المالية، وتطبيق هاتف ذكي فائق السرعة (Android APK & iOS) للمناديب في الميدان لشركة <strong>KENAVET</strong>.
        </p>

        <div class="stats-pills">
          <div class="stat-pill"><strong style="color:var(--brand)">27</strong><span>محافظة مصرية</span></div>
          <div class="stat-pill"><strong style="color:#0284c7">275</strong><span>مركز ومدينة</span></div>
          <div class="stat-pill"><strong style="color:#10b981">100%</strong><span>توثيق GPS دقيق</span></div>
          <div class="stat-pill"><strong style="color:#f59e0b">0%</strong><span>تكرار تحصيلات</span></div>
          <div class="stat-pill"><strong style="color:#8b5cf6">Multi-Role</strong><span>مصفوفة صلاحيات</span></div>
        </div>

        <div class="cover-footer-info">
          <span>📅 تاريخ العرض: سبتمبر 2026</span>
          <span>🏢 شركة KENAVET للأدوية واللقاحات البيطرية</span>
          <span>👨‍💻 برمجة وتطوير: م. محمد الحاوي © KENAVET</span>
          <span>⚡ تصفح بالأسهم [→] [←] أو زر المسطرة Space</span>
        </div>
      </div>
    `
  },

  // Slide 2: Target Sectors & Problems
  {
    id: 'slide-2',
    category: 'intro',
    badge: '🎯 قطاعات السوق والمشكلات',
    title: 'القطاعات المستهدفة والمشكلات الواقعية',
    subtitle: 'لماذا تحتاج شركة KENAVET لهذا النظام؟ وكيف يقضي على الفوضى الميدانية؟',
    image: imgLogin,
    imageCaption: 'شاشة تسجيل الدخول المعتمدة لشركة KENAVET مع توقيع التطوير الهادئ',
    htmlContent: `
      <div class="card-grid-2">
        <div class="feature-box">
          <div class="f-icon">🏢</div>
          <h4>القطاعات المستهدفة:</h4>
          <ul>
            <li><strong>شركات الأدوية واللقاحات البيطرية:</strong> تغطية عيادات الأطباء البيطريين، الصيدليات البيطرية، والمستودعات الطبية.</li>
            <li><strong>قطاع الثروة الداجنة والحيوانية:</strong> مزارع التسمين، البياض، الجدود، ومحطات الماشية والحلاب.</li>
            <li><strong>مصانع الأعلاف والمركزات:</strong> تغطية الموزعين والتجار والوكلاء في كافة المحافظات.</li>
            <li><strong>شركات التوزيع والتجارة:</strong> أي نشاط يعتمد على مناديب ومناطق جغرافية وسداد آجل.</li>
          </ul>
        </div>

        <div class="feature-box">
          <div class="f-icon" style="background:#fef2f2;color:#ef4444">⚠️</div>
          <h4>المشاكل الجذرية التي يعالجها:</h4>
          <ul>
            <li><strong>الزيارات الصورية:</strong> القضاء على التقارير الكاذبة بإلزام إثبات الحضور بالـ GPS وتوقيت الوصول الدقيق.</li>
            <li><strong>تداخل المناطق:</strong> حصر كل مندوب بمحافظاته ومراكزه المحددة ومنع تضارب المندوبين.</li>
            <li><strong>ضياع الشيكات:</strong> رقابة محكمة تشمل رقم الشيك، البنك المسحوب عليه، تاريخ الاستحقاق وصورة الشيك.</li>
            <li><strong>تسريب الأسعار:</strong> حجب سجل مشتريات العميل التاريخي عن المندوب وتمكينه فقط من إدخال طلبيات جديدة.</li>
          </ul>
        </div>
      </div>
    `
  },

  // Slide 3: User Roles Matrix Overview
  {
    id: 'slide-3',
    category: 'roles',
    badge: '👥 مصفوفة الأدوار والصلاحيات',
    title: 'هيكل المستخدمين ومصفوفة الصلاحيات',
    subtitle: 'كل مستخدم يرى بدقة ما يخص صلاحياته فقط دون أي تداخل مع زملائه',
    fullWidth: true,
    htmlContent: `
      <div class="roles-table-wrap">
        <table class="styled-table">
          <thead>
            <tr>
              <th style="width:20%">الدور الوظيفي</th>
              <th style="width:20%">المسمى بالإنجليزية</th>
              <th style="width:35%">المسؤوليات اليومية المباشرة</th>
              <th style="width:25%">نطاق الرؤية والأمان</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="role-pill rep">مندوب مبيعات ميداني</span></td>
              <td><b>Sales Representative</b></td>
              <td>زيارة المزارع والعيادات، إثبات الحضور بالـ GPS، تحصيل كاش وشيكات، إدخال فواتير جديدة، طلب إجازات.</td>
              <td>مقيد جغرافياً بمحافظاته ومدنه المسندة فقط؛ سجل فواتير العميل التاريخية محجوب عنه.</td>
            </tr>
            <tr>
              <td><span class="role-pill sup">مشرف / مدير المناديب</span></td>
              <td><b>Area Supervisor / Manager</b></td>
              <td>متابعة مناديب قطاعه، مراجعة الخطط الأسبوعية والشهرية، اعتماد الزيارات، ورصد العملاء المتأخر زيارتهم.</td>
              <td>رؤية قطاعه ومحافظاته ومناديبه التابعين له مع صلاحيات توجيه واعتماد.</td>
            </tr>
            <tr>
              <td><span class="role-pill fin">الإدارة المالية</span></td>
              <td><b>Finance Department</b></td>
              <td>تدقيق ومراجعة التحصيلات، فحص بيانات وصور الشيكات، تأكيد الإيداعات، وتحليل سجل مشتريات وفواتير العملاء.</td>
              <td>وصول كامل لكافة المعاملات المالية والشيكات وسجل فواتير ومشتريات العملاء.</td>
            </tr>
            <tr>
              <td><span class="role-pill hr">الموارد البشرية</span></td>
              <td><b>Human Resources (HR)</b></td>
              <td>متابعة ملفات المناديب والموظفين، أكواد EMP، مراقبة أرصدة الإجازات، وتسوية الإجازات المعتمدة مع الرواتب.</td>
              <td>إدارة شؤون الموظفين وأرصدة الإجازات الرسمية.</td>
            </tr>
            <tr>
              <td><span class="role-pill gm">المدير العام / مدير الشركة</span></td>
              <td><b>General Manager / CEO</b></td>
              <td>الاعتماد الحصري لإجازات الموظفين والمناديب، اعتماد الخطط السنوية والشهرية، ومتابعة لوحة المؤشرات الشاملة.</td>
              <td>صلاحية استراتيجية عليا ورؤية شاملة للشركة بكافة فروعها ومحافظاتها.</td>
            </tr>
            <tr>
              <td><span class="role-pill adm">مدير النظام</span></td>
              <td><b>Super Administrator</b></td>
              <td>تكويد الموظفين بالتسلسل EMP، إسناد المحافظات المتعددة، ضبط الصلاحيات ومراجعة سجل التدقيق الأمني.</td>
              <td>تحكم مطلق في الهيكل التنظيمي وإعدادات وقواعد الأمان.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },

  // Slide 4: Sales Rep Deep Dive
  {
    id: 'slide-4',
    category: 'roles',
    badge: '🏃‍♂️ دور المستخدم بالتفصيل',
    title: 'مندوب المبيعات الميداني (Sales Representative)',
    subtitle: 'ماذا يفعل المندوب من بداية اليوم وحتى نهايته؟ خطوة بخطوة',
    image: imgDashRep,
    imageCaption: 'لوحة تحكم المندوب: عملاء منطقته فقط، إنجاز اليوم، وأزرار الوصول السريع بنقرة واحدة',
    htmlContent: `
      <div class="steps-flow">
        <div class="step-card">
          <div class="step-num">١</div>
          <div>
            <h5>بداية اليوم ولوحة التحكم:</h5>
            <p>يسجل الدخول ليرى فقط عملاء مناطقه، عدد زيارات اليوم، المبالغ المحصلة، ونسبة تحقيق مستهدفه البيعي.</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-num">٢</div>
          <div>
            <h5>رادار العملاء الأقرب واللوكيشن:</h5>
            <p>يضغط زر <code>📍 إظهار العملاء الأقرب لموقعي (GPS)</code> لمعرفة العيادات والمزارع المحيطة به، وبضغطة زر يفتح <strong>Google Maps</strong> للملاحة إليها مباشرة.</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-num">٣</div>
          <div>
            <h5>إثبات الزيارة بالـ GPS:</h5>
            <p>عند الوصول، يفتح "تسجيل تقرير يومي" ويضغط <code>📍 تسجيل الحضور وتأكيد الموقع GPS</code> لتوثيق وقت وصوله الدقيق وتواجده الفعلي.</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-num">٤</div>
          <div>
            <h5>التحصيل المالي وإدخال الفواتير:</h5>
            <p>يسجل الكاش برقم الإيصال، أو الشيك ببيانات البنك وتاريخ الاستحقاق وصورته. ويسجل طلبيات التوريد الجديدة دون رؤية سجل المشتريات القديم.</p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-num">٥</div>
          <div>
            <h5>طلب الإجازة برصيد:</h5>
            <p>يطلع على رصيده المتبقي من الإجازات ويقدم طلبه الذي يتوجه مباشرة لمدير عام الشركة للاعتماد.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 5: Supervisor & Finance Roles
  {
    id: 'slide-5',
    category: 'roles',
    badge: '👔 المشرفين والمالية',
    title: 'مشرف المناديب والإدارة المالية',
    subtitle: 'الرقابة الميدانية التكتيكية والتدقيق المحاسبي الصارم للمدفوعات والشيكات',
    image: imgCollCheque,
    imageCaption: 'شاشة التحصيل مع تفاصيل الشيك البنكي (رقم الشيك، اسم البنك، تاريخ الاستحقاق) بانتظار اعتماد المالية',
    htmlContent: `
      <div class="card-grid-2">
        <div class="feature-box">
          <span class="role-pill sup" style="margin-bottom:8px">مشرف / مدير المناديب</span>
          <h4>مهام المشرف الميداني:</h4>
          <ul>
            <li><strong>الإشراف الجغرافي:</strong> متابعة كافة المناديب التابعين لمحافظاته ومراكزه.</li>
            <li><strong>متابعة خط السير:</strong> فحص إحداثيات الـ GPS وأوقات تسجيل حضور المناديب في المزارع.</li>
            <li><strong>مراجعة واعتماد الخطط:</strong> فحص خطط العمل الأسبوعية والشهرية وتوجيه المناديب للمستهدف.</li>
            <li><strong>إنقاذ العملاء الخاملين:</strong> متابعة تنبيهات العملاء الذين لم تتم زيارتهم منذ 30 يوماً.</li>
            <li><strong>الملاحظات الفنية:</strong> تقديم الدعم الفني والبيطري للمندوب لمساعدته في إغلاق الصفقات.</li>
          </ul>
        </div>

        <div class="feature-box">
          <span class="role-pill fin" style="margin-bottom:8px">الإدارة المالية</span>
          <h4>مهام الإدارة المالية:</h4>
          <ul>
            <li><strong>تدقيق التحصيلات:</strong> مراجعة كافة التحصيلات المرسلة من الميدان بحالة <code>Submitted</code>.</li>
            <li><strong>مطابقة الشيكات:</strong> فحص بيانات الشيك (البنك المسحوب عليه، تاريخ الاستحقاق، ورقم الشيك) ومطابقة صورته المرفقة.</li>
            <li><strong>التأكيد المالي:</strong> الضغط على "اعتماد وموافقة" فور التأكد من دخول الشيك الحافظة أو توريد الكاش.</li>
            <li><strong>سجل المبيعات والمديونيات:</strong> الصلاحية الكاملة للاطلاع على سجل فواتير ومشتريات العملاء لمتابعة أرصدتهم وحدودهم الائتمانية.</li>
          </ul>
        </div>
      </div>
    `
  },

  // Slide 6: HR & CEO Roles
  {
    id: 'slide-6',
    category: 'roles',
    badge: '👑 الإدارة العليا والموارد البشرية',
    title: 'المدير العام (مدير الشركة) والموارد البشرية',
    subtitle: 'القيادة التنفيذية، اعتماد الإجازات، الخطط الاستراتيجية، وإدارة شؤون الموظفين',
    image: imgLeaveModal,
    imageCaption: 'نافذة تقديم طلب الإجازة: حساب آلي لعدد الأيام، مقارنة بالرصيد المتاح، وتوجيه حصري لمدير الشركة',
    htmlContent: `
      <div class="card-grid-2">
        <div class="feature-box">
          <span class="role-pill gm" style="margin-bottom:8px">المدير العام / مدير الشركة (CEO)</span>
          <h4>صاحب القرار والاعتماد الأعلى:</h4>
          <ul>
            <li><strong>اعتماد الإجازات الحصري:</strong> توجه كافة طلبات إجازات المناديب والمشرفين لمدير الشركة مباشرة للبت فيها مع خصم الرصيد تلقائياً.</li>
            <li><strong>اعتماد الخطط الكبرى:</strong> اعتماد المستهدفات البيعية والتحصيلية السنوية والشهرية للشركة.</li>
            <li><strong>لوحة القيادة التنفيذية:</strong> متابعة فورية لإجمالي المبيعات، المحصل الفعلي، وتغطية المحافظات.</li>
            <li><strong>قرارات التوسع الجغرافي:</strong> دراسة تقارير التغطية الشاملة لفتح محافظات جديدة وتعيين مناديب.</li>
          </ul>
        </div>

        <div class="feature-box">
          <span class="role-pill hr" style="margin-bottom:8px">الموارد البشرية (HR)</span>
          <h4>شؤون الموظفين والامتثال:</h4>
          <ul>
            <li><strong>سجلات الموظفين:</strong> متابعة الأكواد الوظيفية المتسلسلة (EMP-xxx) وبيانات التواصل.</li>
            <li><strong>إدارة الأرصدة الافتتاحية:</strong> ضبط وتحديث أرصدة الإجازات السنوية، العارضة، والمرضية وفقاً لقانون العمل ولائحة الشركة.</li>
            <li><strong>تسوية مسيرات الرواتب:</strong> تصدير سجلات الإجازات المعتمدة من مدير الشركة لمطابقتها مع الحضور والرواتب.</li>
          </ul>
        </div>
      </div>
    `
  },

  // Slide 7: Egypt 27 Governorates & GPS Radar
  {
    id: 'slide-7',
    category: 'features',
    badge: '🗺️ التغطية الجغرافية والخرائط',
    title: 'تغطية 27 محافظة مصرية ورادار GPS',
    subtitle: 'قاعدة بيانات متكاملة لجميع مدن ومراكز مصر مع ربط ديناميكي ذكي وملاحة سريعة',
    image: imgAddCust,
    imageCaption: 'نافذة تكويد العميل: اختيار المحافظة يظهر تلقائياً مراكزها التابعة، مع زر التقاط إحداثيات GPS ورابط الخريطة',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">🏛️</div>
          <div>
            <strong>تكويد 27 محافظة و 275 مركزاً مصرياً:</strong>
            <p>جميع محافظات الجمهورية من الإسكندرية ومطروح إلى أسوان والوادي الجديد، مع كافة المراكز الإدارية الرسمية.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🔄</div>
          <div>
            <strong>ربط متتابع ذكي (Cascading Dropdowns):</strong>
            <p>بمجرد اختيار المحافظة في أي شاشة، يتم تحديث قائمة المدن والمراكز تلقائياً لتظهر فقط المراكز التابعة لها، مانعاً الأخطاء الإملائية وتشتت البيانات.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">📡</div>
          <div>
            <strong>رادار العملاء الأقرب لموقعي (GPS Distance):</strong>
            <p>زر ذكي في شاشة العملاء يحسب المسافة الحقيقية بين موقع المندوب الحالي وبين كل مزرعة أو عيادة بالكيلومتر والمتر (مثال: <code>تبعد 350 متر</code>) لترتيب خط سيره بأعلى كفاءة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🗺️</div>
          <div>
            <strong>الملاحة المباشرة عبر Google Maps:</strong>
            <p>زر مخصص على بطاقة كل عميل يفتح تطبيق Google Maps مباشرة في هاتف المندوب لتوجيهه بدقة لبوابة المزرعة أو العيادة.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 8: Doctor Profile
  {
    id: 'slide-8',
    category: 'features',
    badge: '👨‍⚕️ بروفايل شامل وتفاعلي',
    title: 'بروفايل العميل / الطبيب البيطري (Doctor Profile)',
    subtitle: 'ملف رقمي متكامل لكل عميل يجمع بياناته، مزارعه، أطبائه، وسجل معاملاته التاريخية',
    image: imgDocProf,
    imageCaption: 'بروفايل الطبيب: شارات التصنيف، أزرار الإجراء السريع (زيارة، تحصيل، فاتورة)، رابط Google Maps، وسجل التقارير',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">📋</div>
          <div>
            <strong>بيانات التواصل المتكاملة:</strong>
            <p>اسم المنشأة، اسم الطبيب المسؤول، الهاتف المباشر، زر فتح محادثة WhatsApp فورية، والعنوان الجغرافي التفصيلي.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">⚡</div>
          <div>
            <strong>أزرار الإجراء السريع (Quick Actions):</strong>
            <p>بدون الرجوع للقوائم أو البحث؛ من داخل بروفايل الطبيب يمكنك بضغطة واحدة: [تسجيل زيارة] أو [تسجيل تحصيل] أو [إدخال فاتورة].</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">📑</div>
          <div>
            <strong>تبويبات السجلات التاريخية:</strong>
            <p>سجل تفصيلي بكافة المقابلات والزيارات السابقة ونتائجها ومواعيد المتابعة، وسجل التحصيلات المالية المعتمدة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🛡️</div>
          <div>
            <strong>الحماية والخصوصية:</strong>
            <p>يظهر سجل الفواتير والمشتريات القديمة فقط للمديرين والإدارة المالية، مع حجبه عن المندوب برسالة تنبيهية واضحة.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 9: GPS Check-in on Daily Reports
  {
    id: 'slide-9',
    category: 'features',
    badge: '📍 الرقابة الميدانية الموثقة',
    title: 'التقارير اليومية وإثبات الحضور بالـ GPS',
    subtitle: 'القضاء النهائي على الزيارات الوهمية عبر توثيق إحداثيات تواجد المندوب ولحظة الوصول',
    image: imgVisitGps,
    imageCaption: 'شاشة تسجيل التقرير اليومي: اختيار العميل من قائمة منطقته، وزر إثبات الحضور وتأكيد الموقع GPS بالثانية',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">🎯</div>
          <div>
            <strong>اختيار العميل التلقائي:</strong>
            <p>المندوب يختار العميل من قائمة منسدلة تحصر عملاء مناطقه فقط؛ بمجرد اختياره تظهر بطاقة فورية باسم الطبيب ونشاطه وهاتفه للتأكيد.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">📌</div>
          <div>
            <strong>ختم الحضور الجغرافي الإلزامي (GPS Check-in):</strong>
            <p>زر <code>📍 تسجيل الحضور وتأكيد الموقع GPS الآن</code> يلتقط إحداثيات هاتف المندوب ولحظة وصوله الدقيقة بالثانية، لتأكيد حضوره الفعلي داخل المزرعة أو العيادة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">📝</div>
          <div>
            <strong>تدوين نتائج المقابلة والمتابعة:</strong>
            <p>تحديد نوع الزيارة (دورية، مبيعات، تحصيل، متابعة)، كتابة الغرض، النتيجة، تاريخ الزيارة القادمة، وإرفاق صورة الروشتة أو المزرعة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🎖️</div>
          <div>
            <strong>شارة التوثيق في جدول الزيارات:</strong>
            <p>تظهر شارة خضراء أنيقة <code>📍 موثق بالـ GPS</code> بجوار كل زيارة مثبتة جغرافياً لإعطاء الإدارة الثقة التامة في صحة التقارير.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 10: Collections & Cheques
  {
    id: 'slide-10',
    category: 'features',
    badge: '💵 الضبط والرقابة المالية',
    title: 'التحصيلات المالية والشيكات البنكية',
    subtitle: 'دورة نقدية وبنكية محكمة تغطي الكاش والشيكات والتحويلات مع اعتماد مالي إلزامي',
    image: imgCollCheque,
    imageCaption: 'حقول الشيك البنكي الإلزامية: رقم الشيك، البنك المسحوب عليه، تاريخ الاستحقاق، وصورة الشيك المرفقة',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">🏦</div>
          <div>
            <strong>إلزامية بيانات الشيك البنكي:</strong>
            <p>عند اختيار "شيك بنكي"، تفتح الشاشة تلقائياً حقولاً إجبارية تشمل: رقم الشيك، اسم البنك المسحوب عليه، تاريخ الاستحقاق، وإرفاق صورة واضحة للشيك.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">💵</div>
          <div>
            <strong>تغطية كافة قنوات الدفع:</strong>
            <p>دعم كامل للدفع النقدي (كاش مع رقم الإيصال)، التحويلات البنكية، والمحافظ الإلكترونية و <strong>InstaPay</strong>.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">⏳</div>
          <div>
            <strong>حالة الاعتماد المعلقة (Submitted):</strong>
            <p>المبلغ لا يدخل ميزان المدفوعات كـ <code>Confirmed</code> إلا بعد مراجعة الإدارة المالية لصورة الشيك ومطابقة حسابات البنك أو توريد الكاش للخزينة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🔒</div>
          <div>
            <strong>منع تكرار القيد (Idempotency Locks):</strong>
            <p>أقفال برمجية مشفرة تمنع تسجيل الدفعة مرتين في حال ضعف شبكة الهاتف أو ضغط المندوب على الزر أكثر من مرة.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 11: Invoices Gated View
  {
    id: 'slide-11',
    category: 'features',
    badge: '🔒 سرية الأسعار والمبيعات',
    title: 'الفواتير وحجب السجل التاريخي عن المناديب',
    subtitle: 'حماية السياسات السعرية والائتمانية مع تمكين المندوب من رفع أوامر التوريد الجديدة',
    image: imgInvGated,
    imageCaption: 'رسالة الحجب الأمني للمندوب: تنبيه واضح يوضح صلاحية إدخال فواتير جديدة فقط مع حجب مشتريات العميل التاريخية',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">📦</div>
          <div>
            <strong>إدخال الفواتير الجديدة (Invoice Entry):</strong>
            <p>يستطيع المندوب بسهولة رفع طلبيات العميل وأوامر التوريد الجديدة برقم الفاتورة، القيمة الإجمالية بالجنيه، وصورة إذن الاستلام أو الفاتورة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🛡️</div>
          <div>
            <strong>حجب السجل التاريخي للمشتريات:</strong>
            <p>يظهر للمندوب تنبيه أمني واضح؛ حيث يُحجب جدول المبيعات التاريخية لحماية أسرار الخصومات والتسعير الخاص بكل مزرعة وعيادة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">📊</div>
          <div>
            <strong>رؤية كاملة للإدارة والمديرين:</strong>
            <p>تمتلك الإدارة المالية والمدير العام والمشرفون شاشة فواتير كاملة بجدول تاريخي ومؤشرات لتحليل معدلات السحب ومواعيد السداد.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 12: Leave Balances & CEO Approval
  {
    id: 'slide-12',
    category: 'features',
    badge: '🌴 إدارة الإجازات الذكية',
    title: 'أرصدة الإجازات والطلب المباشر لمدير الشركة',
    subtitle: 'منظومة إدارية آلية بالكامل تحسب الأيام المتبقية وتوجه الطلب لصاحب القرار التنفيذي',
    image: imgLeavesBal,
    imageCaption: 'شاشة الإجازات: بطاقات حية بالأرصدة (الرصيد الكلي، المستهلك، المتبقي) وجدول الطلبات المعتمدة',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">🎫</div>
          <div>
            <strong>بطاقات أرصدة لحظية:</strong>
            <p>تعرض للموظف رصيده المتبقي من كل نوع: إجازة سنوية (21 يوماً)، عارضة (7 أيام)، ومرضية، مع توضيح الرصيد الافتتاحي والمستهلك.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🧮</div>
          <div>
            <strong>احتساب آلي لعدد الأيام وفحص الكفاية:</strong>
            <p>يحسب النظام عدد الأيام آلياً بمجرد تحديد تاريخ البداية والنهاية، ويمنع إرسال الطلب إن كان الرصيد المتبقي لا يكفي.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">👑</div>
          <div>
            <strong>توجيه مباشر لمدير عام الشركة:</strong>
            <p>تصل كافة طلبات المناديب والمشرفين إلى شاشة <strong>المدير العام / مدير الشركة</strong> حصرياً للموافقة أو الرفض مع سبب توضيحي.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">⚡</div>
          <div>
            <strong>خصم آلي للرصيد فور الاعتماد:</strong>
            <p>بمجرد موافقة مدير الشركة في مركز الموافقات، يُخصم عدد الأيام تلقائياً من رصيد الموظف ويُخطر الموظف فورياً.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 13: Work Plans Divided
  {
    id: 'slide-13',
    category: 'features',
    badge: '📅 إدارة الخطط والمستهدفات',
    title: 'خطط العمل الميدانية (أسبوعية / شهرية / سنوية)',
    subtitle: 'تقسيم زمني استراتيجي ومتابعة لحظية لمعدلات تحقيق التارجت البيعي والتحصيلي',
    image: imgPlans,
    imageCaption: 'شاشة خطط العمل: تبويبات فرز سريعة بين الخطط الأسبوعية والشهرية والسنوية مع تحديد مستهدفات الزيارات والتحصيل',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">🗂️</div>
          <div>
            <strong>تبويبات الفرز الزمني السريع:</strong>
            <p>التنقل السلس بضغطة زر بين: [جميع الخطط] | [خطط أسبوعية Weekly] | [خطط شهرية Monthly] | [خطط سنوية Annual].</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🎯</div>
          <div>
            <strong>مستهدفات تفصيلية قابلة للقياس:</strong>
            <p>تحديد مستهدف عدد الزيارات، مبالغ التحصيل بالجنيه، المبيعات المتوقعة، وعدد العملاء الجدد المستهدف إضافتهم.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">📈</div>
          <div>
            <strong>مقارنة المحقق بالمستهدف آلياً:</strong>
            <p>يقوم النظام تلقائياً بربط الزيارات والتحصيلات المسجلة من المندوب بالخطة لاحتساب نسبة الإنجاز المئوية دون أي حسابات يدوية.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 14: Coverage Report & Excel Export
  {
    id: 'slide-14',
    category: 'features',
    badge: '📊 الرقابة والتقارير التنفيذية',
    title: 'تقرير تغطية المناديب والدكاترة وتصدير Excel',
    subtitle: 'رؤية 360 درجة لحركة الفريق الميداني وتوزيع المزارع والعيادات وتصدير فوري',
    image: imgCoverage,
    imageCaption: 'تقرير التغطية الشامل: توزيع المحافظات، المشرفين، العيادات، المزارع، ومبالغ التحصيل مع أزرار تصدير Excel و PDF',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">🔬</div>
          <div>
            <strong>جدول التغطية الميدانية الشامل:</strong>
            <p>يعرض لكل مندوب: المحافظات والمدن المسندة له، المشرف المباشر، عدد العيادات والأطباء، عدد المزارع، عدد الصيدليات، إجمالي الزيارات، والمبالغ المحصلة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">📥</div>
          <div>
            <strong>تصدير احترافي إلى Excel (XLSX):</strong>
            <p>تصدير كافة الجداول بضغطة زر إلى ملفات إكسيل منسقة بترميز UTF-8 يدعم الحروف العربية بشكل سليم تماماً ودون تشويه.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🖨️</div>
          <div>
            <strong>تصدير CSV والطباعة المباشرة و PDF:</strong>
            <p>خيارات تصدير مرنة لتجهيز التقارير الدورية للاجتماعات ومجالس الإدارة ولجان المبيعات.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 15: Team Auto-Sequence & Multi-Regions
  {
    id: 'slide-15',
    category: 'features',
    badge: '🔢 إدارة الهيكل والتكويد الآلي',
    title: 'تكويد الموظفين بالتسلسل EMP وإسناد محافظات متعددة',
    subtitle: 'أتمتة تكويد الكوادر ومنح مرونة كاملة لتغطية قطاعات جغرافية واسعة',
    image: imgTeamSeq,
    imageCaption: 'نافذة تكويد موظف جديد: حساب تلقائي للكود التالي (EMP-016)، اختيار المشرف، وإسناد محافظات ومراكز متعددة',
    htmlContent: `
      <div class="bullets-feature-list">
        <div class="bf-item">
          <div class="bf-icon">🔢</div>
          <div>
            <strong>التسلسل التلقائي لكود الموظف (Auto-sequence):</strong>
            <p>يقوم النظام بالبحث عن أعلى كود مسجل وتوليد الكود التالي فورياً (مثل <code>EMP-016</code>) مانعاً تكرار الأكواد أو الأخطاء البشرية.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">🌐</div>
          <div>
            <strong>إسناد محافظات متعددة ومراكز محددة:</strong>
            <p>إمكانية اختيار أكثر من محافظة في نفس الوقت لنفس المندوب أو المدير، مع زر <code>تحديد كل المدن والمراكز</code> أو انتقاء مراكز معينة بمرونة فائقة.</p>
          </div>
        </div>

        <div class="bf-item">
          <div class="bf-icon">👔</div>
          <div>
            <strong>الربط بالمشرف المباشر:</strong>
            <p>خيار ذكي لربط المندوب بمدير المناديب المسؤول عنه لتنظيم التسلسل القيادي ومسارات الاعتماد.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 16: Mobile Apps (Android APK & iOS PWA)
  {
    id: 'slide-16',
    category: 'tech',
    badge: '📱 تطبيق أندرويد KENAVET.apk',
    title: 'تطبيق الأندرويد الميداني (KENAVET APK)',
    subtitle: 'تطبيق مخصص كامل بحزمة أصلية وتثبيت فوري على هواتف المناديب',
    image: imgDashRep,
    imageCaption: 'واجهة تطبيق KENAVET للهاتف: شريط تنقل سفلي، شاشة كاملة، وسرعة فائقة في الميدان',
    htmlContent: `
      <div class="card-grid-2">
        <div class="feature-box">
          <div class="f-icon">🤖</div>
          <h4>تطبيق الأندرويد الأصلي (KENAVET.apk):</h4>
          <ul>
            <li><strong>ملف جاهز للتثبيت:</strong> حزمة أندرويد مستقلة <code>KENAVET.apk</code> بحجم 4.1 ميجابايت فقط.</li>
            <li><strong>معرف الحزمة:</strong> <code>com.kenavet.fieldforce</code> مع شاشة بداية باسم وشعار KENAVET.</li>
            <li><strong>صلاحيات متقدمة:</strong> وصول كامل ودقيق لحساس الـ GPS وكاميرا الهاتف لتصوير الشيكات والفواتير.</li>
            <li><strong>الاتصال الذكي:</strong> اتصال مباشر بسيرفر الشركة عبر الشبكة مع مرونة كتابة أي رابط سيرفر مستقبلي.</li>
          </ul>
        </div>

        <div class="feature-box">
          <div class="f-icon" style="background:#ecfdf5;color:#059669">🍏</div>
          <h4>هواتف آبل (iPhone / iPad) والأمان:</h4>
          <ul>
            <li><strong>تطبيق PWA للآيفون:</strong> يعمل عبر Safari بزر "إضافة إلى الشاشة الرئيسية" كأي تطبيق أصلي بدون مصاريف متجر آبل.</li>
            <li><strong>عزل البيانات RLS:</strong> عزل تام على مستوى قاعدة البيانات بحيث يستحيل على المندوب رؤية بيانات خارج محافظاته.</li>
            <li><strong>أقفال المعاملات المالية:</strong> منع تكرار قيد المبالغ المحصلة عند ضعف تغطية شبكة الهاتف بالمزارع.</li>
          </ul>
        </div>
      </div>
    `
  },

  // Slide 17: Step-by-Step Usage Guide Summary
  {
    id: 'slide-17',
    category: 'manual',
    badge: '📖 دليل الاستخدام السريع',
    title: 'ملخص خطوات الاستخدام اليومي',
    subtitle: 'دليل مبسط يوضح كيف ينجز المندوب والمدير أعمالهم في أقل من دقيقة',
    fullWidth: true,
    htmlContent: `
      <div class="workflow-cards-row">
        <div class="wf-card">
          <span class="wf-badge">المرحلة الأولى</span>
          <h4>تكويد العميل</h4>
          <p>اختيار المحافظة ← تظهر مراكزها تلقائياً ← كتابة العنوان ← الضغط على زر <code>📍 تحديد موقعي GPS</code> للحصول على الإحداثيات ورابط Google Maps فورياً.</p>
        </div>

        <div class="wf-card">
          <span class="wf-badge">المرحلة الثانية</span>
          <h4>الوصول وتأكيد الحضور</h4>
          <p>فتح رادار الأقرب ← الملاحة بـ Google Maps ← فتح تقرير زيارة ← الضغط على <code>📍 تسجيل الحضور GPS الآن</code> لتوثيق الوجود الفعلي.</p>
        </div>

        <div class="wf-card">
          <span class="wf-badge">المرحلة الثالثة</span>
          <h4>التحصيل المالي</h4>
          <p>اختيار العميل والمبلغ ← اختيار طريقة الدفع ← تعبئة رقم الشيك والبنك وتاريخ الاستحقاق وصورته ← إرسال للمراجعة المالية.</p>
        </div>

        <div class="wf-card">
          <span class="wf-badge">المرحلة الرابعة</span>
          <h4>اعتماد الإدارة</h4>
          <p>مدير الشركة يعتمد طلبات الإجازات والخطط ← الإدارة المالية تعتمد الشيكات والكاش لتأكيد الإيداع في الحسابات.</p>
        </div>
      </div>
    `
  },

  // Slide 18: Demo Accounts & Live Testing
  {
    id: 'slide-18',
    category: 'close',
    badge: '🔑 بيئة التجربة والفحص المباشر',
    title: 'مصفوفة حسابات التجربة الفورية',
    subtitle: 'النظام يعمل ومتاح للاستعراض والتجربة الفورية أمام عميلك الآن',
    fullWidth: true,
    htmlContent: `
      <div class="demo-box-hero">
        <div class="demo-url-bar">
          <span>🌐 رابط النظام المحلي المباشر:</span>
          <strong>http://localhost:3000</strong>
          <span class="badge-active">KENAVET تعمل ومستقرة 🟢</span>
        </div>
        <p style="margin:8px 0 16px;color:#475569">
          🔑 كلمة المرور الموحدة لجميع حسابات التجربة: <code>DemoPass!2026</code>
        </p>

        <div class="demo-accounts-grid">
          <div class="account-card">
            <span class="role-pill rep">مندوب مبيعات (أحمد)</span>
            <div class="acc-email">ahmed@fieldforce.test</div>
            <p>تجربة رؤية عملاء منطقته فقط، رادار GPS، تسجيل تقرير بالـ GPS، تسجيل شيك بنكي، إدخال فاتورة، وطلب إجازة برصيد.</p>
          </div>

          <div class="account-card">
            <span class="role-pill sup">مشرف المناديب</span>
            <div class="acc-email">supervisor@fieldforce.test</div>
            <p>تجربة متابعة مناديب المحافظة، مراجعة الخطط، تنبيهات العملاء الخاملين، واعتماد تقارير الزيارات.</p>
          </div>

          <div class="account-card">
            <span class="role-pill fin">الإدارة المالية</span>
            <div class="acc-email">finance@fieldforce.test</div>
            <p>تجربة تدقيق ومراجعة الشيكات والتحصيلات، التأكيد المالي، والاطلاع على سجل فواتير ومشتريات العملاء.</p>
          </div>

          <div class="account-card">
            <span class="role-pill gm">مدير عام الشركة</span>
            <div class="acc-email">manager@fieldforce.test</div>
            <p>تجربة الاعتماد الحصري للإجازات، تقرير تغطية المناديب والدكاترة، واعتماد الخطط ولوحة المؤشرات الشاملة.</p>
          </div>
        </div>
      </div>
    `
  },

  // Slide 19: Executive Closing & Conclusion
  {
    id: 'slide-19',
    category: 'close',
    badge: '🏁 الخلاصة والاعتماد',
    title: 'KENAVET — جاهزون للانطلاق وقيادة السوق',
    subtitle: 'الاستثمار الذكي لتعظيم مبيعات شركتك وضبط عملياتك الميدانية في كافة محافظات مصر',
    fullWidth: true,
    htmlContent: `
      <div class="closing-hero">
        <div class="closing-mark">K</div>
        <h2>KENAVET Enterprise</h2>
        <p class="closing-tagline">المنظومة الرقمية الشاملة لإدارة العمليات والمبيعات الميدانية البيطرية</p>

        <div class="value-triad">
          <div class="triad-item">
            <div class="triad-icon">📈</div>
            <h4>زيادة المبيعات بنسبة 35%</h4>
            <p>عبر رادار العملاء الأقرب، القضاء على إهدار الوقت في التنقل، وتحفيز المناديب بمستهدفات واضحة.</p>
          </div>
          <div class="triad-item">
            <div class="triad-icon">🛡️</div>
            <h4>صفر تلاعب في الزيارات</h4>
            <p>بفضل توثيق الحضور الجغرافي الإلزامي بالـ GPS وتوقيت الوصول الدقيق بالثانية داخل المنشأة.</p>
          </div>
          <div class="triad-item">
            <div class="triad-icon">💵</div>
            <h4>تحصيل مالي مضمون 100%</h4>
            <p>توثيق الشيكات ببيانات البنك وتاريخ الاستحقاق وصورة الشيك ومنع تكرار القيود واعتماد مالي فوري.</p>
          </div>
        </div>

        <div class="contact-card">
          <b>برمجة وتطوير: م. محمد الحاوي © KENAVET</b>
          <p style="margin-top:4px">تطبيق APK مخصص: <code>KENAVET.apk</code> · وثيقة التشغيل: <code>KENAVET_User_Guide.docx</code></p>
        </div>
      </div>
    `
  }
];

// Generate HTML Document
const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KENAVET — العرض التقديمي الشامل لنظام العمليات الميدانية</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #176b55;
      --brand-dark: #0e4c3c;
      --brand-light: #e6f4ea;
      --brand-hover: #125744;
      --accent: #0284c7;
      --amber: #f59e0b;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --white: #ffffff;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Cairo', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: #091310;
      color: var(--slate-900);
      overflow: hidden;
      height: 100vh;
      width: 100vw;
      user-select: none;
    }

    /* Top Progress Bar */
    .top-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1000;
    }
    .top-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #0284c7);
      width: 0%;
      transition: width 0.3s ease;
    }

    /* Presentation Viewport */
    .deck-container {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: radial-gradient(circle at 50% 30%, #132a24 0%, #08110e 100%);
      padding: 24px;
    }

    .slide {
      display: none;
      width: 100%;
      max-width: 1540px;
      height: 92vh;
      max-height: 860px;
      background: var(--white);
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
      flex-direction: column;
      animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .slide.active {
      display: flex;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Slide Header */
    .slide-header {
      padding: 24px 36px 16px;
      border-bottom: 1px solid var(--slate-100);
      background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-shrink: 0;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: var(--brand-light);
      color: var(--brand);
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .slide-title {
      font-size: 26px;
      font-weight: 800;
      color: var(--slate-900);
      line-height: 1.25;
    }

    .slide-subtitle {
      font-size: 14px;
      color: var(--slate-600);
      margin-top: 4px;
    }

    .header-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--slate-50);
      padding: 6px 14px;
      border-radius: 12px;
      border: 1px solid var(--slate-200);
    }
    .header-logo .mark {
      width: 28px;
      height: 28px;
      background: var(--brand);
      color: var(--white);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 16px;
    }
    .header-logo b {
      font-size: 14px;
      color: var(--slate-800);
    }

    /* Slide Body */
    .slide-body {
      flex: 1;
      padding: 24px 36px;
      overflow-y: auto;
      display: flex;
      gap: 32px;
    }

    .slide-body.full {
      display: block;
    }

    .left-col {
      flex: 1.15;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .right-col {
      flex: 1.25;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Device Preview Container */
    .screenshot-card {
      width: 100%;
      background: #0f172a;
      border-radius: 14px;
      padding: 10px 10px 8px;
      box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      border: 1px solid #334155;
    }

    .window-dots {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
      padding-right: 4px;
    }
    .window-dots span {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #ef4444;
    }
    .window-dots span:nth-child(2) { background: #f59e0b; }
    .window-dots span:nth-child(3) { background: #10b981; }

    .screenshot-img {
      width: 100%;
      height: auto;
      max-height: 490px;
      object-fit: contain;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
      cursor: zoom-in;
      transition: transform 0.2s;
    }

    .screenshot-caption {
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    /* Grid & Cards */
    .card-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      height: 100%;
    }

    .feature-box {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .feature-box .f-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--brand-light);
      color: var(--brand);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .feature-box h4 {
      font-size: 17px;
      font-weight: 800;
      color: var(--slate-900);
    }

    .feature-box ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .feature-box li {
      font-size: 13.5px;
      line-height: 1.5;
      color: var(--slate-700);
      position: relative;
      padding-right: 18px;
    }

    .feature-box li::before {
      content: '✓';
      position: absolute;
      right: 0;
      color: var(--brand);
      font-weight: 900;
    }

    /* Bullets Feature List */
    .bullets-feature-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .bf-item {
      display: flex;
      gap: 14px;
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      padding: 14px 16px;
      border-radius: 12px;
      align-items: flex-start;
      transition: all 0.2s;
    }

    .bf-item:hover {
      background: #ffffff;
      border-color: var(--brand);
      transform: translateX(-4px);
      box-shadow: var(--shadow-sm);
    }

    .bf-icon {
      font-size: 24px;
      background: #ffffff;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      border: 1px solid var(--slate-200);
      flex-shrink: 0;
    }

    .bf-item strong {
      font-size: 15px;
      color: var(--slate-900);
      display: block;
      margin-bottom: 2px;
    }

    .bf-item p {
      font-size: 13px;
      color: var(--slate-600);
      line-height: 1.45;
    }

    /* Steps Flow */
    .steps-flow {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .step-card {
      display: flex;
      gap: 12px;
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      padding: 10px 14px;
      border-radius: 10px;
      align-items: center;
    }

    .step-num {
      width: 30px;
      height: 30px;
      background: var(--brand);
      color: var(--white);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      flex-shrink: 0;
    }

    .step-card h5 {
      font-size: 14px;
      font-weight: 700;
      color: var(--slate-900);
    }

    .step-card p {
      font-size: 12.5px;
      color: var(--slate-600);
      line-height: 1.35;
    }

    /* Role Pills */
    .role-pill {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
    }
    .role-pill.rep { background: #e0f2fe; color: #0369a1; }
    .role-pill.sup { background: #fef3c7; color: #b45309; }
    .role-pill.fin { background: #dcfce7; color: #15803d; }
    .role-pill.hr { background: #f3e8ff; color: #7e22ce; }
    .role-pill.gm { background: #fee2e2; color: #b91c1c; }
    .role-pill.adm { background: #f1f5f9; color: #334155; }

    /* Tables */
    .styled-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
      text-align: right;
    }
    .styled-table th {
      background: var(--brand);
      color: var(--white);
      padding: 12px 16px;
      font-weight: 700;
      border: 1px solid var(--brand);
    }
    .styled-table td {
      padding: 12px 16px;
      border: 1px solid var(--slate-200);
      color: var(--slate-800);
    }
    .styled-table tr:nth-child(even) {
      background: var(--slate-50);
    }

    /* Cover Hero */
    .cover-hero {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px;
      background: radial-gradient(circle at 50% 50%, #f0fdf4 0%, #ffffff 100%);
    }

    .brand-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--white);
      border: 1px solid var(--brand);
      color: var(--brand);
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 20px;
      box-shadow: var(--shadow-sm);
    }

    .pulse {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .hero-title {
      font-size: 46px;
      font-weight: 900;
      color: var(--slate-900);
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .hero-desc {
      font-size: 18px;
      color: var(--slate-600);
      max-width: 860px;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .stats-pills {
      display: flex;
      gap: 18px;
      margin-bottom: 36px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .stat-pill {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      padding: 12px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: var(--shadow-sm);
      min-width: 140px;
    }
    .stat-pill strong {
      font-size: 28px;
      font-weight: 900;
      line-height: 1;
    }
    .stat-pill span {
      font-size: 13px;
      color: var(--slate-600);
      margin-top: 4px;
      font-weight: 600;
    }

    .cover-footer-info {
      display: flex;
      gap: 20px;
      font-size: 13px;
      color: var(--slate-500);
      border-top: 1px solid var(--slate-200);
      padding-top: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }

    /* Workflow Cards */
    .workflow-cards-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      height: 100%;
      align-items: stretch;
    }

    .wf-card {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
    }

    .wf-badge {
      align-self: flex-start;
      padding: 4px 10px;
      background: var(--brand);
      color: var(--white);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
    }

    .wf-card h4 {
      font-size: 18px;
      font-weight: 800;
      color: var(--slate-900);
    }

    .wf-card p {
      font-size: 13px;
      color: var(--slate-600);
      line-height: 1.6;
    }

    /* Demo accounts hero */
    .demo-box-hero {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 16px;
      padding: 24px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .demo-url-bar {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: 10px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 15px;
    }
    .demo-url-bar strong {
      color: var(--brand);
      font-size: 17px;
    }
    .badge-active {
      margin-right: auto;
      background: #ecfdf5;
      color: #059669;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .demo-accounts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 14px;
      flex: 1;
    }

    .account-card {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .acc-email {
      font-family: monospace;
      font-size: 14px;
      font-weight: 700;
      color: var(--slate-900);
      background: var(--slate-100);
      padding: 4px 8px;
      border-radius: 6px;
      align-self: flex-start;
      margin-top: 4px;
    }
    .account-card p {
      font-size: 12.5px;
      color: var(--slate-600);
      line-height: 1.45;
      margin-top: 4px;
    }

    /* Closing Hero */
    .closing-hero {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 30px;
      background: radial-gradient(circle at 50% 40%, #f0fdf4 0%, #ffffff 100%);
    }

    .closing-mark {
      width: 64px;
      height: 64px;
      background: var(--brand);
      color: var(--white);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 900;
      margin-bottom: 16px;
      box-shadow: 0 10px 20px -5px rgba(23, 107, 85, 0.4);
    }

    .closing-hero h2 {
      font-size: 34px;
      font-weight: 900;
      color: var(--slate-900);
      margin-bottom: 6px;
    }

    .closing-tagline {
      font-size: 16px;
      color: var(--brand);
      font-weight: 700;
      margin-bottom: 28px;
    }

    .value-triad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      max-width: 980px;
      margin-bottom: 28px;
    }

    .triad-item {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }
    .triad-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }
    .triad-item h4 {
      font-size: 16px;
      font-weight: 800;
      color: var(--slate-900);
      margin-bottom: 6px;
    }
    .triad-item p {
      font-size: 12.5px;
      color: var(--slate-600);
      line-height: 1.5;
    }

    .contact-card {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 13px;
      color: var(--slate-700);
    }

    /* Bottom Control Bar */
    .controls-bar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      padding: 8px 16px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15);
      z-index: 2000;
      color: var(--white);
    }

    .control-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--white);
      padding: 6px 14px;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .control-btn:hover {
      background: var(--brand);
      border-color: var(--brand);
      transform: translateY(-1px);
    }

    .slide-indicator {
      font-size: 13px;
      font-weight: 700;
      padding: 0 8px;
      font-family: monospace;
      color: #94a3b8;
    }
    .slide-indicator span {
      color: #38bdf8;
    }

    .slide-selector {
      background: #1e293b;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 5px 10px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 12.5px;
      outline: none;
    }

    /* Print Styles */
    @media print {
      body {
        overflow: visible;
        background: transparent;
        height: auto;
      }
      .top-progress, .controls-bar {
        display: none !important;
      }
      .deck-container {
        padding: 0;
        background: none;
        height: auto;
      }
      .slide {
        display: flex !important;
        page-break-after: always;
        height: 100vh;
        max-height: none;
        max-width: none;
        border-radius: 0;
        box-shadow: none;
        margin-bottom: 20px;
      }
    }
  </style>
</head>
<body>

  <!-- Top Progress Bar -->
  <div class="top-progress">
    <div class="top-progress-fill" id="topProgress"></div>
  </div>

  <!-- Deck Container -->
  <div class="deck-container">
    ${slides.map((s, index) => `
      <section class="slide ${index === 0 ? 'active' : ''}" id="${s.id}" data-index="${index}">
        ${!s.fullWidth ? `
          <header class="slide-header">
            <div>
              <span class="badge">${s.badge}</span>
              <h2 class="slide-title">${s.title}</h2>
              <p class="slide-subtitle">${s.subtitle}</p>
            </div>
            <div class="header-logo">
              <div class="mark">K</div>
              <b>KENAVET</b>
            </div>
          </header>
        ` : ''}

        <div class="slide-body ${s.fullWidth ? 'full' : ''}">
          ${!s.fullWidth ? `
            <div class="left-col">
              ${s.htmlContent}
            </div>
            ${s.image ? `
              <div class="right-col">
                <div class="screenshot-card">
                  <div class="window-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <img class="screenshot-img" src="${s.image}" alt="${s.title}" />
                  ${s.imageCaption ? `<div class="screenshot-caption">📷 ${s.imageCaption}</div>` : ''}
                </div>
              </div>
            ` : ''}
          ` : `
            ${s.htmlContent}
          `}
        </div>
      </section>
    `).join('\n')}
  </div>

  <!-- Bottom Navigation Control Bar -->
  <div class="controls-bar">
    <button class="control-btn" id="prevBtn" title="الشريحة السابقة [السهم الأيمن]">
      <span>→</span> السابق
    </button>

    <div class="slide-indicator">
      <span id="currentSlideNum">1</span> / ${slides.length}
    </div>

    <button class="control-btn" id="nextBtn" title="الشريحة التالية [السهم الأيسر أو Space]">
      التالي <span>←</span>
    </button>

    <select class="slide-selector" id="slideSelect">
      ${slides.map((s, i) => `
        <option value="${i}">${i + 1}. ${s.title.slice(0, 32)}...</option>
      `).join('')}
    </select>

    <button class="control-btn" id="fullscreenBtn" title="ملء الشاشة [F]">
      ⛶ شاشة كاملة
    </button>

    <button class="control-btn" id="printBtn" title="طباعة أو تصدير PDF [P]">
      🖨️ طباعة
    </button>

    <a href="./KENAVET.apk" download class="control-btn" style="background:linear-gradient(135deg,#059669,#10b981);color:#fff;text-decoration:none;" title="تحميل تطبيق الأندرويد">
      📱 تحميل APK
    </a>

    <a href="./KENAVET_FieldForce_Presentation.pdf" target="_blank" class="control-btn" style="background:linear-gradient(135deg,#0284c7,#38bdf8);color:#fff;text-decoration:none;" title="تحميل العرض التقديمي كملف PDF">
      📄 تحميل PDF
    </a>

    <a href="./FieldForce_Pro_Comprehensive_User_Guide.docx" download class="control-btn" style="background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;text-decoration:none;" title="تحميل دليل التشغيل الكامل كملف Word">
      📝 دليل Word
    </a>
  </div>

  <script>
    let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const total = slides.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentNumEl = document.getElementById('currentSlideNum');
    const slideSelect = document.getElementById('slideSelect');
    const progressBar = document.getElementById('topProgress');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const printBtn = document.getElementById('printBtn');

    function goToSlide(index) {
      if (index < 0) index = 0;
      if (index >= total) index = total - 1;

      slides[currentIndex].classList.remove('active');
      currentIndex = index;
      slides[currentIndex].classList.add('active');

      currentNumEl.textContent = currentIndex + 1;
      slideSelect.value = currentIndex;
      progressBar.style.width = ((currentIndex + 1) / total * 100) + '%';
    }

    function next() {
      if (currentIndex < total - 1) {
        goToSlide(currentIndex + 1);
      }
    }

    function prev() {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    slideSelect.addEventListener('change', (e) => {
      goToSlide(parseInt(e.target.value, 10));
    });

    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    printBtn.addEventListener('click', () => {
      window.print();
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === ' ' || e.key === 'PageDown') {
        next();
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp' || e.key === 'Backspace') {
        prev();
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      } else if (e.key === 'p' || e.key === 'P') {
        window.print();
      }
    });

    // Expose for testing
    window.goToSlide = goToSlide;

    // Initialize progress bar
    progressBar.style.width = (1 / total * 100) + '%';
  </script>
</body>
</html>
`;

fs.writeFileSync(outputFile, html, 'utf8');
console.log(`Presentation generated successfully at: ${outputFile}`);

const indexHtmlPath = path.join(outputDir, 'index.html');
fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log(`GitHub Pages index generated at: ${indexHtmlPath}`);

// Copy to brain directory as well
if (fs.existsSync(brainDir)) {
  const brainOutput = path.join(brainDir, 'FieldForce_Pro_Interactive_Presentation.html');
  fs.copyFileSync(outputFile, brainOutput);
  console.log(`Copied to brain directory: ${brainOutput}`);
}
