import { Building, Phone, Mail, MapPin, ArrowUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Building className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl">مؤسسة الوعل</h1>
              <p className="text-sm text-secondary-foreground/80">للعقارات والمقاولات</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="hover:text-primary transition-colors">الرئيسية</a>
            <a href="#about" className="hover:text-primary transition-colors">من نحن</a>
            <a href="#services" className="hover:text-primary transition-colors">خدماتنا</a>
            <a href="#projects" className="hover:text-primary transition-colors">مشاريعنا</a>
            <a href="#contact" className="hover:text-primary transition-colors">تواصل معنا</a>
          </nav>
          <Link to="/admin/login">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-bl from-secondary via-secondary/95 to-secondary text-secondary-foreground py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            نبني <span className="text-primary">أحلامك</span> بإتقان
          </h1>
          <p className="text-xl md:text-2xl text-secondary-foreground/80 mb-8 max-w-3xl mx-auto">
            مؤسسة رائدة في مجال العقارات والمقاولات في الجمهورية اليمنية - المكلا
            بخبرة تزيد عن 20 عاماً
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg">
              تواصل معنا
              <ArrowUpLeft className="w-5 h-5 mr-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg border-primary/50 hover:bg-primary/10">
              استعرض مشاريعنا
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">من نحن</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              مؤسسة الوعل للعقارات والمقاولات تأسست منذ أكثر من 20 عاماً،
              ونفتخر بتقديم خدمات متميزة في مجال التطوير العقاري والبناء
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '500+', label: 'مشروع منجز' },
              { number: '20+', label: 'سنة خبرة' },
              { number: '1000+', label: 'عميل سعيد' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 bg-card rounded-xl border border-border">
                <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">خدماتنا</h2>
            <p className="text-muted-foreground">نقدم مجموعة متكاملة من الخدمات العقارية والإنشائية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏗️', title: 'البناء والمقاولات', desc: 'بناء المباني السكنية والتجارية بأعلى معايير الجودة' },
              { icon: '🏢', title: 'التطوير العقاري', desc: 'تطوير المشاريع العقارية من التخطيط للتسليم' },
              { icon: '📐', title: 'التصميم المعماري', desc: 'تصاميم عصرية تجمع بين الجمال والوظيفة' },
              { icon: '🔧', title: 'الصيانة والترميم', desc: 'خدمات صيانة شاملة للمباني والمنشآت' },
            ].map((service, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">تواصل معنا</h2>
            <p className="text-secondary-foreground/80">نحن هنا لمساعدتك في تحقيق مشروعك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Phone, label: 'الهاتف', value: '+967 5 000 0000' },
              { icon: Mail, label: 'البريد الإلكتروني', value: 'info@alwael.com' },
              { icon: MapPin, label: 'العنوان', value: 'المكلا، الجمهورية اليمنية' },
            ].map((contact, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <contact.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium mb-1">{contact.label}</p>
                <p className="text-secondary-foreground/80" dir={index === 0 || index === 1 ? 'ltr' : 'rtl'}>
                  {contact.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/95 text-secondary-foreground py-8 border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary-foreground/60">
            © 2024 مؤسسة الوعل للعقارات والمقاولات. جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
