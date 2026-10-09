export const cottageImages = {
  hero: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=85", // Yorkshire Stone Cottage exterior
  livingRoom: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85", // Wood stove
  terrace: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85", // Swaledale view
  diningRoom: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=85", // Beamed dining
  kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85", // Farmhouse kitchen
  masterBedroom: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85", // Master room
  beamedDouble: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85", // Beamed double
  cosyDouble: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=85", // Garden double
  twinRoom: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85", // Twin room
  bathroom: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85", // Rainfall shower
  panoramicDales: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2400&q=85" // Panoramic Dales
};

export const cottageFeatures = [
  {
    id: "stove",
    tag: "COSY",
    title: "Wood-Burning Stove",
    image: cottageImages.livingRoom,
    description: "Traditional stone hearth with firewood provided for warm Yorkshire evenings."
  },
  {
    id: "beamed-lounge",
    tag: "CHARACTER",
    title: "Beamed Living Room",
    image: cottageImages.diningRoom,
    description: "Exposed oak beams and original stone craftsmanship dating back over two centuries."
  },
  {
    id: "kitchen",
    tag: "FARMHOUSE",
    title: "Well-Equipped Kitchen",
    image: cottageImages.kitchen,
    description: "Modern Range master cooker, quartz countertops, Nespresso machine, and dishwasher."
  },
  {
    id: "bedrooms",
    tag: "RESTFUL",
    title: "Comfortable Bedrooms",
    image: cottageImages.masterBedroom,
    description: "Egyptian cotton linens, pocket-sprung mattresses, and quiet valley morning views."
  },
  {
    id: "bathrooms",
    tag: "REFRESHING",
    title: "Modern Bathrooms",
    image: cottageImages.bathroom,
    description: "Walk-in rainfall shower, freestanding soak tub, heated towel rails, and luxury toiletries."
  },
  {
    id: "views",
    tag: "SCENERY",
    title: "Yorkshire Dales Views",
    image: cottageImages.terrace,
    description: "Uninterrupted 180-degree vistas across Swaledale meadows, drystone walls, and fells."
  }
];

export const cottageRooms = [
  {
    id: "master",
    title: "Master Bedroom",
    subtitle: "King bed with countryside views & en-suite",
    badge: "Sleeps 2",
    image: cottageImages.masterBedroom
  },
  {
    id: "beamed",
    title: "Beamed Double",
    subtitle: "Characterful room with exposed oak timber beams",
    badge: "Sleeps 2",
    image: cottageImages.beamedDouble
  },
  {
    id: "cosy",
    title: "Cosy Double",
    subtitle: "Warm and welcoming with tranquil garden views",
    badge: "Sleeps 2",
    image: cottageImages.cosyDouble
  },
  {
    id: "twin",
    title: "Twin Room",
    subtitle: "Bright twin beds overlooking the upper valley fell",
    badge: "Sleeps 2",
    image: cottageImages.twinRoom
  },
  {
    id: "bathroom",
    title: "Family Bathroom",
    subtitle: "Walk-in rainfall shower and deep soaking bathtub",
    badge: "Ensuite",
    image: cottageImages.bathroom
  },
  {
    id: "lounge",
    title: "Living Room",
    subtitle: "Plush wool sofas centered around the burning stove",
    badge: "Unwind",
    image: cottageImages.livingRoom
  }
];

export const galleryItems = [
  { title: "Hill View stone cottage exterior", image: cottageImages.hero },
  { title: "Living room with wood-burning stove", image: cottageImages.livingRoom },
  { title: "Beamed dining room", image: cottageImages.diningRoom },
  { title: "Farmhouse kitchen", image: cottageImages.kitchen },
  { title: "Double bedroom", image: cottageImages.cosyDouble },
  { title: "Modern bathroom with shower and bath", image: cottageImages.bathroom },
  { title: "Terrace with Yorkshire Dales views", image: cottageImages.terrace },
  { title: "Cosy sitting room", image: cottageImages.beamedDouble }
];
