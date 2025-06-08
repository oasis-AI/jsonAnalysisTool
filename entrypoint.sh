#!/bin/bash

echo "启动JSON工具网站服务器..."
echo "访问地址: http://localhost:8080"
echo "按 Ctrl+C 停止服务器"

# 启动Python简单HTTP服务器
if command -v python3 &> /dev/null; then
    python3 -m http.server 8081 --bind 127.0.0.1
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8081
else
    # 如果没有Python，使用netcat启动简单的HTTP服务器
    echo "Python未找到，使用基础HTTP服务器..."
    ./hello.sh
fi