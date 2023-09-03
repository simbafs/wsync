npm=pnpm

.PHONY: dev
dev: 
	cd ./test/ && nodemon -e go --watch './**/*.go' --watch '../handler/**/*.go' --signal SIGTERM --exec 'go' run . 
