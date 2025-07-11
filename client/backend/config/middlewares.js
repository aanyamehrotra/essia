module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        env('VITE_FRONTEND_LOCAL_URL', ''),
        env('VITE_FRONTEND_SERVER_URL', ''),
      ],
      credentials: true,
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];