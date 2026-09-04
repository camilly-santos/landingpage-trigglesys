/**
 * Componente Compliance — "Hub de Confiança & Governança"
 * Seção 11 — Dois formulários completos: Atendimento ao Titular dos Dados
 * (LGPD/GDPR) e Canal de Denúncias & Comunicação Ética. Cada formulário
 * carrega seus próprios documentos institucionais para download (2 cada).
 *
 * A submissão real ao back-end (validação, sanitização, envio) é conectada
 * na Etapa 8 — por enquanto os handlers só previnem o reload da página.
 */

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  UserCog,
  MessageSquareWarning,
  FileText,
  Download,
  Lock,
  Send,
  Paperclip,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import styles from './Compliance.module.scss';

gsap.registerPlugin(ScrollTrigger, SplitText);

// ═══════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: Lista mini de documentos (reutilizada nos dois formulários)
// ═══════════════════════════════════════════════════════════════════════════
function DocsMiniList({ docs }) {
  if (!docs.length) return null;

  return (
    <div className={styles.miniDocsList}>
      {docs.map((doc) => (
        <a key={doc.id} href={doc.href || '#'} className={styles.miniDocItem} download>
          <FileText size={16} className={styles.miniDocIcon} />
          <span className={styles.miniDocName}>{doc.name}</span>
          <Download size={14} className={styles.miniDocDownloadIcon} />
        </a>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: Formulário LGPD/GDPR
// ═══════════════════════════════════════════════════════════════════════════
function LgpdForm({ t }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState('');

  const rawDocs = t('compliance.lgpd.documents', { returnObjects: true });
  const docs = Array.isArray(rawDocs) ? rawDocs : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO (Etapa 8): enviar { name, email, requestType } para o back-end
    // com validação, sanitização e rate limiting.
  };

  return (
    <Card className={styles.gateCard} variant="dark">
      <div className={styles.gateIcon}>
        <UserCog size={30} />
      </div>
      <h3 className={styles.gateTitle}>{t('compliance.lgpd.title')}</h3>
      <p className={styles.gateDescription}>{t('compliance.lgpd.description')}</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="lgpd-name" className={styles.label}>
            {t('compliance.lgpd.form.nameLabel')}
          </label>
          <input
            id="lgpd-name"
            type="text"
            className={styles.input}
            placeholder={t('compliance.lgpd.form.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lgpd-email" className={styles.label}>
            {t('compliance.lgpd.form.emailLabel')}
          </label>
          <input
            id="lgpd-email"
            type="email"
            className={styles.input}
            placeholder={t('compliance.lgpd.form.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lgpd-request-type" className={styles.label}>
            {t('compliance.lgpd.form.requestTypeLabel')}
          </label>
          <select
            id="lgpd-request-type"
            className={styles.select}
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            required
          >
            <option value="" disabled>
              {t('compliance.lgpd.form.requestTypePlaceholder')}
            </option>
            <option value="deletion">{t('compliance.lgpd.form.requestTypeOptions.deletion')}</option>
            <option value="portability">{t('compliance.lgpd.form.requestTypeOptions.portability')}</option>
            <option value="confirmation">{t('compliance.lgpd.form.requestTypeOptions.confirmation')}</option>
          </select>
        </div>

        <Button type="submit" variant="dark" icon={Send} iconPosition="right">
          {t('compliance.lgpd.form.submit')}
        </Button>
      </form>

      <DocsMiniList docs={docs} />
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: Canal de Denúncias & Comunicação Ética
// ═══════════════════════════════════════════════════════════════════════════
function EthicsForm({ t, sectionRef }) {
  const [identification, setIdentification] = useState('anonymous'); // 'anonymous' | 'identified'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const identifyFieldsRef = useRef(null);
  const isFirstRun = useRef(true);

  const rawDocs = t('compliance.ethics.documents', { returnObjects: true });
  const docs = Array.isArray(rawDocs) ? rawDocs : [];

  // ── Anima os campos Nome/E-mail nos DOIS sentidos: descem/aparecem ao
  //    identificar, sobem/desaparecem ao voltar para anônimo. O bloco fica
  //    sempre montado no DOM — só a altura/opacidade são animadas.
  useGSAP(() => {
    if (!identifyFieldsRef.current) return;

    const isOpen = identification === 'identified';
    const target = isOpen
      ? { height: 'auto', opacity: 1, y: 0 }
      : { height: 0, opacity: 0, y: -12 };

    // Na primeira renderização, aplica o estado inicial sem animar
    // (evita um "flash" do conteúdo aberto antes do JS rodar).
    if (isFirstRun.current) {
      gsap.set(identifyFieldsRef.current, target);
      isFirstRun.current = false;
      return;
    }

    gsap.to(identifyFieldsRef.current, {
      ...target,
      duration: isOpen ? 0.5 : 0.4,
      ease: isOpen ? 'power2.out' : 'power2.inOut',
    });
  }, { dependencies: [identification], scope: sectionRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO (Etapa 8): enviar { identification, name, email, category, description, file }
    // para o back-end com validação, sanitização, rate limiting e upload seguro.
  };

  return (
    <Card className={styles.gateCard} variant="dark">
      <div className={styles.gateIcon}>
        <MessageSquareWarning size={30} />
      </div>
      <h3 className={styles.gateTitle}>{t('compliance.ethics.title')}</h3>
      <p className={styles.gateDescription}>{t('compliance.ethics.description')}</p>

      <form className={styles.form} onSubmit={handleSubmit}>

        {/* ── TOGGLE: Deseja se identificar? ────────────────────────────── */}
        <div className={styles.formGroup}>
          <span className={styles.label}>{t('compliance.ethics.form.identificationLabel')}</span>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleOption} ${identification === 'identified' ? styles.toggleActive : ''}`}
              onClick={() => setIdentification('identified')}
            >
              {t('compliance.ethics.form.identifyOption')}
            </button>
            <button
              type="button"
              className={`${styles.toggleOption} ${identification === 'anonymous' ? styles.toggleActive : ''}`}
              onClick={() => setIdentification('anonymous')}
            >
              {t('compliance.ethics.form.anonymousOption')}
            </button>
          </div>
        </div>

        {/* ── Campos sempre montados no DOM. O GSAP acima anima altura e
            opacidade nos dois sentidos ao trocar identificado/anônimo. */}
        <div
          className={styles.identifyFields}
          ref={identifyFieldsRef}
          aria-hidden={identification !== 'identified'}
        >
          <div className={styles.formGroup}>
            <label htmlFor="ethics-name" className={styles.label}>
              {t('compliance.ethics.form.nameLabel')}
            </label>
            <input
              id="ethics-name"
              type="text"
              className={styles.input}
              placeholder={t('compliance.ethics.form.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={identification !== 'identified'}
              tabIndex={identification !== 'identified' ? -1 : 0}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ethics-email" className={styles.label}>
              {t('compliance.ethics.form.emailLabel')}
            </label>
            <input
              id="ethics-email"
              type="email"
              className={styles.input}
              placeholder={t('compliance.ethics.form.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={identification !== 'identified'}
              tabIndex={identification !== 'identified' ? -1 : 0}
            />
          </div>
        </div>


        <div className={styles.formGroup}>
          <label htmlFor="ethics-category" className={styles.label}>
            {t('compliance.ethics.form.categoryLabel')}
          </label>
          <select
            id="ethics-category"
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              {t('compliance.ethics.form.categoryPlaceholder')}
            </option>
            <option value="fraud">{t('compliance.ethics.form.categoryOptions.fraud')}</option>
            <option value="harassment">{t('compliance.ethics.form.categoryOptions.harassment')}</option>
            <option value="misconduct">{t('compliance.ethics.form.categoryOptions.misconduct')}</option>
            <option value="other">{t('compliance.ethics.form.categoryOptions.other')}</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ethics-description" className={styles.label}>
            {t('compliance.ethics.form.descriptionLabel')}
          </label>
          <textarea
            id="ethics-description"
            className={styles.textarea}
            placeholder={t('compliance.ethics.form.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ethics-attachment" className={styles.fileLabel}>
            <Paperclip size={16} />
            <span>{file ? file.name : t('compliance.ethics.form.attachmentLabel')}</span>
          </label>
          <input
            id="ethics-attachment"
            type="file"
            className={styles.fileInput}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button type="submit" variant="dark" icon={Send} iconPosition="right">
          {t('compliance.ethics.form.submit')}
        </Button>

        <div className={styles.confidentialNotice}>
          <Lock size={14} />
          <span>{t('compliance.ethics.confidentialNotice')}</span>
        </div>
      </form>

      <DocsMiniList docs={docs} />
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
const Compliance = () => {
  const { t, i18n } = useTranslation();

  const sectionRef  = useRef(null);
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const gatesRef    = useRef(null);

  useGSAP(() => {

    // ── 1. REVEAL DO TÍTULO COM SPLITTEXT ─────────────────────────────────
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, {
        type: 'chars,words',
        linesClass: styles.splitLine,
      });

      gsap.set(split.chars, {
        opacity: 0,
        y: 22,
        filter: 'blur(8px)',
        willChange: 'transform, opacity, filter',
      });

      gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.025,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 82%',
          end:   'bottom 45%',
          scrub: 1.2,
        },
      });
    }

    // ── 2. FADE DO SUBTÍTULO ──────────────────────────────────────────────
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ── 3. CASCATA DOS DOIS CARDS DE FORMULÁRIO ─────────────────────────────
    const gateElements = gatesRef.current?.querySelectorAll(`.${styles.gateCard}`);
    if (gateElements?.length) {
      gsap.fromTo(
        gateElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: { each: 0.15, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gatesRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

  }, {
    scope: sectionRef,
    dependencies: [i18n.language],
    revertOnUpdate: true,
  });

  return (
    <section className={styles.complianceSection} id="compliance" ref={sectionRef}>
      <div className={styles.container}>

        <header className={styles.header}>
          <Badge icon={ShieldCheck}>{t('compliance.tag')}</Badge>

          <h2 key={`title-${i18n.language}`} className={styles.title} ref={titleRef}>
            {t('compliance.title')}
          </h2>

          <p key={`subtitle-${i18n.language}`} className={styles.subtitle} ref={subtitleRef}>
            {t('compliance.subtitle')}
          </p>
        </header>

        <div className={styles.gates} ref={gatesRef}>
          <LgpdForm t={t} />
          <EthicsForm t={t} sectionRef={sectionRef} />
        </div>

      </div>
    </section>
  );
};

export default Compliance;