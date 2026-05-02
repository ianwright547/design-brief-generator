const STORAGE_KEY = 'design-brief-clients'

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function getClients() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getClient(id) {
  const clients = getClients()
  return clients.find(c => c.id === id) || null
}

export function saveClient(client) {
  const clients = getClients()
  const idx = clients.findIndex(c => c.id === client.id)
  client.updatedAt = new Date().toISOString()
  if (idx >= 0) {
    clients[idx] = client
  } else {
    client.createdAt = new Date().toISOString()
    clients.push(client)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
  return client
}

export function deleteClient(id) {
  const clients = getClients().filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
}

export function createEmptyBrief() {
  return {
    business: {
      name: '',
      whatYouDo: '',
      city: '',
      yearsInBusiness: '',
      differentiator: '',
      googleReviewCount: '',
      googleRating: '',
    },
    customer: {
      whoIsSearching: '',
      primaryConcern: '',
      deviceSplit: '',
    },
    visual: {
      styleDirection: '',
      personality: {
        corporatePersonal: 50,
        polishedAuthentic: 50,
        establishedScrappy: 50,
        luxuryAccessible: 50,
        reservedOpinionated: 50,
      },
      adjectives: ['', '', '', '', ''],
    },
    moodboard: {
      images: [],
    },
    references: [
      { url: '', businessType: '', taking: '', ignoring: '' },
      { url: '', businessType: '', taking: '', ignoring: '' },
      { url: '', businessType: '', taking: '', ignoring: '' },
    ],
    typography: {
      energy: '',
      headlines: '',
      fontLiked: '',
      headingFont: '',
      bodyFont: '',
      customFonts: [],
    },
    color: {
      physicalSpaceFeel: '',
      brandColors: '',
      competitorColors: '',
      lightOrDark: '',
      colorHate: '',
    },
    homepage: {
      heroType: '',
      heroNotes: '',
      servicesDisplay: '',
      servicesNotes: '',
      galleryDisplay: '',
      galleryNotes: '',
      reviewStyle: 'horizontal-scroll-no-cards',
      aboutApproach: '',
      aboutNotes: '',
      mapStyle: '',
      contactFields: 'name-phone-message',
      contactNotes: '',
      sectionPriority: [
        'hero', 'trust', 'services', 'proof', 'reviews', 'about', 'map', 'contact'
      ],
    },
    designSystem: {
      spacing: '',
      corners: '',
      shadows: '',
      photoStyle: '',
      accentUsage: '',
    },
    images: {
      photos: [],
      quantity: '',
      quality: '',
      proudOf: '',
    },
    animation: {
      motionFeel: '',
      lovedExample: '',
      annoyances: '',
    },
    htmlReferences: {
      files: [],
    },
    mascot: {
      wantsMascot: '',
      style: '',
      character: '',
      pose: '',
      expression: '',
      colors: '',
      useCase: '',
      referenceImages: [],
      notes: '',
    },
    servicePages: {
      services: [],
    },
    serviceAreas: {
      primaryCity: '',
      areas: [],
      areaPageApproach: '',
    },
    blogStrategy: {
      posts: [],
      style: '',
      frequency: '',
    },
  }
}

export function createNewClient(name) {
  return {
    id: generateId(),
    clientName: name,
    currentStep: 0,
    brief: createEmptyBrief(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
