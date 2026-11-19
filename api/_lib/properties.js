const env = (...names) => {
  for (const name of names) {
    const value = (process.env[name] || '').trim();
    if (value) return value;
  }
  return '';
};

export const PROPERTY_SPECS = {
  'chalet-le-joyau': {
    slug: 'chalet-le-joyau',
    label: 'Chalet Le Joyau',
    apartmentIdEnv: 'SMOOBU_CHALET_LE_JOJAU_APARTMENT_ID',
    aliases: ['chalet-le-joyau', 'chalet-le-jojau', 'chalet le joyau', 'chalet le jojau'],
  },
  'hill-view': {
    slug: 'hill-view',
    label: 'Hill View',
    apartmentIdEnv: 'SMOOBU_HILL_VIEW_APARTMENT_ID',
    aliases: ['hill-view', 'hill view', 'hillview'],
  },
};

export const PROPERTY_SLUGS = Object.keys(PROPERTY_SPECS);

export function normalizePropertySlug(property) {
  const value = String(property ?? '').trim().toLowerCase().replace(/[_\s]+/g, '-');

  if (!value) {
    return null;
  }

  const match = Object.entries(PROPERTY_SPECS).find(([, spec]) => spec.aliases.includes(value));
  return match ? match[0] : null;
}

export function resolvePropertyConfig(property) {
  const slug = normalizePropertySlug(property);

  if (!slug) {
    return {
      ok: false,
      slug: null,
      error: `Unknown propertySlug "${property}". Allowed values: ${PROPERTY_SLUGS.join(', ')}.`,
    };
  }

  const spec = PROPERTY_SPECS[slug];
  const apartmentId = env(spec.apartmentIdEnv)?.trim();

  return {
    ok: Boolean(apartmentId),
    slug,
    label: spec.label,
    apartmentIdEnv: spec.apartmentIdEnv,
    apartmentId,
    error: apartmentId
      ? null
      : `Smoobu is not configured for ${spec.label}. Add ${spec.apartmentIdEnv} to the server environment.`,
  };
}

export function resolveSmoobuConfig(property) {
  return resolvePropertyConfig(property);
}

export function smoobuErrorMessage(data, fallback) {
  if (!data || typeof data !== 'object') return fallback;

  const validation = data.validation_messages
    ? Object.values(data.validation_messages)
        .flatMap((value) => (typeof value === 'object' ? Object.values(value) : [value]))
        .join(' ')
    : '';

  return data.message || data.error || data.detail || validation || data.title || fallback;
}