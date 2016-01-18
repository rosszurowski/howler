
REPO    = rosszurowski/howler
DOMAIN  = rosszurowski.github.io/howler
BRANCH  = $(shell git rev-parse --abbrev-ref HEAD)

deploy:
	@echo "Deploying branch 033[0;33m$(BRANCH)033[0m to Github pages..."
	@make clean
	@NODE_ENV=production npm run build
	@(cd build && \
		git init -q . && \
		git add . && \
		git commit -q -m "Deployment (auto-commit)" && \
		echo "033[0;90m" && \
		git push "git@github.com:$(REPO).git" \
		HEAD:gh-pages --force && \
		echo "033[0m")
	@make clean
	@echo "Deployed to 033[0;32mhttp://$(DOMAIN)/033[0m"
