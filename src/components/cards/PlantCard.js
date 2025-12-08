import { createFlipCard, buildFront, buildBack } from "./FlipCard.js";
import { createModal } from "../modal/Modal.js";

const STATUS_LABEL = {
  lc: 'Preocupación menor',
  nt: 'Casi amenazado',
  vu: 'Vulnerable',
  en: 'En peligro',
  cr: 'Peligro crítico',
};

const STATUS_COLOR = {
  lc: '#27ae60', // Verde
  nt: '#f39c12', // Naranja
  vu: '#e67e22', // Naranja oscuro
  en: '#e74c3c', // Rojo
  cr: '#c0392b', // Rojo oscuro
};

function showPlantModal(plant) {
  const modal = createModal({ title: plant.name });
  
  const content = document.createElement('div');
  content.className = 'species-grid';
  
  // Agregar imagen
  const img = document.createElement('img');
  img.className = 'species-image';
  img.src = plant.image;
  img.alt = plant.name;
  content.appendChild(img);
  
  // Agregar información
  const meta = document.createElement('div');
  meta.className = 'species-meta';
  const statusColor = STATUS_COLOR[plant.status] || '#666';
  const statusText = STATUS_LABEL[plant.status] || 'Desconocido';
  
  meta.innerHTML = `
    ${plant.scientificName ? `<div class="species-row"><strong>Científico:</strong> ${plant.scientificName}</div>` : ''}
    <div class="species-row"><strong>Tipo:</strong> Planta</div>
    <div class="species-row"><strong>Hábitat:</strong> ${plant.habitat || 'Desconocido'}</div>
    <div class="species-row"><strong>Región:</strong> ${plant.region || 'Panamá'}</div>
    <div class="species-row"><strong>Estado:</strong> <span style="color: ${statusColor}; font-weight: 700;">${statusText}</span></div>
  `;
  content.appendChild(meta);
  
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
  const color = STATUS_COLOR[status] || '#666';
  const div = document.createElement('div');
  div.className = cls;
  div.innerHTML = `<span class="badge-dot" style="background-color: ${color} !important;"></span><span style="color: ${color} !important; font-weight: 700;">${txt}</span>`;
  return div.outerHTML;
}
