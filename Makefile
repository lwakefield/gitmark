build-ff:
	yarn next build
	yarn next export
	cp manifest.json red_book.svg out
