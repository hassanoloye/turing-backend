default:
	@sh -c "trap 'npm run dev' EXIT; exit 0"

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  [default]            start server in development mode"
	@echo "  clean                clean working directory"
	@echo "  help                 print this help"
	@echo "  setup                Install dependencies"
	@echo "  devserver            Run dev server"
	@echo "  prodserver           Run prod server"
	@echo "  build           	  Build source files"
	@echo "  deploy_heroku        Deploy to heroku"
	@echo "  help                 print this help"
	@echo ""

clean:
	@npm run clean

setup:
	@bash -l -c 'nvm install'
	@npm install

devserver:
	@npm run dev

prodserver:
	@npm start

build:
	@npm run build

deploy_heroku:
	@bash -l -c 'heroku container:push web -a turingapi'
	@bash -l -c 'heroku container:release web -a turingapi'
