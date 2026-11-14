#!/usr/bin/env bash
# Renders every asset HTML to PNG + PDF. Usage: ./scripts/render-all.sh
set -e; cd "$(dirname "$0")/.."
R() { node scripts/render-carousel.mjs "$1" "$2" ${3:+--size $3} | tail -1; }
R content/01-every-birth/carousel/A2.8-sina-your-list/slides.html content/01-every-birth/carousel/A2.8-sina-your-list
R content/01-every-birth/carousel/A1.5-pph-bundle/slides.html content/01-every-birth/carousel/A1.5-pph-bundle
R content/01-every-birth/cards/cards.html /tmp/axcards && cp /tmp/axcards/slide-01.png content/01-every-birth/cards/A1.6_impact-card.png && cp /tmp/axcards/slide-02.png content/01-every-birth/cards/A2.2_data-infographic.png
R content/01-every-birth/cards/whatsapp.html /tmp/axwa 1080x1080 && cp /tmp/axwa/slide-01.png content/01-every-birth/cards/A2.6_benchmark-whatsapp.png
R brand/product-cards/cards.html brand/product-cards/social
