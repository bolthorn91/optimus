/**
 * Textos de la home breve. La home no reproduce el dossier: presenta la propuesta, enseña
 * las oportunidades y lleva a la reserva. El argumentario vive en `/estrategia`.
 */
export const HOME = {
  projects: {
    eyebrow: 'Proyectos abiertos',
    title: 'Oportunidades en preparación',
    intro:
      'Estamos cerrando la información de las primeras oportunidades. Cada ficha mostrará el tipo de activo, la inversión inicial y el retorno estimado antes de abrir la reserva.',
    cta: 'Ver todos los proyectos',
  },
  steps: {
    eyebrow: 'Cómo funciona',
    title: 'Tres pasos, con un interlocutor directo',
    intro:
      'La sesión privada sirve para ordenar su situación antes de hablar de productos o importes.',
    items: [
      {
        title: 'Diagnóstico',
        body: 'Revisamos su situación patrimonial, su residencia fiscal y el horizonte que tiene en mente.',
      },
      {
        title: 'Estructuración',
        body: 'Definimos qué tipo de activo encaja y cómo se articula la operación entre España y Argentina.',
      },
      {
        title: 'Seguimiento',
        body: 'Le acompañamos en la ejecución y en el seguimiento de la inversión con un interlocutor directo.',
      },
    ],
  },
  proof: {
    eyebrow: 'Por qué OPTIMVS',
    title: 'Una firma, dos jurisdicciones y un trato directo',
    items: [
      {
        label: 'España · Argentina',
        body: 'Una estructura hispano-argentina pensada para inversores europeos que miran hacia Argentina.',
      },
      {
        label: 'Marco CDI',
        body: 'La operativa se apoya en el Convenio de Doble Imposición entre España y Argentina.',
      },
      {
        label: 'Atención directa',
        body: 'Sin capas comerciales: la persona que analiza su caso es la que le acompaña después.',
      },
    ],
  },
  calculator: {
    eyebrow: 'Antes de decidir',
    title: 'Vea cómo se comporta un escenario',
    body: 'Ajuste capital, horizonte y perfil para obtener una proyección ilustrativa con sus supuestos a la vista.',
    cta: 'Abrir calculadora',
  },
  close: {
    eyebrow: 'Siguiente paso',
    title: 'Reserve su sesión privada de diagnóstico patrimonial',
    body: 'Analizamos su caso con confidencialidad y sin compromiso. Si encaja, le propondremos la estructura y los siguientes pasos.',
    cta: 'Reservar sesión privada',
  },
} as const;
