import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Smart<span className={styles.primaryText}>.Serve</span>
          </h1>
          <p className={styles.subtitle}>
            Professional home appliance & device installation services.
            Browse, schedule, and pay — all in one place with a guaranteed premium experience.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/services" className={styles.primaryButton}>
              Book a Service
            </Link>
            <Link href="#how-it-works" className={styles.secondaryButton}>
              How it Works
            </Link>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <Image
            src="/images/hero_installation.png"
            alt="Professional installing a flat screen TV"
            width={600}
            height={400}
            className={styles.heroImage}
            priority
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>Effortless Installation</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>1</div>
            <h3 className={styles.stepTitle}>Browse & Select</h3>
            <p className={styles.stepDesc}>
              Choose from our catalog of professional installation services for TVs, smart home tech, and more.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>2</div>
            <h3 className={styles.stepTitle}>Pick a Time</h3>
            <p className={styles.stepDesc}>
              Select a convenient time slot that fits your schedule. Our availability is updated in real-time.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>3</div>
            <h3 className={styles.stepTitle}>We Install it</h3>
            <p className={styles.stepDesc}>
              A certified smart.serve professional arrives and handles the setup perfectly from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className={styles.featured}>
        <div className={styles.featuredHeader}>
          <div>
            <h2 className={styles.sectionTitle} style={{ marginBottom: "0.5rem" }}>Popular Services</h2>
            <p style={{ color: "var(--text-muted)" }}>Trusted installations for modern homes.</p>
          </div>
          <Link href="/services" className={styles.viewAll}>
            View All Catalog &rarr;
          </Link>
        </div>
        
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceImageWrapper}>
              <Image 
                src="/images/feature_booking.jpeg"
                alt="Easy booking on smartphone" 
                fill 
                className={styles.serviceImage}
              />
            </div>
            <div className={styles.serviceInfo}>
              <h3 className={styles.serviceName}>TV Mounting & Setup</h3>
              <p className={styles.servicePrice}>From $99</p>
            </div>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceImageWrapper}>
              <Image 
                src="/images/feature_service.png"
                alt="Smart home devices on table" 
                fill 
                className={styles.serviceImage}
              />
            </div>
            <div className={styles.serviceInfo}>
              <h3 className={styles.serviceName}>Smart Home Integration</h3>
              <p className={styles.servicePrice}>From $149</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to upgrade your home?</h2>
        <p className={styles.ctaDesc}>
          Join thousands of satisfied customers who trust smart.serve with their device installations.
        </p>
        <Link href="/account" className={styles.primaryButton}>
          Create an Account Today
        </Link>
      </section>
    </main>
  );
}
