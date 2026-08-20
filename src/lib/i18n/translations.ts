export type Lang = "en" | "ar";

type Dict = {
  nav: Record<string, string>;
  hero: Record<string, string>;
  stats: Record<string, string>;
  programs: {
    title: string; subtitle: string; viewAll: string;
    videoEyebrow: string; videoTitle: string; videoSubtitle: string;
    quran: { name: string; desc: string };
    islamic: { name: string; desc: string };
    arabic: { name: string; desc: string };
    kids: { name: string; desc: string };
    intermediate: string; hifz: string; ijazah: string;
  };
  why: { title: string; subtitle: string; items: string[] };
  process: { title: string; subtitle: string; steps: { t: string; d: string }[] };
  teachers: { title: string; subtitle: string; viewAll: string };
  pricing: {
    title: string; subtitle: string; popular: string; cta: string; perMonth: string;
    plans: {
      starter: { name: string; features: string[] };
      standard: { name: string; features: string[] };
      premium: { name: string; features: string[] };
    };
  };
  about: {
    title: string; short: string; long: string;
    visionT: string; vision: string;
    missionT: string; mission: string;
    valuesT: string; values: string[];
    storyT: string; story: string[];
    milestoneT: string; milestones: { t: string; d: string }[];
  };
  testimonials: { title: string; items: { q: string; a: string }[] };
  videos: { eyebrow: string; title: string; subtitle: string };
  courses: {
    title: string; subtitle: string;
    level: string; duration: string; lessons: string; enroll: string;
    intro: { title: string; subtitle: string };
    items: { name: string; desc: string; level: string; duration: string; lessons: number; tag: string }[];
  };
  faq: { title: string; items: { q: string; a: string }[] };
  policies: { title: string; items: { t: string; d: string }[] };
  contact: {
    title: string; subtitle: string;
    email: string; support: string; whatsapp: string; follow: string;
    form: { name: string; email: string; program: string; message: string; submit: string };
  };
  footer: {
    about: string; quickLinks: string; programsT: string;
    newsletter: string; newsletterDesc: string; subscribe: string; rights: string;
  };
  cta: { title: string; subtitle: string };
};

export const translations: Record<Lang, Dict> = {
  en: {
    nav: {

      home: "Home",
      about: "About",
      programs: "Programs",
      teachers: "Teachers",
      pricing: "Pricing",
      process: "How it Works",
      policies: "Policies",
      faq: "FAQ",
      contact: "Contact",
      courses: "Courses",
      enroll: "Enroll",
      bookTrial: "Book Free Trial",
    },
    hero: {
      eyebrow: "Qumra Academy · Read · Understand · Ascend",
      title: "Learn Quran, Arabic & Islamic Studies from Certified Teachers",
      subtitle:
        "Personalized online learning designed for children and adults worldwide. Start your journey today with expert instructors and flexible scheduling.",
      cta1: "Book Free Trial",
      cta2: "Explore Programs",
    },
    stats: {
      classes: "Online Classes",
      students: "Students",
      teachers: "Qualified Teachers",
      countries: "Countries",
      satisfaction: "Student Satisfaction",
      support: "Student Support",
    },
    programs: {
      title: "Our Programs",
      subtitle: "Structured tracks for every learner — from first letters to Ijazah.",
      viewAll: "View All Programs",
      quran: {
        name: "Quran Learning",
        desc: "Master Quran recitation with proper Tajweed while building confidence in reading, memorization, and understanding.",
      },
      islamic: {
        name: "Islamic Studies",
        desc: "Build strong Islamic knowledge through structured lessons covering faith, worship, manners, and prophetic traditions.",
      },
      arabic: {
        name: "Arabic Language",
        desc: "Learn Modern Standard Arabic from beginner to advanced levels with practical speaking and writing skills.",
      },
      kids: {
        name: "Kids Programs",
        desc: "Fun and engaging Islamic education designed specifically for young learners.",
      },
      intermediate: "Intermediate — Tajweed & Fluency",
      hifz: "Qur'an Memorization (Hifz Program)",
      ijazah: "Ijazah — Certification Track",
      videoEyebrow: "Watch",
      videoTitle: "See How We Teach",
      videoSubtitle: "A short look at our practical, one-to-one online classes.",
    },
    why: {
      title: "Why Choose Qumra Academy",
      subtitle: "Everything you need for a serious, joyful learning journey.",
      items: [
        "Qualified Male & Female Teachers",
        "One-to-One Live Classes",
        "Flexible Scheduling",
        "Personalized Learning Plans",
        "Native Arabic Instructors",
        "Interactive Learning Environment",
        "Affordable Pricing",
        "International Students Welcome",
        "Detailed Progress Reports",
        "Certificates of Completion",
      ],
    },
    process: {
      title: "How it Works",
      subtitle: "Six simple steps to start learning.",
      steps: [
        { t: "Book a Free Trial", d: "Reserve a no-obligation trial lesson." },
        { t: "Meet Your Teacher", d: "Get matched with the right instructor." },
        { t: "Placement Assessment", d: "We evaluate your current level." },
        { t: "Choose Your Package", d: "Pick the plan that fits your schedule." },
        { t: "Start Learning", d: "Begin live one-to-one sessions." },
        { t: "Track Your Progress", d: "Receive regular progress reports." },
      ],
    },
    teachers: {
      title: "Top Class Instructors",
      subtitle: "Learn from qualified male and female teachers with years of experience.",
      viewAll: "Meet All Teachers",
    },
    pricing: {
      title: "Choose Your Plan",
      subtitle: "Flexible pricing designed to fit every schedule and budget.",
      popular: "Most Popular",
      cta: "Get Started",
      perMonth: "/ month",
      plans: {
        starter: {
          name: "Starter",
          features: [
            "2 Classes per Week",
            "30 Minutes per Session",
            "Live Online Classes",
            "Monthly Progress Report",
          ],
        },
        standard: {
          name: "Standard",
          features: [
            "3 Classes per Week",
            "45 Minutes per Session",
            "Personalized Learning Plan",
            "Monthly Assessment",
          ],
        },
        premium: {
          name: "Premium",
          features: [
            "5 Classes per Week",
            "60 Minutes per Session",
            "Dedicated Teacher",
            "Priority Support",
            "Weekly Reports",
            "Personalized Curriculum",
          ],
        },
      },
    },
    about: {
      title: "About Qumra Academy",
      short:
        "Qumra Academy is a global online learning platform dedicated to teaching the Holy Quran, Islamic Studies, and Arabic Language through qualified teachers and structured educational programs.",
      long:
        "At Qumra Academy, we believe that learning the Quran and understanding Islam should be accessible to everyone regardless of location or language. We combine experienced instructors, interactive online classrooms, and carefully designed curricula to help students read the Quran correctly, understand its meanings, strengthen their Islamic knowledge, and master the Arabic language. Whether you are a beginner, an advanced learner, a child, or an adult, our personalized learning approach ensures steady progress in a supportive environment.",
      visionT: "Our Vision",
      vision:
        "To become one of the world's leading online Islamic education platforms by providing high-quality Quranic and Arabic education that inspires lifelong learning and spiritual growth.",
      missionT: "Our Mission",
      mission:
        "Empower learners around the globe to read the Quran correctly, understand Islam authentically, and communicate confidently in Arabic through engaging, flexible, and personalized online education.",
      valuesT: "Core Values",
      values: [
        "Excellence",
        "Authenticity",
        "Integrity",
        "Respect",
        "Continuous Learning",
        "Student Success",
        "Flexibility",
        "Innovation",
      ],
      storyT: "Our Story",
      story: [
        "Qumra Academy began with a simple belief: the beauty and wisdom of the Quran should be within reach of every learner on Earth. What started as a handful of dedicated instructors has grown into a global community of students from over thirty countries.",
        "Every lesson is a step toward deeper understanding. Our certified teachers — men and women — bring passion, patience, and proven methodology to each one-to-one live session, whether you are learning your first letters or seeking your Ijazah.",
        "From flexible scheduling to personalized learning plans, everything we do is designed around you. Join thousands of students who have already discovered a warmer, more human way to learn Quran, Arabic, and Islamic studies.",
      ],
      milestoneT: "Our Journey",
      milestones: [
        { t: "The First Lesson", d: "A single classroom opened with one teacher and a handful of students." },
        { t: "Going Global", d: "Students joined from across the world, learning in English and Arabic." },
        { t: "A Team of Instructors", d: "Certified male and female teachers now guide every stage of the journey." },
        { t: "Today & Beyond", d: "Thousands of classes delivered, with a growing community in over 30 countries." },
      ],
    },
    testimonials: {
      title: "What Our Students Say",
      items: [
        { q: "Excellent teachers and flexible scheduling. Highly recommended.", a: "Parent · UK" },
        { q: "My children improved their Quran recitation in just a few months.", a: "Parent · USA" },
        { q: "Professional instructors and a wonderful learning experience.", a: "Student · Canada" },
      ],
    },
    videos: {
      eyebrow: "Videos",
      title: "Student Video Reviews",
      subtitle: "Watch and hear what our students say about their journey with Qumra.",
    },
    courses: {
      title: "Our Courses",
      subtitle: "Structured online courses to guide your journey — from beginner to Ijazah.",
      level: "Level",
      duration: "Duration",
      lessons: "Lessons",
      enroll: "Enroll Now",
      intro: { title: "A Glimpse Into Qumra", subtitle: "Watch a short intro to our teaching approach." },
      items: [
        { name: "Noorani Qaida", desc: "Master Arabic letters, vowels, and rules to start reading the Quran with confidence.", level: "Beginner", duration: "2 months", lessons: 24, tag: "Quran" },
        { name: "Quran Recitation with Tajweed", desc: "Learn to recite the Quran correctly with proper Tajweed rules and application.", level: "Intermediate", duration: "6 months", lessons: 72, tag: "Quran" },
        { name: "Quran Memorization (Hifz)", desc: "Structured Hifz program with revision plans and one-to-one tracking.", level: "All Levels", duration: "Ongoing", lessons: 100, tag: "Hifz" },
        { name: "Ijazah Certification", desc: "Advanced program leading to an authenticated Ijazah in Quran recitation.", level: "Advanced", duration: "12+ months", lessons: 150, tag: "Certification" },
        { name: "Arabic Language A1–B2", desc: "Speak, read, and write Modern Standard Arabic through a practical curriculum.", level: "All Levels", duration: "8 months", lessons: 80, tag: "Arabic" },
        { name: "Islamic Studies Essentials", desc: "Aqeedah, Fiqh, Seerah, and daily Islamic practice — clear and authentic.", level: "Beginner", duration: "4 months", lessons: 48, tag: "Islamic" },
        { name: "Kids Quran & Arabic", desc: "Fun, interactive classes designed for children aged 5–12.", level: "Kids", duration: "Flexible", lessons: 60, tag: "Kids" },
        { name: "Tafsir of Juz Amma", desc: "Understand the meanings of the final Juz — verse by verse.", level: "Intermediate", duration: "3 months", lessons: 30, tag: "Tafsir" },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { q: "Do you offer free trial classes?", a: "Yes, every new student can book a free trial lesson." },
        { q: "Are classes one-on-one?", a: "Yes, private lessons are available for all programs." },
        { q: "Can children join?", a: "Absolutely. We offer specialized programs designed for children." },
        { q: "Which countries do you serve?", a: "Students from all around the world are welcome." },
        { q: "What languages are used during lessons?", a: "English and Arabic." },
      ],
    },
    policies: {
      title: "Academy Policies",
      items: [
        { t: "Attendance", d: "Students are expected to attend all scheduled classes on time." },
        { t: "Cancellation", d: "Classes may be rescheduled with at least 24 hours' notice." },
        { t: "Late Attendance", d: "Students arriving more than 15 minutes late may lose the session." },
        { t: "Teacher Replacement", d: "Teachers may be replaced when necessary while maintaining the same educational standards." },
        { t: "Refund Policy", d: "Refunds are subject to academy terms and conditions." },
        { t: "Respect Policy", d: "Students and teachers are expected to maintain respectful communication throughout all sessions." },
      ],
    },
    contact: {
      title: "Get in Touch",
      subtitle: "We're here to answer your questions and help you start your learning journey.",
      email: "Email",
      support: "Support",
      whatsapp: "WhatsApp",
      address: "Address",
      follow: "Follow Us",
      form: {
        name: "Your Name",
        email: "Your Email",
        program: "Program of Interest",
        message: "Your Message",
        submit: "Send via WhatsApp",
      },
    },
    footer: {
      about:
        "Qumra Academy — a global online platform for Quran, Arabic, and Islamic Studies. Read · Understand · Ascend.",
      quickLinks: "Quick Links",
      programsT: "Programs",
      newsletter: "Newsletter",
      newsletterDesc: "Subscribe to receive academy news, educational resources, and special offers.",
      subscribe: "Subscribe",
      rights: "All rights reserved.",
    },
    cta: {
      title: "Start your Qumra journey today",
      subtitle: "Book a free trial lesson and meet your teacher.",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      programs: "البرامج",
      teachers: "المعلمون",
      pricing: "الأسعار",
      process: "طريقة التعلم",
      policies: "السياسات",
      faq: "الأسئلة الشائعة",
      contact: "تواصل معنا",
      courses: "الكورسات",
      enroll: "سجّل الآن",
      bookTrial: "احجز حصة مجانية",
    },
    hero: {
      eyebrow: "أكاديمية قمرة · اقرأ · افهم · ارتقِ",
      title: "تعلّم القرآن واللغة العربية والدراسات الإسلامية مع معلمين معتمدين",
      subtitle:
        "تعلّم أونلاين مخصّص للأطفال والكبار حول العالم. ابدأ رحلتك اليوم مع خبراء تدريس وجداول مرنة.",
      cta1: "احجز حصة مجانية",
      cta2: "استعرض البرامج",
    },
    stats: {
      classes: "حصة أونلاين",
      students: "طالب وطالبة",
      teachers: "معلم مؤهل",
      countries: "دولة",
      satisfaction: "رضا الطلاب",
      support: "دعم على مدار الساعة",
    },
    programs: {
      title: "برامجنا",
      subtitle: "مسارات منظّمة لكل مستوى — من أول الحروف حتى الإجازة.",
      viewAll: "استعرض كل البرامج",
      quran: {
        name: "تعلّم القرآن",
        desc: "أتقن تلاوة القرآن بأحكام التجويد مع بناء الثقة في القراءة والحفظ والفهم.",
      },
      islamic: {
        name: "الدراسات الإسلامية",
        desc: "معرفة إسلامية راسخة عبر دروس منظّمة في العقيدة والفقه والأخلاق والسيرة.",
      },
      arabic: {
        name: "اللغة العربية",
        desc: "تعلّم العربية الفصحى من المبتدئ إلى المتقدم — محادثة وقراءة وكتابة.",
      },
      kids: {
        name: "برامج الأطفال",
        desc: "تعليم إسلامي ممتع ومصمّم خصيصًا للأطفال الصغار.",
      },
      intermediate: "المستوى المتوسط — تجويد وطلاقة",
      hifz: "حفظ القرآن الكريم",
      ijazah: "مسار الإجازة والاعتماد",
      videoEyebrow: "شاهد",
      videoTitle: "شوف طريقة تدريسنا",
      videoSubtitle: "نظرة سريعة على حصصنا العملية الفردية أونلاين.",
    },
    why: {
      title: "لماذا أكاديمية قمرة",
      subtitle: "كل ما تحتاجه لرحلة تعلّم جادّة وممتعة.",
      items: [
        "معلمون ومعلمات مؤهلون",
        "حصص فردية مباشرة",
        "جداول مرنة",
        "خطط تعلّم مخصّصة",
        "معلمون ناطقون بالعربية",
        "بيئة تعلّم تفاعلية",
        "أسعار مناسبة",
        "طلاب من كل دول العالم",
        "تقارير تقدّم دورية",
        "شهادات إتمام معتمدة",
      ],
    },
    process: {
      title: "طريقة التعلم",
      subtitle: "ست خطوات بسيطة لبدء رحلتك.",
      steps: [
        { t: "احجز حصة مجانية", d: "احجز حصة تجريبية بدون أي التزام." },
        { t: "تعرّف على معلمك", d: "نطابقك مع المعلم المناسب لك." },
        { t: "تقييم المستوى", d: "نحدد مستواك الحالي بدقة." },
        { t: "اختر الباقة", d: "اختر الخطة الأنسب لجدولك." },
        { t: "ابدأ التعلم", d: "احضر حصصك الفردية المباشرة." },
        { t: "تابع تقدّمك", d: "استلم تقارير تقدم دورية." },
      ],
    },
    teachers: {
      title: "نخبة من المعلمين",
      subtitle: "تعلّم مع معلمين ومعلمات مؤهلين بخبرات سنوات.",
      viewAll: "تعرف على كل المعلمين",
    },
    pricing: {
      title: "اختر باقتك",
      subtitle: "باقات مرنة تناسب كل جدول وكل ميزانية.",
      popular: "الأكثر طلبًا",
      cta: "ابدأ الآن",
      perMonth: "/ شهريًا",
      plans: {
        starter: {
          name: "المبتدئ",
          features: [
            "حصتان أسبوعيًا",
            "30 دقيقة لكل حصة",
            "حصص أونلاين مباشرة",
            "تقرير تقدم شهري",
          ],
        },
        standard: {
          name: "المتوسط",
          features: [
            "3 حصص أسبوعيًا",
            "45 دقيقة لكل حصة",
            "خطة تعلم مخصصة",
            "تقييم شهري",
          ],
        },
        premium: {
          name: "المتقدم",
          features: [
            "5 حصص أسبوعيًا",
            "60 دقيقة لكل حصة",
            "معلم مخصّص",
            "دعم فوري",
            "تقارير أسبوعية",
            "منهج مخصص",
          ],
        },
      },
    },
    about: {
      title: "عن أكاديمية قمرة",
      short:
        "أكاديمية قمرة منصّة تعليم أونلاين عالمية متخصصة في تعليم القرآن الكريم والدراسات الإسلامية واللغة العربية عبر معلمين مؤهلين وبرامج تعليمية منظّمة.",
      long:
        "نؤمن في قمرة بأن تعلّم القرآن وفهم الإسلام يجب أن يكون متاحًا للجميع بغض النظر عن المكان أو اللغة. نجمع بين معلمين ذوي خبرة وفصول تفاعلية أونلاين ومناهج مصمّمة بعناية لمساعدة الطلاب على قراءة القرآن قراءةً صحيحة وفهم معانيه وتقوية معرفتهم الإسلامية وإتقان اللغة العربية. سواء كنت مبتدئًا أو متقدمًا، طفلًا أو بالغًا، نضمن لك تقدّمًا ثابتًا في بيئة داعمة.",
      visionT: "رؤيتنا",
      vision:
        "أن نكون من أوّل منصّات التعليم الإسلامي أونلاين على مستوى العالم عبر تقديم تعليم قرآني وعربي عالي الجودة.",
      missionT: "رسالتنا",
      mission:
        "تمكين المتعلمين حول العالم من قراءة القرآن قراءة صحيحة وفهم الإسلام فهمًا صحيحًا والتواصل بالعربية بثقة عبر تعليم مرن ومخصّص.",
      valuesT: "قيمنا",
      values: [
        "التميّز",
        "الأصالة",
        "النزاهة",
        "الاحترام",
        "التعلم المستمر",
        "نجاح الطالب",
        "المرونة",
        "الابتكار",
      ],
      storyT: "قصتنا",
      story: [
        "بدأت أكاديمية قمرة بفكرة بسيطة: أن يكون جمال القرآن وحكمته في متناول كل متعلم على وجه الأرض. وما بدأ مع عدد قليل من المعلمين المخلصين أصبح مجتمعًا عالميًا من الطلاب في أكثر من ثلاثين دولة.",
        "كل حصة هي خطوة نحو فهم أعمق. معلمونا المعتمدون — رجالًا ونساءً — يجمعون بين الشغف والصبر والمنهجية المجرّبة في كل حصة مباشرة، سواء كنت تتعلم حروفك الأولى أو تسعى للحصول على إجازتك.",
        "من الجدولة المرنة إلى خطط التعلم المخصصة، كل ما نفعله مصمّم حولك. انضم إلى آلاف الطلاب الذين اكتشفوا طريقة أكثر إنسانية ودافئية لتعلّم القرآن والعربية والدراسات الإسلامية.",
      ],
      milestoneT: "رحلتنا",
      milestones: [
        { t: "أول درس", d: "انطلقت الأكاديمية بمعلم واحد ومجموعة صغيرة من الطلاب." },
        { t: "الانتشار عالميًا", d: "انضم طلاب من جميع أنحاء العالم، يتعلمون بالإنجليزية والعربية." },
        { t: "فريق من المعلمين", d: "معلمون ومعلمات معتمدون يوجّهون كل مرحلة من رحلة التعلم." },
        { t: "اليوم وما بعده", d: "آلاف الحصص المقدّمة ومجتمع متنامٍ في أكثر من 30 دولة." },
      ],
    },
    testimonials: {
      title: "ماذا يقول طلابنا",
      items: [
        { q: "معلمون ممتازون وجدول مرن. أنصح بها بشدة.", a: "ولي أمر · المملكة المتحدة" },
        { q: "أطفالي تحسّنت تلاوتهم للقرآن في أشهر قليلة.", a: "ولي أمر · الولايات المتحدة" },
        { q: "معلمون محترفون وتجربة تعلّم رائعة.", a: "طالب · كندا" },
      ],
    },
    videos: {
      eyebrow: "فيديوهات",
      title: "رأي طلابنا بالفيديو",
      subtitle: "شاهد واستمع لطلابنا وهم يتحدثون عن تجربتهم مع قمرة.",
    },
    courses: {
      title: "كورساتنا",
      subtitle: "كورسات أونلاين منظّمة لترافقك في رحلتك — من المبتدئ حتى الإجازة.",
      level: "المستوى",
      duration: "المدة",
      lessons: "عدد الدروس",
      enroll: "سجّل الآن",
      intro: { title: "لمحة من قمرة", subtitle: "شاهد فيديو تعريفي قصير عن أسلوب التعليم عندنا." },
      items: [
        { name: "القاعدة النورانية", desc: "إتقان الحروف والحركات والقواعد الأساسية لبدء قراءة القرآن بثقة.", level: "مبتدئ", duration: "شهران", lessons: 24, tag: "قرآن" },
        { name: "تلاوة القرآن بأحكام التجويد", desc: "تعلّم تلاوة القرآن بصورة صحيحة مع تطبيق أحكام التجويد.", level: "متوسط", duration: "6 أشهر", lessons: 72, tag: "قرآن" },
        { name: "حفظ القرآن الكريم", desc: "برنامج حفظ منظّم مع خطط مراجعة ومتابعة فردية.", level: "كل المستويات", duration: "مستمر", lessons: 100, tag: "حفظ" },
        { name: "الإجازة في القرآن الكريم", desc: "برنامج متقدّم يؤهلك للحصول على إجازة معتمدة في تلاوة القرآن.", level: "متقدم", duration: "12+ شهر", lessons: 150, tag: "إجازة" },
        { name: "اللغة العربية A1–B2", desc: "تحدّث واقرأ واكتب العربية الفصحى عبر منهج عملي متدرّج.", level: "كل المستويات", duration: "8 أشهر", lessons: 80, tag: "عربية" },
        { name: "أساسيات الدراسات الإسلامية", desc: "العقيدة والفقه والسيرة والتطبيق اليومي — بشكل واضح وأصيل.", level: "مبتدئ", duration: "4 أشهر", lessons: 48, tag: "إسلامي" },
        { name: "قرآن وعربية للأطفال", desc: "حصص ممتعة وتفاعلية مصممة للأطفال من 5 إلى 12 سنة.", level: "أطفال", duration: "مرنة", lessons: 60, tag: "أطفال" },
        { name: "تفسير جزء عمّ", desc: "فهم معاني الجزء الأخير من القرآن — آية آية.", level: "متوسط", duration: "3 أشهر", lessons: 30, tag: "تفسير" },
      ],
    },
    faq: {
      title: "الأسئلة الشائعة",
      items: [
        { q: "هل توفرون حصص تجريبية مجانية؟", a: "نعم، يمكن لكل طالب جديد حجز حصة تجريبية مجانية." },
        { q: "هل الحصص فردية؟", a: "نعم، دروس خاصة متاحة لكل البرامج." },
        { q: "هل يمكن للأطفال الالتحاق؟", a: "بالتأكيد. لدينا برامج مصممة خصيصًا للأطفال." },
        { q: "أي دول تخدمون؟", a: "نرحّب بالطلاب من كل دول العالم." },
        { q: "ما اللغات المستخدمة في الحصص؟", a: "اللغة الإنجليزية واللغة العربية." },
      ],
    },
    policies: {
      title: "سياسات الأكاديمية",
      items: [
        { t: "الحضور", d: "الالتزام بحضور كل الحصص في مواعيدها." },
        { t: "الإلغاء", d: "يمكن إعادة جدولة الحصص بإشعار قبل 24 ساعة على الأقل." },
        { t: "التأخر", d: "الطالب الذي يتأخر أكثر من 15 دقيقة قد يفقد الحصة." },
        { t: "استبدال المعلم", d: "يمكن استبدال المعلم عند الحاجة مع الحفاظ على نفس الجودة." },
        { t: "الاسترداد", d: "الاسترداد يخضع لشروط وأحكام الأكاديمية." },
        { t: "الاحترام", d: "الالتزام بالتواصل المحترم بين الطلاب والمعلمين طوال الحصص." },
      ],
    },
    contact: {
      title: "تواصل معنا",
      subtitle: "نحن هنا للإجابة على أسئلتك ومساعدتك في بدء رحلتك.",
      email: "البريد الإلكتروني",
      support: "الدعم",
      whatsapp: "واتساب",
      address: "العنوان",
      follow: "تابعنا",
      form: {
        name: "الاسم",
        email: "البريد الإلكتروني",
        program: "البرنامج المطلوب",
        message: "رسالتك",
        submit: "أرسل عبر واتساب",
      },
    },
    footer: {
      about:
        "أكاديمية قمرة — منصّة عالمية أونلاين لتعليم القرآن واللغة العربية والدراسات الإسلامية. اقرأ · افهم · ارتقِ.",
      quickLinks: "روابط سريعة",
      programsT: "البرامج",
      newsletter: "النشرة البريدية",
      newsletterDesc: "اشترك لتصلك أخبار الأكاديمية والموارد التعليمية والعروض الخاصة.",
      subscribe: "اشترك",
      rights: "جميع الحقوق محفوظة.",
    },
    cta: {
      title: "ابدأ رحلتك مع قمرة اليوم",
      subtitle: "احجز حصة تجريبية مجانية وتعرّف على معلمك.",
    },
  },
};

export type Translations = Dict;

