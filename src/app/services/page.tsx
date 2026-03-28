import { getDb } from "@/lib/db";
import ServiceCard from "@/components/ServiceCard";
import styles from "./page.module.css";

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
}

export default async function ServicesPage() {
  const db = getDb();
  const services: Service[] = await db("services")
    .select("*")
    .orderBy("id", "asc");

  return (
    <main className={styles.page}>
      <div className={styles.headerWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Installation <span>Catalog</span>
          </h1>
          <p className={styles.subtitle}>
            We offer <span className={styles.count}>{services.length}</span> professional
            installation services for your modern home ecosystem.
          </p>
        </div>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              {...service} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}

