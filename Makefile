all:
	echo "all"

run:
	npm run start

ngrok:
	ngrok http 3000

clean:
	rm -rf node_modules