https://www.youtube.com/watch?v=o-fgWea75O4&t=1076s

sanity schema extract
sanity typegen generate

cd stripecli
./stripe.exe listen --forward-to localhost:3000/webhook

npm run build && npm run start

npm i -g vercel