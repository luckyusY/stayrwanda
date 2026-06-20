# StayRwanda

Rwanda-first property booking marketplace built with Next.js, MongoDB and Cloudinary.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide your own credentials. The homepage uses curated seed listings when MongoDB is unavailable, so the UI remains usable during setup.

## Included

- Responsive premium marketplace homepage
- Search and property-type filtering
- Property detail pages and booking summary
- MongoDB properties API (`GET/POST /api/properties`)
- Cloudinary image upload API (`POST /api/upload`)
- SEO metadata and responsive image optimization

Authentication, live payments, booking persistence and role dashboards are the next product phase.

## Product and UX direction

StayRwanda should combine two complementary hospitality patterns while retaining its own Rwanda-first identity:

- [Marriott](https://www.marriott.com/en-gb/search/findHotels.mi): premium editorial presentation, strong destination imagery, polished property storytelling and a reassuring hospitality tone.
- [Booking.com](https://www.booking.com/): fast search, practical filtering, scannable property comparisons, visible trust signals and a low-friction booking funnel.

These products are references for information architecture and interaction quality, not visual assets or brand elements to copy. StayRwanda's dark-blue, gold and warm-neutral identity remains the source of truth.
