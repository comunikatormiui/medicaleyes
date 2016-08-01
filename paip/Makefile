MFLAGS=-Wall
CXXFLAGS=
CFLAGS=`pkg-config --cflags opencv`
LDFLAGS=
LIBS= `pkg-config --libs opencv`

DESTDIR=./
PREFIX=/usr/local/bin
TARGET=paip 

OBJS=$(patsubst %.cpp,%.o,$(wildcard *.cpp))

.PHONY: all clean install uninstall

all: $(DESTDIR)$(TARGET)

$(DESTDIR)$(TARGET): $(OBJS)
	$(CXX) $(MFLAGS) $(LDFLAGS) -o $(DESTDIR)$(TARGET) $(OBJS) $(LIBS)

$(OBJS): %.o: %.cpp
	$(CXX) $(MFLAGS) $(CXXFLAGS) -c $(CFLAGS) $< -o $@

clean:
	rm -f $(OBJS)
	rm -f $(TARGET)

install:
	install $(TARGET) $(PREFIX)

uninstall:
	rm -f $(PREFIX)/$(TARGET)
