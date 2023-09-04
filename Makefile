npm=pnpm

.PHONY: devVanilla
devVanilla: 
	cd ./example/vanilla && nodemon -e go --watch './**/*.go' --watch '../handler/**/*.go' --signal SIGTERM --exec 'go' run . 

.PHONY: devReact
devReact:
	tmux split-window -h 'cd example/react && npm run dev'
	cd ./example/react && nodemon -e go --watch './**/*.go' --watch '../handler/**/*.go' --signal SIGTERM --exec 'go' run . 
