import { createFlipCard, buildFront, buildBack } from "./FlipCard.js";
import { createModal } from "../modal/Modal.js";

const STATUS_LABEL = {
  lc: 'Preocupación menor',
  nt: 'Casi amenazado',
  vu: 'Vulnerable',
  en: 'En peligro',
  cr: 'Peligro crítico',
};

function showAnimalModal(animal) {
  const modal = createModal({ title: animal.name });
  
  const content = document.createElement('div');
  content.className = 'species-grid';
  content.innerHTML = `
    <img src="${animal.image}" alt="${animal.name}" class="species-image">
    <div class="species-meta">
      ${animal.scientificName ? `<div class="species-row"><strong>Científico:</strong> ${animal.scientificName}</div>` : ''}
      <div class="species-row"><strong>Tipo:</strong> ${animal.type || 'Mamífero'}</div>
      <div class="species-row"><strong>Hábitat:</strong> ${animal.habitat || 'Desconocido'}</div>
      <div class="species-row"><strong>Región:</strong> ${animal.region || 'Panamá'}</div>
      <div class="species-row"><strong>Estado:</strong> ${STATUS_LABEL[animal.status] || 'Desconocido'}</div>
    </div>
  `;
  
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
  const div = document.createElement('div');
  div.className = cls;
  div.innerHTML = `<span class="badge-dot"></span>${txt}`;
  return div.outerHTML;
}
