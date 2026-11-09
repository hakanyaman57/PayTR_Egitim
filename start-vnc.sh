#!/bin/bash

# Varsa eski kilit dosyalarını temizle
rm -f /tmp/.X1-lock /tmp/.X11-unix/X1

# Xvfb sanal ekranını başlat (zaten çalışmıyorsa)
if ! pgrep -x "Xvfb" > /dev/null; then
  Xvfb :1 -screen 0 1920x1080x24 &
  sleep 1
fi

# Fluxbox pencere yöneticisini başlat
if ! pgrep -x "fluxbox" > /dev/null; then
  DISPLAY=:1 fluxbox &
fi

# x11vnc sunucusunu başlat
if ! pgrep -x "x11vnc" > /dev/null; then
  x11vnc -display :1 -nopw -listen localhost -forever -shared &
fi

# noVNC köprüsünü 6080 portunda aç
if ! pgrep -f "websockify" > /dev/null; then
  websockify --web /usr/share/novnc 6080 localhost:5900 &
fi
