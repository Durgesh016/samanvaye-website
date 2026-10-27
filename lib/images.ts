/** Photos used on the page (files live in /public/images). w/h are the full-size pixel dimensions. */
export const images = {
  "hero1": {
    "src": "/images/hero1.jpg",
    "sm": "/images/small/hero1.jpg",
    "alt": "Speaker addressing guests at the Samanvaye Health Clinic opening",
    "w": 1674,
    "h": 941,
    "color": "#937f89"
  },
  "who1": {
    "src": "/images/who1.jpg",
    "sm": "/images/small/who1.jpg",
    "alt": "Lighting the lamp at the launch of Samanvaye Foundation",
    "w": 1800,
    "h": 1201,
    "color": "#7c6d66"
  },
  "edu": {
    "src": "/images/edu.jpg",
    "sm": "/images/small/edu.jpg",
    "alt": "Children holding new books with volunteers at a school",
    "w": 1800,
    "h": 1013,
    "color": "#807064"
  },
  "g_tailor": {
    "src": "/images/g_tailor.jpg",
    "sm": "/images/small/g_tailor.jpg",
    "alt": "Women learning tailoring on sewing machines",
    "w": 1599,
    "h": 899,
    "color": "#6e5d57"
  },
  "g_vayo": {
    "src": "/images/g_vayo.jpg",
    "sm": "/images/small/g_vayo.jpg",
    "alt": "Women at the Vayo Vidhya elder care service",
    "w": 1600,
    "h": 738,
    "color": "#91888a"
  },
  "why": {
    "src": "/images/why.jpg",
    "sm": "/images/small/why.jpg",
    "alt": "Volunteers handing over a tricycle in the community",
    "w": 1280,
    "h": 720,
    "color": "#716459"
  },
  "vol1": {
    "src": "/images/vol1.jpg",
    "sm": "/images/small/vol1.jpg",
    "alt": "Volunteers handing supplies to elderly women",
    "w": 1800,
    "h": 1013,
    "color": "#806e6b"
  },
  "vol2": {
    "src": "/images/vol2.jpg",
    "sm": "/images/small/vol2.jpg",
    "alt": "Guests shaking hands at the grand launching of Samanvaye Foundation",
    "w": 768,
    "h": 512,
    "color": "#9c9695"
  },
  "school": {
    "src": "/images/school.jpg",
    "sm": "/images/small/school.jpg",
    "alt": "Volunteers handing books to a schoolgirl",
    "w": 1800,
    "h": 1013,
    "color": "#70625a"
  },
  "mothers": {
    "src": "/images/mothers.jpg",
    "sm": "/images/small/mothers.jpg",
    "alt": "Women with sewing machines at a tailoring training programme",
    "w": 1600,
    "h": 720,
    "color": "#876468"
  },
  "poor": {
    "src": "/images/poor.jpg",
    "sm": "/images/small/poor.jpg",
    "alt": "Volunteers distributing supplies to elderly people",
    "w": 1800,
    "h": 1013,
    "color": "#746563"
  },
  "launch": {
    "src": "/images/launch.jpg",
    "sm": "/images/small/launch.jpg",
    "alt": "A speaker at the launch of Samanvaye Foundation",
    "w": 1800,
    "h": 1200,
    "color": "#90817a"
  },
  "vayo": {
    "src": "/images/vayo.jpg",
    "sm": "/images/small/vayo.jpg",
    "alt": "Senior citizens learning letters at Vayo Vidhya",
    "w": 1024,
    "h": 472,
    "color": "#757672"
  },
  "tailoring": {
    "src": "/images/mothers.jpg",
    "sm": "/images/small/mothers.jpg",
    "alt": "Women with sewing machines at a tailoring training programme",
    "w": 1600,
    "h": 720,
    "color": "#876468"
  },
  "welfare": {
    "src": "/images/vol1.jpg",
    "sm": "/images/small/vol1.jpg",
    "alt": "Volunteers handing supplies to elderly women",
    "w": 1800,
    "h": 1013,
    "color": "#806e6b"
  },
  "g_medical": {
    "src": "/images/vol1.jpg",
    "sm": "/images/small/vol1.jpg",
    "alt": "Volunteers handing supplies to elderly women",
    "w": 1800,
    "h": 1013,
    "color": "#806e6b"
  },
  "g_food": {
    "src": "/images/poor.jpg",
    "sm": "/images/small/poor.jpg",
    "alt": "Volunteers distributing supplies to elderly people",
    "w": 1800,
    "h": 1013,
    "color": "#746563"
  },
  "g_books": {
    "src": "/images/g_books.jpg",
    "sm": "/images/small/g_books.jpg",
    "alt": "Children receiving books at a Samanvaye event",
    "w": 1800,
    "h": 1013,
    "color": "#7c6b60"
  },
  "news1": {
    "src": "/images/news1.jpg",
    "sm": "/images/small/news1.jpg",
    "alt": "Poster for the launch of Kanneeti Santhakam",
    "w": 1024,
    "h": 683,
    "color": "#9a897e"
  },
  "news2": {
    "src": "/images/news2.jpg",
    "sm": "/images/small/news2.jpg",
    "alt": "Newspaper report on Dr. James Watt Kommu’s appointment",
    "w": 1024,
    "h": 787,
    "color": "#c3b8c0"
  },
  "news3": {
    "src": "/images/news3.jpg",
    "sm": "/images/small/news3.jpg",
    "alt": "Supplies being distributed at a social welfare programme",
    "w": 1024,
    "h": 576,
    "color": "#856763"
  },
  "president": {
    "src": "/images/president.png",
    "sm": "/images/president.png",
    "alt": "Sudha Kommu, President of Samanvaye Foundation",
    "w": 438,
    "h": 570,
    "color": "#c9b8d8"
  }
} as const;

export type ImageKey = keyof typeof images;

export const logo = { src: "/images/logo-light.png", w: 1100, h: 297, alt: "Samanvaye Foundation" } as const;
