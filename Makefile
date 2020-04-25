build-ff:
	yarn next build
	yarn next export
	cp ff-manifest.json out/manifest.json
	cp public/assets/red_book.svg out/red_book.svg

sign-ff: build-ff
	env `cat .env | xargs` yarn web-ext sign -s out
