# Fieldnote Supply

A small demo storefront for stationery and desk goods. Visitors can filter the
catalog, open product details, and save favorites in their browser. There is no
checkout, order submission, payment processing, or finance management.

## Run locally

No dependencies or build step are required. From the repository root:

    python3 -m http.server 4173 --directory dist

Open http://localhost:4173. Edit the catalog in `dist/index.html`, the presentation
in `dist/styles.css`, and catalog interactions in `dist/shop.js`. The product
photography is generated for this demo and served from `dist/assets`.

The Sites hosting manifest points at `dist/`. Push source changes to the linked
repository and publish a new version in Sites to update the hosted storefront.
