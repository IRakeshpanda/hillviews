export const cottageImages = {
  hero: "/images/gardens/yorkshire-dales-hill-view-out-side.jpg",
  livingRoom: "/images/living/hill-view-2026-indoor-bonfire-and-lamp.jpg",
  terrace: "/images/gardens/hill-view-2026-outdoor-chill-view.jpg",
  diningRoom: "/images/kitchen/hill-view-2026-food-dine-elegant-view.jpg",
  kitchen: "/images/kitchen/yorkshire-dales-kitchen.jpg",
  masterBedroom: "/images/bedrooms/hill-view-2026-double-bed-front-view.jpg",
  beamedDouble: "/images/bedrooms/hill-view-2026-double-bed-bed-lamp.jpg",
  cosyDouble: "/images/bedrooms/hill-view-2026-bed-and-window.jpg",
  twinRoom: "/images/bedrooms/hill-view-2026-2-single-beds.jpg",
  bathroom: "/images/bathrooms/yorkshire-dales-wash-basin.jpg",
  panoramicDales: "/images/gardens/hill-view-2026-outdoor-chill.jpg"
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
