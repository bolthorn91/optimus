import type {
  CapitalBand,
  ContactErrorCode,
  InterestId,
  PhonePrefix,
  TaxResidence,
} from '@/lib/contact-form';

/** Literales de `content/secciones/08-cta-contacto.md` y de `docs/product/06-…md` §6. */
export const CONTACT_SCENE = {
  title: 'Reserve su sesión privada de diagnóstico patrimonial',
  subtitle:
    'Analice junto a nuestros consultores cómo estructurar la salida parcial de capitales hacia activos estratégicos en Argentina.',
  benefits: [
    'Evite que su esfuerzo quede atrapado en un mercado con proyección en baja',
    'Mitigue los riesgos hacia su patrimonio',
    'Obtenga los beneficios de la estabilidad de su valor',
  ],
  cta: 'Abrir formulario de reserva',
  ctaNote:
    'El formulario se abre en una página aparte para que pueda revisarlo con calma. Si ha configurado un escenario, se conservará.',
  ctaPrompt: 'Puede configurar su escenario en el simulador o abrir el formulario directamente.',
  formHeading: 'Formulario de reserva',
  benefitsHeading: 'Qué incluye la sesión',
  optionalDetails: 'Añadir detalles (opcional)',
  pageTitle: 'Reserva de sesión privada',
  scenarioHeading: 'Su escenario',
  scenarioEmpty: 'Todavía no ha configurado un escenario.',
  scenarioEdit: 'Editar escenario',
  scenarioConfigure: 'Configurar escenario',
  privacyHref: '/politica-de-privacidad',
  copy: {
    fullName: 'Nombre y apellidos',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    phonePrefix: 'Prefijo internacional',
    phoneNational: 'Número',
    taxResidence: 'País de residencia fiscal',
    interest: 'Interés principal',
    capitalBand: 'Horquilla de capital (opcional)',
    message: 'Mensaje (opcional)',
    consentData: {
      before: 'He leído y acepto la ',
      link: 'política de privacidad',
      after: '',
    },
    consentMarketing: 'Deseo recibir comunicaciones comerciales de OPTIMVS Capital Protegido',
    honeypot: 'Empresa',
    submit: 'Reservar sesión privada',
    sending: 'Enviando…',
    success: 'Solicitud recibida. Le responderemos en un plazo de 48 horas laborables.',
    errorNetwork:
      'No hemos podido enviar su solicitud. Puede reintentarlo o escribirnos directamente.',
    simulatorContext: 'Se enviará también el escenario que ha configurado',
    rateLimited: 'Ha enviado demasiadas solicitudes. Espere unos minutos antes de reintentar.',
    messageCount: (used: number, max: number) => `${String(used)} / ${String(max)}`,
    capital: 'Capital inicial',
    horizon: 'Horizonte',
    horizonUnit: 'años',
    scenario: 'Escenario',
    vehicle: 'Vehículo',
  },
  errors: {
    required: 'Este campo es obligatorio',
    tooLong: 'El texto supera la longitud máxima',
    invalid: 'El valor no es válido',
    rejected: 'Solicitud rechazada',
  } satisfies Record<ContactErrorCode, string>,
  interest: {
    'real-estate': 'Inmuebles',
    equities: 'Acciones y títulos',
    development: 'Proyectos al pozo',
    unspecified: 'No lo tengo claro',
  } satisfies Record<InterestId, string>,
  capitalBand: {
    minimum: 'cuota mínima',
    uncapped: 'sin techo',
  } satisfies Record<CapitalBand, string>,
  taxResidence: {
    ES: 'España',
    AR: 'Argentina',
    DE: 'Alemania',
    FR: 'Francia',
    IT: 'Italia',
    PT: 'Portugal',
    GB: 'Reino Unido',
    CH: 'Suiza',
    BE: 'Bélgica',
    NL: 'Países Bajos',
    OTHER: 'Otro',
  } satisfies Record<TaxResidence, string>,
  phonePrefix: {
    '+34': 'España (+34)',
    '+54': 'Argentina (+54)',
    '+49': 'Alemania (+49)',
    '+33': 'Francia (+33)',
    '+39': 'Italia (+39)',
    '+351': 'Portugal (+351)',
    '+44': 'Reino Unido (+44)',
    '+1': 'Estados Unidos (+1)',
    '+41': 'Suiza (+41)',
    '+32': 'Bélgica (+32)',
    '+31': 'Países Bajos (+31)',
    '+52': 'México (+52)',
    '+56': 'Chile (+56)',
    '+598': 'Uruguay (+598)',
  } satisfies Record<PhonePrefix, string>,
} as const;

export function consentDataSentence(): string {
  const { before, link, after } = CONTACT_SCENE.copy.consentData;
  return `${before}${link}${after}`;
}
