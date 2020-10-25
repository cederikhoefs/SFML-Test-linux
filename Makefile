CXX = g++
CPP_FLAGS = -g -O3 -pthread -I . -I imgui -I imgui-sfml #-I /usr/include/SFML/include
CPP_LIBS = -lOpenGL -lsfml-graphics -lsfml-window -lsfml-system

CPP_SRCS = $(shell find src -name '*.cpp') #every cpp file will be compiled!
CPP_SRCS += imgui/imgui.cpp imgui/imgui_widgets.cpp imgui/imgui_draw.cpp
CPP_SRCS += imgui-sfml/imgui-SFML.cpp

OBJS = $(patsubst %,bin/%.o,$(CPP_SRCS))

REQUIRED_DIRS = bin bin/src bin/imgui bin/imgui-sfml

all: bin/sfml-test bin/shaderfloat.frag bin/shaderdouble.frag

bin/sfml-test: $(OBJS)
	$(CXX) $(CPP_FLAGS) $^ -o $@ $(CPP_LIBS)

bin/%.o: % $(CPP_HDRS)
	$(CXX) $(CPP_FLAGS) -o $@ -c $<

bin/%.frag: src/%.frag
	@cp $< $@

.PHONY: all run remake clean printvars

run: all
	cd bin && ./sfml-test

clean:
	@rm -f -r bin/*

remake: clean all

printvars:
	@echo "Sources: $(CPP_SRCS)"
	@echo "Objs: $(OBJS)"

$(shell mkdir -p $(REQUIRED_DIRS))
