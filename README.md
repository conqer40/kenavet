# KENAVET — نظام إدارة المناديب والعمليات الميدانية البيطرية
### FieldForce Pro Enterprise Platform

منظومة سحابية متقدمة وتطبيق أندرويد ميداني ذكي لشركة **KENAVET للأدوية واللقاحات البيطرية**، تم تطويرها وبرمجتها لإدارة فرق المناديب والأطباء البيطريين، الزيارات الميدانية بالـ GPS، التقارير اليومية، التحصيلات المالية والشيكات، وإدارة الإجازات عبر 27 محافظة مصرية.

**برمجة وتطوير:** م. محمد الحاوي (Mohamed Elhawy) © KENAVET

---

## 🌟 روابط التحميل المباشرة والمعاينة (Direct Downloads & Links)

* 🌐 **العرض التقديمي التفاعلي (GitHub Pages):** [عرض البرزنتيشن أونلاين](https://conqer40.github.io/kenavet-crm/)
* 📱 **تحميل تطبيق الأندرويد الميداني:** [تحميل KENAVET.apk](https://github.com/conqer40/kenavet-crm/raw/main/docs/KENAVET.apk)
* 📄 **تحميل العرض التقديمي PDF (16:9):** [تحميل KENAVET_FieldForce_Presentation.pdf](https://github.com/conqer40/kenavet-crm/raw/main/docs/KENAVET_FieldForce_Presentation.pdf)
* 📝 **دليل التشغيل والاستخدام الشامل (Word):** [تحميل FieldForce_Pro_Comprehensive_User_Guide.docx](https://github.com/conqer40/kenavet-crm/raw/main/docs/FieldForce_Pro_Comprehensive_User_Guide.docx)

---

## ⚡ خيارات الاستضافة والمعاينة التجريبية المجانية

1. **معاينة حية وفورية عبر النفق (Tunnel):**
   ```bash
   npm run tunnel
   ```
2. **استضافة مجانية كاملة على Render.com (خطة Web Service المجانية 750 ساعة):**
   - تم تجهيز ملف `render.yaml` للرفع بضغطة واحدة دون الحاجة إلى Vercel أو Netlify.
3. **استضافة عبر Docker على Railway أو Koyeb:**
   - تم تجهيز ملف `Dockerfile` مدمج مع قاعدة البيانات والترحيلات التلقائية.

---

## 👥 حسابات الدخول التجريبية (Demo Credentials)

| الرتبة / الصفة | البريد الإلكتروني | كلمة المرور | نطاق الصلاحيات |
|---|---|---|---|
| **المدير العام (Admin)** | `admin@fieldforce.local` | `Admin#2026` | إدارة شاملة لكافة الأقسام والمحافظات |
| **مدير المنطقة (Manager)** | `tanta.mgr@fieldforce.local` | `Manager#2026` | متابعة المناديب والتقارير واعتماد الإجازات |
| **طبيب / مندوب ميداني (Rep)** | `dr.ahmed@fieldforce.local` | `Rep#2026` | تقارير يومية، رادار العملاء، طلب إجازات |
| **المحاسب المالي (Accountant)** | `acc@fieldforce.local` | `Acc#2026` | التحصيل وسندات السداد وتأكيد الخزينة |

---

## 🛠️ التشغيل المحلي (Local Development)

```bash
# 1. تثبيت الحزم
npm install

# 2. ترحيل قاعدة البيانات وملء البيانات التجريبية
npm run db:migrate
npm run db:seed

# 3. تشغيل الخادم
npm run dev
```

افتح المتصفح على: `http://localhost:3000`
