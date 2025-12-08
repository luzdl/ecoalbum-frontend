/**
 * PlantCard: usa FlipCard con datos de flora
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

export function renderPlantCard(plant, { size = 'md', glass = false } = {}) {
  const badge = makeBadge(plant.status);
  const front = buildFront({
    image: plant.image,
    title: `${plant.name} ${plant.scientificName ? `(${plant.scientificName})` : ''}`,
    subtitle: `Planta | ${plant.habitat ?? 'Hábitat desconocido'}`,
    statusBadge: badge,
  });

  const paragraphs = [];
  if (plant.summary) paragraphs.push(plant.summary);

  const actions = [];
  if (plant.url) {
    actions.push({ href: plant.url, label: 'Ver ficha', variant: '' });
  }

  const back = buildBack({
    paragraphs,
    habitat: plant.habitat,
    region: plant.region,
    actions,
  });

  return createFlipCard({
    front,
    back,
    size,
    glass,
    title: plant.name || 'Planta',
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
