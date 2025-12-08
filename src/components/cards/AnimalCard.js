/**
 * AnimalCard: usa FlipCard con datos de fauna
 * Espera un objeto:
 *  {
 *    name, scientificName, image, status, habitat, region,
 *    summary (string), url (opcional)
 *  }
 */

import { createFlipCard, buildFront, buildBack } from "./FlipCard.js";

const STATUS_LABEL = {
  lc: 'Preocupación menor',
  nt: 'Casi amenazado',
  vu: 'Vulnerable',
  en: 'En peligro',
  cr: 'Peligro crítico',
};

export function renderAnimalCard(animal, { size = 'md', glass = false } = {}) {
  const badge = makeBadge(animal.status);
  const front = buildFront({
    image: animal.image,
    title: `${animal.name} ${animal.scientificName ? `(${animal.scientificName})` : ''}`,
    subtitle: `Mamífero/AVES/… | ${animal.habitat ?? 'Hábitat desconocido'}`, // ajusta si tienes "type"
    statusBadge: badge,
  });

  const paragraphs = [];
  if (animal.summary) paragraphs.push(animal.summary);

  const actions = [];
  if (animal.url) {
    actions.push({ href: animal.url, label: 'Ver ficha', variant: '' });
  }

  const back = buildBack({
    paragraphs,
    habitat: animal.habitat,
    region: animal.region,
    actions,
  });

  return createFlipCard({
    front,
    back,
    size,
    glass,
    title: animal.name || 'Especie',
  });
}

function makeBadge(status = 'lc') {
  const cls = `badge badge-${status}`;
  const txt = STATUS_LABEL[status] ?? 'Estado';
  const div = document.createElement('div');
  div.className = cls;
  div.innerHTML = `<span class="badge-dot"></span>${txt}`;
  return div.outerHTML;
}
