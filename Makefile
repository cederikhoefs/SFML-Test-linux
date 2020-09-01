CXX = g++
CPP_FLAGS = -g -O0 -pthread -I . -I imgui -I imgui-sfml #-I /usr/include/SFML/include
CPP_LIBS = -lOpenGL -lsfml-graphics -lsfml-window -lsfml-system

CPP_SRCS = $(shell find ./src -name '*.cpp') #every cpp file will be compiled!
CPP_SRCS += imgui/imgui.cpp imgui/imgui_widgets.cpp imgui/imgui_draw.cpp
CPP_SRCS += imgui-sfml/imgui-SFML.cpp

all: bin/sfml-test bin/shaderfloat.frag bin/shaderdouble.frag
remake: clean all
bin:
	mkdir bin

bin/sfml-test: $(CPP_SRCS) bin
	@echo "Compiling..."
	@$(CXX) $(CPP_FLAGS) $(CPP_SRCS) -o $@ $(CPP_LIBS)

bin/shaderfloat.frag: src/shaderfloat.frag bin
	@echo "Updating float shader file"
	@cp src/shaderfloat.frag bin/shaderfloat.frag

bin/shaderdouble.frag: src/shaderdouble.frag bin
	@echo "Updating double shader file"
	@cp src/shaderdouble.frag bin/shaderdouble.frag

run: all
	@cd bin && ./magnetron-viewer

clean:
	@echo Cleaning Binaries...
	@rm -f -r bin/*
