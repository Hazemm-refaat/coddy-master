document.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scroll (Task 1)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium fast-out-slow-in easing
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Sync ScrollTrigger with Lenis (scroller proxy)
  document.documentElement.classList.add("js-anim");

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  lenis.on("scroll", ScrollTrigger.update);
  ScrollTrigger.addEventListener("refresh", () => lenis.resize());

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const revealOnScroll = (
    selector,
    trigger,
    start = "top 85%",
    stagger = 0.1,
  ) => {
    const els = gsap.utils.toArray(selector);
    if (!els.length || !trigger) return;
    gsap.fromTo(
      els,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger,
          start,
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
        onComplete: () => els.forEach((el) => el.classList.add("is-visible")),
      },
    );
  };

  const initRevealFallback = () => {
    const targets = document.querySelectorAll(".scroll-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              overwrite: true,
            });
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );
    targets.forEach((el) => io.observe(el));
  };

  // Smooth anchor link scrolling behavior with offset (Task 4)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        lenis.scrollTo(0, {
          duration: 1.4,
          ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        return;
      }

      let targetElement = document.querySelector(targetId);
      // Fallback for contact since index.html has no dedicated contact form
      if (!targetElement && targetId === "#contact") {
        targetElement = document.getElementById("about");
      }

      if (targetElement) {
        // Scroll to target with a clean 80px offset for the sticky navbar
        lenis.scrollTo(targetElement, {
          offset: -80,
          duration: 1.4,
          ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    });
  });

  // Master Entry Timeline
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Initial resets (Dynamically injected upon script execution to support progressive enhancement)
  gsap.set("#hero-bg", { scale: 1.15, opacity: 0 });
  gsap.set(".hero-title-text", { yPercent: 120, opacity: 0 });
  gsap.set(".hero-element", { y: 30, opacity: 0 });
  gsap.set(".brand-strip-container", { y: 40, opacity: 0 });

  // The Orchestration
  tl
    // Background slow fade and scale
    .to(
      "#hero-bg",
      { scale: 1.1, opacity: 1, duration: 2, ease: "power2.out" },
      0,
    )

    // Top Navigation Reveal
    .to(".hero-nav", { opacity: 1, duration: 1 }, 0.2)

    // Cinematic Typography Reveal
    .to(
      ".hero-title-text",
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
      },
      0.3,
    )

    // Subtext and CTAs
    .to(
      ".hero-element",
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
      },
      0.6,
    )

    // Brand Strip floats up seamlessly after the hero is settled
    .to(
      ".brand-strip-container",
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
      },
      0.8,
    );

  // Premium Magnetic Button Logic
  const magneticBtns = document.querySelectorAll(".magnetic-btn");
  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });
    });
  });

  // Trusted By Section Header Reveal (GSAP ScrollTrigger)
  gsap.fromTo(
    ".trusted-header",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#trusted-by",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    },
  );

  // Services Section Header Reveal (GSAP ScrollTrigger)
  gsap.fromTo(
    ".services-header",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#services",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );

  // Service Cards Staggered Reveal (GSAP ScrollTrigger)
  gsap.fromTo(
    ".service-card",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      scrollTrigger: {
        trigger: "#services",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    },
  );

  // --- ODOO SOLUTIONS DATA ---
  const odooModules = {
    accounting: {
      en: {
        title: "Accounting",
        tag: "finance",
        desc: "Automate your financial processes. Direct bank feeds, AI invoice digitization, real-time reporting, and local VAT compliance.",
        features: [
          "AI-powered bill digitisation",
          "Real-time balance sheets",
          "Direct bank synchronization",
          "Egyptian Tax Authority e-invoicing integration",
        ],
        value:
          "Reduce manual bookkeeping by 80% and close your monthly accounts in minutes.",
      },
      ar: {
        title: "المحاسبة",
        tag: "مالية",
        desc: "أتمتة عملياتك المالية. ربط بنكي مباشر، رقمنة الفواتير بالذكاء الاصطناعي، تقارير فورية، وامتثال كامل لضريبة القيمة المضافة المصرية.",
        features: [
          "رقمنة الفواتير بالذكاء الاصطناعي",
          "ميزانيات عمومية لحظية",
          "مزامنة بنكية مباشرة",
          "الربط مع منظومة الفاتورة الإلكترونية المصرية",
        ],
        value:
          "تقليل الإدخال اليدوي بنسبة 80% وإغلاق الحسابات الشهرية في دقائق معدودة.",
      },
    },
    inventory: {
      en: {
        title: "Inventory",
        tag: "operations",
        desc: "Double-entry inventory management system. Traceability from purchase to sales, automated replenishment, and smart barcodes.",
        features: [
          "Double-entry inventory tracking",
          "Real-time stock valuation",
          "Barcode & RFID integration",
          "Automated reordering rules",
        ],
        value:
          "Optimize warehouse space, minimize deadstock, and improve fulfillment speed by 35%.",
      },
      ar: {
        title: "المخزون",
        tag: "عمليات",
        desc: "نظام إدارة مخزون مزدوج القيد. تتبع كامل من الشراء إلى البيع، إعادة إمداد تلقائي، وباركود ذكي.",
        features: [
          "تتبع المخزون مزدوج القيد",
          "تقييم المخزون في الوقت الفعلي",
          "تكامل الباركود و RFID",
          "قواعد إعادة الطلب التلقائية",
        ],
        value:
          "تحسين مساحة المستودعات، تقليل المخزون الراكد، وتسريع تلبية الطلبات بنسبة 35%.",
      },
    },
    manufacturing: {
      en: {
        title: "Manufacturing",
        tag: "production · mrp · quality",
        desc: "Fully integrated MRP, PLM, Quality, Maintenance, and Shop Floor. Plan work orders, track machinery, and schedule production.",
        features: [
          "Multi-level Bill of Materials (BOM)",
          "Work center capacity planning",
          "Real-time OEE tracking",
          "Quality control checks",
        ],
        value:
          "Increase production efficiency, prevent downtime, and ensure 100% product quality consistency.",
      },
      ar: {
        title: "التصنيع",
        tag: "إنتاج · MRP · جودة",
        desc: "نظام MRP متكامل بالكامل، إدارة دورة حياة المنتج، الجودة، الصيانة، وصالة الإنتاج. تخطيط أوامر العمل، تتبع الماكينات وجدولة الإنتاج.",
        features: [
          "قائمة مواد متعددة المستويات (BOM)",
          "تخطيط سعة مراكز العمل",
          "تتبع كفاءة المعدات الإجمالية (OEE)",
          "فحوصات مراقبة الجودة",
        ],
        value:
          "زيادة كفاءة الإنتاج، منع توقف العمليات، وضمان اتساق جودة المنتج بنسبة 100%.",
      },
    },
    crm: {
      en: {
        title: "CRM & Sales",
        tag: "pipeline",
        desc: "Track leads, close opportunities, and automate quotes. Predict sales revenue and manage pipeline activities easily.",
        features: [
          "Lead scoring & assignment",
          "Interactive pipeline kanban board",
          "Professional HTML quotation builder",
          "Automated email sequences",
        ],
        value:
          "Boost win rates by 25% and manage your entire sales team from a single screen.",
      },
      ar: {
        title: "العملاء والمبيعات",
        tag: "خطوط البيع",
        desc: "تتبع العملاء المحتملين، إغلاق الفرص، وأتمتة العروض. توقع إيرادات المبيعات وإدارة أنشطة خطوط المبيعات بسهولة.",
        features: [
          "تقييم العملاء وتوزيعهم",
          "لوحة كانبان تفاعلية لخطوط البيع",
          "منشئ عروض أسعار احترافي HTML",
          "سلاسل بريد إلكتروني مؤتمتة",
        ],
        value:
          "زيادة نسبة إغلاق الصفقات بـ 25% وإدارة فريق المبيعات بالكامل من شاشة واحدة.",
      },
    },
    dashboard: {
      en: {
        title: "Dashboard",
        tag: "analytics",
        desc: "Customizable business intelligence boards. Clean graphs, pivot tables, and KPI cards with drag-and-drop builder.",
        features: [
          "Real-time data visualization",
          "Multi-database reporting",
          "Custom formulas & filters",
          "Automated PDF report delivery",
        ],
        value:
          "Empower executives with reliable dashboards for instant, data-driven decisions.",
      },
      ar: {
        title: "لوحة التحكم",
        tag: "تحليلات",
        desc: "لوحات تحليلات ذكاء أعمال قابلة للتخصيص. رسوم بيانية واضحة، جداول محورية، وبطاقات مؤشرات أداء رئيسية KPI مع منشئ سحب وإفلات.",
        features: [
          "تمثيل البيانات لحظياً",
          "تقارير لقواعد بيانات متعددة",
          "معادلات وفلاتر مخصصة",
          "إرسال تقارير PDF تلقائية",
        ],
        value:
          "تمكين المديرين التنفيذيين بلوحات تحكم موثوقة لاتخاذ قرارات فورية مبنية على البيانات.",
      },
    },
    ecommerce: {
      en: {
        title: "eCommerce",
        tag: "store · catalog",
        desc: "B2B & B2C online store integrated with inventory and accounting. Out-of-the-box checkout, customer portal, and SEO optimization.",
        features: [
          "Product variant configurations",
          "Integrated payment gateways (Paymob/Fawry)",
          "Real-time inventory sync",
          "Customer order tracking portal",
        ],
        value:
          "Expand into digital commerce seamlessly with zero double-entry of product data.",
      },
      ar: {
        title: "التجارة الإلكترونية",
        tag: "متجر · كاتالوج",
        desc: "متجر إلكتروني B2B و B2C متكامل مع المخازن والمحاسبة. دفع إلكتروني جاهز، بوابة عملاء، وتحسين كامل لمحركات البحث SEO.",
        features: [
          "إعدادات متغيرات المنتجات",
          "بوابات دفع متكاملة (فوري/بيموب)",
          "مزامنة المخازن لحظياً",
          "بوابة تتبع طلبات العملاء",
        ],
        value:
          "التوسع في التجارة الرقمية بسلاسة دون الحاجة لتكرار إدخال بيانات المنتجات.",
      },
    },
    documents: {
      en: {
        title: "Documents",
        tag: "dms · workflow",
        desc: "Go paperless. Extract data with OCR, sign documents digitally, assign approvals, and archive in a smart, searchable structure.",
        features: [
          "AI-powered OCR document reading",
          "E-signature flows",
          "Custom approval routing",
          "Smart categorization tags",
        ],
        value:
          "Save hours spent processing bills and files; access any company contract in 3 seconds.",
      },
      ar: {
        title: "المستندات",
        tag: "إدارة وثائق · سير عمل",
        desc: "تخلص من المعاملات الورقية. استخرج البيانات بالذكاء الاصطناعي (OCR)، وقع المستندات رقمياً، ووثق الموافقات في نظام أرشيف ذكي قابل للبحث.",
        features: [
          "قراءة المستندات بالتعرف الضوئي بالذكاء الاصطناعي",
          "تدفقات التوقيع الإلكتروني",
          "توجيه الموافقات المخصصة",
          "علامات تصنيف ذكية",
        ],
        value:
          "توفير الساعات المستغرقة في معالجة الفواتير والملفات؛ الوصول لأي عقد في 3 ثوانٍ.",
      },
    },
    planning: {
      en: {
        title: "Planning",
        tag: "scheduling",
        desc: "Manage employee shifts, project schedules, and resource allocations with an intuitive Gantt-style planning calendar.",
        features: [
          "Drag-and-drop shift scheduling",
          "Resource conflict checking",
          "Employee portal for shift swaps",
          "Integrated timesheet tracking",
        ],
        value:
          "Optimize employee schedule efficiency, preventing project delays and understaffing.",
      },
      ar: {
        title: "التخطيط",
        tag: "جدولة",
        desc: "إدارة ورديات الموظفين، جداول المشاريع وتخصيص الموارد باستخدام تقويم تخطيط تفاعلي بنمط Gantt.",
        features: [
          "جدولة الورديات بالسحب والإفلات",
          "التحقق من تعارض الموارد",
          "بوابة الموظفين لمبادلة الورديات",
          "تتبع سجلات الوقت المتكاملة",
        ],
        value: "تحسين كفاءة جداول الموظفين، ومنع تأخر المشاريع أو نقص العمالة.",
      },
    },
    maintenance: {
      en: {
        title: "Maintenance",
        tag: "assets · pm",
        desc: "Preventive and corrective maintenance for machinery. Automate work requests, track downtime, and optimize parts inventory.",
        features: [
          "Preventive maintenance scheduling",
          "Corrective request portal",
          "Equipment statistics & MTBF tracking",
          "Spare parts inventory links",
        ],
        value:
          "Extend asset lifetime by 25% and dramatically reduce unexpected production halts.",
      },
      ar: {
        title: "الصيانة",
        tag: "أصول · صيانة وقائية",
        desc: "صيانة وقائية وتصحيحية للآلات والمعدات. أتمتة طلبات العمل، تتبع أوقات التوقف، وتحسين مخزون قطع الغيار.",
        features: [
          "جدولة الصيانة الوقائية",
          "بوابة طلبات الإصلاح الفوري",
          "إحصائيات المعدات وتتبع MTBF",
          "ربط قطع الغيار بالمخزون",
        ],
        value:
          "إطالة عمر الأصول بنسبة 25% وتقليل التوقفات المفاجئة للإنتاج بشكل كبير.",
      },
    },
    sign: {
      en: {
        title: "Sign",
        tag: "digital signatures",
        desc: "Send, sign, and approve contracts online. Fully legal, encrypted e-signatures for PDFs, employee onboarding, and NDAs.",
        features: [
          "Multi-signer workflows",
          "Drag-and-drop field mapping",
          "Secure audit trail records",
          "Reusable contract templates",
        ],
        value:
          "Eliminate printing costs and execute legal agreements in minutes rather than days.",
      },
      ar: {
        title: "التوقيع الرقمي",
        tag: "توقيعات رقمية",
        desc: "إرسال وتوقيع واعتماد العقود عبر الإنترنت. توقيعات إلكترونية مشفرة وقانونية بالكامل لملفات PDF، وتعيين الموظفين الجدد، واتفاقيات السرية.",
        features: [
          "تدفقات عمل متعددة الموقعين",
          "رسم الحقول بالسحب والإفلات",
          "سجلات تتبع تدقيق آمنة",
          "قوالب عقود قابلة لإعادة الاستخدام",
        ],
        value:
          "إلغاء تكاليف الطباعة وتوقيع الاتفاقيات القانونية في دقائق بدلاً من أيام.",
      },
    },
    subscriptions: {
      en: {
        title: "Subscriptions",
        tag: "recurring · billing",
        desc: "Manage recurring sales, automated invoices, and payment renewals. Handle SaaS contracts, maintenance retainers, and services.",
        features: [
          "Automated billing & renewal runs",
          "Customer subscription portal",
          "Churn analysis & MRR analytics",
          "Flexible pricing plan setup",
        ],
        value:
          "Build predictable recurring revenue streams with completely touchless renewals.",
      },
      ar: {
        title: "الاشتراكات",
        tag: "اشتراكات متكررة · فواتير",
        desc: "إدارة المبيعات المتكررة، الفواتير التلقائية وتجديد المدفوعات. معالجة عقود SaaS وصيانات الدعم والخدمات الدورية.",
        features: [
          "تشغيل الفواتير والتجديد التلقائي",
          "بوابة اشتراكات العملاء",
          "تحليلات الإيرادات الشهرية المتكررة والانسحاب",
          "إعداد خطط تسعير مرنة",
        ],
        value:
          "بناء تدفقات إيرادات متكررة يمكن التنبؤ بها مع تجديدات مؤتمتة بالكامل.",
      },
    },
    ai: {
      en: {
        title: "AI & Intelligence",
        tag: "automation · predictions · studio",
        desc: "Infuse smart machine learning into your ERP. Smart sales forecast, auto-generated descriptions, predictive inventory refills, and custom AI actions.",
        features: [
          "Predictive inventory refilling",
          "Lead scoring & conversion prediction",
          "Smart document categorization",
          "Odoo Studio AI layout builder",
        ],
        value:
          "Anticipate market changes and automate repetitive decision pathways with cutting-edge ML models.",
      },
      ar: {
        title: "الذكاء الاصطناعي",
        tag: "أتمتة · توقعات · ستوديو",
        desc: "دمج الذكاء الاصطناعي في نظام الـ ERP الخاص بك. توقعات مبيعات ذكية، توليد تلقائي للأوصاف، إعادة تعبئة المخزون التنبؤية، وإجراءات مخصصة.",
        features: [
          "إعادة ملء تنبؤي للمخزون",
          "تقييم وتوقع تحويل العملاء المحتملين",
          "تصنيف المستندات بالذكاء الاصطناعي",
          "منشئ لوحات Odoo Studio بالذكاء الاصطناعي",
        ],
        value:
          "استباق تغيرات السوق وأتمتة مسارات القرار المتكررة باستخدام نماذج تعلم الآلة المتطورة.",
      },
    },
  };

  let isArabic = localStorage.getItem("lang") === "ar";

  const WEBHOOK_URL = "https://fayrouztours.com/webhook/coddy-master-lead";
  const MODULE_ICONS = { ecommerce: "eCommerce" };

  const getModuleIcon = (mod) =>
    `assets/odoo modules/${MODULE_ICONS[mod] || mod}.svg`;

  // --- DRAWER ACTIONS ---
  const sb = document.getElementById("sb");
  const sov = document.getElementById("sov");
  const sbcl = document.getElementById("sbcl");
  const sbcta = document.getElementById("sbcta");

  const closeSidebar = () => {
    if (sb) {
      sb.classList.remove("op");
      sb.setAttribute("aria-hidden", "true");
    }
    if (sov) {
      sov.classList.remove("op");
    }
  };

  if (sbcl) sbcl.addEventListener("click", closeSidebar);
  if (sov) sov.addEventListener("click", closeSidebar);
  if (sbcta) sbcta.addEventListener("click", closeSidebar);

  // Expose closeSB globally if clicked from inside index.html elements
  window.closeSB = closeSidebar;

  // --- ODOO CARD CLICK TRIGGER ---
  document.querySelectorAll(".odoo-card").forEach((card) => {
    card.addEventListener("click", () => {
      const mod = card.getAttribute("data-mod");
      const data = odooModules[mod];
      if (!data) return;

      const langData = isArabic ? data.ar : data.en;

      // Populate sidebar elements
      const sbimg = document.getElementById("sbimg");
      const sbti = document.getElementById("sbti");
      const sbtg = document.getElementById("sbtg");
      const sbds = document.getElementById("sbds");
      const sbfl = document.getElementById("sbfl");
      const sbvlt = document.getElementById("sbvlt");

      if (sbimg) sbimg.src = getModuleIcon(mod);
      if (sbti) sbti.innerText = langData.title;
      if (sbtg) sbtg.innerText = langData.tag;
      if (sbds) sbds.innerText = langData.desc;

      if (sbfl) {
        sbfl.innerHTML = "";
        langData.features.forEach((feat) => {
          const li = document.createElement("li");
          li.className = "flex items-start gap-3 text-sm text-gray-500";
          li.innerHTML = `<span class="w-1.5 h-1.5 bg-brand-orange mt-2 shrink-0"></span><span>${feat}</span>`;
          sbfl.appendChild(li);
        });
      }

      if (sbvlt) sbvlt.innerText = langData.value;

      // Show drawer
      if (sb) {
        sb.classList.add("op");
        sb.setAttribute("aria-hidden", "false");
      }
      if (sov) {
        sov.classList.add("op");
      }
    });
  });

  // --- 3D TILT PHYSICS (Desktop Only) ---
  if (window.innerWidth > 1024) {
    document.querySelectorAll(".odoo-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const tiltX = (yc - y) / 40;
        const tiltY = (x - xc) / 40;
        gsap.to(card, {
          rotateX: tiltX,
          rotateY: tiltY,
          y: -4,
          scale: 1.01,
          duration: 0.4,
          transformPerspective: 1000,
          ease: "power2.out",
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    });
  }

  // --- GSAP REVEALS FOR ODOO SECTION ---
  gsap.fromTo(
    ".solutions-header",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#solutions",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );

  // Trigger and display micro-animations specifically when each card comes into the viewport
  // Mimic/replicate the precise animation style and feel from old.html (Task 2)
  document.querySelectorAll(".odoo-card").forEach((card, idx) => {
    gsap.fromTo(
      card,
      {
        opacity: 0,
        scale: 0.9,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        delay: (idx % 3) * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  // --- GSAP REVEALS FOR WHY US SECTION ---
  gsap.fromTo(
    ".why-header",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".why-card",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#about",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    },
  );

  // --- GSAP REVEALS FOR ENTERPRISE IMPACT SECTION ---
  gsap.fromTo(
    "#impact .border-l",
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#impact",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    },
  );

  // Animate the large ROI numbers with a count-up feel
  gsap.fromTo(
    "#impact .font-mono.text-6xl",
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: "#impact",
        start: "top 65%",
        toggleActions: "play none none none",
      },
    },
  );

  // --- GSAP REVEALS FOR LEADERSHIP SPLIT-SCREEN SECTION ---
  gsap.fromTo(
    "#leadership .lg\\:w-\\[45\\%\\]",
    { opacity: 0, x: -60 },
    {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#leadership",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    "#leadership .lg\\:w-\\[55\\%\\]",
    { opacity: 0, x: 60 },
    {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#leadership",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    },
  );

  // Parallax background on scroll (upward motion to prevent top gaps)
  ScrollTrigger.create({
    trigger: ".hero-wrapper",
    start: "top top",
    end: "bottom top",
    scrub: true,
    animation: gsap.to("#hero-bg", {
      yPercent: -15, // Move the background up subtly as you scroll (natural parallax)
      ease: "none",
    }),
  });

  // --- GSAP REVEALS FOR TEAM SECTION ---
  revealOnScroll(".team-header", "#team", "top 88%", 0);
  revealOnScroll(".team-card", "#team", "top 78%", 0.12);

  // --- GSAP REVEALS FOR EVENTS SECTION ---
  revealOnScroll(".events-header", "#events", "top 88%", 0);
  revealOnScroll(".event-card", "#events", "top 78%", 0.15);

  // --- GSAP REVEALS FOR CAREERS SECTION ---
  revealOnScroll(".careers-header", "#careers", "top 88%", 0);
  revealOnScroll(".career-card", "#careers", "top 72%", 0.1);
  revealOnScroll(".careers-cta", "#careers", "top 85%", 0);

  // --- GSAP REVEALS FOR VIDEOS & ARTICLES ---
  revealOnScroll(".videos-header", "#videos", "top 88%", 0);
  revealOnScroll(".video-card", "#videos", "top 72%", 0.12);
  revealOnScroll(".articles-header", "#articles", "top 88%", 0);
  revealOnScroll(".blog-card", "#articles", "top 72%", 0.12);

  // --- GSAP REVEALS FOR CONTACT SECTION ---
  gsap.fromTo(
    ".contact-header",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".contact-details",
    { opacity: 0, x: -40 },
    {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact",
        start: "top 65%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".contact-form-container",
    { opacity: 0, x: 40 },
    {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact",
        start: "top 65%",
        toggleActions: "play none none none",
      },
    },
  );

  // --- VIDEO MODAL LOGIC ---
  const videoModal = document.getElementById("video-modal");
  const videoIframe = document.getElementById("video-iframe");
  const videoCloseBtn = document.getElementById("video-modal-close");
  const videoOverlay = document.getElementById("video-modal-overlay");

  const closeVideoModal = () => {
    if (videoModal) {
      videoModal.classList.remove("active");
      // Give time for transition before clearing src
      setTimeout(() => {
        if (videoIframe) videoIframe.src = "";
      }, 400);
    }
  };

  document.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => {
      const vid = card.getAttribute("data-vid");
      if (vid && videoIframe && videoModal) {
        // Embed YouTube video with autoplay
        videoIframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`;
        videoModal.classList.add("active");
      }
    });
  });

  if (videoCloseBtn) videoCloseBtn.addEventListener("click", closeVideoModal);
  if (videoOverlay) videoOverlay.addEventListener("click", closeVideoModal);

  // ==========================================================================
  // i18n — Full Arabic / English Corporate Localization
  // ==========================================================================
  const i18n = {
    en: {
      "nav-services": "Services",
      "nav-solutions": "Odoo Solutions",
      "nav-contact": "Contact Us",
      "nav-careers": "Careers",
      "nav-leadership": "Our Team",
      "nav-videos": "Videos",
      "nav-cta": "Book Consultation",
      "lang-toggle-btn": "العربية",
      "hero-badge": "Enterprise System Integrator",
      "hero-title-1": "From Chaos",
      "hero-title-2": "to Control.",
      "hero-subtitle":
        "We help growing businesses set up Odoo ERP and manage their finances. Get complete control over your operations, clean accounting, and professional financial guidance—all in one place.",
      "hero-deploy-btn": "Get Started with Odoo",
      "hero-secondary-btn": "How We Work",
      "show-all-btn": "Show All Solutions",
      "show-less-btn": "Show Less",
      "sol-explore": "EXPLORE MODULE",
      "sol-explore-ai": "EXPLORE FUTURE TECH",
      "sol-dashboard-title": "Dashboard",
      "sol-dashboard-cat": "analytics",
      "sol-ecommerce-title": "eCommerce",
      "sol-ecommerce-cat": "store · catalog",
      "sol-documents-title": "Documents",
      "sol-documents-cat": "dms · workflow",
      "sol-planning-title": "Planning",
      "sol-planning-cat": "scheduling",
      "sol-maintenance-title": "Maintenance",
      "sol-maintenance-cat": "assets · pm",
      "sol-sign-title": "Sign",
      "sol-sign-cat": "digital signatures",
      "sol-subs-title": "Subscriptions",
      "sol-subs-cat": "recurring · billing",
      "sol-ai-title": "AI & Intelligence",
      "sol-ai-badge": "Futuristic Tech",
      "sol-ai-cat": "automation · predictions · studio",
      "sol-ai-desc":
        "Infuse smart machine learning into your ERP. Smart sales forecast, auto-generated descriptions, predictive inventory refills, and custom AI actions.",
      "sb-capabilities": "Key Capabilities",
      "sb-value-label": "Business Value",
      "sb-cta": "IMPLEMENT THIS MODULE",
      "team-badge": "Our Experts",
      "team-title": "Meet Our Leadership & Advisory",
      "team-subtitle":
        "Senior accountants, certified consultants, and ERP architects working together to drive operational resilience.",
      "team-m1-name": "Ahmed Zehery",
      "team-m1-role": "Co-founder & Marketing and sales manager",
      "team-m1-desc":
        "Specialized in marketing strategies, customer acquisition, and enterprise sales growth.",
      "team-m2-name": "Mohamed Refaat",
      "team-m2-role": "Co-founder & Operation manager",
      "team-m2-desc":
        "Expert in optimizing operations, workflow automation, and managing client services.",
      "team-m3-name": "Hazem Refaat",
      "team-m3-role": "Odoo Developer",
      "team-m3-desc":
        "software programmer who builds, customizes, and integrates applications for the Odoo ERP software suite.",
      "team-m4-name": "Sohaila",
      "team-m4-role": "Odoo Implementer",
      "team-m4-desc":
        "Experienced in Odoo module integration, testing, and business workflow setup.",
      "team-m5-name": "Eyad Elsheha",
      "team-m5-role": "Sales",
      "team-m5-desc":
        "Focused on driving growth and connecting with enterprise partners.",
      "team-m6-name": "Ramy Khoukh",
      "team-m6-role": "Legal accountant",
      "team-m6-desc":
        "Expert in tax compliance, auditing, and corporate financial legislation.",
      "events-badge": "Summit & Events",
      "events-title": "Upcoming Corporate Events",
      "events-subtitle":
        "Executive seminars, partner summits, and compliance workshops designed for C-level decision makers.",
      "event1-date": "Oct 2026",
      "event1-badge": "Live Summit",
      "event1-title": "New Damietta Odoo Summit 2026",
      "event1-desc":
        "Join our architects as we demonstrate Egypt ETA e-invoicing live integration on Odoo 19.",
      "event2-date": "Nov 2026",
      "event2-badge": "Workshop",
      "event2-title": "ZATCA Phase 2 Advisory Day",
      "event2-desc":
        "Exclusive advisory day for CFOs and directors regarding ZATCA Phase 2 compliance rules in Saudi Arabia.",
      "events-cta": "Book Seat",
      "form-title": "Send Us a Message",
      "form-name-label": "Full Name",
      "form-name-ph": "John Doe",
      "form-email-label": "Email",
      "form-email-ph": "john@company.com",
      "form-phone-label": "Phone",
      "form-phone-ph": "+20 100 000 0000",
      "form-service-label": "Service Needed",
      "form-service-opt0": "Select...",
      "form-service-opt1": "ERP Implementation",
      "form-service-opt2": "Virtual CFO",
      "form-service-opt3": "Outsource Accounting",
      "form-service-opt4": "Other",
      "form-message-label": "Message",
      "form-message-ph": "Tell us about your business...",
      "form-submit": "Send Message",
      "form-sending": "Sending...",
      "form-success":
        "Your message has been sent successfully. We will contact you shortly.",
      "form-error":
        "Something went wrong. Please try again or email Info@coddymaster.com.",
      "form-required": "Please fill in all required fields.",
      "contact-location": "New Damietta, Egypt\nGCC & MENA Coverage",
      "footer-location": "New Damietta, Egypt",
      "chat-name": "Coddy Assistant",
      "chat-status": "Online — replies instantly",
      "chat-welcome":
        "👋 Hi! I'm the Coddy Master assistant. How can I help you today?",
      "chat-now": "Just now",
      "chat-q1": "📅 Book a Consultation",
      "chat-q2": "💰 Our Pricing",
      "chat-q3": "⚙️ Our Services",
      "chat-q4": "🔧 Odoo Modules",
      "chat-input-ph": "Type a message...",
    },
    ar: {
      "nav-services": "خدماتنا",
      "nav-solutions": "حلول أودو",
      "nav-contact": "تواصل معنا",
      "nav-careers": "الوظائف",
      "nav-leadership": "فريقنا",
      "nav-videos": "الفيديو",
      "nav-cta": "احجز استشارة",
      "lang-toggle-btn": "English",
      "hero-badge": "مُكامل أنظمة مؤسسية",
      "hero-title-1": "من الفوضى",
      "hero-title-2": "إلى السيطرة.",
      "hero-subtitle":
        "نساعد الشركات النامية على إعداد نظام أودو (Odoo ERP) وإدارة حساباتها بسهولة. احصل على تحكم كامل في عملياتك، ومحاسبة واضحة، وتوجيه مالي خبير—كل ذلك في مكان واحد.",
      "hero-deploy-btn": "ابدأ مع أودو الآن",
      "hero-secondary-btn": "طريقة عملنا",
      "show-all-btn": "عرض الكل",
      "show-less-btn": "عرض أقل",
      "sol-explore": "استكشف الوحدة",
      "sol-explore-ai": "استكشف تقنيات المستقبل",
      "sol-dashboard-title": "لوحة التحكم",
      "sol-dashboard-cat": "تحليلات",
      "sol-ecommerce-title": "التجارة الإلكترونية",
      "sol-ecommerce-cat": "متجر · كاتالوج",
      "sol-documents-title": "المستندات",
      "sol-documents-cat": "إدارة وثائق · سير عمل",
      "sol-planning-title": "التخطيط",
      "sol-planning-cat": "جدولة",
      "sol-maintenance-title": "الصيانة",
      "sol-maintenance-cat": "أصول · صيانة وقائية",
      "sol-sign-title": "التوقيع الرقمي",
      "sol-sign-cat": "توقيعات رقمية",
      "sol-subs-title": "الاشتراكات",
      "sol-subs-cat": "اشتراكات متكررة · فواتير",
      "sol-ai-title": "الذكاء الاصطناعي",
      "sol-ai-badge": "تقنية مستقبلية",
      "sol-ai-cat": "أتمتة · توقعات · ستوديو",
      "sol-ai-desc":
        "دمج التعلم الآلي الذكي في نظام الـ ERP. توقعات مبيعات ذكية، أوصاف تلقائية، إعادة تعبئة تنبؤية للمخزون، وإجراءات مخصصة.",
      "sb-capabilities": "القدرات الرئيسية",
      "sb-value-label": "القيمة التجارية",
      "sb-cta": "طبّق هذه الوحدة",
      "team-badge": "خبراؤنا",
      "team-title": "تعرّف على قيادتنا واستشاريينا",
      "team-subtitle":
        "محاسبون كبار ومستشارون معتمدون ومهندسو ERP يعملون معًا لتحقيق المرونة التشغيلية.",
      "team-m1-name": "أحمد زهيري",
      "team-m1-role": "شريك مؤسس ومدير التسويق والمبيعات",
      "team-m1-desc":
        "متخصص في استراتيجيات التسويق وجذب العملاء وتنمية مبيعات الشركات.",
      "team-m2-name": "محمد رفعت",
      "team-m2-role": "شريك مؤسس ومدير العمليات",
      "team-m2-desc":
        "خبير في تحسين العمليات وأتمتة سير العمل وإدارة الخدمات التقنية.",
      "team-m3-name": "حازم رفعت",
      "team-m3-role": "مطور نظام أودو",
      "team-m3-desc":
        "مطور متخصص في بناء وتخصيص وإدارة نظام Odoo",
      "team-m4-name": "سهيله شعلان",
      "team-m4-role": "منفّذة نظام أودو",
      "team-m4-desc":
        "خبرة في دمج وتكامل موديولات Odoo وتدفقات العمل البرمجية.",
      "team-m5-name": "إياد الشيحة",
      "team-m5-role": "مبيعات",
      "team-m5-desc":
        "التركيز على دفع عجلة النمو والتواصل مع شركاء المؤسسات.",
      "team-m6-name": "رامي خوخ",
      "team-m6-role": "محاسب قانوني",
      "team-m6-desc":
        "خبير في الامتثال الضريبي، المراجعة والتدقيق، والقوانين المالية للشركات.",
      "events-badge": "القمة والفعاليات",
      "events-title": "الفعاليات المؤسسية القادمة",
      "events-subtitle":
        "ندوات تنفيذية وقمم شراكة وورش امتثال مصممة لصناع القرار على مستوى الإدارة العليا.",
      "event1-date": "أكتوبر 2026",
      "event1-badge": "قمة مباشرة",
      "event1-title": "قمة أودو دمياط الجديدة 2026",
      "event1-desc":
        "انضم إلى مهندسينا لعرض تكامل الفاتورة الإلكترونية المصرية مباشرة على Odoo 19.",
      "event2-date": "نوفمبر 2026",
      "event2-badge": "ورشة عمل",
      "event2-title": "يوم استشارات المرحلة الثانية — ZATCA",
      "event2-desc":
        "يوم استشاري حصري للمديرين الماليين حول قواعد امتثال المرحلة الثانية في المملكة العربية السعودية.",
      "events-cta": "احجز مقعدًا",
      "form-title": "أرسل لنا رسالة",
      "form-name-label": "الاسم الكامل",
      "form-name-ph": "الاسم الكامل",
      "form-email-label": "البريد الإلكتروني",
      "form-email-ph": "name@company.com",
      "form-phone-label": "الهاتف",
      "form-phone-ph": "+20 100 000 0000",
      "form-service-label": "الخدمة المطلوبة",
      "form-service-opt0": "اختر...",
      "form-service-opt1": "تطبيق ERP",
      "form-service-opt2": "مدير مالي افتراضي",
      "form-service-opt3": "محاسبة خارجية",
      "form-service-opt4": "أخرى",
      "form-message-label": "الرسالة",
      "form-message-ph": "أخبرنا عن أعمالك...",
      "form-submit": "إرسال الرسالة",
      "form-sending": "جاري الإرسال...",
      "form-success": "تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.",
      "form-error":
        "حدث خطأ. يرجى المحاولة مرة أخرى أو مراسلتنا على Info@coddymaster.com.",
      "form-required": "يرجى ملء جميع الحقول المطلوبة.",
      "contact-location": "دمياط الجديدة، مصر\nتغطية الخليج والشرق الأوسط",
      "footer-location": "دمياط الجديدة، مصر",
      "chat-name": "مساعد كودي",
      "chat-status": "متصل — يرد فورًا",
      "chat-welcome":
        "👋 مرحبًا! أنا مساعد كودي ماستر. كيف يمكنني مساعدتك اليوم؟",
      "chat-now": "الآن",
      "chat-q1": "📅 احجز استشارة",
      "chat-q2": "💰 الأسعار",
      "chat-q3": "⚙️ خدماتنا",
      "chat-q4": "🔧 وحدات أودو",
      "chat-input-ph": "اكتب رسالتك...",
    },
  };

  Object.assign(i18n.en, {
    "brand-badge": "Official Odoo Partner",
    "brand-title": "Smart ERP Solutions with Odoo",
    "brand-desc":
      "We help you set up, customize, and run Odoo ERP. Simplify your daily tasks, see your finances clearly, and make better decisions for your business.",
    "trusted-badge": "Trusted By Growing Businesses",
    "trusted-title": "Helping businesses grow with confidence and clear organization.",
    "svc-banner-badge": "Premium CFO Advisory",
    "svc-banner-title": "Grow your business with expert financial control.",
    "svc-badge": "Our Core Solutions",
    "svc-title": "Designed to help your business run smoothly and grow.",
    "svc-desc":
      "We connect easy-to-use Odoo software with professional financial guidance. No more messy spreadsheets—just clear information to run your business.",
    "svc1-badge": "01 / ERP Systems",
    "svc1-metric-label": "Workflow Automation",
    "svc1-title": "ERP Systems Implementation",
    "svc1-desc":
      "We set up and customize Odoo to connect your sales, inventory, and accounting. Run all parts of your business from a single, easy-to-use system.",
    "svc1-learn": "Explore Implementation",
    "svc2-badge": "02 / Virtual CFO",
    "svc2-metric-label": "Financial Clarity",
    "svc2-title": "Virtual CFO Leadership",
    "svc2-desc":
      "Get a part-time chief financial officer (CFO) to manage your cash flow, plan your budget, and guide your growth without the high cost of a full-time hire.",
    "svc2-learn": "Explore CFO Services",
    "svc3-badge": "03 / Accounting",
    "svc3-metric-label": "Compliance Rate",
    "svc3-title": "Outsourced Accounting",
    "svc3-desc":
      "Leave the daily bookkeeping, payroll, VAT, and tax compliance to us. We keep your records clean, accurate, and ready for tax season.",
    "svc3-learn": "Explore Accounting",
    "sol-badge": "Odoo Ecosystem",
    "sol-title": "Complete Odoo Solutions Hub",
    "sol-desc":
      "Explore our main Odoo tools and see how they can simplify your daily work.",
    "sol-partner": "Official Partner",
    "sol-accounting-title": "Accounting",
    "sol-accounting-cat": "finance",
    "sol-inventory-title": "Inventory",
    "sol-inventory-cat": "operations",
    "sol-manufacturing-title": "Manufacturing",
    "sol-manufacturing-cat": "production · mrp · quality",
    "sol-manufacturing-desc":
      "Fully integrated MRP, PLM, Quality, Maintenance, and Shop Floor. Plan work orders, track machinery, and schedule production.",
    "sol-crm-title": "CRM & Sales",
    "sol-crm-cat": "pipeline",
    "why-badge": "Why Coddy Master",
    "why-title": "Built by business and finance experts.",
    "why-desc":
      "We combine smart business software with real financial expertise to organize your company and help you grow.",
    "why1-title": "Official Odoo Partner",
    "why1-desc":
      "We follow Odoo's official guidelines to set up your system correctly, keeping it secure and easy to upgrade.",
    "why2-title": "Business-First Approach",
    "why2-desc":
      "We study how your business actually runs first. We adapt Odoo to fit your workflow, not the other way around.",
    "why3-title": "Fast Implementation",
    "why3-desc":
      "We roll out your new system in quick stages. You will start seeing results and using key features in weeks, not months.",
    "why4-title": "Financial Expertise",
    "why4-desc":
      "Founded by professional accountants. We make sure your books, tax setup, and financial reports are 100% accurate.",
    "why5-title": "Dedicated Support",
    "why5-desc":
      "We are always here to help. Our team provides ongoing technical support, updates, and training for your staff.",
    "why6-title": "Scalable Systems",
    "why6-desc":
      "Systems designed to grow with you. Easily handle multiple currencies, warehouses, or branches as your company expands.",
    "impact1-title": "Faster Bookkeeping",
    "impact1-desc":
      "Sync your bank accounts and match payments automatically, saving you hours of manual entry every month.",
    "impact2-title": "Tax & Invoice Compliance",
    "impact2-desc":
      "Connect directly with the Egyptian Tax Authority to send error-free electronic invoices automatically.",
    "impact3-title": "Everything in One Place",
    "impact3-desc":
      "See everything clearly in one dashboard, from stock levels to sales and overall business profits.",
    "leadership-badge": "Leadership & Advisory",
    "leadership-title": "Financial Guidance.\nReal Growth.",
    "leadership-p1":
      "We do more than just set up software. Our team of experienced accountants and business consultants works with you to turn raw business numbers into a clear plan for growth.",
    "leadership-p2":
      "From planning your setup to supporting you daily, we make sure your business runs smoothly, securely, and stays profitable.",
    "leadership-cta": "Schedule Consultation",
    "careers-badge": "Join the Team",
    "careers-title": "Build the future of enterprise intelligence.",
    "careers-desc":
      "We are building a team of helpful developers, consultants, and business experts. If you want to help businesses grow and simplify their operations, join us.",
    "careers-stat1": "Team Members",
    "careers-stat2": "Countries",
    "careers-stat3": "Growth Mode",
    "careers-apply": "APPLY NOW",
    "careers-cta-title": "Don't see your role?",
    "careers-cta-desc":
      "We're always looking for exceptional talent. Send us your CV and tell us how you'd like to contribute.",
    "careers-cta-btn": "Send Open Application",
    "job-fulltime": "Full-time",
    "job-remote": "Remote",
    "job-hybrid": "Hybrid",
    "job-loc-remote": "New Damietta · Remote",
    "job-loc-hybrid": "New Damietta · Hybrid",
    "job-loc-onsite": "New Damietta · On-site",
    "job-loc-dubai": "Dubai · New Damietta",
    "job-loc-worldwide": "Remote Worldwide",
    "job1-dept": "Tech",
    "job1-title": ".NET Full Stack Developer",
    "job1-desc":
      "Build enterprise-grade web applications using .NET Core, Blazor, and SQL Server. Design microservices architectures and RESTful APIs for GCC clients.",
    "job2-dept": "Consulting",
    "job2-title": "Odoo Functional Consultant",
    "job2-desc":
      "Lead client workshops, map business processes to Odoo modules, configure accounting flows, and deliver end-to-end implementations for enterprise clients.",
    "job3-dept": "Design",
    "job3-title": "Senior UI/UX Designer",
    "job3-desc":
      "Craft premium digital experiences, design systems, and ERP dashboard interfaces. Translate complex data workflows into intuitive, elegant user journeys.",
    "job4-dept": "Tech",
    "job4-title": "Odoo Technical Developer",
    "job4-desc":
      "Develop custom Odoo modules, build advanced Python controllers, create sophisticated OWL components, and architect complex multi-company setups.",
    "job5-dept": "Sales",
    "job5-title": "Business Development Manager",
    "job5-desc":
      "Drive strategic partnerships across the GCC. Identify enterprise leads, manage the sales pipeline, and close high-value ERP implementation deals.",
    "job6-dept": "Finance",
    "job6-title": "Senior Financial Accountant",
    "job6-desc":
      "Manage outsourced accounting portfolios, configure Odoo Accounting for clients, handle VAT compliance, and deliver monthly executive financial reports.",
    "videos-badge": "Watch & Learn",
    "videos-title": "Latest Videos & Live Sessions",
    "videos-desc":
      "Real implementation stories, live Odoo sessions, and expert insights — straight from our team and clients.",
    "video1-badge": "Success Story",
    "video1-title": "Ahmed Tarek's Journey with Odoo",
    "video2-badge": "Career Tips",
    "video2-title": "How to Succeed in Your Work",
    "video3-badge": "Live Webinar",
    "video3-title": "Odoo 19 Studio AI — Live Session",
    "articles-badge": "Knowledge Hub",
    "articles-title": "Latest Articles & Insights",
    "articles-viewall": "View All",
    "article1-cat": "ERP",
    "article1-meta": "May 2026 · 8 min read",
    "article1-title": "The Complete Guide to Odoo ERP Implementation in Egypt",
    "article1-desc":
      "A step-by-step breakdown of a successful Odoo deployment — from needs analysis to go-live.",
    "article-read": "Read More",
    "article2-cat": "Finance",
    "article2-meta": "Apr 2026 · 5 min read",
    "article2-title": "When Does Your Business Need a Virtual CFO?",
    "article2-desc":
      "Signs your business has outgrown basic bookkeeping and needs strategic financial leadership.",
    "article3-cat": "Accounting",
    "article3-meta": "Mar 2026 · 6 min read",
    "article3-title":
      "5 Reasons Egyptian SMEs Are Outsourcing Accounting in 2026",
    "article3-desc":
      "Cost savings, compliance, and access to senior talent — the outsourcing advantage is real.",
    "contact-badge": "Get In Touch",
    "contact-title": "Let's Transform\nYour Business",
    "contact-desc":
      "Ready to set up Odoo, outsource your bookkeeping, or get professional financial guidance? Book a free 30-minute call to discuss your needs.",
    "contact-loc-label": "Location",
    "contact-email-label": "Email",
    "contact-phone-label": "Phone",
    "contact-web-label": "Website",
    "footer-desc":
      "Official Odoo Partner delivering ERP, Virtual CFO, and outsourced accounting to SMEs in Egypt and the Arab world.",
    "footer-services": "Services",
    "footer-company": "Company",
    "footer-contact": "Contact",
    "footer-svc1": "Virtual CFO",
    "footer-svc2": "Outsource Accounting",
    "footer-svc3": "ERP Implementation",
    "footer-svc4": "Odoo Modules",
    "footer-co1": "Our Team",
    "footer-co2": "Impact",
    "footer-co3": "Blog & Insights",
    "footer-co4": "Videos",
    "footer-co5": "Careers",
    "footer-copy": "© 2026 Coddy Master. All rights reserved.",
    "footer-powered": "Powered by",
    "video-close": "CLOSE",
  });

  Object.assign(i18n.ar, {
    "brand-badge": "شريك أودو الرسمي",
    "brand-title": "حلول ERP الذكية مع أودو",
    "brand-desc":
      "كشريك رسمي لـ أودو، نساعدك في إعداد وتخصيص النظام لتبسيط مهامك اليومية، ورؤية أرقامك المالية بوضوح، واتخاذ قرارات أفضل لعملك.",
    "trusted-badge": "موثوق من شركات نامية",
    "trusted-title": "نساعد الشركات على النمو بثقة وبتنظيم واضح.",
    "svc-banner-badge": "استشارات المدير المالي المتميزة",
    "svc-banner-title": "نساعد عملك على النمو مع رقابة مالية دقيقة.",
    "svc-badge": "حلولنا الأساسية",
    "svc-title": "حلول مصممة لتيسير أعمالك ومساعدتك على النمو.",
    "svc-desc":
      "نربط بين نظام أودو سهل الاستخدام والتوجيه المالي الاحترافي. وداعاً للجداول الحسابية المعقدة—نمنحك معلومات واضحة لإدارة شركتك.",
    "svc1-badge": "01 / أنظمة ERP",
    "svc1-metric-label": "أتمتة سير العمل",
    "svc1-title": "تطبيق أنظمة ERP",
    "svc1-desc":
      "نقوم بإعداد وتخصيص نظام أودو ليربط المبيعات والمخازن والمحاسبة معاً. أدر كافة أقسام شركتك من مكان واحد سهل الاستخدام.",
    "svc1-learn": "استكشف التطبيق",
    "svc2-badge": "02 / مدير مالي افتراضي",
    "svc2-metric-label": "وضوح مالي",
    "svc2-title": "قيادة المدير المالي الافتراضي",
    "svc2-desc":
      "احصل على مستشار مالي خبير لإدارة تدفقاتك النقدية، وتخطيط ميزانيتك، وتوجيه مسيرة نموك بتكلفة تناسب عملك ودون الحاجة لتوظيف مدير مالي دائم.",
    "svc2-learn": "استكشف خدمات المدير المالي",
    "svc3-badge": "03 / محاسبة",
    "svc3-metric-label": "نسبة الامتثال",
    "svc3-title": "محاسبة خارجية",
    "svc3-desc":
      "اترك مهام المحاسبة اليومية، والرواتب، والضرائب، والفواتير الإلكترونية لنا. نحافظ على دفاتر حساباتك منظمة، دقيقة، وجاهزة دائماً.",
    "svc3-learn": "استكشف المحاسبة",
    "sol-badge": "منظومة أودو",
    "sol-title": "مركز حلول أودو الشامل",
    "sol-desc":
      "استكشف أهم أدوات أودو وتعرف على كيف يمكنها تبسيط أعمالك اليومية.",
    "sol-partner": "شريك رسمي",
    "sol-accounting-title": "المحاسبة",
    "sol-accounting-cat": "مالية",
    "sol-inventory-title": "المخزون",
    "sol-inventory-cat": "عمليات",
    "sol-manufacturing-title": "التصنيع",
    "sol-manufacturing-cat": "إنتاج · MRP · جودة",
    "sol-manufacturing-desc":
      "نظام MRP متكامل، PLM، الجودة، الصيانة، وصالة الإنتاج. تخطيط أوامر العمل وتتبع الماكينات وجدولة الإنتاج.",
    "sol-crm-title": "العملاء والمبيعات",
    "sol-crm-cat": "خطوط البيع",
    "why-badge": "لماذا كودي ماستر",
    "why-title": "صُممت خدماتنا بأيدي خبراء المال والأعمال.",
    "why-desc":
      "نجمع بين برمجيات الأعمال الذكية والخبرة المالية الحقيقية لتنظيم شركتك ومساعدتك على التوسع.",
    "why1-title": "شريك أودو الرسمي",
    "why1-desc":
      "نتبع إرشادات أودو الرسمية لإعداد نظامك بشكل صحيح، مما يضمن أمان النظام وسهولة تحديثه مستقبلاً.",
    "why2-title": "نهج يضع الأعمال أولاً",
    "why2-desc":
      "ندرس كيف تسير أعمالك على أرض الواقع أولاً، ثم نُهيئ أودو ليتناسب مع أسلوب عملك، وليس العكس.",
    "why3-title": "تطبيق سريع",
    "why3-desc":
      "ننفذ نظامك الجديد على مراحل سريعة. ستبدأ في رؤية النتائج واستخدام الميزات الأساسية في أسابيع قليلة وليس أشهر.",
    "why4-title": "خبرة مالية",
    "why4-desc":
      "تأسست شركتنا بأيدي محاسبين مهنيين. نضمن لك إعداد حساباتك، نظامك الضريبي، وتقاريرك المالية بدقة 100%.",
    "why5-title": "دعم مخصص",
    "why5-desc":
      "نحن معك دائماً. يقدم فريقنا الدعم الفني المستمر، والتحديثات، وتدريب موظفيك لضمان سير العمل بسلاسة.",
    "why6-title": "أنظمة قابلة للتوسع",
    "why6-desc":
      "أنظمة مصممة لتنمو معك. تعامل بسهولة مع عملات متعددة، ومخازن وفروع مختلفة مع توسع أعمالك.",
    "impact1-title": "إغلاق حسابات أسرع",
    "impact1-desc":
      "اربط حساباتك البنكية وطابق المدفوعات تلقائياً، ووفر ساعات من الإدخال اليدوي كل شهر.",
    "impact2-title": "ربط الفاتورة الإلكترونية",
    "impact2-desc":
      "اربط نظامك مباشرة بمصلحة الضرائب المصرية لإرسال فواتير إلكترونية صحيحة وتلقائية.",
    "impact3-title": "تحكم كامل وموحد",
    "impact3-desc":
      "شاهد كل تفاصيل عملك بوضوح في لوحة تحكم واحدة، من مستويات المخزون إلى المبيعات والأرباح الإجمالية.",
    "leadership-badge": "القيادة والاستشارات",
    "leadership-title": "توجيه مالي خبير.\nلنمو حقيقي.",
    "leadership-p1":
      "لا يقتصر دورنا على إعداد البرامج فقط. يعمل فريقنا من المحاسبين والمستشارين معك لتحويل أرقام عملك إلى خطة واضحة ومدروسة للنمو والتوسع.",
    "leadership-p2":
      "من التخطيط الأولي وحتى الدعم اليومي بعد التشغيل، نضمن أن تدار أعمالك بسلاسة، وأمان، وربحية مستمرة.",
    "leadership-cta": "احجز استشارة",
    "careers-badge": "انضم إلى الفريق",
    "careers-title": "ابنِ مستقبل ذكاء المؤسسات.",
    "careers-desc":
      "نحن نبني فريقاً من المطورين والمستشارين وخبراء الأعمال المتعاونين. إذا كنت ترغب في مساعدة الشركات على النمو وتبسيط عملياتها، انضم إلينا.",
    "careers-stat1": "أعضاء الفريق",
    "careers-stat2": "دول",
    "careers-stat3": "وضع النمو",
    "careers-apply": "قدّم الآن",
    "careers-cta-title": "لا تجد دورك؟",
    "careers-cta-desc":
      "نبحث دائماً عن المواهب الاستثنائية. أرسل سيرتك الذاتية وأخبرنا كيف يمكنك الإسهام.",
    "careers-cta-btn": "تقديم مفتوح",
    "job-fulltime": "دوام كامل",
    "job-remote": "عن بُعد",
    "job-hybrid": "هجين",
    "job-loc-remote": "دمياط الجديدة · عن بُعد",
    "job-loc-hybrid": "دمياط الجديدة · هجين",
    "job-loc-onsite": "دمياط الجديدة · حضوري",
    "job-loc-dubai": "دبي · دمياط الجديدة",
    "job-loc-worldwide": "عن بُعد عالمياً",
    "job1-dept": "تقنية",
    "job1-title": "مطور .NET متكامل",
    "job1-desc":
      "بناء تطبيقات ويب مؤسسية باستخدام .NET Core وBlazor وSQL Server. تصميم معماريات الخدمات المصغرة وواجهات API لعملاء الخليج.",
    "job2-dept": "استشارات",
    "job2-title": "مستشار أودو وظيفي",
    "job2-desc":
      "قيادة ورش العمل، رسم العمليات على وحدات أودو، تهيئة التدفقات المحاسبية، وتسليم تطبيقات شاملة للعملاء المؤسسيين.",
    "job3-dept": "تصميم",
    "job3-title": "مصمم واجهات أول",
    "job3-desc":
      "صياغة تجارب رقمية متميزة وأنظمة تصميم ولوحات ERP. تحويل سير العمل المعقد إلى رحلات مستخدم أنيقة وبديهية.",
    "job4-dept": "تقنية",
    "job4-title": "مطور أودو تقني",
    "job4-desc":
      "تطوير وحدات أودو مخصصة، بناء وحدات تحهم Python متقدمة، ومكوّنات OWL، وإعدادات متعددة الشركات.",
    "job5-dept": "مبيعات",
    "job5-title": "مدير تطوير الأعمال",
    "job5-desc":
      "قيادة الشراكات الاستراتيجية في الخليج. تحديد العملاء المؤسسيين وإدارة خطوط البيع وإغلاق صفقات ERP عالية القيمة.",
    "job6-dept": "مالية",
    "job6-title": "محاسب مالي أول",
    "job6-desc":
      "إدارة محافظ المحاسبة الخارجية، تهيئة محاسبة أودو للعملاء، الامتثال الضريبي، وتقارير مالية تنفيذية شهرية.",
    "videos-badge": "شاهد وتعلّم",
    "videos-title": "أحدث الفيديوهات والجلسات المباشرة",
    "videos-desc":
      "قصص تطبيق حقيقية، جلسات أودو مباشرة، ورؤى خبراء — من فريقنا وعملائنا.",
    "video1-badge": "قصة نجاح",
    "video1-title": "رحلة أحمد طارق مع أودو",
    "video2-badge": "نصائح مهنية",
    "video2-title": "كيف تنجح في عملك",
    "video3-badge": "ندوة مباشرة",
    "video3-title": "أودو 19 Studio AI — جلسة مباشرة",
    "articles-badge": "مركز المعرفة",
    "articles-title": "أحدث المقالات والرؤى",
    "articles-viewall": "عرض الكل",
    "article1-cat": "ERP",
    "article1-meta": "مايو 2026 · 8 دقائق قراءة",
    "article1-title": "الدليل الشامل لتطبيق Odoo ERP في مصر",
    "article1-desc":
      "تحليل خطوة بخطوة لتطبيق أودو ناجح — من تحليل الاحتياجات إلى الإطلاق.",
    "article-read": "اقرأ المزيد",
    "article2-cat": "مالية",
    "article2-meta": "أبريل 2026 · 5 دقائق قراءة",
    "article2-title": "متى تحتاج مؤسستك إلى مدير مالي افتراضي؟",
    "article2-desc":
      "علامات تدل على أن أعمالكم تجاوزت مسك الدفاتر الأساسي وتحتاج قيادة مالية استراتيجية.",
    "article3-cat": "محاسبة",
    "article3-meta": "مارس 2026 · 6 دقائق قراءة",
    "article3-title":
      "5 أسباب لجوء الشركات المصرية الصغيرة والمتوسطة للمحاسبة الخارجية في 2026",
    "article3-desc":
      "توفير التكاليف والامتثال والوصول إلى كفاءات كبار — ميزة الاستعانة بمصادر خارجية حقيقية.",
    "contact-badge": "تواصل معنا",
    "contact-title": "لنحوّل\nأعمالك معاً",
    "contact-desc":
      "هل أنت مستعد لإعداد أودو، أو إسناد دفاتر حساباتك لنا، أو الحصول على توجيه مالي احترافي؟ احجز مكالمة استشارية مجانية لمدة 30 دقيقة لنتحدث عن احتياجات عملك.",
    "contact-loc-label": "الموقع",
    "contact-email-label": "البريد الإلكتروني",
    "contact-phone-label": "الهاتف",
    "contact-web-label": "الموقع الإلكتروني",
    "footer-desc":
      "شريك أودو الرسمي يقدم ERP والمدير المالي الافتراضي والمحاسبة الخارجية للشركات الصغيرة والمتوسطة في مصر والعالم العربي.",
    "footer-services": "الخدمات",
    "footer-company": "الشركة",
    "footer-contact": "تواصل",
    "footer-svc1": "مدير مالي افتراضي",
    "footer-svc2": "محاسبة خارجية",
    "footer-svc3": "تطبيق ERP",
    "footer-svc4": "وحدات أودو",
    "footer-co1": "فريقنا",
    "footer-co2": "الأثر",
    "footer-co3": "المدونة والرؤى",
    "footer-co4": "الفيديو",
    "footer-co5": "الوظائف",
    "footer-copy": "© 2026 كودي ماستر. جميع الحقوق محفوظة.",
    "footer-powered": "مدعوم بـ",
    "video-close": "إغلاق",
  });

  const applyLanguage = (lang) => {
    isArabic = lang === "ar";
    const dict = i18n[lang] || i18n.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.body.classList.toggle("lang-ar", isArabic);
    localStorage.setItem("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] === undefined) return;
      const val = dict[key];
      if (
        key === "contact-location" ||
        key === "leadership-title" ||
        key === "contact-title"
      ) {
        el.innerHTML = val.replace(/\n/g, "<br>");
      } else {
        el.textContent = val;
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key]) el.innerHTML = dict[key].replace(/\n/g, "<br>");
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.placeholder = dict[key];
    });

    const toggleModulesText = document.getElementById("toggle-modules-text");
    if (toggleModulesText) {
      const key = toggleModulesText.getAttribute("data-i18n") || "show-all-btn";
      if (dict[key]) toggleModulesText.textContent = dict[key];
    }

    const toggleCareersText = document.getElementById("toggle-careers-text");
    if (toggleCareersText) {
      const key = toggleCareersText.getAttribute("data-i18n") || "show-all-btn";
      if (dict[key]) toggleCareersText.textContent = dict[key];
    }

    const setText = (sel, key, root = document) => {
      const el = root.querySelector(sel);
      if (el && dict[key]) el.textContent = dict[key];
    };

    const jobLocs = {
      "job-card-1": "job-loc-remote",
      "job-card-2": "job-loc-hybrid",
      "job-card-3": "job-loc-worldwide",
      "job-card-4": "job-loc-onsite",
      "job-card-5": "job-loc-dubai",
      "job-card-6": "job-loc-onsite",
    };
    Object.entries(jobLocs).forEach(([id, key]) => {
      const card = document.getElementById(id);
      const loc = card?.querySelector(".text-gray-400.font-mono");
      if (loc && dict[key]) loc.textContent = dict[key];
    });

    const jobTypes = {
      "job-card-1": "job-fulltime",
      "job-card-2": "job-fulltime",
      "job-card-3": "job-remote",
      "job-card-4": "job-fulltime",
      "job-card-5": "job-fulltime",
      "job-card-6": "job-fulltime",
    };
    Object.entries(jobTypes).forEach(([id, key]) => {
      const card = document.getElementById(id);
      const typeBadge = card?.querySelectorAll(
        ".flex.items-center.gap-3 span",
      )[1];
      if (typeBadge && dict[key]) typeBadge.textContent = dict[key];
    });

    for (let i = 1; i <= 6; i++) {
      const card = document.getElementById(`job-card-${i}`);
      if (!card) continue;
      const h3 = card.querySelector("h3");
      const p = card.querySelector("p.text-gray-500");
      if (h3 && dict[`job${i}-title`]) h3.textContent = dict[`job${i}-title`];
      if (p && dict[`job${i}-desc`]) p.textContent = dict[`job${i}-desc`];
      const dept = card.querySelectorAll(".flex.items-center.gap-3 span")[0];
      if (dept && dict[`job${i}-dept`]) dept.textContent = dict[`job${i}-dept`];
      const applySpan = card.querySelector(".career-apply-btn span");
      if (applySpan && dict["careers-apply"])
        applySpan.textContent = dict["careers-apply"];
    }

    document.querySelectorAll("#about .why-card").forEach((card, idx) => {
      const prefix = `why${idx + 1}`;
      const h = card.querySelector("h3");
      const p = card.querySelector("p");
      if (h && dict[`${prefix}-title`]) h.textContent = dict[`${prefix}-title`];
      if (p && dict[`${prefix}-desc`]) p.textContent = dict[`${prefix}-desc`];
    });

    setText("#about .why-header span", "why-badge");
    setText("#about .why-header h2", "why-title");
    setText("#about .why-header p", "why-desc");

    const impacts = document.querySelectorAll("#impact .border-l");
    const impactKeys = ["impact1", "impact2", "impact3"];
    impacts.forEach((el, idx) => {
      const h = el.querySelector("h4");
      const p = el.querySelector("p");
      const k = impactKeys[idx];
      if (h && dict[`${k}-title`]) h.textContent = dict[`${k}-title`];
      if (p && dict[`${k}-desc`]) p.textContent = dict[`${k}-desc`];
    });

    document.querySelectorAll(".video-card").forEach((card, idx) => {
      const n = idx + 1;
      const badge = card.querySelector(
        ".p-6 .text-\\[9px\\], .text-\\[9px\\].font-mono",
      );
      const title = card.querySelector("h3");
      if (badge && dict[`video${n}-badge`])
        badge.textContent = dict[`video${n}-badge`];
      if (title && dict[`video${n}-title`])
        title.textContent = dict[`video${n}-title`];
    });

    document.querySelectorAll(".blog-card").forEach((card, idx) => {
      const n = idx + 1;
      const cat = card.querySelector(".text-\\[10px\\].font-mono");
      const meta = card.querySelector(".text-xs.text-gray-400");
      const title = card.querySelector("h3");
      const desc = card.querySelector("p.text-gray-500");
      const read = card.querySelector(".text-sm.font-semibold");
      if (cat && dict[`article${n}-cat`])
        cat.textContent = dict[`article${n}-cat`];
      if (meta && dict[`article${n}-meta`])
        meta.textContent = dict[`article${n}-meta`];
      if (title && dict[`article${n}-title`])
        title.textContent = dict[`article${n}-title`];
      if (desc && dict[`article${n}-desc`])
        desc.textContent = dict[`article${n}-desc`];
      if (read && dict["article-read"])
        read.childNodes[0].textContent = dict["article-read"] + " ";
    });

    setText("footer p.text-white\\/70", "footer-desc");
    setText("footer .grid > div:nth-child(2) h4", "footer-services");
    setText("footer .grid > div:nth-child(3) h4", "footer-company");
    setText("footer .grid > div:nth-child(4) h4", "footer-contact");
    const footerSvc = document.querySelectorAll(
      "footer .grid > div:nth-child(2) li a",
    );
    ["footer-svc1", "footer-svc2", "footer-svc3", "footer-svc4"].forEach(
      (k, i) => {
        if (footerSvc[i] && dict[k]) footerSvc[i].textContent = dict[k];
      },
    );
    const footerCo = document.querySelectorAll(
      "footer .grid > div:nth-child(3) li a",
    );
    [
      "footer-co1",
      "footer-co2",
      "footer-co3",
      "footer-co4",
      "footer-co5",
    ].forEach((k, i) => {
      if (footerCo[i] && dict[k]) footerCo[i].textContent = dict[k];
    });
    setText("footer .border-t p", "footer-copy");
    setText("footer .border-t .flex span", "footer-powered");
    setText("#video-modal-close span", "video-close");
  };

  applyLanguage(isArabic ? "ar" : "en");

  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      applyLanguage(isArabic ? "en" : "ar");
    });
  }

  // ==========================================================================
  // Mobile Full-Screen Navigation
  // ==========================================================================
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileOverlay = document.getElementById("mobile-menu-overlay");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenuClose = document.getElementById("mobile-menu-close");

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (mobileOverlay) {
      mobileOverlay.classList.add("open");
      mobileOverlay.setAttribute("aria-hidden", "false");
    }
    document.body.classList.add("menu-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    // Swap hamburger → X
    const iconH = document.getElementById("icon-hamburger");
    const iconX = document.getElementById("icon-close-hamburger");
    if (iconH) { iconH.style.opacity = "0"; iconH.style.transform = "scale(0.75) rotate(45deg)"; }
    if (iconX) { iconX.style.opacity = "1"; iconX.style.transform = "scale(1) rotate(0deg)"; }
    gsap.fromTo(
      mobileMenu.querySelectorAll(".mobile-nav-link"),
      { opacity: 0, x: isArabic ? -30 : 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.1,
      },
    );
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    // Move focus back BEFORE setting aria-hidden to avoid focus-inside-hidden-element error
    if (menuToggle) menuToggle.focus();
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (mobileOverlay) {
      mobileOverlay.classList.remove("open");
      mobileOverlay.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("menu-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    // Swap X → hamburger
    const iconH = document.getElementById("icon-hamburger");
    const iconX = document.getElementById("icon-close-hamburger");
    if (iconH) { iconH.style.opacity = "1"; iconH.style.transform = "scale(1) rotate(0deg)"; }
    if (iconX) { iconX.style.opacity = "0"; iconX.style.transform = "scale(0.75) rotate(-45deg)"; }
  };

  if (menuToggle) menuToggle.addEventListener("click", openMobileMenu);
  if (mobileMenuClose)
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMobileMenu);
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // ==========================================================================
  // Odoo Modules Mobile Accordion
  // ==========================================================================
  const solutionsGrid = document.getElementById("solutions-grid");
  const toggleModulesBtn = document.getElementById("toggle-modules");
  const toggleModulesText = document.getElementById("toggle-modules-text");
  const toggleModulesArrow = document.getElementById("toggle-modules-arrow");
  let modulesExpanded = false;

  if (toggleModulesBtn && solutionsGrid) {
    toggleModulesBtn.addEventListener("click", () => {
      modulesExpanded = !modulesExpanded;
      solutionsGrid.classList.toggle("modules-expanded", modulesExpanded);
      if (toggleModulesArrow)
        toggleModulesArrow.classList.toggle("rotated", modulesExpanded);
      if (toggleModulesText) {
        toggleModulesText.setAttribute(
          "data-i18n",
          modulesExpanded ? "show-less-btn" : "show-all-btn",
        );
        toggleModulesText.textContent =
          i18n[isArabic ? "ar" : "en"][
            modulesExpanded ? "show-less-btn" : "show-all-btn"
          ];
      }
      if (modulesExpanded) {
        gsap.fromTo(
          solutionsGrid.querySelectorAll(".odoo-card.mobile-hidden"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      }
    });
  }

  // ==========================================================================
  // Careers Mobile Accordion
  // ==========================================================================
  const careersGrid = document.getElementById("careers-grid");
  const toggleCareersBtn = document.getElementById("toggle-careers");
  const toggleCareersText = document.getElementById("toggle-careers-text");
  const toggleCareersArrow = document.getElementById("toggle-careers-arrow");
  let careersExpanded = false;

  if (toggleCareersBtn && careersGrid) {
    toggleCareersBtn.addEventListener("click", () => {
      careersExpanded = !careersExpanded;
      careersGrid.classList.toggle("careers-expanded", careersExpanded);
      if (toggleCareersArrow)
        toggleCareersArrow.classList.toggle("rotated", careersExpanded);
      if (toggleCareersText) {
        toggleCareersText.setAttribute(
          "data-i18n",
          careersExpanded ? "show-less-btn" : "show-all-btn",
        );
        toggleCareersText.textContent =
          i18n[isArabic ? "ar" : "en"][
            careersExpanded ? "show-less-btn" : "show-all-btn"
          ];
      }
      if (careersExpanded) {
        gsap.fromTo(
          careersGrid.querySelectorAll(".career-card.mobile-hidden"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      }
    });
  }

  // ==========================================================================
  // Contact Form → n8n Webhook (fayrouztours.com)
  // ==========================================================================
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const formSubmitBtn = document.getElementById("form-submit");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dict = i18n[isArabic ? "ar" : "en"];
      const name = document.getElementById("form-name")?.value.trim();
      const email = document.getElementById("form-email")?.value.trim();
      const phone = document.getElementById("form-phone")?.value.trim();
      const service = document.getElementById("form-service")?.value;
      const message = document.getElementById("form-message")?.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = "er";
          formStatus.textContent = dict["form-required"];
        }
        return;
      }

      if (formSubmitBtn) formSubmitBtn.disabled = true;
      const submitLabel = formSubmitBtn?.querySelector(
        "[data-i18n='form-submit']",
      );
      if (submitLabel) submitLabel.textContent = dict["form-sending"];

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            service,
            message,
            source: "Coddy Master Website",
            lang: isArabic ? "ar" : "en",
            submittedAt: new Date().toISOString(),
          }),
        });

        if (!res.ok) throw new Error("Webhook failed");

        if (formStatus) {
          formStatus.className = "ok";
          formStatus.textContent = dict["form-success"];
        }
        contactForm.reset();
      } catch (err) {
        if (formStatus) {
          formStatus.className = "er";
          formStatus.textContent = dict["form-error"];
        }
      } finally {
        if (formSubmitBtn) formSubmitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = dict["form-submit"];
      }
    });
  }

  // ==========================================================================
  // AI Chatbot Widget
  // ==========================================================================
  const chatToggle = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chatbot-window");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");
  const chatIconOpen = document.getElementById("chat-icon-open");
  const chatIconClose = document.getElementById("chat-icon-close");

  const chatReplies = {
    book: {
      en: "Book a free 30-minute consultation via our contact form or email Info@coddymaster.com.",
      ar: "احجز استشارة مجانية لمدة 30 دقيقة عبر نموذج التواصل أو البريد Info@coddymaster.com.",
    },
    pricing: {
      en: "Pricing varies by service: Virtual CFO retainer, flexible accounting plans, and official Odoo implementation models. Contact us for a tailored quote.",
      ar: "تختلف الأسعار حسب الخدمة: اشتراك المدير المالي الافتراضي، باقات محاسبة مرنة، ونماذج تطبيق أودو الرسمية. تواصل معنا لعرض مخصص.",
    },
    services: {
      en: "We deliver Virtual CFO leadership, outsourced accounting, and certified Odoo ERP implementation for GCC enterprises.",
      ar: "نقدم قيادة المدير المالي الافتراضي، المحاسبة الخارجية، وتطبيق Odoo ERP المعتمد لمؤسسات الخليج.",
    },
    odoo: {
      en: "Explore our Odoo modules grid — Accounting, Inventory, Manufacturing, CRM, AI, and more. Click any module for details.",
      ar: "استكشف شبكة وحدات أودو — المحاسبة، المخزون، التصنيع، CRM، الذكاء الاصطناعي والمزيد. انقر على أي وحدة للتفاصيل.",
    },
    default: {
      en: "Thank you for your message. Our team will follow up shortly. For urgent requests, call +20 100 527 5315.",
      ar: "شكرًا لرسالتك. سيتواصل فريقنا معك قريبًا. للطلبات العاجلة: +20 100 527 5315.",
    },
  };

  const appendChatMessage = (text, isUser) => {
    if (!chatMessages) return;
    const wrap = document.createElement("div");
    wrap.className = `chat-msg ${isUser ? "chat-msg-user" : "chat-msg-bot"}`;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-bot"}`;
    bubble.innerHTML = text.replace(/\n/g, "<br>");
    const time = document.createElement("div");
    time.className = "chat-time";
    time.textContent = isArabic ? "الآن" : "Just now";
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const showChatTyping = (callback) => {
    if (!chatMessages) return callback();
    const typ = document.createElement("div");
    typ.className = "chat-msg chat-msg-bot chat-typing-wrap";
    typ.innerHTML =
      '<div class="chat-typing"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typ);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
      typ.remove();
      callback();
    }, 900);
  };

  const respondChat = (key) => {
    const reply = chatReplies[key] || chatReplies.default;
    showChatTyping(() =>
      appendChatMessage(isArabic ? reply.ar : reply.en, false),
    );
  };

  const toggleChat = () => {
    if (!chatWindow || !chatToggle) return;
    const open = chatWindow.classList.toggle("open");
    chatWindow.setAttribute("aria-hidden", open ? "false" : "true");
    chatToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (chatIconOpen) chatIconOpen.classList.toggle("hidden", open);
    if (chatIconClose) chatIconClose.classList.toggle("hidden", !open);
  };

  if (chatToggle) chatToggle.addEventListener("click", toggleChat);

  document.querySelectorAll(".chat-quick").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rk = btn.getAttribute("data-rk");
      appendChatMessage(btn.textContent.trim(), true);
      respondChat(rk);
    });
  });

  const handleChatSend = () => {
    const text = chatInput?.value.trim();
    if (!text) return;
    appendChatMessage(text, true);
    if (chatInput) chatInput.value = "";
    respondChat("default");
  };

  if (chatSend) chatSend.addEventListener("click", handleChatSend);
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleChatSend();
      }
    });
  }

  // Sticky nav background on scroll
  const mainNav = document.getElementById("main-nav");
  if (mainNav) {
    ScrollTrigger.create({
      start: "top -80",
      onUpdate: (self) => {
        if (self.scroll() > 80) {
          mainNav.classList.add(
            "bg-brand-carbon/40",
            "backdrop-blur-md",
            "py-4",
          );
          mainNav.classList.remove("py-5");
        } else {
          mainNav.classList.remove(
            "bg-brand-carbon/40",
            "backdrop-blur-md",
            "py-4",
          );
          mainNav.classList.add("py-5");
        }
      },
    });
  }

  // Ensure marquee-track has duplicated content for seamless infinite loop (fixes translated variant)
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    // If content width isn't duplicated, clone children once
    const children = Array.from(marqueeTrack.children);
    // If there is only one sequence of logos, duplicate them to allow seamless -50% translate
    if (children.length > 0) {
      const total = children.length;
      // Heuristic: if duplicate sequence not detected (no repeating src within first half), append a clone
      let isDuplicated = false;
      for (let i = 0; i < total / 2; i++) {
        const a = children[i]?.querySelector("img")?.getAttribute("src");
        const b = children[i + total / 2]
          ?.querySelector("img")
          ?.getAttribute("src");
        if (a && b && a === b) {
          isDuplicated = true;
          break;
        }
      }
      if (!isDuplicated) {
        const cloneFrag = document.createDocumentFragment();
        children.forEach((c) => cloneFrag.appendChild(c.cloneNode(true)));
        marqueeTrack.appendChild(cloneFrag);
      }
    }
  }

  initRevealFallback();
  ScrollTrigger.refresh(true);
  window.addEventListener("load", () => ScrollTrigger.refresh(true));
  window.addEventListener("resize", () => {
    lenis.resize();
    ScrollTrigger.refresh(true);
  });
});
