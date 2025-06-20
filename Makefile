# 명시적으로 실행
win:
	@echo "▶ Running Windows batch script..."
	@cmd /c docker\\window-start.bat

linux:
	@echo "▶ Running Linux shell script..."
	@bash docker/linux-start.sh

# 운영체제 자동 감지 후 실행
auto:
	@if [ "$(OS)" = "Windows_NT" ]; then \
		echo "▶ Detected Windows OS"; \
		cmd /c docker\\window-start.bat; \
	else \
		echo "▶ Detected Unix-like OS"; \
		bash docker/linux-start.sh; \
	fi
