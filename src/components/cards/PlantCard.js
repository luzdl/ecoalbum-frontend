import { createFlipCard, buildFront, buildBack } from "./FlipCard.js";
import { createModal } from "../modal/Modal.js";

const STATUS_LABEL = {
  lc: 'Preocupación menor',
  nt: 'Casi amenazado',
  vu: 'Vulnerable',
  en: 'En peligro',
  cr: 'Peligro crítico',
};

function showPlantModal(plant) {
  const modal = createModal({ title: plant.name });
  
  const content = document.createElement('div');
  content.className = 'species-grid';
  content.innerHTML = `
    <img src="${plant.image}" alt="${plant.name}" class="species-image">
    <div class="species-meta">
      ${plant.scientificName ? `<div class="species-row"><strong>Científico:</strong> ${plant.scientificName}</div>` : ''}
      <div class="species-row"><strong>Tipo:</strong> Planta</div>
      <div class="species-row"><strong>Hábitat:</strong> ${plant.habitat || 'Desconocido'}</div>
      <div class="species-row"><strong>Región:</strong> ${plant.region || 'Panamá'}</div>
      <div class="species-row"><strong>Estado:</strong> ${STATUS_LABEL[plant.status] || 'Desconocido'}</div>
    </div>
  `;
  
  if (plant.summary) {
    const desc = document.createElement('p');
    desc.className = 'species-description';
    desc.textContent = plant.summary;
    content.appendChild(desc);
  }
  
  modal.setContent(content);
  modal.open();
}

export function renderPlantCard(plant, { size = 'md' } = {}) {
  const title = `${plant.name ?? ''}${plant.scientificName ? ` (${plant.scientificName})` : ''}`;

  const front = buildFront({
    image: plant.image,
    title,
    subtitle: `Planta | ${plant.habitat ?? 'Hábitat desconocido'}`,
  });

  const statusBadge = makeBadge(plant.status);
  const paragraphs = [];
  if (plant.summary) paragraphs.push(plant.summary);

  const actions = [
    {
      label: 'Aprender más',
      variant: 'btn-primary',
      onClick: () => showPlantModal(plant),
    },
  ];

  const back = buildBack({
    paragraphs,
    habitat: plant.habitat,
    region: plant.region,
    statusBadge,
    actions,
  });

  return createFlipCard({ front, back, size, title: plant.name || 'Planta' });
}

function makeBadge(status = 'lc') {
  const cls = `badge badge-${status}`;
  const txt = STATUS_LABEL[status] ?? 'Estado';
  const div = document.createElement('div');
  div.className = cls;
  div.innerHTML = `<span class="badge-dot"></span>${txt}`;
  return div.outerHTML;
}
