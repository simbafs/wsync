npm=pnpm

.PHONY: dev
dev: 
	cd ./test/ && nodemon -e go --watch './**/*.go' --signal SIGTERM --exec 'go' run . 
