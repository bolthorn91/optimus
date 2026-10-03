import { ContactDetails } from '@/components/ContactDetails';
import { Scene } from '@/motion/Scene';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';

import './scene.css';

const HEIGHT = '100vh';

export function ContactScene() {
  return (
    <Scene background="var(--color-navy-deep)" className="on-navy" height={HEIGHT} id="contacto">
      <div className="act-contact">
        <h2>{CONTACT_SCENE.title}</h2>
        <p>{CONTACT_SCENE.subtitle}</p>
        <ul>
          {CONTACT_SCENE.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
        <ContactDetails />
      </div>
    </Scene>
  );
}
