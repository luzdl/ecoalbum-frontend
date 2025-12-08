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

function showAnimalModal(animal) {
  const modal = createModal({ title: animal.name });
  
  const content = document.createElement('div');
  content.className = 'species-grid';
  
  // Agregar imagen
  const img = document.createElement('img');
  img.className = 'species-image';
  img.src = animal.image;
  img.alt = animal.name;
  content.appendChild(img);
  
  // Agregar información
  const meta = document.createElement('div');
  meta.className = 'species-meta';
  const statusColor = STATUS_COLOR[animal.status] || '#666';
  const statusText = STATUS_LABEL[animal.status] || 'Desconocido';
  
  meta.innerHTML = `
    ${animal.scientificName ? `<div class="species-row"><strong>Científico:</strong> ${animal.scientificName}</div>` : ''}
    <div class="species-row"><strong>Tipo:</strong> ${animal.type || 'Mamífero'}</div>
    <div class="species-row"><strong>Hábitat:</strong> ${animal.habitat || 'Desconocido'}</div>
    <div class="species-row"><strong>Región:</strong> ${animal.region || 'Panamá'}</div>
    <div class="species-row"><strong>Estado:</strong> <span style="color: ${statusColor}; font-weight: 700;">${statusText}</span></div>
  `;
  content.appendChild(meta);
  
  if (animal.summary) {
    const desc = document.createElement('p');
    desc.className = 'species-description';
    desc.textContent = animal.summary;
    content.appendChild(desc);
  }
  
  modal.setContent(content);
  modal.open();
}

export function renderAnimalCard(animal, { size = 'md' } = {}) {
  const title = `${animal.name ?? ''}${animal.scientificName ? ` (${animal.scientificName})` : ''}`;

  const front = buildFront({
    image: animal.image,
    title,
    subtitle: `${animal.type ?? 'Mamífero'} | ${animal.habitat ?? 'Hábitat desconocido'}`,
  });

  const statusBadge = makeBadge(animal.status);
  const paragraphs = [];
  if (animal.summary) paragraphs.push(animal.summary);

  // Acción TRASERA: "Aprender más" (siempre visible)
  const actions = [{
    label: 'Aprender más',
    variant: 'btn-primary',
    onClick: () => showAnimalModal(animal),
  }];

  const back = buildBack({
    paragraphs,
    habitat: animal.habitat,
    region: animal.region,
    statusBadge,
    actions,
  });

  return createFlipCard({ front, back, size, title: animal.name || 'Especie' });
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
