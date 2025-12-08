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
    title: `${plant.name}`,
    subtitle: `${plant.scientificName ? plant.scientificName : ''} | Planta`,
    statusBadge: badge,
  });

  const paragraphs = [];
  if (plant.summary) paragraphs.push(plant.summary);

  const actions = [
    { href: plant.url ?? '#', label: 'Aprender más', variant: 'btn-primary', target: '_blank' }
  ];

  const back = buildBack({
    title: 'Información',
    paragraphs,
    habitat: plant.habitat,
    region: plant.region,
    status: plant.status,
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
