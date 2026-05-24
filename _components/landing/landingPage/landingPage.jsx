import Hero from "../hero/hero";
import Showcase from "../showcase/showcase";
import Cta from "../cta/cta";
import Footer from "../footer/footer";
import styles from "./landingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <main>
        <Hero />
        <Showcase />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
